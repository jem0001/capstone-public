import { motion } from "framer-motion";
import img0 from "../../../assets/hangman-images/0.png";
import img1 from "../../../assets/hangman-images/1.png";
import img2 from "../../../assets/hangman-images/2.png";
import img3 from "../../../assets/hangman-images/3.png";
import img4 from "../../../assets/hangman-images/4.png";
import img5 from "../../../assets/hangman-images/5.png";
import img6 from "../../../assets/hangman-images/6.png";

const hangmanImages = [img0, img1, img2, img3, img4, img5, img6];

export function HangmanDrawing({ numberOfGuesses }) {
  return (
    <div style={{}}>
      <motion.img
        src={hangmanImages[numberOfGuesses]}
        alt=""
        style={{ width: 500 }}
        className="border-brown-900 border-8 rounded-2xl"
      />
    </div>
  );
}
