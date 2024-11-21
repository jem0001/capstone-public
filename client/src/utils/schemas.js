import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("It must be a valid email")
    .required("Email is a required field"),
  password: Yup.string()
    .required("Password is a required field")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  // .min(8, "Password is too short - should be 8 characters minimum.")
});

export const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is a required field"),
  lastName: Yup.string().required("Last Name is a required field"),
  email: Yup.string()
    .email("It must be a valid email")
    .required("Email is a required field"),
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password is too short - should be 8 characters minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("It must be a valid email")
    .required("Email is a required field"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password is too short - should be 8 characters minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is a required field"),
  newPassword: Yup.string()
    .required("Password is a required field")
    .min(8, "Password is too short - should be 8 characters minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords must match"
  ),
});

export const addStudentSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is a required field"),
  lastName: Yup.string().required("Last Name is a required field"),
  studentId: Yup.string().required("Student Id is a required field"),
  section: Yup.string().required("Section is a required field"),
  batch: Yup.string().required("Batch is a required field"),
  qrImage: Yup.mixed().required("QR Code is required"),
});

export const editStudentSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is a required field"),
  lastName: Yup.string().required("Last Name is a required field"),
  studentId: Yup.string().required("Student Id is a required field"),
  section: Yup.string().required("Section is a required field"),
  batch: Yup.string().required("Batch is a required field"),
  qrImage: Yup.mixed(),
});

export const addWeekSchema = Yup.object().shape({
  week: Yup.string().required("Week is a required field"),
  lessonTitle: Yup.string().required("Lesson Title is a required field"),
});
