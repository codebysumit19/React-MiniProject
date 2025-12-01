import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import EventForm from "./pages/EventForm";
import EventData from "./pages/EventData";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeData from "./pages/EmployeeData";
import DepartmentForm from "./pages/DepartmentForm";
import DepartmentData from "./pages/DepartmentData";
import ProjectForm from "./pages/ProjectForm";
import ProjectData from "./pages/ProjectData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventform" element={<EventForm />} />
        <Route path="/eventdata" element={<EventData />} />
        <Route path="/employeeform" element={<EmployeeForm />} />
        <Route path="/employeedata" element={<EmployeeData />} />
        <Route path="/departmentform" element={<DepartmentForm />} />
        <Route path="/departmentdata" element={<DepartmentData />} />
        <Route path="/projectform" element={<ProjectForm />} />
        <Route path="/projectdata" element={<ProjectData />} />
      </Routes>
    </Router>
  );
}
export default App;
