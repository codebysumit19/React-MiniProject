import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
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

        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
