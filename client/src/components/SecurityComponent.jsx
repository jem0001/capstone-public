import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { changePasswordSchema } from "../utils/schemas";

export function SecurityComponent() {
  const { getTeacher, changePassword } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [open, setOpen] = useState(null);
  const handleOpen = (value) => setOpen(open === value ? null : value);
  const [email, setEmail] = useState("");

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      validationSchema: changePasswordSchema,
      onSubmit: (values, actions) => {
        changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
      },
    });

  useEffect(() => {
    (async () => {
      const teacher = await getTeacher();
      setEmail(teacher.email);
    })();
  }, []);

  return (
    <Card className="h-full w-full border-[#697565] border-4 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
      <CardHeader floated={false} shadow={false} className="rounded-none pt-5">
        <div className="">
          <div>
            <Typography variant="h5" color="blue-gray" className="text-center">
              Security and Password
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className=" px-0">
        <div className=" justify-between border-t border-blue-gray-50 p-8 rounded-xl bg-gray-50 w-[90%] mx-auto">
          <Input
            color="black"
            label="email"
            className="pointer-events-none text-black"
            value={email}
            readOnly
          />

          <div className="mt-4"></div>
          <Accordion
            open={open === 1}
            className="mb-2 rounded-lg border border-blue-gray-100">
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="text-gray-900 text-center flex items-center justify-center hover:bg-[#3C3D37] hover:text-white">
              Change password
            </AccordionHeader>
            <AccordionBody className="px-4">
              <div className="relative flex w-full mt-4 text-white">
                <Input
                  label="old password"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={values.oldPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div
                  onClick={() => {
                    setShowOldPassword(!showOldPassword);
                  }}>
                  {showOldPassword ? (
                    <EyeIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  ) : (
                    <EyeSlashIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  )}
                </div>
              </div>
              {errors.oldPassword && touched.oldPassword && (
                <p className="text-red-500 text-xs ml-2">
                  {errors.oldPassword}
                </p>
              )}

              <div className="relative flex w-full mt-4">
                <Input
                  name="newPassword"
                  label="new password"
                  size="lg"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}>
                  {showPassword ? (
                    <EyeIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  ) : (
                    <EyeSlashIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  )}
                </div>
              </div>

              {errors.newPassword && touched.newPassword && (
                <p className="text-red-500 text-xs ml-2">
                  {errors.newPassword}
                </p>
              )}

              <div className="relative flex w-full mt-4">
                <Input
                  name="confirmPassword"
                  label="confirm password"
                  size="lg"
                  type={showPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}>
                  {showPassword ? (
                    <EyeIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  ) : (
                    <EyeSlashIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                  )}
                </div>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs ml-2">
                  {errors.confirmPassword}
                </p>
              )}
            </AccordionBody>
          </Accordion>
        </div>
      </CardBody>
      {open && (
        <Button
          onClick={handleSubmit}
          className="bg-[#3C3D37] mx-16 mb-4 mt-[-3rem]">
          save
        </Button>
      )}
    </Card>
  );
}
