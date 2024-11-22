import React, { useState } from "react";
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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/context";
import { LoginSchema } from "../utils/schemas";

import logo from "../assets/logo.png";

const LoginComponent = () => {
  const { login } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: (values, actions) => {
        login(values);
      },
    });

  return (
    <div className="flex">
      <div className="w-96  rounded-none bg-[#1E201E] z-10 flex items-center justify-center">
        <img src={logo} alt="logo" className="rounded-full h-72" />
      </div>
      <Card className="w-96 rounded-none">
        <CardBody>
          <div>
            <h1 className="text-[#1E201E] text-center font-extrabold text-[2rem] tracking-widest py-4 mt-8">
              LOGIN
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="email"
              label="Email"
              size="lg"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs -mt-2 ml-2">{errors.email}</p>
            )}
            <div className="relative flex w-full">
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
              <p className="text-red-500 text-xs -mt-2 ml-2">
                {errors.password}
              </p>
            )}
            <div className="-ml-2.5">
              <Typography
                as="a"
                href="/forgotPassword"
                variant="small"
                color="blue-gray"
                className="ml-2"
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth type="submit" className="bg-[#1E201E] mt-2">
              Log in
            </Button>
          </form>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="flex justify-center">
            Don&apos;t have an account?
            <Typography
              as="a"
              href="/signup"
              variant="small"
              className="ml-1 font-bold text-[#1E201E] mb-12"
            >
              Sign up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginComponent;
