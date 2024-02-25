import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className={`header fixed w-screen px-10 sm:px-24 transparent ${visible ? "top-0 ease-in" : "-top-20 ease-out"} transition-all duration-[400ms]`}>
      <div className="flex flex-row justify-between items-center w-full h-full">
        <div className="flex flex-row justify-between items-center">
          <Link className="mr-4 hover:cursor-pointer" to="/">
            <p className="text-xl secondary-text font-bold font-['Lora']">Anki Lingo</p>
          </Link>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link
            className="mr-1 sm:mr-6 hover:cursor-pointer w-16 flex flex-row justify-center items-center"
            to="/main"
          >
            <div className="text-lg secondary-text hover:font-bold transition-all duration-500">
              Home
            </div>
          </Link>
          <Link
            className="ml-1 sm:ml-6 hover:cursor-pointer w-16 flex flex-row justify-center items-center"
            to="/about"
          >
            <div className="text-lg secondary-text hover:font-bold transition-all duration-500">
              About
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
