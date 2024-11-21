/**
 * Render a rounded button with light blue/indigo background
 * @param {string|JSX.Element} children - the content to render inside the button
 * @param {object} rest - other attributes to pass on to the <button /> component (mostly the onClick attribute)
 * @returns {JSX.Element}
 * @constructor
 */
const ControlButton = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className="w-full px-4  md:p-2 rounded-xl bg-white py-2 border-[#af1d20] border-2 text-sm md:text-md relative hover:-top-1 transition-all duration-300 hover:shadow-md hover:shadow-white-300 text-red-900 font-bold mt-2">
      {children}
    </button>
  );
};

export default ControlButton;
