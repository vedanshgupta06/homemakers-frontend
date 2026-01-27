import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

// USER
import UserDashboard from "./pages/user/UserDashboard";
import ProvidersList from "./pages/user/ProvidersList";
import ProviderDetails from "./pages/user/ProviderDetails";
import MyBookings from "./pages/user/MyBookings";

// PROVIDER
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderPricing from "./pages/provider/ProviderPricing";
import ProviderEarnings from "./pages/provider/ProviderEarnings";
import ProviderPayouts from "./pages/provider/ProviderPayouts";
import ProviderDeductions from "./pages/provider/ProviderDeductions";

// ADMIN
import AdminPayouts from "./pages/user/admin/AdminPayouts";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* AFTER LOGIN */}
        <Route
          path="/redirect"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/providers"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <ProvidersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/providers/:providerId"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <ProviderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/bookings"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/earnings"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderEarnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/payouts"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderPayouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/deductions"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderDeductions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/availability"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/pricing"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderPricing />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
      
        <Route
          path="/admin/payouts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPayouts />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
