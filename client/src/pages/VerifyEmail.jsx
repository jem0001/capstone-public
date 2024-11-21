import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const effectRan = useRef(false);

  const verify = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/auth/verify-email/${token}`);
      setVerified(true);
      setMessage(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      setVerified(false);
      setMessage(error.response.data.message);
      console.log("error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!effectRan.current) verify();
    return () => {
      effectRan.current = true;
    };
  }, []);

  if (loading) {
    return (
      <div className=" h-screen grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-500  bg-cover">
        <div className="text-center flex gap-8 flex-col">
          <p className="uppercase font-bold text-white text-8xl">{message}</p>
          <Link
            className="px-4 py-8 bg-transparent text-3xl text-white border-white border-8 tracking-widest mt-4 hover:bg-white hover:text-green-500 rounded-lg"
            to={"/login"}>
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white h-screen w-full grid place-items-center bg-red-500">
      <p className="uppercase font-bold text-white text-7xl">{message}</p>
    </div>
  );
};
export default VerifyEmail;
