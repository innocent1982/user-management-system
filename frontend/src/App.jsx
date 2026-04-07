import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LoginPage} from "./features/auth/pages/login";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
