import SignupUser from "../../../components-app/SignupUser";
import Layouts from "../_layouts";

const RegistrasiUserPage = () => {
  return (
    <div>
      <Layouts>
        <h2 className="main-content-title">Form Pendaftaran User Baru</h2>
        <SignupUser />
      </Layouts>
    </div>
  );
};

export default RegistrasiUserPage;
