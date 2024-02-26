import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Header() {
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const { pathname } = useLocation();

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
      className={`header fixed w-screen px-10 sm:px-24 transparent z-10 ${
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
          transition={{ duration: 0.75, delay: 1.25 }}
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
            transition={{ duration: 0.75, delay: 1.25 }}
          >
            <Link
              className="group mr-1 sm:mr-6 hover:cursor-pointer flex flex-col justify-center items-start"
              to="/home"
            >
              <div className="text-lg secondary-text">Home</div>
              <div
                className={`${
                  pathname != "/home" &&
                  "max-w-0 group-hover:max-w-full transition-all duration-300 rounded-full"
                } w-full h-0.5 bg-black`}
              />
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 1.25 }}
          >
            <Link
              className="group ml-1 sm:ml-6 hover:cursor-pointer justify-center items-start flex flex-col"
              to="/about"
            >
              <div className="text-lg secondary-text">About</div>
              <div
                className={`${
                  pathname != "/about" &&
                  "max-w-0 group-hover:max-w-full transition-all duration-300 rounded-full"
                } w-full h-0.5 bg-black`}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
