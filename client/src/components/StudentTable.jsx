import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MdDashboard } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import {
  TrashIcon,
  PencilIcon,
  QrCodeIcon,
  UserPlusIcon,
  PrinterIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { EditDialog } from "./EditDialog";
import { AddDialog } from "./AddDialog";
import { useGlobalContext } from "../context/context";
import PrintQr from "./PrintQrComponent";
import { useNavigate } from "react-router-dom";
import PrintQrComponent from "./PrintQrComponent";
import axios from "axios";

const QUARTER_TABS = [
  {
    label: "Quarter 1",
    value: "quarter-1",
  },
  {
    label: "Quarter 2",
    value: "quarter-2",
  },
  {
    label: "Quarter 3",
    value: "quarter-3",
  },
  {
    label: "Quarter 4",
    value: "quarter-4",
  },
  {
    label: "All Quarters",
    value: "",
  },
];

const TABLE_HEAD = [
  "Name",
  "Student-id",
  "QR",
  "Individual Points",
  "Groupings Points",
  "Completed Group Acts",
  "Total Points",
  "Actions",
];

const BATCH_ARRAY = [
  { name: "2024-2025" },
  { name: "2025-2026" },
  { name: "2026-2027" },
  { name: "2027-2028" },
  { name: "2028-2029" },
  { name: "2029-2030" },
  { name: "2030-2031" },
  { name: "2031-2032" },
  { name: "2032-2033" },
  { name: "2033-2034" },
  { name: "2034-2035" },
];

export function StudentTable({ handlePrint }) {
  const { students, setStudents } = useGlobalContext();
  const [editableStudent, setEditableStudent] = useState();

  const {
    getAllStudents,
    getOneStudent,
    deleteStudent,
    setStudentFilter,
    studentFilter,
  } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [totalPages, setTotalPages] = useState("");
  const [changesFlag, setChangesFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sections, setSections] = useState([]);
  const [totalGroupActs, setTotalGroupActs] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  // HANDLERS
  const handleOpen = async (id) => {
    setOpen((cur) => !cur);
    if (!open) {
      const { student } = await getOneStudent(id);
      setEditableStudent(student);
    }
  };
  const handleQrOpen = () => setQrOpen((cur) => !cur);
  const handleAddOpen = () => setAddOpen((cur) => !cur);
  const handleConfirmationOpen = () => setConfirmationOpen((cur) => !cur);

  // set up section tab
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { students, totalPages } = await getAllStudents({
        limit: 0,
        batch: studentFilter.batch,
      });
      let distinctSection = new Set(students.map((student) => student.section));
      distinctSection = [...distinctSection].sort();
      setSections(distinctSection);
    })();
  }, [changesFlag]);

  // auto page adjustment, when result for that page is empty - potentially be deleted
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { students, totalPages, page } = await getAllStudents(
        studentFilter
      );
      if (students.length === 0 && studentFilter.page > 1) {
        setStudentFilter((prevFilter) => ({
          ...prevFilter,
          page: prevFilter.page - 1,
        }));
      }
      setChangesFlag(!changesFlag);
    })();
  }, [deleteFlag]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      console.log("ssssss", studentFilter.page);
      const {
        data: { nbHits },
      } = await axios.get(
        `/activities?quarter=${studentFilter.quarter}&type=groupings`
      );

      const { students, totalPages, page } = await getAllStudents(
        studentFilter
      );

      setStudents(students);
      setTotalPages(totalPages);
      setTotalGroupActs(nbHits);
      console.log(studentFilter);
      setLoading(false);
    })();
  }, [studentFilter, changesFlag]);

  return (
    <>
      <Card className="h-full w-full border-blue-gray-50 border-4 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none overflow-visible"
        >
          <div className="mb-8 flex items-center justify-between gap-8 mt-2 ">
            <div className="flex gap-2 text-2xl">
              <MdDashboard className="" />
              <Typography variant="h5" color="blue-gray" className="">
                Students Table
              </Typography>
            </div>

            <div className="gap-2 flex">
              <Button
                className="flex w-40 gap-4 bg-[#059212] text-[white] "
                size="sm"
                onClick={handleAddOpen}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add student
              </Button>

              <Button
                className="flex w-40 gap-4 bg-[#03346E] text-[white]"
                size="sm"
                onClick={() => {
                  handlePrint();
                }}
              >
                <PrinterIcon strokeWidth={2} className="h-4 w-4" /> Print view
              </Button>
              <Button
                className="flex w-40 gap-4 bg-[#FF9100] text-[white]"
                size="sm"
                onClick={() => {
                  navigate(
                    `/student/history/${studentFilter.batch}/${studentFilter.section}`
                  );
                }}
              >
                <MdHistory className="h-4 w-4" />
                Pts History
              </Button>
            </div>
          </div>
          <Tabs
            value={studentFilter.quarter}
            className="w-full my-4 bg-blue-gray-50 rounded-lg"
          >
            <TabsHeader className="bg-blue-gray-50 ">
              {QUARTER_TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  color="blue-gray"
                  className="bg-blue-gray-50 text-black font-medium tracking-widest"
                  onClick={() => {
                    setStudentFilter({
                      ...studentFilter,
                      quarter: value,
                      page: 1,
                      search: "",
                    });
                    setSearchInput("");
                  }}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row ">
            <div className="">
              <Select
                className="border-2"
                size="md"
                label="Batch"
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    disabled: true,
                    className:
                      "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                  })
                }
                value={studentFilter.batch}
                onChange={(val) => {
                  setStudentFilter({
                    ...studentFilter,
                    batch: val,
                    page: 1,
                    search: "",
                  });
                  setSearchInput("");
                  setChangesFlag(!changesFlag);
                }}
              >
                {BATCH_ARRAY.map(({ name, flags }) => (
                  <Option
                    key={name}
                    value={name}
                    className="flex items-center gap-2"
                  >
                    {name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-[500px]">
              <Input
                label="Search"
                className="border-4"
                icon={
                  <MagnifyingGlassIcon
                    className="h-5 w-5"
                    onClick={() => {
                      setStudentFilter({
                        ...studentFilter,
                        search: searchInput,
                        page: 1,
                      });
                    }}
                  />
                }
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setStudentFilter({
                      ...studentFilter,
                      search: searchInput,
                      page: 1,
                    });
                  }
                }}
              />
            </div>
            <div className="">
              <Select
                className="border-2"
                label="Sort by:"
                value={studentFilter.sort}
                onChange={(val) => {
                  setStudentFilter({ ...studentFilter, sort: val, search: "" });
                  setSearchInput("");
                }}
              >
                <Option value="lastName">Last Name [ A-Z ]</Option>
                <Option value="-lastName">Last Name [ Z-A ]</Option>
                <Option value="points">Points [ Ascending ]</Option>
                <Option value="-points">Points [ Descending ]</Option>
              </Select>
            </div>
          </div>
          {sections.length !== 0 && !loading && (
            <Tabs
              value={studentFilter.section}
              className="w-full mt-4 bg-blue-gray-50 rounded-lg"
            >
              <TabsHeader className="bg-blue-gray-50">
                {sections.map((section) => (
                  <Tab
                    key={section}
                    value={section}
                    className="text-black"
                    onClick={() => {
                      setStudentFilter({
                        ...studentFilter,
                        section: section,
                        page: 1,
                        search: "",
                      });
                      setSearchInput("");
                    }}
                  >
                    &nbsp;&nbsp;{section}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          )}
        </CardHeader>
        <div>
          <CardBody className="overflow-x-scroll px-0 ">
            <table className="mt-4 w-full min-w-max table-auto text-center">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="p-4 bg-blue-gray-50">
                      <Typography
                        variant="small"
                        color="black"
                        className="font-normal leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              {!loading && students.length !== 0 && (
                <tbody>
                  {students.map(
                    (
                      {
                        fullName,
                        studentId,
                        individualPoints,
                        groupingsPoints,
                        completedGroupActs,
                        qrURL,
                        _id,
                      },
                      index
                    ) => {
                      const isLast = index === students.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              {/* <Avatar
                                src="https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg?format=jpg&crop=4401,4401,x0,y0,safe&height=416&width=416&fit=bounds"
                                alt={fullName}
                                size="sm"
                              /> */}
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {fullName
                                    .split(" ")
                                    .map(
                                      (item) =>
                                        item.charAt(0).toUpperCase() +
                                        item.slice(1)
                                    )
                                    .join(" ")}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {studentId}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <img src={qrURL} alt="qr.png" className="size-14" />
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {individualPoints}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {groupingsPoints}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {`${completedGroupActs}/${totalGroupActs}`}
                                {/* {completedGroupActs} */}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {individualPoints + groupingsPoints}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Edit User">
                              <IconButton
                                variant="text"
                                onClick={() => {
                                  handleOpen(_id);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              content="Delete User"
                              className="bg-red-600"
                            >
                              <IconButton
                                variant="text"
                                onClick={() => {
                                  handleConfirmationOpen();
                                  setDeleteId(studentId);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="View Charts">
                              <IconButton
                                variant="text"
                                onClick={() => {
                                  navigate(`${_id}`);
                                }}
                              >
                                <PresentationChartLineIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              )}
            </table>
            {loading && <Spinner className="mx-auto mt-10 mb-5" />}
            {!loading && students.length === 0 && (
              <Typography
                color="blue-gray"
                className="font-normal text-center text-3xl mt-6"
              >
                No Students were found..
              </Typography>
            )}
          </CardBody>
          <CardFooter className="flex items-center justify-between p-4 bg-blue-gray-50">
            <Typography variant="small" color="black" className="font-normal">
              Page {students.length === 0 ? "0" : studentFilter.page} of{" "}
              {totalPages}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                color="black"
                onClick={() => {
                  const { page } = studentFilter;
                  if (page === 1) {
                    setStudentFilter({ ...studentFilter, page: totalPages });
                  } else {
                    setStudentFilter({ ...studentFilter, page: page - 1 });
                  }
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="sm"
                color="black"
                onClick={() => {
                  const { page } = studentFilter;
                  if (page === totalPages) {
                    setStudentFilter({ ...studentFilter, page: 1 });
                  } else {
                    setStudentFilter({ ...studentFilter, page: page + 1 });
                  }
                }}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
      {/* DIALOGS */}
      {editableStudent && (
        <div className="aria-hidden">
          <EditDialog
            open={open}
            setOpen={setOpen}
            handleOpen={handleOpen}
            editableStudent={editableStudent}
            setChangesFlag={setChangesFlag}
            changesFlag={changesFlag}
          />
        </div>
      )}
      <AddDialog
        open={addOpen}
        handleOpen={handleAddOpen}
        students={students}
        changesFlag={changesFlag}
        setChangesFlag={setChangesFlag}
      />
      <Dialog
        open={confirmationOpen}
        handler={handleConfirmationOpen}
        size="sm"
      >
        <DialogHeader>Delete confirmation</DialogHeader>
        <DialogBody>Are you sure you want to delete this student?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleConfirmationOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={async () => {
              handleConfirmationOpen();
              await deleteStudent(deleteId);
              setDeleteFlag(!deleteFlag);
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
