import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  CardFooter,
  Spinner,
} from "@material-tailwind/react";
import { HiDotsVertical } from "react-icons/hi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/context";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { renameGameTitle } from "../utils/misc-functions";
import { LazyLoadImage } from "react-lazy-load-image-component";
export function ActivitiesGrid() {
  const { week, quarter } = useParams();
  const { deleteActivity, addActivity } = useGlobalContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [changesFlag, setChangesFlag] = useState(false);
  const [id, setId] = useState({ button: "", week: "", name: "", id: "" });
  const [confirmationMessage, setConfirmationMessage] = useState({
    header: "adf",
    body: "fdas",
  });

  const [actCollections, setActCollections] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectError, setSelectError] = useState("");

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleAddOpen = () => setAddOpen(!addOpen);
  const handleOpen = () => setOpen(!open);

  const getActivities = async (quarter, week) => {
    const response = await axios.get(
      `/activities/?week=${week}&quarter=${quarter}`
    );

    const renamedActivities = response.data.activities.map((activity) => {
      const renamed = renameGameTitle(activity.name);
      return { ...activity, newName: renamed };
    });

    setActivities(renamedActivities);
  };
  const getActCollections = async () => {
    const response = await axios.get(`/actCollections`);
    setActCollections(response.data.actCollections);
    console.log("gettingcollectoin", response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActivity) {
      setSelectError("please pick an activity");
      return;
    }
    const form = { actId: selectedActivity, quarter, week };
    await addActivity(form);
    setChangesFlag(!changesFlag);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getActivities(quarter, week);
      await getActCollections();
      setLoading(false);
    };
    fetchData();
  }, [changesFlag]);

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center absolute left-0 top-0">
        <Spinner />
      </div>
    );
  }
  if (activities.length === 0 || actCollections.length === 0) {
    <></>;
  }
  console.log(useParams());
  return (
    <div className="flex justify-center items-center flex-wrap gap-4">
      {activities.map(
        ({
          _id,
          imageLink,
          week,
          name,
          description,
          activityNumber,
          type,
          newName,
        }) => (
          <div key={_id}>
            <Card className="z-2 border-[#3C3D37] border-4 max-w-[600px] flex-row h-[300px] overflow-hidden shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024] transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
              <CardHeader
                shadow={false}
                floated={false}
                className="m-0 w-3/6 shrink-0 rounded-none hover:cursor-pointer"
                onClick={() => {
                  navigate(`${name}/${_id}`);
                }}
              >
                {/* <img
                  src={imageLink}
                  alt="card-image"
                  className="h-full w-full bg-cover rounded-none"
                /> */}
                <LazyLoadImage
                  alt="card-image"
                  src={imageLink}
                  effect="blur"
                  height={"100%"}
                  className="h-full w-full bg-cover rounded-none"
                />
              </CardHeader>
              <CardBody className="flex justify-center items-start flex-col">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-black tracking-widest font-bold"
                >
                  <span className="uppercase">{newName}</span>
                </Typography>
                <div className="mb-2 text-black w-fit font-bold text-sm">
                  {`Activity ${activityNumber} -`}
                  <span
                    className="uppercase
                  "
                  >{` ${type}`}</span>
                </div>
                <Typography
                  color="gray"
                  className="font-normal text-black text-xs text-justify"
                >
                  {description}
                </Typography>
                <hr className="border-[1px] border-[#1E201E] my-4 w-full"></hr>
                <div className="w-full z-4">
                  <div className="flex items-center justify-start gap-2">
                    <div className="">
                      <button
                        onClick={() => {
                          handleOpen();
                          setConfirmationMessage({
                            header: "Edit Contents",
                            body: "Are you sure you want to edit content?",
                          });
                          setId({ button: "edit", week, name, id: _id });
                        }}
                      >
                        <EditButton />
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleOpen();
                          setConfirmationMessage({
                            header: "Delete Activity",
                            body: "Are you sure you want to delete this activity? ",
                          });
                          setId({ button: "delete", id: _id });
                        }}
                      >
                        <DeleteButton />
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )
      )}
      <div
        className="min-w-[600px] h-[300px] bg-white border-4 border-[#3C3D37] overflow-hidden grid place-items-center shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024] rounded-lg transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
        onClick={handleAddOpen}
      >
        <PlusIcon className="size-20" />
      </div>

      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader>{confirmationMessage.header}</DialogHeader>
        <DialogBody>{confirmationMessage.body}</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={async () => {
              handleOpen();
              if (id.button === "delete") {
                await deleteActivity(id.id);
                setChangesFlag(!changesFlag);
              } else {
                navigate(
                  `/activities/edit/${quarter}/${id.week}/${id.name}/${id.id}`
                );
              }
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        size="lg"
        open={addOpen}
        handler={handleAddOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[96rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Activity
            </Typography>

            <Typography className="-mb-2" variant="h6">
              Choose Activity
            </Typography>

            <div className="flex flex-wrap items-center justify-center w-full p-4 gap-4 bg-gray-300 overflow-x-auto py-8 ">
              {actCollections.map(({ _id, name, imageLink, type }) => (
                <div
                  key={_id}
                  className={` ${
                    _id === selectedActivity
                      ? "border-[#059212] border-[8px]"
                      : ""
                  } `}
                  onClick={(e) => {
                    setSelectedActivity(_id);
                    setSelectError("");
                  }}
                >
                  <div>
                    <div
                      className="bg-yellow-200 w-80 h-48 bg-contain bg-no-repeat mx-auto"
                      style={{ backgroundImage: `url(${imageLink})` }}
                    ></div>
                    <div className=" text-sm flex items-center justify-around bg-[#059212] py-4 mt-[-1rem] text-white font-bold tracking-widest">
                      <p>
                        <span className="uppercase"> {name} </span>
                      </p>
                      <p>
                        <span className="uppercase bg-yellow-600 px-4 text-[#059212] rounded-full py-2">
                          {" "}
                          {type}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectError && (
              <p className="text-red-500 text-xs -mt-2 ml-2">{selectError}</p>
            )}

            <Button className="w-full bg-[#059212]" onClick={handleSubmit}>
              Add
            </Button>
          </CardBody>
        </Card>
      </Dialog>
    </div>
  );
}
