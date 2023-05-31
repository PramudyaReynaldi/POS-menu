import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import POSPage from "./pages/POSPage";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<POSPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
