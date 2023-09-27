import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./components/ParticleSettings";
import Main from "./components/Main";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

function App() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("0x0");
  const [tether, setTether] = useState({});
  const [tetherBalance, setTetherBalance] = useState(0);
  const [rwd, setRWD] = useState({});
  const [rwdBalance, setRWDBalance] = useState(0);
  const [decentralBank, setDecentralBank] = useState({});
  const [stakingBalance, setstakingBalance] = useState(0);

  const loadBlockchainData = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(() => accounts[1]);
    console.log(account);
    const accountTemp = accounts[1];
    const networkId = await web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tetherContract = new web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      let tetherBalance = await tetherContract.methods
        .balanceOf(accountTemp)
        .call();
      setTetherBalance(() => tetherBalance.toString());
      setTether(() => tetherContract);
    } else {
      alert("Tether contract not deployed to detected network");
    }

    // Load RWD Contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwdContract = new web3.eth.Contract(RWD.abi, rwdData.address);
      let rwdBalance = await rwdContract.methods.balanceOf(accountTemp).call();
      setRWDBalance(() => rwdBalance.toString());
      setRWD(() => rwdContract);
    } else {
      window.alert("Tether contract not deployed to detected network");
    }

    // Load DecentralBank Contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBankContract = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      let stakingBalance = await decentralBankContract.methods
        .stakingBalance(accountTemp)
        .call();
      setstakingBalance(() => stakingBalance.toString());
      setDecentralBank(() => decentralBankContract);
    } else {
      window.alert("Tether contract not deployed to detected network");
    }

    // End Loading
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await loadWeb3();
      await loadBlockchainData();
    };
    fetch();
  }, []);

  const loadWeb3 = async () => {
    if (!web3) {
      alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const stakeTokens = (amount) => {
    setLoading(true);
    tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account, gas: 1000000 })
      .on("transactionHash", () => {
        decentralBank.methods
          .depositTokens(amount)
          .send({ from: account, gas: 1000000 })
          .on("transactionHash", () => {
            setLoading(false);
          });
      });
  };

  const unstakeTokens = () => {
    setLoading(true);
    decentralBank.methods
      .unstakeTokens()
      .send({ from: account, gas: 1000000 })
      .on("transactionHash", () => {
        setLoading(false);
      });
  };

  return (
    <div className="App" style={{ position: "relative" }}>
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticleSettings />
      </div>
      <NavBar account={account} />

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Main
          tetherBalance={tetherBalance}
          rwdBalance={rwdBalance}
          stakingBalance={stakingBalance}
          stakeTokens={stakeTokens}
          unstakeTokens={unstakeTokens}
          decentralBankContract={decentralBank}
        />
      )}
    </div>
  );
}

export default App;
