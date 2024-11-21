import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  Outlet,
  useAsyncError,
} from "react-router-dom";
import { SidebarComponent } from "../components/SidebarComponent";
import { useGlobalContext } from "../context/context";

const Home = () => {
  const { teacher, setTeacher } = useGlobalContext();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const response = await axios.get("/auth/logout");
      navigate("/login");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getProfile = async () => {
      const response = await axios.get("/auth/profile");
      console.log(response.data.teacher.firstName);
      setTeacher(response.data.teacher);
    };
    getProfile();
  }, []);

  if (!teacher) return <></>;
  return (
    <main>
      <div className="h-screen grid place-items-center">
        <div className="fixed top-0 left-0 z-50 no-print">
          <SidebarComponent handleLogout={handleLogout} teacher={teacher} />
        </div>

        <Outlet />
      </div>
    </main>
  );
};

export default Home;
