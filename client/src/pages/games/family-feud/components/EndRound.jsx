import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EndRound = (props) => {
  const [show, setShow] = useState(false);
  const handleOpen = () => setShow(!show);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setShow(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Modal
      </Button>
      <Dialog
        open={show}
        handler={handleOpen}
        size="xs"
        className="bg-transparent shadow-none"
      >
        <Link to="../scoreboard">
          <button className="next-btn-font bg-blue-500 rounded-lg px-16 py-4 mx-auto block">
            Next
          </button>
        </Link>
      </Dialog>
    </>
  );
};

export default EndRound;
