import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState("");
  // For confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };
  // For confetti end
  const [studentFilter, setStudentFilter] = useState({
    section: "1",
    batch: "2024-2025",
    search: "",
    page: 1,
    sort: "lastName",
    quarter: "quarter-1",
    limit: "9",
  });
  const [dashboardFilter, setDashboardFilter] = useState({
    batch: "",
    quarter: "",
    section: "",
  });
  const navigate = useNavigate();
  // QR
  const [toggleScanner, setToggleScanner] = useState(false);
  const handleToggleScanner = () => {
    setToggleScanner(!toggleScanner);
  };

  //   AUTH AXIOS
  const register = async (form) => {
    const response = await toast.promise(axios.post("/auth/register", form), {
      pending: "Registering",
      success: {
        render({ data }) {
          return `${data.data.message}`;
        },
        // other options
        icon: "🟢",
      },
      error: {
        render({ data }) {
          return `${data.response.data.message}`;
        },
        icon: "🟢",
      },
    });
  };

  const login = async (form) => {
    try {
      const response = await toast.promise(
        axios.post("/auth/login", form, {}),
        {
          pending: "Logging in",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const forgotPassword = async (form) => {
    const response = await toast.promise(
      axios.post("/auth/forgot-password", form),
      {
        pending: "Sending reset link to your email",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      }
    );
  };

  const resetPassword = async (token, form) => {
    try {
      const response = await toast.promise(
        axios.post(`/auth/reset-password/${token}`, form),
        {
          pending: "Sending reset link to your email",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const getTeacher = async () => {
    try {
      const response = await axios.get(
        "/auth/profile?select=firstName,lastName,email,profilePic,profilePicURL,-_id"
      );
      return response.data.teacher;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeacher = async (form) => {
    try {
      const response = await toast.promise(
        axios.patch("/auth/update-teacher", form),
        {
          pending: "Updating Profile",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data.message);
      setTeacher(response.data.teacher);
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = async (form) => {
    try {
      const response = await toast.promise(
        axios.post("/auth/change-password", form),
        {
          pending: "changing password",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // AUTH AXIOS END

  // STUDENT AXIOS
  const getAllStudents = async ({
    section = "",
    batch = "",
    quarter = "",
    search = "",
    page = "1",
    sort,
    limit = "",
  } = {}) => {
    const response = await axios.get(
      `/students/?section=${section}&batch=${batch}&quarter=${quarter}&search=${search}&page=${page}&sort=${sort}&limit=${limit}`
    );
    console.log(response.data);
    return response.data;
  };

  const addStudent = async (form) => {
    try {
      const response = await toast.promise(axios.post("/students", form), {
        pending: "Adding student",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      return response.data.student;
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getOneStudent = async (_id) => {
    const response = await axios.get(`/students/${_id}`);
    console.log(response.data);
    return response.data;
  };

  const updateStudent = async (studentId, form) => {
    try {
      const response = await toast.promise(
        axios.patch(`/students/${studentId}`, form),
        {
          pending: "Updating student",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const response = await toast.promise(
        axios.delete(`/students/${studentId}`),
        {
          pending: "Deleting student",
          success: {
            render({ data }) {
              return `${data.data.message}`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const validateQr = async (studentId) => {
    try {
      console.log("studentiddddddd>>>", studentId, typeof studentId);
      const response = await toast.promise(
        axios.post(`/students/validate-qr`, { studentId: studentId }),
        {
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
            icon: "🟢",
          },
        }
      );
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  // STUDENT AXIOS END

  // ACTIVITY AXIOS
  const getActivity = async (id) => {
    const response = await axios.get(`/activities/${id}`);
    console.log(response.data.activity);
    return response.data.activity;
  };

  const updateActivity = async (id, form) => {
    // Create a reference to the toast
    const toastId = toast.loading("Uploading file...");

    try {
      const response = await axios.patch(`/activities/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          // Calculate the percentage of upload progress
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          // Update the toast with progress information
          toast.update(toastId, {
            render: `Uploading file... ${percentCompleted}%`,
            type: "info",
            autoClose: false,
          });
        },
      });

      // Update the toast on success
      toast.update(toastId, {
        render: `${response.data.message}`,
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });

      console.log(response.data.message);
      return response.data.activity;
    } catch (error) {
      // Update the toast on error
      toast.update(toastId, {
        render: `Error: ${error.response?.data?.message || "Upload failed"}`,
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });

      console.log(error);
    }
  };

  const addActivity = async (form) => {
    try {
      const response = await toast.promise(axios.post(`/activities/`, form), {
        pending: "adding activity",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const response = await toast.promise(axios.delete(`/activities/${id}`), {
        pending: "Deleting activity",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // ACTIVITY AXIOS END

  // WEEK AXIOS
  const addWeek = async (form) => {
    try {
      const response = await toast.promise(axios.post(`/weeks/`, form), {
        pending: "adding week",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const editWeek = async (id, form) => {
    try {
      const response = await toast.promise(axios.patch(`/weeks/${id}`, form), {
        pending: "editing week",
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // WEEK AXIOS END

  // HISTORY AXIOS
  const addHistory = async (form) => {
    try {
      const response = await toast.promise(axios.post(`/histories`, form), {
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHistory = async (id) => {
    try {
      const response = await toast.promise(axios.delete(`/histories/${id}`), {
        success: {
          render({ data }) {
            return `${data.data.message}`;
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return `${data.response.data.message}`;
          },
          icon: "🟢",
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // HISTORY AXIOS END

  // INDIVIDUAL CHARTS
  const getIndividualCharts = async (
    id,
    chartType,
    quarter = "",
    type = "",
    dateFilter = ""
  ) => {
    const response = await axios.get(
      `/histories/charts/${id}?chartType=${chartType}&quarter=${quarter}&type=${type}&dateFilter=${dateFilter}`
    );
    return response.data.histories;
  };
  // INDIVIDUAL CHARTS END

  // DASHBOARD CHARTS
  const getDashboardCharts = async (
    chartType,
    batch = "",
    section = "",
    quarter = ""
  ) => {
    const response = await axios.get(
      `/histories/charts/?chartType=${chartType}&batch=${batch}&section=${section}&quarter=${quarter}`
    );
    return response.data.charts;
  };
  // DASHBOARD CHARTS END

  return (
    <GlobalContext.Provider
      value={{
        students,
        setStudents,
        studentFilter,
        setStudentFilter,
        dashboardFilter,
        setDashboardFilter,
        teacher,
        setTeacher,
        register,
        login,
        forgotPassword,
        resetPassword,
        getTeacher,
        updateTeacher,
        changePassword,
        getAllStudents,
        addStudent,
        getOneStudent,
        updateStudent,
        deleteStudent,
        toggleScanner,
        setToggleScanner,
        handleToggleScanner,
        getActivity,
        updateActivity,
        addActivity,
        addWeek,
        editWeek,
        addHistory,
        deleteActivity,
        deleteHistory,
        validateQr,
        getIndividualCharts,
        getDashboardCharts,
        showConfetti,
        setShowConfetti,
        handleConfettiComplete,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default GlobalProvider;
