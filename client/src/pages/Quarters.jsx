import QuartersComponent from "../components/QuartersComponent";

const Quarters = () => {
  return (
    // bg can be added below
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className="h-full container mx-auto py-12 px-28 ">
        <h1 className="text-4xl font-bold text-center text-[black] tracking-widest uppercase"></h1>
        <QuartersComponent />
      </div>
    </div>
  );
};
export default Quarters;
