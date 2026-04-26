import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

/* LAYOUT */
import MainLayout from "./components/layout/MainLayout";

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
import WalletRecharge from "./pages/user/WalletRecharge";
import PaymentHistory from "./pages/user/PaymentHistory";
import BookingSuccess from "./pages/user/BookingSuccess";
import UserProfile from "./pages/user/UserProfile";
import BookingDetails from "./pages/user/BookingDetails";
import HelpSupport from "./pages/user/HelpSupport";
import AdminComplaints from "./pages/user/admin/complaints/AdminComplaints";
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

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
              <MainLayout />
            </ProtectedRoute>
          }
        >
         

            <Route
              path="/user/profile"
              element={
                <ProtectedRoute role="USER">
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          <Route index element={<UserDashboard />} />

          <Route path="providers" element={<ProvidersList />} />
          <Route path="providers/:providerId" element={<ProviderDetails />} />

          <Route path="bookings" element={<MyBookings />} />
          <Route path="attendance" element={<AttendanceApproval />} />
          <Route path="services" element={<SelectServices />} />
          <Route path="requirements" element={<Requirements />} />
          <Route path="date" element={<SelectDateTime />} />
          <Route path="slots" element={<AvailableSlots />} />
          <Route path="preview" element={<BookingPreview />} />
          <Route path="payments" element={<PaymentRequired />} />
          <Route path="payments/history" element={<PaymentHistory />} />
          <Route path="wallet" element={<WalletRecharge />} />
          <Route path="success" element={<BookingSuccess />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>

        {/* ================= PROVIDER ================= */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProviderDashboard />} />

          <Route path="bookings" element={<ProviderBookings />} />
          <Route path="photo" element={<ProviderPhotoUpload />} />
          <Route path="documents" element={<ProviderDocuments />} />
          <Route path="attendance" element={<ProviderAttendance />} />
          <Route path="earnings" element={<ProviderEarnings />} />
          <Route path="payouts" element={<ProviderPayouts />} />
          <Route path="deductions" element={<ProviderDeductions />} />
          <Route path="availability" element={<ProviderAvailability />} />
          <Route path="pricing" element={<ProviderPricing />} />
          <Route path="profile" element={<ProviderProfile />} />
          
        </Route>

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

          <Route path="payouts/requests" element={<AdminPayoutRequests />} />
          <Route path="payouts/history" element={<AdminPayoutHistory />} />
          <Route path="providers" element={<ProvidersListAdmin />} />
          <Route path="providers/:providerId" element={<ProviderDetailsAdmin />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="complaints" element={<AdminComplaints />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;