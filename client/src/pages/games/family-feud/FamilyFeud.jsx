import { useEffect } from "react";
import App from "./App";
import FamProvider from "./famContext";

const FamilyFeud = () => {
  useEffect(() => {
    console.log("name");
  });

  return (
    <FamProvider>
      <App />
    </FamProvider>
  );
};
export default FamilyFeud;
