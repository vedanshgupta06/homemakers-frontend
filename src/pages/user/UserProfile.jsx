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
import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { User, Mail, Phone, MapPin, Home, Pencil, X, Check, ArrowLeft, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAGPUR_LOCALITIES = [
  { name: "Abhyankar Nagar",    pincode: "440010" },
  { name: "Ajni",               pincode: "440001" },
  { name: "Ambazari",           pincode: "440010" },
  { name: "Amravati Road",      pincode: "440033" },
  { name: "Ayodhya Nagar",      pincode: "440024" },
  { name: "Bajaj Nagar",        pincode: "440010" },
  { name: "Beltarodi",          pincode: "440034" },
  { name: "Bhandara Road",      pincode: "440008" },
  { name: "Bharat Nagar",       pincode: "440026" },
  { name: "Butibori",           pincode: "441108" },
  { name: "Civil Lines",        pincode: "440001" },
  { name: "Cotton Market",      pincode: "440018" },
  { name: "Dharampeth",         pincode: "440010" },
  { name: "Dhantoli",           pincode: "440012" },
  { name: "Gandhibagh",         pincode: "440002" },
  { name: "Gorewada",           pincode: "440013" },
  { name: "Gokulpeth",          pincode: "440010" },
  { name: "Hanuman Nagar",      pincode: "440024" },
  { name: "Hingna",             pincode: "440016" },
  { name: "Itwari",             pincode: "440002" },
  { name: "Jafar Nagar",        pincode: "440013" },
  { name: "Jaripatka",          pincode: "440014" },
  { name: "Kamptee",            pincode: "441002" },
  { name: "Kalamna",            pincode: "440030" },
  { name: "Katol Road",         pincode: "440013" },
  { name: "Khamla",             pincode: "440025" },
  { name: "Khapri",             pincode: "441108" },
  { name: "Koradi",             pincode: "441111" },
  { name: "Laxmi Nagar",        pincode: "440022" },
  { name: "Mahal",              pincode: "440032" },
  { name: "Manewada",           pincode: "440024" },
  { name: "Mankapur",           pincode: "440030" },
  { name: "Manas Nagar",        pincode: "440024" },
  { name: "Medical Square",     pincode: "440009" },
  { name: "Mouda",              pincode: "441104" },
  { name: "Nandanvan",          pincode: "440009" },
  { name: "Nagpur Railway",     pincode: "440001" },
  { name: "New Subhedar Layout",pincode: "440024" },
  { name: "Pratap Nagar",       pincode: "440022" },
  { name: "Ramdaspeth",         pincode: "440010" },
  { name: "Reshimbagh",         pincode: "440009" },
  { name: "Sadar",              pincode: "440001" },
  { name: "Sakkardara",         pincode: "440009" },
  { name: "Shankar Nagar",      pincode: "440010" },
  { name: "Sitabuldi",          pincode: "440012" },
  { name: "Somalwada",          pincode: "440015" },
  { name: "Subhedar Layout",    pincode: "440024" },
  { name: "Telecom Nagar",      pincode: "440022" },
  { name: "Trimurti Nagar",     pincode: "440022" },
  { name: "Umred Road",         pincode: "440009" },
  { name: "Wadi",               pincode: "440023" },
  { name: "Wardha Road",        pincode: "440015" },
  { name: "Wathoda",            pincode: "440035" },
  { name: "Yashodhara Nagar",   pincode: "440022" },
  { name: "Zingabai Takli",     pincode: "440030" },
];

function UserProfile() {
  const [user, setUser]       = useState({ name: "", email: "", phone: "", city: "", address: "", pincode: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  // locality search state
  const [localitySearch, setLocalitySearch]         = useState("");
  const [showSuggestions, setShowSuggestions]       = useState(false);
  const [manualPincode, setManualPincode]           = useState(false);
  const suggestionsRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => { fetchProfile(); }, []);

  // close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data);
      // pre-fill locality search from saved pincode
      const match = NAGPUR_LOCALITIES.find(l => l.pincode === res.data.pincode);
      if (match) setLocalitySearch(match.name);
      else if (res.data.pincode) {
        setLocalitySearch(res.data.pincode);
        setManualPincode(true);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported by your browser"); return; }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocating(false);
      },
      () => {
        setLocError("Location access denied. Please allow location or enter pincode manually.");
        setLocating(false);
      }
    );
  };

  const selectLocality = (locality) => {
    setUser(prev => ({ ...prev, pincode: locality.pincode }));
    setLocalitySearch(locality.name);
    setShowSuggestions(false);
    setManualPincode(false);
  };

  const handleLocalityInput = (val) => {
    setLocalitySearch(val);
    setShowSuggestions(true);
    setManualPincode(false);
    // if user typed a 6-digit number, treat as direct pincode
    if (/^\d{6}$/.test(val.trim())) {
      setUser(prev => ({ ...prev, pincode: val.trim() }));
    } else if (val === "") {
      setUser(prev => ({ ...prev, pincode: "" }));
    }
  };

  const applyManualPincode = () => {
    const pin = localitySearch.trim();
    if (/^\d{5,6}$/.test(pin)) {
      setUser(prev => ({ ...prev, pincode: pin }));
      setManualPincode(true);
      setShowSuggestions(false);
    }
  };

  const filteredLocalities = NAGPUR_LOCALITIES.filter(l =>
    l.name.toLowerCase().includes(localitySearch.toLowerCase()) ||
    l.pincode.includes(localitySearch)
  );

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/api/users/profile", {
        name:      user.name,
        phone:     user.phone,
        city:      user.city,
        address:   user.address,
        pincode:   user.pincode   || null,
        latitude:  user.latitude  || null,
        longitude: user.longitude || null,
      });
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  const basicFields = [
    { name: "name",  label: "Full Name", icon: User,   iconBg: "bg-blue-600",   disabled: false, placeholder: "Your name",        type: "text" },
    { name: "email", label: "Email",     icon: Mail,   iconBg: "bg-slate-400",  disabled: true,  placeholder: "your@email.com",   type: "email" },
    { name: "phone", label: "Phone",     icon: Phone,  iconBg: "bg-emerald-500",disabled: false, placeholder: "Add phone number", type: "text" },
    { name: "city",  label: "City",      icon: MapPin, iconBg: "bg-orange-500", disabled: false, placeholder: "Add your city",    type: "text" },
  ];

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
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}
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
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

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
                <Pencil size={11} strokeWidth={3} /> Edit
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all text-xs font-black text-slate-600 uppercase tracking-wider"
              >
                <X size={11} strokeWidth={3} /> Cancel
              </button>
            )}
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">
            {editing ? "Make your changes and save below" : "Click edit to update your information"}
          </p>

          {/* BASIC FIELDS */}
          <div className="space-y-3 mb-3">
            {basicFields.map(({ name, label, icon: Icon, iconBg, disabled, placeholder, type }) => {
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

            {/* ── AREA / PINCODE FIELD ── */}
            <div className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 relative
              ${!editing ? "bg-slate-50 border-slate-100" : "bg-white border-blue-100 shadow-sm"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${!editing ? "bg-slate-300" : "bg-blue-500"}`}>
                <MapPin size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0" ref={suggestionsRef}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Area / Locality</p>

                {!editing ? (
                  // READ MODE
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {localitySearch || <span className="text-slate-300 font-medium">Not set</span>}
                    </p>
                    {user.pincode && (
                      <p className="text-[10px] text-blue-500 font-bold mt-0.5">Pincode: {user.pincode}</p>
                    )}
                  </div>
                ) : (
                  // EDIT MODE
                  <div>
                    <input
                      type="text"
                      value={localitySearch}
                      onChange={e => handleLocalityInput(e.target.value)}
                      onFocus={() => localitySearch.length > 0 && setShowSuggestions(true)}
                      placeholder="Type area name e.g. Dharampeth, Jaripatka..."
                      className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
                    />

                    {/* pincode badge */}
                    {user.pincode && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                          Pincode: {user.pincode}
                        </span>
                        <button
                          onClick={() => { setUser(prev => ({ ...prev, pincode: "" })); setLocalitySearch(""); setManualPincode(false); }}
                          className="text-[10px] text-slate-400 hover:text-red-500 transition-colors font-black"
                        >
                          ✕ Clear
                        </button>
                      </div>
                    )}

                    {/* SUGGESTIONS DROPDOWN */}
                    {showSuggestions && localitySearch.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="max-h-52 overflow-y-auto">
                          {filteredLocalities.length > 0 ? (
                            filteredLocalities.map(l => (
                              <button
                                key={l.name + l.pincode}
                                onMouseDown={() => selectLocality(l)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                              >
                                <span className="text-sm font-bold text-slate-800">{l.name}</span>
                                <span className="text-xs font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{l.pincode}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3">
                              <p className="text-xs text-slate-500 font-medium mb-2">
                                "{localitySearch}" not in list —
                              </p>
                            </div>
                          )}
                        </div>

                        {/* MANUAL PINCODE ENTRY — always shown at bottom when typing */}
                        <div className="border-t border-slate-100 p-3 bg-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                            Enter pincode manually
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={localitySearch}
                              onChange={e => setLocalitySearch(e.target.value)}
                              placeholder="6-digit pincode"
                              maxLength={6}
                              className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-800 outline-none focus:border-blue-500 placeholder:text-slate-300"
                            />
                            <button
                              onMouseDown={applyManualPincode}
                              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all"
                            >
                              Apply
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5">
                            Can't find your area? Type the 6-digit pincode directly.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ADDRESS */}
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

            {/* USE MY LOCATION */}
            {editing && (
              <div className="p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/40">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                  Location <span className="normal-case font-medium text-slate-400">— improves provider matching</span>
                </p>

                {user.latitude && user.longitude ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700">
                      Location saved ({Number(user.latitude).toFixed(4)}, {Number(user.longitude).toFixed(4)})
                    </span>
                    <button
                      onClick={() => setUser(prev => ({ ...prev, latitude: null, longitude: null }))}
                      className="ml-auto text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-200 disabled:opacity-60"
                  >
                    <Navigation size={12} />
                    {locating ? "Getting location..." : "Use My Location"}
                  </button>
                )}

                {locError && <p className="mt-2 text-xs text-red-500 font-medium">{locError}</p>}
                <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                  Your location is only used to show you providers near you. It is never shared publicly.
                </p>
              </div>
            )}
          </div>

          {editing && (
            <>
              <div className="flex items-center gap-4 mb-6 mt-6">
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
                {saving ? "SAVING..." : <><Check size={14} strokeWidth={4} /> SAVE CHANGES</>}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserProfile;