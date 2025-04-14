import "./App.css";
import Landing from "./pages/Landing";
import { Route, Routes, useLocation } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import About from "./pages/About";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Main />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
