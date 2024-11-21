import { useGlobalContext } from "../context/context";

const PrintQrComponent = () => {
  const { students, setStudents } = useGlobalContext();
  return (
    <div
      id="print-qr"
      className="bg-blue grid grid-cols-3 place-items-center gap-x-4 gap-y-8 text-center w-full mx-auto p-4 "
    >
      {students.map(({ _id, qrURL, fullName }) => {
        return (
          <div key={_id} className=" border-[4px] ">
            <img src={qrURL} alt="" className="" />
            <p className="capitalize text font text-sm">{fullName}</p>
          </div>
        );
      })}
    </div>
  );
};
export default PrintQrComponent;
