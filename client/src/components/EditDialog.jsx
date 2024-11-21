import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Select,
  Option,
  ThemeProvider,
  Tooltip,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { addStudentSchema, editStudentSchema } from "../utils/schemas";
import { QRCodeCanvas } from "qrcode.react";
import { useGlobalContext } from "../context/context";

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
const SECTIONS = [
  {
    label: "Section1",
    value: "1",
  },
  {
    label: "Section2",
    value: "2",
  },
  {
    label: "Section3",
    value: "3",
  },
];

const theme = {
  select: { styles: { base: { menu: { maxHeight: "max-h-[300px]" } } } },
};
export function EditDialog({
  open,
  setOpen,
  handleOpen,
  editableStudent,
  changesFlag,
  setChangesFlag,
}) {
  const { updateStudent, getAllStudents } = useGlobalContext();
  const [showQr, setShowQr] = useState(true);
  const qrRef = useRef();

  const handleGenerateQr = (e) => {
    if (values.studentId) {
      setShowQr(true);
      setFieldValue("qrImage", values.studentId);
      return;
    }
    setErrors({
      ...errors,
      qrImage: "Student Id must be filled up before you can generate qr",
    });
  };

  const { firstName, lastName, qrURL, batch, section, studentId, _id } =
    editableStudent;

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues: {
      firstName,
      lastName,
      studentId,
      section,
      batch,
      qrURL,
      qrImage: "",
    },
    enableReinitialize: true,
    validationSchema: editStudentSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
      const canvas = qrRef.current.querySelector("canvas");

      // Convert Canvas to Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          1
        );
      });

      // Convert blob to file
      const imageFile = new File([blob], "qr.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("studentId", values.studentId);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("batch", values.batch);
      formData.append("section", values.section);
      formData.append("qrImage", imageFile);

      await updateStudent(studentId, formData);
      setChangesFlag(!changesFlag);
    },
  });

  return (
    <Dialog size="md" open={open} handler={handleOpen} className="shadow-none">
      <Card className="mx-auto w-full max-w-[96rem] ">
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4 overflow-visible">
            <Typography variant="h4" color="blue-gray">
              Edit Student
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  size="lg"
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-2 ml-2">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Input
                  size="lg"
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-2 ml-2">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <Input
              size="lg"
              label="Student Id"
              name="studentId"
              value={values.studentId}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.studentId && touched.studentId && (
              <p className="text-red-500 text-xs -mt-2 ml-2">
                {errors.studentId}
              </p>
            )}
            <ThemeProvider value={theme}>
              <div className="w-full">
                <Select
                  size="lg"
                  label="Select Batch"
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      disabled: true,
                      className:
                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                    })
                  }
                  name="batch"
                  value={values.batch}
                  onBlur={handleBlur}
                  onChange={(val) => {
                    setFieldValue("batch", val);
                  }}>
                  {BATCH_ARRAY.map(({ name, flags }) => (
                    <Option
                      key={name}
                      value={name}
                      className="flex items-center gap-2">
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>
            </ThemeProvider>
            {errors.batch && touched.batch && (
              <p className="text-red-500 text-xs -mt-2 ml-2">{errors.batch}</p>
            )}

            <div className="w-full">
              <Input
                label="Section"
                name="section"
                value={values.section}
                onBlur={handleBlur}
                onChange={handleChange}></Input>
            </div>
            {errors.section && touched.section && (
              <p className="text-red-500 text-xs -mt-2 ml-2">
                {errors.section}
              </p>
            )}
            <div className="">
              {showQr && (
                <div>
                  <div>
                    <QRCodeCanvas
                      size={144} // Increased size for better quality -can also use state to dynamically adjust
                      value={values.studentId}
                      level={"H"} // High error correction level
                      includeMargin={true} // Include margin to improve readability
                    ></QRCodeCanvas>
                  </div>
                  <div ref={qrRef} className="hidden">
                    <QRCodeCanvas
                      size={256} // Increased size for better quality -can also use state to dynamically adjust
                      value={values.studentId}
                      level={"H"} // High error correction level
                      includeMargin={true} // Include margin to improve readability
                    ></QRCodeCanvas>
                  </div>
                </div>
              )}
              {values.studentId ? (
                <Button
                  variant="gradient"
                  className="w-fit"
                  onClick={handleGenerateQr}>
                  Generate Qr
                </Button>
              ) : (
                <Button variant="gradient" className="w-fit" disabled>
                  Generate Qr
                </Button>
              )}
              {/* {errors.qrImage && touched.qrImage && (
                <p className="text-red-500 text-xs mt-2 ml-2">
                  {errors.qrImage}
                </p>
              )} */}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="submit" variant="gradient" fullWidth>
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Dialog>
  );
}
