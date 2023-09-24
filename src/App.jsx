import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./components/ParticleSettings";

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
    const web3 = window.web3;
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
      window.alert("Tether contract not deployed to detected network");
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
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  return (
    <div className="App" style={{ position: "relative" }}>
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticleSettings />
      </div>
      <NavBar account={account} />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {loading ? <h1>Loading...</h1> : <div>End Loading!</div>}
    </div>
  );
}

export default App;
