import usersManual from "../assets/users-manual.pdf";

const Help = () => {
  return (
    <>
      <div
        className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50
"
      >
        <div className="w-full h-full ">
          <embed
            src={usersManual}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </>
  );
};
export default Help;
