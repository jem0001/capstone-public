import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { resetPasswordSchema } from "../utils/schemas";
import { useFormik } from "formik";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/context";

const ResetComponent = () => {
  const { resetPassword } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema: resetPasswordSchema,
      onSubmit: (values, actions) => {
        resetPassword(token, values);
      },
    });

  return (
    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Reset Password
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
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
          <p className="text-red-500 text-xs -mt-2   ml-2">{errors.password}</p>
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
        <Button variant="gradient" fullWidth onClick={handleSubmit}>
          Log in
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResetComponent;
