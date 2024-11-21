import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";

export function AccountComponent() {
  const { getTeacher, updateTeacher } = useGlobalContext();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: null,
    profilePicURL: "",
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      const { profilePicURL, firstName, lastName, email, profilePic } = values;

      const formData = new FormData();
      formData.append("profilePic", profilePic);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);

      await updateTeacher(formData);
      setIsEditClicked(false);
      navigate("/account");
    },
  });

  useEffect(() => {
    (async () => {
      const teacher = await getTeacher();
      console.log("teacher", teacher);
      setInitialValues(teacher);
    })();
  }, []);

  if (isEditClicked) {
    return (
      <Card className="h-full w-full py-4 border-[#697565] border-4 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="">
            <Typography variant="h5" color="blue-gray" className="text-center">
              My Account
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="profile pic"
                className="size-40 object-cover border-[#697565] border-4 rounded-full "
              />
            ) : (
              <img
                src={values.profilePicURL}
                alt="default profile"
                className="size-40 object-cover border-[#697565] border-4 rounded-full"
              />
            )}
          </div>
          <div className=" mb-4 flex items-center justify-center mt-4 mx-auto w-fit">
            <Input
              label="Profile picture"
              id="file_input"
              type="file"
              onChange={(e) => {
                setFieldValue("profilePic", e.target.files[0]);
                try {
                  const fileURL = URL.createObjectURL(e.target.files[0]);
                  setPreview(fileURL);
                } catch (error) {
                  setPreview("");
                }
              }}
            />
          </div>
          <div className="w-full flex gap-4 ">
            <Input
              label="First Name"
              size="lg"
              name="firstName"
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <Input
              label="Last Name"
              size="lg"
              name="lastName"
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
          <div className="w-full mt-4">
            <Input
              label="Email Address"
              size="lg"
              name="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
        </CardBody>
        <div className="flex items-center justify-center gap-2 ml-4">
          <Button color="blue" onClick={handleSubmit}>
            save
          </Button>
          <Button
            color="red"
            onClick={() => {
              setIsEditClicked(false);
              resetForm();
              setPreview("");
            }}>
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full py-4 border-[#697565] border-4 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="">
          <Typography variant="h5" color="blue-gray" className="text-center">
            My Account
          </Typography>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mb-12 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="profile pic"
              className="size-40 object-cover border-[#697565] border-4 rounded-full "
            />
          ) : (
            <img
              src={values.profilePicURL}
              alt="profile pic"
              className="size-40 object-cover border-[#697565] border-4 rounded-full "
            />
          )}
        </div>
        <div className="w-full flex gap-4">
          <Input
            label="First Name"
            size="lg"
            floated="true"
            name="firstName"
            value={values.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
            className="pointer-events-none "
          />
          <Input
            label="Last Name"
            size="lg"
            name="lastName"
            value={values.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
            className="pointer-events-none "
          />
        </div>
        <div className="w-full mt-4">
          <Input
            label="Email Address"
            size="lg"
            name="email"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
            className="pointer-events-none "
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            className="w-24 mt-4"
            onClick={() => {
              setIsEditClicked(true);
            }}>
            Edit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
