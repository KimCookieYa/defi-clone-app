import tether from "../tether.png";
import { useRef } from "react";
import { web3 } from "../App.jsx";

function Main({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
  decentralBankContract,
}) {
  const inputRef = useRef("");
  return (
    <div id="content" className="mt-3">
      <table className="table text-center text-muted">
        <thead>
          <tr style={{ color: "white" }}>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: "white" }}>
            <td>{web3.utils.fromWei(stakingBalance, "ether")} USDT</td>
            <td>{web3.utils.fromWei(rwdBalance, "ether")} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="mb-2 bg-white card" style={{ opacity: ".9" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            let amount;
            amount = inputRef.current.value;
            amount = web3.utils.toWei(amount, "ether");
            stakeTokens(amount);
            inputRef.current.value = "";
          }}
          className="mb-3"
        >
          <div style={{ borderSpacing: "0 1em" }}>
            <label className="float-left mr-10 ml-15">
              <b>Stake Tokens</b>
            </label>
            <span className="float-right mr-8">
              Balance: {web3.utils.fromWei(tetherBalance, "ether")}
            </span>
            <div className="flex flex-row mb-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="0"
                required
                className="w-30"
              />
              <img
                src={tether}
                alt="tether"
                style={{ height: "32px", width: "60px" }}
              />
              USDT
            </div>
            <button type="submit">DEPOSIT</button>
          </div>
        </form>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault(unstakeTokens());
          }}
        >
          WITHDRAW
        </button>
      </div>
    </div>
  );
}

export default Main;
