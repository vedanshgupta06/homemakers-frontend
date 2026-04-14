// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// function MainLayout() {

//   return (
//     <div className="min-h-screen bg-[#F5F3EE]">

//       <Navbar />

//       <div className="max-w-5xl mx-auto px-6 py-8">
//         <Outlet />
//       </div>

//     </div>
//   );
// }

// export default MainLayout;

import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    // Changed background to a slightly cleaner off-white to match the new slate theme
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <Navbar />

      {/* 
          1. Removed max-w-5xl (which was the bottleneck)
          2. Added w-[95%] for mobile and w-[90%] for desktop 
          3. Added max-w-[1800px] so it doesn't get TOO wide on massive 4K monitors
      */}
      <div className="w-[95%] lg:w-[90%] max-w-[1800px] mx-auto py-8 md:py-12">
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;