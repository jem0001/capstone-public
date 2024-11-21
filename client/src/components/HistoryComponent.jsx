import React, { useEffect, useState } from "react";
import { formatDate } from "../utils/dateUtils";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Select,
  Option,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import ScrollToTopButton from "./ScrollToTopButton";

function BillingCard({
  student: { qrImage, fullName, section, batch },
  createdAt,
  pointsAdded,
  from,
  type,
  quarter,
  week,
  activityNumber,
  status,
  _id,
  handleOpen,
  setIdToDelete,
}) {
  return (
    <Card
      shadow={false}
      className={`rounded-lg border-4 shadow-md ${
        status === "won" ? "border-green-500 " : "border-red-500"
      } p-4 my-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 ">
          <div className="border border-gray-200 p-2.5 rounded-lg size-16">
            <img
              src={`https://d5bvvx354nxbm.cloudfront.net/${qrImage}`}
              alt="qr.png"
              className="w-fit"
            />
          </div>
          <div className="">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-1 font-bold">
              {fullName}
            </Typography>
            <Typography className="!text-gray-600 text-xs mb-1 font-bold">
              {batch}
            </Typography>
            <Typography className="!text-gray-600 text-xs font-bold">
              {`section-${section}`}
            </Typography>
          </div>
        </div>
        <div>
          <div className="flex gap-1 items-end mt-1">
            <Typography className="mb-1 text-xs !text-gray-600 font-bold">
              {"Details"}:
            </Typography>
            <Typography className="text-xs" color="blue-gray">
              Received
              <span
                className={`${
                  status === "won" ? "text-green-500" : "text-red-500"
                } text-lg mx-2`}>
                {pointsAdded} points{" "}
              </span>
              {`for participating in Activity ${activityNumber} of Quarter ${
                quarter.split("-")[1]
              } Week ${week.split("-")[1]}, `}
              {status === "won"
                ? "achieving a perfect score"
                : "awarded for effort"}
            </Typography>
          </div>
          <div className="flex gap-1">
            <Typography className="mb-1 text-xs font-bold !text-gray-600">
              {"Activity type"}:
            </Typography>
            <Typography className="text-xs" color="blue-gray">
              {type}
            </Typography>
          </div>
          <div className="flex gap-1">
            <Typography className="mb-1 text-xs font-bold !text-gray-600">
              {"Date and Time"}:
            </Typography>
            <Typography className="text-xs" color="blue-gray">
              {formatDate(createdAt)}
            </Typography>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="text"
            color="red"
            className="flex items-center gap-2"
            onClick={() => {
              handleOpen();
              setIdToDelete(_id);
            }}>
            <TrashIcon className="h-4 w-4 text-red-500 mt-3" />
            <Typography className="!font-semibold text-xs text-red-500 md:block hidden mt-4">
              delete
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HistoryComponent() {
  const { deleteHistory } = useGlobalContext();

  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const { section, batch } = useParams();
  const [histories, setHistories] = useState([]);
  const [filter, setFilter] = useState({
    dateFilter: "",
    status: "",
    type: "",
  });

  const handleOpen = () => setOpen(!open);

  const getAllHistory = async () => {
    const response = await axios.get(
      `/histories/?batch=${batch}&section=${section}&dateFilter=${filter.dateFilter}&status=${filter.status}&type=${filter.type}`
    );
    console.log("history>>>>>", response.data.histories);
    setHistories(response.data.histories);
  };

  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    getAllHistory();
  }, [refreshFlag, filter]);

  return (
    <section className=" !mx-auto px-2 py-16 w-full">
      <Card className="pb-4 border-[#697565] border-4 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none flex gap-2 flex-col md:flex-row items-start !justify-between p-4 overflow-visible items-start">
          <div className="w-full mb-2">
            <Typography className="font-bold" color="blue-gray" variant="h5">
              <span className="text-green-500">Points</span>
              <span className="text-red-500"> History</span>
            </Typography>
            <Typography
              className="mt-1 !font-normal !text-gray-600"
              variant="small">
              View and update details quickly and easily.
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-fit">
              <Select
                label="Date filter"
                value={filter.dateFilter}
                onChange={(val) => {
                  setFilter({ ...filter, dateFilter: val });
                }}>
                <Option value="">All dates</Option>
                <Option value="today">Today</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="thisWeek">This week</Option>
                <Option value="lastWeek">Last week</Option>
              </Select>
            </div>
            <div className="w-fit">
              <Select
                label="Status filter"
                value={filter.status}
                onChange={(val) => {
                  setFilter({ ...filter, status: val });
                }}>
                <Option value="">Both</Option>
                <Option value="won">Correct</Option>
                <Option value="lost">Incorrect</Option>
              </Select>
            </div>
            <div className="w-fit">
              <Select
                label="Activity type"
                value={filter.type}
                onChange={(val) => {
                  setFilter({ ...filter, type: val });
                }}>
                <Option value="">Both</Option>
                <Option value="groupings">Groupings</Option>
                <Option value="individual">Individual</Option>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 !p-4">
          {histories.length === 0 && (
            <p className="text-2xl text-center">No data was found..</p>
          )}
          {histories.length > 0 && (
            <div>
              {histories.map((props, key) => (
                <BillingCard
                  key={props._id}
                  {...props}
                  handleOpen={handleOpen}
                  setIdToDelete={setIdToDelete}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <ScrollToTopButton />

      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader>Delete history</DialogHeader>
        <DialogBody>Are you sure you want to delete this record?</DialogBody>
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
            onClick={async () => {
              handleOpen();
              await deleteHistory(idToDelete);
              setRefreshFlag(!refreshFlag);
            }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
}

export default HistoryComponent;
