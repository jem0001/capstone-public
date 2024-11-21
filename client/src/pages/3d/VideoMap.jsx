import React, { act, useEffect, useState } from "react";
import philippinesJson from "../../utils/philippines.json";
import seal3D from "../../assets/seal-3D.mp4";
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  spinner,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { PlayCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context/context";
import QuizGame from "./quiz/QuizGame";
import YouTube from "react-youtube";

const VideoMap = () => {
  const { getActivity } = useGlobalContext();
  const { week, id } = useParams();

  const [videoCode, setVideoCode] = useState("");
  const [ph, setPh] = useState(philippinesJson);
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState();
  const [loading, setLoading] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handlePlaceClick = (place) => {
    if (place === activity.place) {
      handleOpen();
    }
  };

  const handleVideoEnd = () => {
    setVideoOpen(false);
    setGameOpen(true);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const activity = await getActivity(id);
      setActivity(activity);

      // get youtube id
      if (activity.videoURL.startsWith("https://www.youtu")) {
        const ytVideoCode = activity.videoURL.split("v=")[1].split("&")[0];
        setVideoCode(ytVideoCode);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }
  // bg can be added below
  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-900">
      <div className="h-full container mx-auto px-24 py-16">
        {!videoOpen && !gameOpen && (
          <div className="map-div grid place-items-center">
            <svg
              xmlns:mapsvg="http://mapsvg.com"
              xmlns:dc="http://purl.org/dc/elements/1.1/"
              xmlns:cc="http://creativecommons.org/ns#"
              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              xmlns:svg="http://www.w3.org/2000/svg"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="svg2"
              height="1209.4381"
              width="702.39001"
              mapsvg:geoviewbox="116.927573 20.834769 126.606549 4.640292">
              <metadata id="metadata89">
                <rdf:RDF>
                  <cc:Work rdf:about="">
                    <dc:format>image/svg+xml</dc:format>
                    <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                    <dc:title></dc:title>
                  </cc:Work>
                </rdf:RDF>
              </metadata>
              <defs id="defs87" />
              {ph.map(({ id, title, d }) => {
                return (
                  <Tooltip key={id} content={title} placement="top">
                    <path
                      id={id}
                      title={title}
                      d={d}
                      style={{ fill: title === activity.place && "blue" }}
                      onClick={() => {
                        handlePlaceClick(title);
                      }}></path>
                  </Tooltip>
                );
              })}
            </svg>

            <Dialog size="xl" open={open} handler={handleOpen}>
              <DialogHeader className="justify-between">
                {activity.place}
              </DialogHeader>
              <DialogBody>
                {/* <img
                  alt="nature"
                  className="h-[30rem] w-full rounded-lg object-cover object-center"
                  src={`${activity.modalImageURL}?${Date.now()}`}
                /> */}
                <iframe
                  src={activity.streetViewURL}
                  width="100%"
                  height="500"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
                <div className="grid grid-cols-5 place-items-center p-4 gap-4">
                  <div className="mt-4 col-span-4">
                    {/* <h1 className="text-2xl text-black">
                      {activity.modalPlace}
                    </h1> */}
                    <p className="text-justify text-black">
                      {activity.modalDescription}
                    </p>
                  </div>
                  <PlayCircleIcon
                    className=" size-48 flex items-end justify-center text-black hover:scale-105 hover:cursor-pointer col-span-1"
                    onClick={() => {
                      handleOpen();
                      setVideoOpen(true);
                    }}
                  />
                </div>
              </DialogBody>
            </Dialog>
          </div>
        )}

        <div className="w-fit mx-auto">
          {videoOpen &&
            (activity.videoURL.startsWith("https://www.youtu") ? (
              <YouTube
                opts={{
                  width: "640", // Adjust width as needed
                  height: "360",
                }}
                videoId={videoCode}
                className=""
                onEnd={handleVideoEnd}></YouTube>
            ) : (
              <video
                controls
                className="w-[640px] h-[360px]"
                onEnded={handleVideoEnd}>
                <source
                  src={`${activity.videoURL}?${Date.now()}`}
                  type="video/mp4"
                />
              </video>
            ))}
        </div>

        {gameOpen && <QuizGame setGameOpen={setGameOpen} />}
      </div>
    </div>
  );
};

export default VideoMap;
