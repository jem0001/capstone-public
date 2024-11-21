import { useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { GameContext } from "../context/GameContext";
import DraggableFlagsContainer from "./DraggableFlagsContainer";
import EndMatchStats from "./EndMatchStats";
import SilhouettesGridContainer from "./SilhouettesGridContainer";
import Countdown from "react-countdown";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import { Spinner } from "@material-tailwind/react";
import Drag from "../image/Drag.png";

export default function GameApp() {
  const { playMusic, isMusicPlaying, isMusicMuted } = useGlobalSounds();

  const {
    startMatch,
    setStartMatch,
    matchEnded,
    setMatch,
    handleOnDragEnd,
    title,
    countdownRef,
    remainingTime,
    renderer,
    decreaseTime,
    handleCountdownComplete,
    setCountdownStartTime,
    setRemainingTime,
    activity,
    setActivity,
    playerWon,
    guessedCountriesCounter,
  } = useContext(GameContext);

  if (!activity) {
    return <Spinner />;
  }
  return (
    <>
      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
        <main className="flex flex-col items-center justify-between  w-full ">
          {!startMatch ? (
            <>
              <div className="bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat  min-h-screen w-full flex items-center justify-center flex-col">
                <div>
                  <img
                    src={Drag}
                    alt=""
                    className="h-80 rounded-2xl border-4 border-white mb-8"
                  />
                  <div className="flex items-center justify-center">
                    <button
                      className="playAgainBtn bg-[#059212] px-16 py-4 rounded-2xl text-2xl tracking-widest uppercase text-white font-bold"
                      onClick={() => {
                        setStartMatch(true);
                        const newCountdownStartTime =
                          Date.now() + 60000 * activity.timer;
                        setCountdownStartTime(newCountdownStartTime);
                        setRemainingTime(newCountdownStartTime);

                        // play music
                        if (!isMusicPlaying && !isMusicMuted) {
                          console.log("layout");
                          playMusic("pleasant");
                        }
                      }}>
                      START GAME
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : matchEnded ? (
            <>
              <div className="bg-green-900 min-h-screen w-full grid place-items-center">
                <button
                  onClick={() => {
                    setMatch();

                    const newCountdownStartTime =
                      Date.now() + 60000 * activity.timer;
                    setCountdownStartTime(newCountdownStartTime);
                    setRemainingTime(newCountdownStartTime);
                    // play music
                    if (!isMusicPlaying && !isMusicMuted) {
                      console.log("layout");
                      playMusic("pleasant");
                    }
                  }}
                  className="playAgainBtn bg-[#06D001] text-white font-bold tracking-widest text-4xl px-12 py-4 rounded-xl">
                  PLAY AGAIN
                </button>
              </div>
            </>
          ) : (
            <>
              {/* bg-[url('/src/assets/gardenBg.jpg')]  */}
              <div className="bg-[url('/src/assets/dnd-bg.jpg')] bg-no-repeat bg-cover min-h-screen w-full grid place-items-center py-4 px-24">
                <div>
                  <p className="font-bold bg-green-900 text-white tracking-widest px-16 py-4 rounded-lg text-xl uppercase ">
                    {title}
                  </p>
                </div>

                <section className="flex items-center justify-center  mb-20 md:py-0 py-2 md:flex-row flex-col-reverse w-full">
                  <SilhouettesGridContainer />
                  <aside className="flex flex-col items-center gap-4 h-full px-4 md:px-0 md:py-0 py-2 text-center ">
                    <div className="timer">
                      <p className="text-white tracking-widest font-bold">
                        TIMER
                      </p>
                      <div className="text-white">
                        <Countdown
                          ref={countdownRef}
                          date={remainingTime}
                          autoStart={true}
                          renderer={renderer}
                          controlled={false}
                          onComplete={handleCountdownComplete}
                        />
                      </div>
                      {/* <button
                        onClick={decreaseTime}
                        className="bg-[#af1d20] p-2 text-white rounded-lg ml-2 shadow-2xl">
                        Decrease Time by 3 Seconds
                      </button> */}
                    </div>

                    <DraggableFlagsContainer />
                  </aside>
                </section>
              </div>
            </>
          )}
        </main>
        {playerWon && (
          <QrReaderComponent
            message={"You win"}
            pointsAdded={activity.winPoints * guessedCountriesCounter}
            status={"won"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
        {!playerWon && (
          <QrReaderComponent
            message={"You lose, but gained"}
            pointsAdded={activity.winPoints * guessedCountriesCounter}
            status={"lost"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
      </DragDropContext>
    </>
  );
}
