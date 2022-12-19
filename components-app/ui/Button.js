import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type={props.type}
      onClick={props.clickHandler}
      className={`${styles["btn"]} ${styles[props.width]} ${styles[props.color]}`}
      disabled={props.disabled}
    >
      {props.icon}
      <h4>{props.label}</h4>
    </button>
  );
};

export default Button;
