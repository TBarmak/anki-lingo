import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  return (
    <div className="w-screen h-screen bg-blue-800 flex flex-col justify-center items-center">
      <h1 className="text-white text-4xl">Anki Lang</h1>
      <p className="text-white my-2">The current time is {currentTime}</p>
    </div>
  );
}

export default App;
