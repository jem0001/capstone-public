import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useGlobalContext } from "../context/context";
import { ForgotPasswordSchema, RegisterSchema } from "../utils/schemas";

import logo from "../assets/logo.png";

const ForgotComponent = () => {
  const { forgotPassword } = useGlobalContext();
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, actions) => {
      console.log("submitting emal");
      await forgotPassword(values);
      setSubmitting(false);
    },
  });

  return (
    <div className="flex">
      <div className="w-96 bg-[#1E201E] z-10 flex items-center justify-center">
        <img src={logo} alt="logo" className="rounded-full h-72" />
      </div>
      <Card className="w-96 rounded-none">
        <CardBody className="flex flex-col gap-4">
          <div>
            <h1 className="text-[#1E201E] text-center font-extrabold text-[2rem] tracking-widest py-6 mt-8">
              FORGOT PASSWORD
            </h1>
          </div>
          <div className="relative flex w-full max-w-[24rem]">
            <Input
              name="email"
              type="email"
              label="Email Address"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="pr-20"
              containerProps={{
                className: "min-w-0",
              }}
            />
            {isSubmitting ? (
              <Button
                size="sm"
                color={values.email ? "gray" : "blue-gray"}
                disabled
                className="!absolute right-1 top-1 rounded"
                onClick={handleSubmit}
              >
                Send
              </Button>
            ) : (
              <Button
                size="sm"
                color={values.email ? "gray" : "blue-gray"}
                disabled={!values.email}
                className="!absolute right-1 top-1 rounded"
                onClick={handleSubmit}
              >
                Send
              </Button>
            )}
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs -mt-2   ml-2">{errors.email}</p>
          )}
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="mt-6 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              href="/login"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Log in
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotComponent;
