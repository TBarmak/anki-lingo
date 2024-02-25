import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      let moving = window.scrollY;
      setVisible(position > moving || moving <= 20);
      setPosition(moving);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div
      className={`header fixed w-screen px-10 sm:px-24 transparent ${
        visible ? "top-0 ease-in" : "-top-20 ease-out"
      } transition-all duration-[400ms]`}
    >
      <div className="flex flex-row justify-between items-center w-full h-full">
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 2 }}
          className="flex flex-row justify-between items-center"
        >
          <Link className="mr-4 hover:cursor-pointer" to="/">
            <p className="text-xl secondary-text font-bold font-['Lora']">
              Anki Lingo
            </p>
          </Link>
        </motion.div>
        <div className="flex flex-row justify-between items-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 2 }}
          >
            <Link
              className="mr-1 sm:mr-6 hover:cursor-pointer w-16 flex flex-row justify-center items-center"
              to="/main"
            >
              <div className="text-lg secondary-text">Home</div>
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 2 }}
          >
            <Link
              className="ml-1 sm:ml-6 hover:cursor-pointer w-16 flex flex-row justify-center items-center"
              to="/about"
            >
              <div className="text-lg secondary-text">About</div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
