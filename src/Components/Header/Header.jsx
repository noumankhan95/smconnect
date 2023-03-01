import "./Header.css";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../store/authreducer";
import { useDispatch, useSelector } from "react-redux";

const Header = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authreducer);
  return (
    <header className="Header">
      <nav className="Header_nav">
        <div className="Header_nav_logo">
          <NavLink to={"/"}>SMCONNECT</NavLink>
        </div>
        <div className="Header_nav_Info">
          <h2>
            <NavLink to={`/Profile/${user.id}`} className="profileLink">
              Profile
            </NavLink>
          </h2>
          <button onClick={() => dispatch(logoutUser())} className="signout">SignOut</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
