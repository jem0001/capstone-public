import React, { createContext, useContext, useState } from "react";
// import sounds
import pleasantMusicMp3 from "./assets/pleasant-music.mp3";
import youWinMp3 from "./assets/you-win.mp3";
import youLoseMp3 from "./assets/game-over.mp3";
import scannerBeepMp3 from "./assets/scanner-beep.mp3";
import scannerErrorMp3 from "./assets/scanner-error.mp3";
import correctMp3 from "./assets/correct.mp3";
import wrongMp3 from "./assets/wrong.mp3";

// Initialize music tracks
const musicTracks = {
  pleasant: new Audio(pleasantMusicMp3),
  exciting: new Audio(youWinMp3),
};

// Set loop and volume for each music track
Object.values(musicTracks).forEach((music) => {
  music.loop = true;
  music.volume = 1.0;
});

// Initialize sound effects
const scannerBeep = new Audio(scannerBeepMp3);
const scannerError = new Audio(scannerErrorMp3);
const correct = new Audio(correctMp3);
const wrong = new Audio(wrongMp3);
// Create the context
const SoundContext = createContext();

// Create the provider component
const SoundProvider = ({ children }) => {
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [areEffectsMuted, setAreEffectsMuted] = useState(false);

  const playMusic = (trackName) => {
    if (trackName) {
      musicTracks[trackName].pause();
    }
    musicTracks[trackName].play();
    setIsMusicPlaying(true);
    setCurrentMusic(trackName);
  };

  const pauseMusic = (trackName) => {
    if (trackName) {
      musicTracks[trackName].pause();
    }
    setIsMusicPlaying(false);
  };

  const stopAndResetMusic = (trackName) => {
    setIsMusicPlaying(false);
    if (trackName) {
      musicTracks[trackName].pause();
      musicTracks[trackName].currentTime = 0;
    }
  };

  const toggleMusicMute = () => {
    if (isMusicMuted) {
      setIsMusicMuted(false);
      playMusic(currentMusic);
    } else {
      setIsMusicMuted(true);
      pauseMusic(currentMusic);
    }
  };

  // SOUND EFFECTS
  const toggleEffectsMute = () => {
    setAreEffectsMuted(!areEffectsMuted);
  };

  const playSoundEffect = (sound) => {
    if (!areEffectsMuted) {
      sound.pause();
      sound.currentTime = 0;
      sound.play();
    }
  };

  const playYouWin = () => {
    playSoundEffect(new Audio(youWinMp3));
  };

  const playYouLose = () => {
    playSoundEffect(new Audio(youLoseMp3));
  };

  const playScannerBeep = () => {
    playSoundEffect(scannerBeep);
  };

  const playScannerError = () => {
    playSoundEffect(scannerError);
  };

  const playCorrect = () => {
    playSoundEffect(correct);
  };

  const playWrong = () => {
    playSoundEffect(wrong);
  };

  return (
    <SoundContext.Provider
      value={{
        playMusic,
        pauseMusic,
        stopAndResetMusic,
        toggleMusicMute,
        isMusicMuted,
        isMusicPlaying,
        playYouWin,
        playYouLose,
        playScannerBeep,
        playScannerError,
        toggleEffectsMute,
        areEffectsMuted,
        playCorrect,
        playWrong,
        setAreEffectsMuted,
        setIsMusicMuted,
      }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useGlobalSounds = () => {
  return useContext(SoundContext);
};

export { SoundProvider, SoundContext };
