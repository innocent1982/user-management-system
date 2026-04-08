import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignInPage from "./features/auth/pages/signin";
import SignUpPage from "./features/auth/pages/signup";
import "./index.css";
import EmailSentPage from "./features/auth/pages/emailSentPage";
import Dashboard from "./features/user/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
