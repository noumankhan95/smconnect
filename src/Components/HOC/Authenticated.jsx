import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
const Authenticated = (props) => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Authenticated;
