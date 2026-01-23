import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import EventForm from "./pages/events/EventForm";
import EventData from "./pages/events/EventData";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeData from "./pages/employees/EmployeeData";
import DepartmentForm from "./pages/departments/DepartmentForm";
import DepartmentData from "./pages/departments/DepartmentData";
import ProjectForm from "./pages/projects/ProjectForm";
import ProjectData from "./pages/projects/ProjectData";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/eventform" 
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/eventdata" 
          element={
            <ProtectedRoute>
              <EventData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employeeform" 
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employeedata" 
          element={
            <ProtectedRoute>
              <EmployeeData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/departmentform" 
          element={
            <ProtectedRoute>
              <DepartmentForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/departmentdata" 
          element={
            <ProtectedRoute>
              <DepartmentData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projectform" 
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projectdata" 
          element={
            <ProtectedRoute>
              <ProjectData />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
