import "./App.css";
import Landing from "./pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Main />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
