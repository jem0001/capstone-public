/**
 * Button rendered on top of the board over a gradient background
 * @component
 * @param {string|JSX.Element} children - content of the button
 * @param {function} onClick - callback for button click
 * @returns {JSX.Element}
 * @constructor
 */
const BoardAction = ({ children, onClick }) => {
  return (
    <div className="z-20 absolute w-full h-full flex items-center justify-center">
      <div
        className="
                                w-full flex items-center justify-center py-16"
      >
        <button
          className=" bg-[#af1d20] rounded-full
                                     px-4 py-2 text-lg md:text-xl text-white border-2 border-white-
                                     hover:to-white-800 hover:from-fuchsia-700 hover:text-white
                                     relative hover:-top-1 transition-all duration-300
                                     hover:shadow-lg hover:shadow-white
                                     flex flex-row gap-2 items-center justify-center
                                     active:from-fuchsia-600 active:to-white"
          onClick={onClick}
        >
          {children}
        </button>
      </div>
    </div>
  );
};

export default BoardAction;
