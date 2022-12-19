import MainNav from "../components-user/MainNav";
import LoginPage from "../components-user/LoginPage";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingPage from "../components-app/ui/LoadingPage";

const UserLoginPage = () => {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if (status === "authenticated") {
      router.push("/app");
    }
    setIsLoading(false);
  }, [status]);

  return (
    <>
      {isLoading ? <LoadingPage /> : null}
      {status !== "authenticated" ? <MainNav /> : null}
      {status !== "authenticated" ? <LoginPage /> : null}
    </>
  );
};

export default UserLoginPage;
