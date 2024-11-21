import { AccountComponent } from "../components/AccountComponent";

const Account = () => {
  return (
    // bg can be added below
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className="h-full container mx-auto grid place-items-center content-center px-80 py-16 ">
        <AccountComponent />
      </div>
    </div>
  );
};
export default Account;
