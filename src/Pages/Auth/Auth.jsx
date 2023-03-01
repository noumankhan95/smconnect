import "./Auth.css";

import { useSearchParams } from "react-router-dom";
import { useState, useCallback, useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { signupUser, signinUser } from "../../store/authreducer";
import Button from "../../Components/Button/Button";
const initialInputState = {
  username: "",
  email: "",
  password: "",
};
const inputReducer = (state, action) => {
  switch (action.type) {
    case "input":
      return { ...state, ...action.input };
    case "reset":
      return { ...state, username: "", email: "", password: "" };
    default:
      return state;
  }
};
const Auth = (props) => {
  const [params, setsearchparams] = useSearchParams();
  const [logmode, setlogmode] = useState();
  const [input, dispatch] = useReducer(inputReducer, initialInputState);
  const uid = useSelector((state) => state.authreducer.id);
  const navigate = useNavigate();
  const reduxdispatch = useDispatch();
  const [isloading, setisloading] = useState(false);
  let mode = params.get("logmode") || "login";
  useEffect(() => {
    setlogmode((p) => (mode === "signup" ? true : false));
  }, []);

  const changeLogmode = useCallback(() => {
    setsearchparams({ logmode: logmode ? "login" : "signup" });
    setlogmode((p) => !p);
  }, [logmode, setsearchparams]);
  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      // console.log(logmode);
      setisloading((p) => true);
      if (logmode) {
        reduxdispatch(signupUser(input))
          .then((r) => {
            console.log(r);
            setisloading((p) => false);
            navigate("/Auth?logmode=login");
          })
          .catch((c) => {
            console.log(c);
            setisloading((p) => false);
          });
      } else if (!logmode) {
        reduxdispatch(signinUser(input))
          .then((r) => {
            navigate("/feed");
            setisloading((p) => false);
          })
          .catch((e) => {
            console.log(e);
            setisloading((p) => false);
          });
      }
      dispatch({ type: "reset" });
    },
    [logmode, input, navigate]
  );
  const changeInput = useCallback((e) => {
    dispatch({ type: "input", input: { [e.target.name]: e.target.value } });
  }, []);
  if (isloading) {
    return (
      <div className="Auth">
        <Oval visible={true} />
      </div>
    );
  }
  return (
    <section className="Auth">
      <div className="AuthContainer">
        <div className="AuthLogo">
          <h1>SMCONNECT</h1>
        </div>
        <form className="AuthContainer_form" onSubmit={submitHandler}>
          {logmode && (
            <>
              <label htmlFor="">Enter Username</label>
              <input
                type="text"
                name="username"
                className="AuthContainer_form_input"
                onChange={changeInput}
              />
            </>
          )}

          <label htmlFor="">Enter Email</label>
          <input
            type="text"
            name="email"
            className="AuthContainer_form_input"
            onChange={changeInput}
          />
          <label htmlFor="">Enter Password</label>
          <input
            type="text"
            name="password"
            className="AuthContainer_form_input"
            onChange={changeInput}
          />
          <button className="AuthContainer_form_submit">Authneticate</button>
        </form>
      </div>
      <Button onClick={changeLogmode}>Change LogMode</Button>
    </section>
  );
};

export default Auth;
