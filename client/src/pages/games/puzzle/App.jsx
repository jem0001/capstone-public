import GameScreen from "./screens/GameScreen";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SelectSize from "./screens/SelectSize";
import FoundationLayout from "./components/layout/FoundationLayout";
import CountDown from "./components/CountDown";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Puzzle Game wrapper
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <FoundationLayout>
      <Outlet />
    </FoundationLayout>
  );
}

export default App;
