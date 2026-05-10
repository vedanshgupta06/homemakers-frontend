// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminTopbar />
      <main className="w-[95%] 2xl:w-[92%] mx-auto py-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;