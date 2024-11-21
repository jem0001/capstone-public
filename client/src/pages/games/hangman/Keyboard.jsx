const KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export function Keyboard({
  activeLetters,
  addGuessedLetter,
  inactiveLetters,
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-2  w-[80%] mx-auto">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            onClick={() => addGuessedLetter(key)}
            className={`  w-full bg-transparent bg-brown-900 text-white rounded-lg aspect-square text-3xl uppercase font-bold cursor-pointer select-none 
                        ${isActive ? "bg-yellow-600 text-white" : ""}
                        ${isInactive ? "opacity-30" : ""}
                        hover:bg-yellow-400`}
            disabled={isInactive || isActive || disabled}
            key={key}>
            {key}
          </button>
        );
      })}
    </div>
  );
}
