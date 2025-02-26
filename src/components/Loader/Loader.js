import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="flex justify-center items-center mt-32">
      <BeatLoader loading={true} />
    </div>
  );
}

export default Loader;
