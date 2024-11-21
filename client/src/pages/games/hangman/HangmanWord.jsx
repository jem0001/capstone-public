export function HangmanWord({ guessedLetters, wordToGuess, reveal = false }) {
  return (
    <div className="flex gap-1 text-6xl font-bold uppercase font-mono select-none">
      {wordToGuess.split("").map((letter, index) => (
        <span
          key={index}
          className={`${
            letter === " " ? "border-none" : "border-b-8 m-4 border-white"
          } select-none`}>
          <span
            className={`${
              guessedLetters.includes(letter) || letter === " " || reveal
                ? "visible"
                : "invisible"
            } ${
              !guessedLetters.includes(letter) && reveal && letter !== " "
                ? "text-red-600"
                : "text-green-700"
            }`}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        </span>
      ))}
    </div>
  );
}
