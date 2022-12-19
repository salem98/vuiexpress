import { useRef, useState } from "react";
import { signIn } from "next-auth/react";

import styles from "./LoginPage.module.css";
import LoginIcon from "../public/icons/login-icon";
import { useRouter } from "next/router";
import LoadingSpinner from "../public/icons/loading-spinner";

const LoginPage = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    setLoginStatus(result.error);
    setIsLoading(false);

    if (!result.error) {
      router.replace("/app");
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <form onSubmit={loginHandler} className={styles["container"]}>
        <div className={styles["field"]}>
          <label htmlFor="username">Username:</label>
          <input
            type="email"
            id="username"
            name="username"
            ref={emailRef}
            placeholder="masukkan username..."
            autoComplete="off"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            placeholder="masukkan password..."
            autoComplete="off"
          />
        </div>
        <div className="error-txt">{isLoading ? <LoadingSpinner /> : loginStatus}</div>
        <button className={styles["btn"]}>
          <p>Login</p>
          <LoginIcon />
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
