// import { useState, useEffect } from "react";
// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";
// import api from "../../api/axios";

// function UserProfile() {

//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     city: "",
//     address: ""
//   });

//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // 🔥 FETCH PROFILE FROM BACKEND
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/api/users/profile");
//       setUser(res.data);
//     } catch (err) {
//       console.error("Failed to fetch profile", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   // 🔥 SAVE PROFILE TO BACKEND
//   const saveProfile = async () => {
//     try {
//       await api.put("/api/users/profile", user);

//       setEditing(false);
//       alert("Profile updated successfully ✅");

//     } catch (err) {
//       console.error("Update failed", err);
//       alert("Failed to update profile ❌");
//     }
//   };

//   if (loading) {
//     return (
//       <Container>
//         <p>Loading profile...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container>

//       {/* HEADER */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold">
//           My Profile 👤
//         </h2>
//         <p className="text-gray-500 text-sm">
//           Manage your personal details
//         </p>
//       </div>

//       {/* PROFILE CARD */}
//       <Card className="max-w-xl mx-auto p-6">

//         {/* AVATAR */}
//         <div className="flex flex-col items-center mb-6">

//           <div className="
//             w-20 h-20 rounded-full
//             bg-gradient-to-br from-blue-500 to-indigo-600
//             text-white text-2xl font-bold
//             flex items-center justify-center
//             shadow-md
//           ">
//             {user.name?.charAt(0) || "U"}
//           </div>

//           <p className="mt-3 font-medium text-gray-700">
//             {user.name}
//           </p>

//         </div>

//         {/* FORM */}
//         <div className="space-y-4">

//           {/* NAME */}
//           <div>
//             <label className="text-sm text-gray-500">Name</label>
//             <input
//               name="name"
//               value={user.name}
//               onChange={handleChange}
//               disabled={!editing}
//               className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="text-sm text-gray-500">Email</label>
//             <input
//               name="email"
//               value={user.email}
//               disabled
//               className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
//             />
//           </div>

//           {/* PHONE */}
//           <div>
//             <label className="text-sm text-gray-500">Phone</label>
//             <input
//               name="phone"
//               value={user.phone || ""}
//               onChange={handleChange}
//               disabled={!editing}
//               placeholder="Add phone number"
//               className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>

//           {/* CITY */}
//           <div>
//             <label className="text-sm text-gray-500">City</label>
//             <input
//               name="city"
//               value={user.city || ""}
//               onChange={handleChange}
//               disabled={!editing}
//               placeholder="Add city"
//               className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>
//             {/* ADDRESS */}
//             <div>
//             <label className="text-sm text-gray-500">Address</label>
//             <textarea
//                 name="address"
//                 value={user.address || ""}
//                 onChange={handleChange}
//                 disabled={!editing}
//                 placeholder="Add your full address"
//                 rows={3}
//                 className="
//                 w-full mt-1 px-3 py-2 border rounded-lg
//                 focus:ring-2 focus:ring-blue-500 outline-none
//                 disabled:bg-gray-100
//                 resize-none
//                 "
//             />
//             </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="mt-6 flex justify-between">

//           {!editing ? (
//             <button
//               onClick={() => setEditing(true)}
//               className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
//             >
//               Edit Profile
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={saveProfile}
//                 className="
//                   px-5 py-2 rounded-lg text-white font-medium
//                   bg-gradient-to-r from-blue-500 to-indigo-600
//                   hover:scale-[1.03] active:scale-[0.97]
//                   transition-all
//                 "
//               >
//                 Save Changes
//               </button>
//             </>
//           )}

//         </div>

//       </Card>

//     </Container>
//   );
// }

// export default UserProfile;

import { useState, useEffect } from "react";
import api from "../../api/axios";
import { User, Mail, Phone, MapPin, Home, Pencil, X, Check,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
function UserProfile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", city: "", address: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/api/users/profile", user);
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: User, iconBg: "bg-blue-600", disabled: false, placeholder: "Your name", type: "text" },
    { name: "email", label: "Email", icon: Mail, iconBg: "bg-slate-400", disabled: true, placeholder: "your@email.com", type: "email" },
    { name: "phone", label: "Phone", icon: Phone, iconBg: "bg-emerald-500", disabled: false, placeholder: "Add phone number", type: "text" },
    { name: "city", label: "City", icon: MapPin, iconBg: "bg-orange-500", disabled: false, placeholder: "Add your city", type: "text" },
  ];
 const navigate = useNavigate();
  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%]">
          <div className="max-w-7xl mx-auto">
            <div className="h-4 w-32 bg-white/10 rounded-full mb-4 animate-pulse" />
            <div className="h-10 w-48 bg-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="px-[5%]">
          <div className="max-w-xl mx-auto -mt-8 relative z-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8">
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative flex items-center gap-6">
         <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
        >
          <ArrowLeft 
            size={18} 
            strokeWidth={2.5} 
            className="text-slate-900 transition-transform group-hover:-translate-x-0.5" 
          />
        </button>
          {/* AVATAR */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-900/30">
            <span className="text-white text-2xl md:text-3xl font-black">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">My Account</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
              {user.name || "My"} <span className="text-blue-400">Profile</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-28">
        <div className="max-w-xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* SECTION HEADER */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Personal Details</h3>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all text-xs font-black text-slate-600 uppercase tracking-wider"
              >
                <Pencil size={11} strokeWidth={3} />
                Edit
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all text-xs font-black text-slate-600 uppercase tracking-wider"
              >
                <X size={11} strokeWidth={3} />
                Cancel
              </button>
            )}
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">
            {editing ? "Make your changes and save below" : "Click edit to update your information"}
          </p>

          {/* FIELDS */}
          <div className="space-y-3 mb-6">
            {fields.map(({ name, label, icon: Icon, iconBg, disabled, placeholder, type }) => {
              const isDisabled = disabled || !editing;
              return (
                <div key={name} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                  ${isDisabled ? "bg-slate-50 border-slate-100" : "bg-white border-blue-100 shadow-sm"}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${disabled ? "bg-slate-300" : iconBg}`}>
                    <Icon size={15} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <input
                      type={type}
                      name={name}
                      value={user[name] || ""}
                      onChange={handleChange}
                      disabled={isDisabled}
                      placeholder={placeholder}
                      className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium disabled:text-slate-600"
                    />
                  </div>
                </div>
              );
            })}

            {/* ADDRESS - textarea */}
            <div className={`flex gap-4 p-4 rounded-2xl border-2 transition-all duration-200
              ${!editing ? "bg-slate-50 border-slate-100" : "bg-white border-blue-100 shadow-sm"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!editing ? "bg-slate-300" : "bg-violet-500"}`}>
                <Home size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                <textarea
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Add your full address"
                  rows={2}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium resize-none disabled:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          {editing && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Save Changes</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
                  ${saving
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
                  }`}
              >
                {saving ? (
                  "SAVING..."
                ) : (
                  <>
                    <Check size={14} strokeWidth={4} />
                    SAVE CHANGES
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserProfile;