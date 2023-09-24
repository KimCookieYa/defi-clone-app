import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";

function App() {
  const [loading, setLoading] = useState(true);
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
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      setTether(() => new web3.eth.Contract(Tether.abi, tetherData.address));
      let tetherBalance = await tether.methods.balanceOf(account).call();
      setTetherBalance(() => tetherBalance.toString());
    } else {
      window.alert("Tether contract not deployed to detected network");
    }

    // Load RWD Contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      setRWD(() => new web3.eth.Contract(RWD.abi, rwdData.address));
      let rwdBalance = await rwd.methods.balanceOf(account).call();
      setRWDBalance(() => rwdBalance.toString());
    } else {
      window.alert("Tether contract not deployed to detected network");
    }

    // Load DecentralBank Contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      setDecentralBank(
        () =>
          new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
      );
      let stakingBalance = await decentralBank.methods
        .stakingBalance(account)
        .call();
      setstakingBalance(() => stakingBalance.toString());
    } else {
      window.alert("Tether contract not deployed to detected network");
    }

    // End Loading
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      console.log(accounts);
      setAccount(accounts[1]);
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
    <>
      <NavBar account={account} />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {loading ? <h1>Loading...</h1> : <div>End Loading!</div>}
    </>
  );
}

export default App;
