import "./Button.css";

const Button = (props) => {
  return (
    <button
      className={`button ${props.custom ? props.custom : ""}`}
      onClick={props.onClick}
    >
      {props.children.toUpperCase()}
    </button>
  );
};

export default Button;
