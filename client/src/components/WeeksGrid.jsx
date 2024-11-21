import {
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { addWeekSchema } from "../utils/schemas";
import { FaLock } from "react-icons/fa";
import YouTube from "react-youtube";

const WEEKS = [
  "week-1",
  "week-2",
  "week-3",
  "week-4",
  "week-5",
  "week-6",
  "week-7",
  "week-8",
  "week-9",
  "week-10",
  "week-11",
  "week-12",
  "week-13",
  "week-14",
];

export function WeeksGrid({}) {
  const { addWeek, editWeek } = useGlobalContext();
  const navigate = useNavigate();
  const { quarter } = useParams();

  const [weeks, setWeeks] = useState([]);
  const [actCollections, setActCollections] = useState([]);
  const [lockFlag, setLockFlag] = useState(false);
  const [id, setId] = useState("");
  const [changesFlag, setChangesFlag] = useState(false);

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleAddOpen = () => setAddOpen(!addOpen);
  const handleEditOpen = () => setEditOpen(!editOpen);

  const getAllWeek = async (quarter) => {
    const response = await axios.get(`/weeks?quarter=${quarter}`);
    setWeeks(response.data.weeks);
  };

  const getActCollections = async () => {
    const response = await axios.get(`/actCollections`);
    setActCollections(response.data.actCollections);
    console.log("gettingcollectoin", response.data);
  };

  const unlock = async (id) => {
    const response = await axios.patch(`/weeks/${id}`, { open: true });
    setLockFlag((prev) => !prev);
  };
  const lock = async (id) => {
    const response = await axios.patch(`/weeks/${id}`, { open: false });
    setLockFlag((prev) => !prev);
  };

  const handleEdit = async () => {
    const { week: name, lessonTitle } = values;
    const form = { quarter, name, lessonTitle };
    await editWeek(id, form);
    setChangesFlag(!changesFlag);
  };

  // Form Validation
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues: { week: "", lessonTitle: "" },
    validationSchema: addWeekSchema,
    onSubmit: async () => {
      const { week: name, lessonTitle } = values;
      const form = { quarter, name, lessonTitle };

      await addWeek(form);
      setChangesFlag(!changesFlag);
    },
  });

  useEffect(() => {
    getAllWeek(quarter);
    getActCollections();
    console.log("useeffect");
  }, [lockFlag, changesFlag]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 w-full">
        {weeks.map((week) => (
          <div key={week._id} className="relative">
            {/* <img
            className="h-full w-full max-w-full rounded-lg object-contain object-center shadow-xl "
            // src={
            //   week.open
            //     ? week.imageLink
            //     : "https://media.istockphoto.com/id/936681148/vector/lock-icon.jpg?s=612x612&w=0&k=20&c=_0AmWrBagdcee-KDhBUfLawC7Gh8CNPLWls73lKaNVA="
            // }
            src={week.imageLink}
            alt="gallery-photo"
            onClick={() => {
              if (week.open) {
                console.log("navigating");
                navigate(`${week.name}`);
              }
            }}
          /> */}

            <div
              className="h-[300px] w-full rounded-lg object-contain object-center bg-[url('/src/assets/weekBG.png')] bg-cover text-white text-center shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024] flex items-center justify-center"
              onClick={() => {
                if (week.open) {
                  console.log("navigating");
                  navigate(`${week.name}`);
                }
              }}>
              <div className="bg-black bg-opacity-80 py-6 capitalize w-full">
                <h3 className="font-semibold tracking-widest uppercase">
                  {week.name}
                </h3>
                <h6>{week.lessonTitle}</h6>
              </div>
            </div>

            {/* locked overlay */}
            {!week.open && (
              <>
                <div className="lock-overlay h-full w-full absolute bg-black opacity-95 top-0 rounded-lg grid place-items-center "></div>
                <p className="absolute top-0 h-full w-full grid place-items-center text-[1.5rem] font-bold tracking-widest text-white ">
                  LOCKED
                </p>
              </>
            )}
            <div className="absolute top-1 right-1">
              <div className="grid place-items-center gap-2">
                {week.open ? (
                  <LockOpenIcon
                    className="size-8 hover:text-green-400 text-white"
                    onClick={() => {
                      lock(week._id);
                    }}
                  />
                ) : (
                  <Tooltip
                    placement="top-end"
                    className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                    content={
                      <div className="w-40">
                        {/* <Typography
                      color="blue-gray"
                      className="font-medium"
                    ></Typography> */}
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-80">
                          We recommend unlocking when you're done with the
                          previous week
                        </Typography>
                      </div>
                    }>
                    <LockClosedIcon
                      className="size-8 hover:text-green-500 text-white"
                      onClick={() => {
                        setOpen(true);
                        setId(week._id);
                      }}
                    />
                  </Tooltip>
                )}

                <PencilSquareIcon
                  className="size-8 text-white hover:text-green-500"
                  onClick={async () => {
                    const response = await axios.get(`/weeks/${week._id}`);
                    setFieldValue("week", response.data.week.name);
                    setFieldValue(
                      "lessonTitle",
                      response.data.week.lessonTitle
                    );
                    setEditOpen(true);
                    setId(week._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div
          className="h-[300px] bg-white rounded-lg grid place-items-center shadow-xl"
          onClick={() => {
            resetForm();
            handleAddOpen();
          }}>
          <PlusIcon className="size-20" />
        </div>
      </div>

      {/* DIALOGS */}
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader>Unlock confirmation</DialogHeader>
        <DialogBody>Are you sure you want to unlock this week?</DialogBody>
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
              unlock(id);
            }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        size="sm"
        open={addOpen}
        handler={handleAddOpen}
        className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[96rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Activity
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Choose week number
            </Typography>
            <Select
              name="week"
              label="Week Number"
              value={values.week}
              onBlur={handleBlur}
              onChange={(val) => {
                setFieldValue("week", val);
              }}>
              {WEEKS.map((week) => (
                <Option key={week} value={week}>
                  {week}
                </Option>
              ))}
            </Select>

            {errors.week && touched.week && (
              <p className="text-red-500 text-xs -mt-2 ml-2">{errors.week}</p>
            )}
            <Typography className="-mb-2" variant="h6">
              Lesson title
            </Typography>
            <Input
              name="lessonTitle"
              value={values.lessonTitle}
              label="Lesson Title"
              size="lg"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lessonTitle && touched.lessonTitle && (
              <p className="text-red-500 text-xs -mt-2 ml-2">
                {errors.lessonTitle}
              </p>
            )}

            <Button className="w-full" onClick={handleSubmit}>
              Add
            </Button>
          </CardBody>
        </Card>
      </Dialog>

      <Dialog
        size="sm"
        open={editOpen}
        handler={handleEditOpen}
        className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[96rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Edit Activity
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Week number
            </Typography>
            <Select
              name="week"
              label="Week Number"
              value={values.week}
              onBlur={handleBlur}
              onChange={(val) => {
                setFieldValue("week", val);
              }}>
              {WEEKS.map((week) => (
                <Option key={week} value={week}>
                  {week}
                </Option>
              ))}
            </Select>

            <Typography className="-mb-2" variant="h6">
              Lesson title
            </Typography>
            <Input
              name="lessonTitle"
              value={values.lessonTitle}
              label="Lesson Title"
              size="lg"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lessonTitle && touched.lessonTitle && (
              <p className="text-red-500 text-xs -mt-2 ml-2">
                {errors.lessonTitle}
              </p>
            )}

            <Button className="w-full" onClick={handleEdit}>
              Edit
            </Button>
          </CardBody>
        </Card>
      </Dialog>
    </div>
  );
}
