function NavBar({ account }) {
  return (
    <nav className="navbar navbar-dark fixed-top shadow p-0 bg-black text-white">
      <a>DAPP Yield Staking (Decentralized Banking)</a>
      <ul className="navbar-nav px-3">
        <li className="text-nowrap d-none nav-item d-sm-none d-sm-block">
          <small>ACCOUNT NUMBER: {account}</small>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
