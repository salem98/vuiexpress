import styles from "../../styles/Layouts.module.css";

import Sidemenu from "../../components-app/Sidemenu";
import Topbar from "../../components-app/Topbar";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingComponent from "../../components-app/ui/LoadingComponent";

const Layouts = (props) => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [profile, setProfile] = useState("");
  const router = useRouter();

  const showSideMenuHandler = () => {
    setShowSideMenu(!showSideMenu);
  };

  useEffect(() => {
    getSession().then((session) => {
      // console.log(session);
      if (!session) {
        router.replace("/auth");
      } else {
        setProfile(session);
        setLoadingPage(false);
      }
    });
  }, [router]);

  // console.log(status);

  return (
    <div className={styles["container"]}>
      <Sidemenu style={showSideMenu} />
      <div className={styles["main-side"]}>
        <Topbar onToggle={showSideMenuHandler} onShow={showSideMenu} user={profile} />
        {loadingPage ? <LoadingComponent /> : props.children}
      </div>
    </div>
  );
};

export default Layouts;
