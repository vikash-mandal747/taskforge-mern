import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages (dummy for now)
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Protected */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* User Protected */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
