import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <BeatLoader loading={true} />
    </div>
  );
}

export default Loader;
