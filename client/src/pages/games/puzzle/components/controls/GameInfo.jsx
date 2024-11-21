/**
 * Renders an individual game information, with an Icon, a Label and a Value
 * @param {?JSX.Element} icon icon to render
 * @param {string} label information label
 * @param {string|number|JSX.Element} children information content (value)
 * @returns {JSX.Element}
 * @constructor
 */
const GameInfo = ({ icon = null, label = "", children }) => {
  return (
    <div
      className="flex flex-row md:flex-col justify-center items-center gap-2 text-red-500
                bg-[white] border-[#af1d20] border-4 py-1 py-4 px-2 rounded-xl flex-1 md:flex-none shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]
">
      <div className="text-xl md:text-5xl font-bold">{icon}</div>
      <div className="flex flex-row items-center gap-2 justify-center text-sm md:text-md">
        <span className="font-bold">{!!label && label + ": "}</span>
        <div className="font-bold">{children}</div>
      </div>
    </div>
  );
};

export default GameInfo;
