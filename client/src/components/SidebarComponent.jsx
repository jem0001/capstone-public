import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
  Drawer,
  Card,
} from "@material-tailwind/react";
import { IoLogOutSharp } from "react-icons/io5";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UserGroupIcon,
  HomeIcon,
  PuzzlePieceIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  PresentationChartLineIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function SidebarComponent({ handleLogout, teacher }) {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);

  const navigate = useNavigate();
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <IconButton
        variant="text"
        size="lg"
        className="rounded-xl"
        onClick={openDrawer}
      >
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2 bg-white" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2 bg-white" />
        )}
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        className="border-gray-100 border-r-2 shadow"
      >
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="flex items-center gap-4 p-4">
            <img
              src={`${teacher.profilePicURL}?${Date.now()}`}
              alt="profile-pic"
              className="h-8 w-8 rounded-full"
            />
            <Typography variant="h5" className="capitalize">
              <span className="text-[#1E201E]">Teacher </span>
              {teacher.firstName}
            </Typography>
          </div>

          <List>
            <hr className="border-[#1E201E]" />
            <ListItem
              onClick={() => {
                navigate("/");
              }}
            >
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5 text-[#1E201E]" />
              </ListItemPrefix>
              Home
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/student");
              }}
            >
              <ListItemPrefix>
                <UserGroupIcon className="h-5 w-5 text-[#1E201E]" />
              </ListItemPrefix>
              Students
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/activities");
              }}
            >
              <ListItemPrefix>
                <PuzzlePieceIcon className="h-5 w-5 text-[#1E201E]" />
              </ListItemPrefix>
              Activities
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("dashboard");
              }}
            >
              <ListItemPrefix>
                <PresentationChartLineIcon className="h-5 w-5 text-[#1E201E]" />
              </ListItemPrefix>
              Dashboard
            </ListItem>

            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <Cog6ToothIcon className="size-6 text-[#1E201E]" />
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal">
                    Settings
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem
                    className="pl-8"
                    onClick={() => {
                      navigate("/account");
                    }}
                  >
                    <ListItemPrefix>
                      <UserIcon className="size-5 text-[#1E201E]" />
                    </ListItemPrefix>
                    Account
                  </ListItem>
                  <ListItem
                    className="pl-8"
                    onClick={() => {
                      navigate("/security");
                    }}
                  >
                    <ListItemPrefix>
                      <KeyIcon className="size-5 text-[#1E201E]" />
                    </ListItemPrefix>
                    Security
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>

            <ListItem onClick={handleLogout}>
              <ListItemPrefix>
                <IoLogOutSharp className="h-5 w-5 text-[#1E201E]" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
