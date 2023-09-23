function NavBar() {
  return (
    <nav
      className="navbar navbar-dark fixed-top shadow p-0"
      style={{ backgroundColor: "black" }}
    >
      <a className="text-white">DAPP Yield Staking (Decentralized Banking)</a>
      <ul>
        <li>
          <small className="text-white">ACCOUNT NUMBER:</small>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
