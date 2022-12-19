import ReceiveManifest from "../../../components-app/ReceiveManifest";
import Layouts from "../_layouts";

const ReceiveManifestPage = () => {
  return (
    <div>
      <Layouts>
        <h2 className="main-content-title">Manifest Incoming</h2>
        <ReceiveManifest />
      </Layouts>
    </div>
  );
};

export default ReceiveManifestPage;
