import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import GlobalProvider from "./context/context.jsx";
import { SoundProvider } from "./context/sound/SoundContext.jsx";

const theme = {
  dialog: {
    styles: {
      base: {
        backdrop: {
          height: "h-screen overflow-y-auto",
          // display: "grid",
          // placeItems: "place-items-center",
          // position: "fixed",
          // top: 0,
          // left: 0,
          // width: "w-screen",
          // backgroundColor: "bg-black",
          // backgroundOpacity: "bg-opacity-60",
          // backdropFilter: "backdrop-blur-sm",
        },
      },
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider value={theme}>
      <BrowserRouter>
        <GlobalProvider>
          <SoundProvider>
            <App />
          </SoundProvider>
        </GlobalProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
