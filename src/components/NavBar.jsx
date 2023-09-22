import { Nav } from "../styles/navbar.styles";

function NavBar() {
  return (
    <Nav>
      <a style={{ color: "white" }}>
        DAPP Yield Staking (Decentralized Banking)
      </a>
      <ul>
        <li>
          <small style={{ color: "white" }}>ACCOUNT NUMBER:</small>
        </li>
      </ul>
    </Nav>
  );
}

export default NavBar;
