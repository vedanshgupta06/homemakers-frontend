import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

/* USER */
import UserDashboard from "./pages/user/UserDashboard";
import ProvidersList from "./pages/user/admin/providers/ProvidersList";
import ProviderDetails from "./pages/user/admin/providers/ProviderDetails";
import MyBookings from "./pages/user/MyBookings";
import AttendanceApproval from "./pages/user/AttendanceApproval";
import SelectServices from "./pages/user/SelectServices";
import Requirements from "./pages/user/Requirements";
import SelectDateTime from "./pages/user/SelectDateTime";
import BookingPreview from "./pages/user/BookingPreview";
import AvailableSlots from "./pages/user/AvailableSlots";
import PaymentRequired from "./pages/user/PaymentRequired";
import Register from "./auth/Register";
import WalletRecharge from "./pages/user/WalletRecharge";
import PaymentHistory from "./pages/user/PaymentHistory";
/* PROVIDER */
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderPricing from "./pages/provider/ProviderPricing";
import ProviderEarnings from "./pages/provider/ProviderEarnings";
import ProviderPayouts from "./pages/provider/ProviderPayouts";
import ProviderDeductions from "./pages/provider/ProviderDeductions";
import ProviderAttendance from "./pages/provider/ProviderAttendance";
import ProviderPhotoUpload from "./pages/provider/ProviderPhotoUpload";
import ProviderDocuments from "./pages/provider/ProviderDocuments";
import ProviderAccountProfile from "./pages/provider/ProviderAccountProfile";

/* ADMIN */
import AdminLayout from "./pages/user/admin/layout/AdminLayout";
import AdminDashboard from "./pages/user/admin/dashboard/AdminDashboard";
import ProvidersListAdmin from "./pages/user/admin/providers/ProvidersList";
import ProviderDetailsAdmin from "./pages/user/admin/providers/ProviderDetails";
import AdminBookings from "./pages/user/admin/bookings/AdminBookings";
import AdminPayoutHistory from "./pages/user/admin/payouts/AdminPayoutHistory";
import AdminPayoutRequests from "./pages/user/admin/payouts/AdminPayoutRequests";
import AdminReports from "./pages/user/admin/reports/AdminReports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* REDIRECT AFTER LOGIN */}
        <Route
          path="/redirect"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
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
        {/* <Route
          path="/user/attendance"
          element={
            <ProtectedRoute role="USER">
              <AttendanceApproval />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER ATTENDANCE CONFIRMATION */}
        <Route
          path="/user/attendance"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <AttendanceApproval />
            </ProtectedRoute>
          }
        />
        <Route path="/user/services" element={<SelectServices />} />
        <Route path="/user/slots" element={<AvailableSlots />} />
        <Route
          path="/user/payments"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <PaymentRequired />
            </ProtectedRoute>
          }
        />
        <Route path="/user/requirements" element={<Requirements />} />
        <Route path="/user/date" element={<SelectDateTime />} />
        <Route path="/user/preview" element={<BookingPreview />} />
        <Route path="/user/wallet" element={<WalletRecharge />} />
        <Route path="/user/payments/history" element={<PaymentHistory />} />

        
        {/* ================= PROVIDER ================= */}
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

        {/* PROVIDER ATTENDANCE */}
        <Route path="/provider/photo" element={<ProviderPhotoUpload />} />
        <Route path="/provider/documents" element={<ProviderDocuments />} />
        <Route
          path="/provider/attendance"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderAttendance />
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

       <Route path="/provider/setup-profile" element={<ProviderProfile />} />
       <Route path="/provider/profile" element={<ProviderAccountProfile />} />

        <Route
          path="/provider/pricing"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <ProviderPricing />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="/admin/payouts/requests" element={<AdminPayoutRequests />} />
          <Route path="/admin/payouts/history" element={<AdminPayoutHistory />} />
          <Route path="providers" element={<ProvidersListAdmin />} />
          <Route path="providers/:providerId" element={<ProviderDetailsAdmin />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;