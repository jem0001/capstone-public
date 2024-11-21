import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  MusicalNoteIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { useGlobalSounds } from "../context/sound/SoundContext";

export function SoundSettings() {
  const {
    areEffectsMuted,
    isMusicMuted,
    toggleEffectsMute,
    toggleMusicMute,
    setIsMusicMuted,
    setAreEffectsMuted,
  } = useGlobalSounds();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button onClick={handleOpen} className="bg-[#1E201E]">
        <Cog6ToothIcon className="size-8" />
      </Button>
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader>
          <p className="w-full text-2xl text-center border-b-2 border-black pb-4 font-bold text-black">
            Sound Settings
          </p>
        </DialogHeader>
        <DialogBody>
          <div>
            <div className="w-full mx-auto h-12 flex  gap-16 items-center justify-center pb-4 ">
              <div className="flex gap-4">
                <p className="text-xl text-black font-semibold ">Music</p>
                <input
                  type="checkbox"
                  className="size-6 accent-black"
                  checked={!isMusicMuted}
                  onClick={toggleMusicMute}
                />
              </div>
              <div className="flex gap-4">
                <p className="text-xl text-black font-semibold">Sound FX</p>
                <input
                  type="checkbox"
                  className="size-6 accent-black"
                  checked={!areEffectsMuted}
                  onClick={toggleEffectsMute}
                />
              </div>
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
