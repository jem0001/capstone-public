import App from "./App";
import FlipProvider from "./context/fllipContext";
import { SoundSettings } from "../../../components/SoundSettings";
const Flip = () => {
  return (
    <>
      <FlipProvider>
        <App />
        <div className="absolute top-2 right-2">
          <SoundSettings />
        </div>
      </FlipProvider>
    </>
  );
};
export default Flip;
