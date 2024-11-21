// React
import { useEffect, useState } from "react";
import QrReaderPlugin from "./QrReaderPlugin";
import { useGlobalContext } from "../../context/context";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useGlobalSounds } from "../../context/sound/SoundContext";

// Components

function QrReaderComponent({
  message,
  pointsAdded,
  status,
  from,
  quarter,
  week,
  activityNumber,
  type,
}) {
  // state DEFAULTS

  const { toggleScanner, setToggleScanner, handleToggleScanner, addHistory } =
    useGlobalContext();
  const [scannedResult, setScannedResult] = useState("");
  const [maxScan, setMaxScan] = useState(1);
  const [scanCounter, setScanCounter] = useState(1);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    console.log("openingg");
    setOpen(!open);
  };

  // endgame

  const handleChange = (e) => {
    setMaxScan(Number(e.target.value));
    setScanCounter(1);
  };

  useEffect(() => {
    console.log(">>>>maxScan", maxScan);
    console.log(">>>>counter", scanCounter);

    const handleScanIterate = async () => {
      if (scannedResult) {
        // set up form
        const form = {
          student: scannedResult,
          pointsAdded,
          status,
          from,
          quarter,
          week,
          activityNumber,
          type,
        };
        if (scanCounter !== maxScan) {
          setToggleScanner(false);
          setScannedResult("");
          setScanCounter((prev) => prev + 1);

          // send to server
          console.log("sending to db");
          await addHistory(form);

          // Set timeout to reopen QR after 1 second
          await new Promise((resolve) =>
            setTimeout(() => {
              resolve();
            }, 1000)
          );
          setToggleScanner(true);
          // Return cleanup function to cancel timeout
        } else {
          // Max scan reached close QR and reset
          setToggleScanner(false);
          setScannedResult("");
          // reset scanCounter and maxScan
          setMaxScan(1);
          setScanCounter(1);
          console.log("sending to db last");
          await addHistory(form);
        }
      }
    };

    handleScanIterate();
  }, [scannedResult, maxScan]);

  return (
    <>
      {toggleScanner && (
        <Dialog
          open={toggleScanner}
          handler={handleToggleScanner}
          className="p-4"
          dismiss={{ enabled: false }}
          style={{ zIndex: 9 }}>
          <div className="size-12 bg-white absolute top-[0] left-[50%] -translate-x-1/2 -translate-y-full w-fit  rounded-t-full h-15 hover:scale-105">
            <XCircleIcon
              className="size-10  text-center w-full text-red-500"
              onClick={handleOpen}
            />
          </div>

          <DialogHeader>
            <div className="absolute right-8 flex flex-col ">
              <label htmlFor="ptsCounter" className="text-[10px]">
                Scan count
              </label>

              <input
                type="number"
                name="ptsCounter"
                id="ptsCounter"
                autoFocus={false}
                tabIndex={-1}
                className="border-[1px] border-gray-300  w-[60px] rounded-md shadow-md text-center"
                value={maxScan}
                onChange={handleChange}
              />
            </div>
            <p className="absolute left-8 w-[60px]">
              {scanCounter}/{maxScan}
            </p>
            <div
              className={`${
                status === "won" ? "text-green-500" : "text-red-500"
              } text-center w-full text-[1.3rem]`}>{`${message} ${pointsAdded} point(s)`}</div>
          </DialogHeader>
          <DialogBody>
            <QrReaderPlugin
              scannedResult={scannedResult}
              setScannedResult={setScannedResult}
            />
          </DialogBody>
        </Dialog>
      )}

      {/* key to indexing, must check if scanner is open */}
      {toggleScanner && (
        <Dialog open={open} handler={handleOpen} size="sm">
          <DialogHeader>Close scanner</DialogHeader>
          <DialogBody>Are you sure you want to close scanner?</DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={() => {
                handleOpen();
                handleToggleScanner();
              }}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}

export default QrReaderComponent;
