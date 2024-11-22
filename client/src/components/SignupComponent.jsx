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
import { RegisterSchema } from "../utils/schemas";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/context";

import logo from "../assets/logo.png";

const SignupComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useGlobalContext();

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: RegisterSchema,
      onSubmit: (values, actions) => {
        const { confirmPassword, ...formWithoutCp } = values;
        register(formWithoutCp);
      },
    });

  return (
    <div className="">
      <div className="flex">
        <div className="w-96  rounded-none bg-[#1E201E] z-10 flex items-center justify-center">
          <img src={logo} alt="logo" className="rounded-full h-72" />
        </div>
        <Card className="w-96 rounded-none">
          <div>
            <h1 className="text-[#1E201E] text-center font-extrabold text-[2rem] tracking-widest mt-8 ">
              SIGN UP
            </h1>
          </div>
          <CardBody className="flex flex-col gap-4">
            <Input
              name="firstName"
              label="First Name"
              size="lg"
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
            />

            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-xs -mt-2   ml-2">
                {errors.firstName}
              </p>
            )}
            <Input
              name="lastName"
              label="Last Name"
              size="lg"
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.lastName && touched.lastName && (
              <p className="text-red-500 text-xs -mt-2   ml-2">
                {errors.lastName}
              </p>
            )}
            <Input
              name="email"
              label="Email"
              size="lg"
              value={values.email}
              type="email"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs -mt-2   ml-2">
                {errors.email}
              </p>
            )}

            <div className="relative flex w-full ]">
              <Input
                name="password"
                label="Password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <div
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <EyeIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                ) : (
                  <EyeSlashIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                )}
              </div>
            </div>

            {errors.password && touched.password && (
              <p className="text-red-500 text-xs -mt-2   ml-2">
                {errors.password}
              </p>
            )}

            <div className="relative flex w-full ]">
              <Input
                name="confirmPassword"
                label="Password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <div
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <EyeIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                ) : (
                  <EyeSlashIcon className="absolute right-1 top-[50%] translate-x-[-50%] translate-y-[-50%] rounded size-5" />
                )}
              </div>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs -mt-2   ml-2">
                {errors.confirmPassword}
              </p>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button className="bg-[#1E201E]" fullWidth onClick={handleSubmit}>
              Sign Up
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Typography
                as="a"
                href="/login"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold text-[#1E201E]"
              >
                Log in
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupComponent;
