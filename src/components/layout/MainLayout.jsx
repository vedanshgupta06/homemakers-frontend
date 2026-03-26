import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;