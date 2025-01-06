import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import HomeComponent from "./pages/HomeComponent";
import Student from "./pages/Student";
import VideoMap from "./pages/3d/VideoMap";
import { ToastContainer } from "react-toastify";
import { Testing } from "./pages/Testing";
import VerifyEmail from "./pages/VerifyEmail";
import Account from "./pages/Account";
import Security from "./pages/Security";
import Weeks from "./pages/Weeks";
import Activities from "./pages/Activities";
import Puzzle from "./pages/games/puzzle/Puzzle";
import GameScreen from "./pages/games/puzzle/screens/GameScreen";
import SelectSize from "./pages/games/puzzle/screens/SelectSize";
import History from "./pages/History";
import EditPuzzle from "./pages/editGames/EditPuzzle";
import ProtectedRoute from "./components/ProtectedRoute";
import EditQuiz from "./pages/editGames/EditQuiz";
import IndiCharts from "./pages/individual-charts/IndiCharts";
import Dashboard from "./pages/dashboard/Dashboard";
import Quarters from "./pages/Quarters";
import FamilyFeud from "./pages/games/family-feud/FamilyFeud";
import StartGame from "./pages/games/family-feud/views/gamestart";
import Scoreboard from "./pages/games/family-feud/views/scoreboard";
import GameEnd from "./pages/games/family-feud/views/gameend";
import Round from "./pages/games/family-feud/views/round";
import EditFamilyFeud from "./pages/editGames/EditFamilyFeud";
import NonFlipEasy from "./pages/games/non-flip-easy/NonFlipEasy";
import EditNonFlipEasy from "./pages/editGames/EditNonFlipEasy";
import DragAndLearn from "./pages/games/drag-and-learn/DragAndLearn";
import EditDragAndLearn from "./pages/editGames/EditDragAndLearn";
import Hangman from "./pages/games/hangman/Hangman";
import EditHangman from "./pages/editGames/EditHangman";
import Flip from "./pages/games/flip/Flip";
import EditFlip from "./pages/editGames/EditFlip";
import NonFlipHard from "./pages/games/non-flip-hard/NonFlipHard";
import PuzzleLanding from "./pages/games/puzzle/screens/PuzzleLanding";
import CountDown from "./pages/games/puzzle/components/CountDown";
import Help from "./pages/Help";

function App() {
  return (
    <>
      <ToastContainer position="top-right" className={"z-[99999999999999]"} />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<HomeComponent />} />
            <Route path="student" element={<Student />} />
            <Route path="help" element={<Help />} />
            <Route path="student/:id" element={<IndiCharts />} />
            <Route
              path="student/history/:batch/:section"
              element={<History />}
            />
            <Route path="security" element={<Security />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account" element={<Account />} />

            <Route path="activities" element={<Quarters />} />
            <Route path="activities/:quarter" element={<Weeks />} />
            <Route path="activities/:quarter/:week" element={<Activities />} />

            {/* GAME 1 - PUZZLE */}
            <Route
              path="activities/:quarter/:week/puzzle/:id"
              element={<Puzzle />}
            >
              <Route path="" element={<PuzzleLanding />} />
              <Route path="game-screen" element={<GameScreen />} />
              <Route path="select-size" element={<SelectSize />} />
            </Route>
            <Route
              path="activities/edit/:quarter/:week/puzzle/:id"
              element={<EditPuzzle />}
            />
            {/* GAME 1 - PUZZLE END*/}

            {/* MAP ACTIVITY */}
            <Route
              path="activities/:quarter/:week/map/:id"
              element={<VideoMap />}
            />
            <Route
              path="activities/edit/:quarter/:week/map/:id"
              element={<EditQuiz />}
            />
            <Route path="video-map" element={<VideoMap />} />

            {/* MAP ACTIVITY END*/}

            {/* GAME-3 FAMILY FEUD */}

            <Route
              path="activities/:quarter/:week/family-feud/:id"
              element={<FamilyFeud />}
            >
              <Route path="" element={<StartGame />} />
              <Route path="scoreboard" element={<Scoreboard />} />

              <Route path="round/:roundNumber" element={<Round />} />
              <Route path="game-end" element={<GameEnd />} />
            </Route>
            <Route
              path="activities/edit/:quarter/:week/family-feud/:id"
              element={<EditFamilyFeud />}
            />

            {/* GAME-3 FAMILY FEUD  END*/}

            {/* GAME-4 NON-FLIP-EASY */}

            <Route
              path="activities/:quarter/:week/non-flip-easy/:id"
              element={<NonFlipEasy />}
            ></Route>
            <Route
              path="activities/edit/:quarter/:week/non-flip-easy/:id"
              element={<EditNonFlipEasy />}
            />
            {/* GAME-4 NON-FLIP-EASY  END*/}

            {/* GAME-5 DRAG-AND-LEARN */}
            <Route
              path="activities/:quarter/:week/drag-and-learn/:id"
              element={<DragAndLearn />}
            />
            <Route
              path="activities/edit/:quarter/:week/drag-and-learn/:id"
              element={<EditDragAndLearn />}
            />
            {/* GAME-5 DRAG-AND-LEARN END*/}

            {/* GAME-6 HANGMAN */}
            <Route
              path="activities/:quarter/:week/hangman/:id"
              element={<Hangman />}
            />
            <Route
              path="activities/edit/:quarter/:week/hangman/:id"
              element={<EditHangman />}
            />
            {/* GAME-6 HANGMAN*/}

            {/* GAME-7 FLIP */}
            <Route
              path="activities/:quarter/:week/flip/:id"
              element={<Flip />}
            />
            <Route
              path="activities/edit/:quarter/:week/flip/:id"
              element={<EditFlip />}
            />
            {/* GAME-7 FLIP*/}

            {/* GAME-8 NON-FLIP-HARD */}

            <Route
              path="activities/:quarter/:week/non-flip-hard/:id"
              element={<NonFlipHard />}
            ></Route>
            <Route
              path="activities/edit/:quarter/:week/non-flip-hard/:id"
              element={<EditNonFlipEasy />}
            />
            {/* GAME-8 NON-FLIP-HARD  END*/}
          </Route>
        </Route>

        {/* <Route path="/countdown" element={<CountDown />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="testing" element={<Testing />} />
      </Routes>
    </>
  );
}

export default App;
