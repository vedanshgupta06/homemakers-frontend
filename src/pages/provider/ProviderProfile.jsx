// import { useEffect, useState, useRef } from "react";
// import api from "../../api/axios";

// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";

// const SERVICES = [
//   "CLEANING",
//   "COOKING",
//   "BABYSITTING",
//   "LAUNDRY",
//   "DISH_WASHING",
//   "ELDER_CARE",
//   "DUSTING",
// ];

// function ProviderProfile() {
//   const [profile, setProfile] = useState(null);
//   const [city, setCity] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]);

//   const [photoFile, setPhotoFile] = useState(null);
//   const [idProof, setIdProof] = useState(null);
//   const [addressProof, setAddressProof] = useState(null);

//   const [completion, setCompletion] = useState(0);

//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const photoRef = useRef();
//   const idRef = useRef();
//   const addressRef = useRef();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/api/provider/me");
//       const p = res.data;

//       setProfile(p);
//       setCity(p.city || "");
//       setSelectedServices(p.services || []);
//       calculateCompletion(p);
//     } catch {
//       setError("Failed to load profile");
//     }
//   };

//   const calculateCompletion = (p) => {
//     let score = 0;
//     let total = 4;

//     if (p.city) score++;
//     if (p.services?.length) score++;
//     if (p.profilePhotoUrl) score++;
//     if (p.idProofUrl && p.addressProofUrl) score++;

//     setCompletion(Math.round((score / total) * 100));
//   };

//   const toggleService = (service) => {
//     setSelectedServices((prev) =>
//       prev.includes(service)
//         ? prev.filter((s) => s !== service)
//         : [...prev, service]
//     );
//   };

//   const uploadPhoto = async () => {
//     if (!photoFile) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", photoFile);

//       await api.post("/api/provider/me/photo", formData);

//       setMessage("Photo uploaded successfully");
//       setPhotoFile(null);
//       fetchProfile();
//     } catch {
//       setError("Photo upload failed");
//     }
//   };

//   const uploadDocs = async () => {
//     if (!idProof || !addressProof) return;

//     try {
//       const formData = new FormData();
//       formData.append("idProof", idProof);
//       formData.append("addressProof", addressProof);

//       await api.post("/api/provider/me/documents", formData);

//       setMessage("Documents uploaded successfully");
//       setIdProof(null);
//       setAddressProof(null);
//       fetchProfile();
//     } catch {
//       setError("Document upload failed");
//     }
//   };

//   const saveProfile = async () => {
//     try {
//       setSaving(true);
//       setMessage("");
//       setError("");

//       await api.put("/api/provider/me", {
//         city,
//         services: selectedServices,
//       });

//       setMessage("Profile updated successfully");
//       fetchProfile();
//     } catch (err) {
//       setError(
//         err?.response?.data?.message || "Failed to update profile"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   useEffect(() => {
//     if (message || error) {
//       const t = setTimeout(() => {
//         setMessage("");
//         setError("");
//       }, 3000);
//       return () => clearTimeout(t);
//     }
//   }, [message, error]);

//   const getImageUrl = (url) =>
//     url ? `http://localhost:8080${url}` : null;

//   if (!profile) return null;

//   return (
//     <Container>

//       {/* HEADER */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold text-gray-900">
//           My Profile
//         </h2>
//         <p className="text-gray-500 text-sm">
//           Complete your profile to start receiving bookings
//         </p>
//       </div>

//       {/* PROGRESS */}
//       <div className="mb-6">
//         <div className="h-2 bg-gray-200 rounded-full">
//           <div
//             className="h-full bg-blue-600 rounded-full"
//             style={{ width: `${completion}%` }}
//           />
//         </div>
//         <p className="text-sm mt-2 text-gray-600">
//           Profile Completion: {completion}%
//         </p>
//       </div>

//       <Card className="space-y-6">

//         {/* PHOTO */}
//         <div className="flex items-center gap-5">
//           <img
//             src={
//               getImageUrl(profile.profilePhotoUrl) ||
//               "https://via.placeholder.com/80"
//             }
//             className="w-20 h-20 rounded-xl object-cover border"
//           />

//           <input
//             type="file"
//             ref={photoRef}
//             className="hidden"
//             onChange={(e) => setPhotoFile(e.target.files[0])}
//           />

//           <div className="flex gap-3">
//             <button
//               onClick={() => photoRef.current.click()}
//               className="px-4 py-2 bg-gray-100 rounded-lg"
//             >
//               Choose Photo
//             </button>

//             <Button onClick={uploadPhoto} disabled={!photoFile}>
//               Upload
//             </Button>
//           </div>

//           {photoFile && (
//             <p className="text-xs text-gray-500">
//               {photoFile.name}
//             </p>
//           )}
//         </div>

//         {/* CITY */}
//         <div>
//           <label className="text-sm text-gray-600">City</label>
//           <input
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* SERVICES */}
//         <div>
//           <p className="text-sm font-medium text-gray-700 mb-2">
//             Services Offered
//           </p>

//           <div className="flex flex-wrap gap-2">
//             {SERVICES.map((service) => (
//               <span
//                 key={service}
//                 onClick={() => toggleService(service)}
//                 className={`px-3 py-1 rounded-full text-xs cursor-pointer transition ${
//                   selectedServices.includes(service)
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {service.replace("_", " ")}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* DOCUMENTS */}
//         <div>
//           <p className="text-sm font-medium text-gray-700 mb-3">
//             Documents
//           </p>

//           {/* STATUS */}
//           <div className="space-y-3 mb-4">

//             <div className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2">
//               <div>
//                 <p className="text-sm font-medium">ID Proof</p>
//                 <p className={`text-xs ${profile.idProofUrl ? "text-green-600" : "text-gray-400"}`}>
//                   {profile.idProofUrl ? "Uploaded" : "Not uploaded"}
//                 </p>
//               </div>

//               {profile.idProofUrl && (
//                 <a
//                   href={getImageUrl(profile.idProofUrl)}
//                   target="_blank"
//                   className="text-blue-600 text-sm"
//                 >
//                   View
//                 </a>
//               )}
//             </div>

//             <div className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2">
//               <div>
//                 <p className="text-sm font-medium">Address Proof</p>
//                 <p className={`text-xs ${profile.addressProofUrl ? "text-green-600" : "text-gray-400"}`}>
//                   {profile.addressProofUrl ? "Uploaded" : "Not uploaded"}
//                 </p>
//               </div>

//               {profile.addressProofUrl && (
//                 <a
//                   href={getImageUrl(profile.addressProofUrl)}
//                   target="_blank"
//                   className="text-blue-600 text-sm"
//                 >
//                   View
//                 </a>
//               )}
//             </div>

//           </div>

//           {/* INPUTS */}
//           <input type="file" ref={idRef} className="hidden" onChange={(e) => setIdProof(e.target.files[0])} />
//           <input type="file" ref={addressRef} className="hidden" onChange={(e) => setAddressProof(e.target.files[0])} />

//           <div className="flex gap-3 flex-wrap">
//             <button onClick={() => idRef.current.click()} className="px-4 py-2 bg-gray-100 rounded-lg">
//               Choose ID Proof
//             </button>

//             <button onClick={() => addressRef.current.click()} className="px-4 py-2 bg-gray-100 rounded-lg">
//               Choose Address Proof
//             </button>

//             <Button variant="outline" onClick={uploadDocs} disabled={!idProof || !addressProof}>
//               Upload Docs
//             </Button>
//           </div>

//           <div className="text-xs text-gray-500 mt-2">
//             {idProof && <p>ID: {idProof.name}</p>}
//             {addressProof && <p>Address: {addressProof.name}</p>}
//           </div>
//         </div>

//         {/* FEEDBACK */}
//         {message && (
//           <div className="text-green-600 bg-green-50 p-2 rounded text-sm">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="text-red-500 bg-red-50 p-2 rounded text-sm">
//             {error}
//           </div>
//         )}

//         {/* SAVE */}
//         <Button onClick={saveProfile} disabled={saving}>
//           {saving ? "Saving..." : "Save Changes"}
//         </Button>

//       </Card>
//     </Container>
//   );
// }

// export default ProviderProfile;



import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import {
  User, MapPin, Briefcase, FileText, Camera,
  CheckCircle2, AlertCircle, Upload, Eye, Check, X,ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const SERVICES = [
  "CLEANING", "COOKING", "BABYSITTING", "LAUNDRY",
  "DISH_WASHING", "ELDER_CARE", "DUSTING",
];

function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [city, setCity] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const photoRef = useRef();
  const idRef = useRef();
  const addressRef = useRef();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/provider/me");
      const p = res.data;
      setProfile(p);
      setCity(p.city || "");
      setSelectedServices(p.services || []);
      calculateCompletion(p);
    } catch {
      setError("Failed to load profile");
    }
  };

  const calculateCompletion = (p) => {
    let score = 0;
    if (p.city) score++;
    if (p.services?.length) score++;
    if (p.profilePhotoUrl) score++;
    if (p.idProofUrl && p.addressProofUrl) score++;
    setCompletion(Math.round((score / 4) * 100));
  };

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", photoFile);
      await api.post("/api/provider/me/photo", formData);
      setMessage("Photo uploaded successfully");
      setPhotoFile(null);
      fetchProfile();
    } catch {
      setError("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const uploadDocs = async () => {
    if (!idProof || !addressProof) return;
    setUploadingDocs(true);
    try {
      const formData = new FormData();
      formData.append("idProof", idProof);
      formData.append("addressProof", addressProof);
      await api.post("/api/provider/me/documents", formData);
      setMessage("Documents uploaded successfully");
      setIdProof(null);
      setAddressProof(null);
      fetchProfile();
    } catch {
      setError("Document upload failed");
    } finally {
      setUploadingDocs(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage(""); setError("");
    try {
      await api.put("/api/provider/me", { city, services: selectedServices });
      setMessage("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
const navigate = useNavigate();
  useEffect(() => {
    if (message || error) {
      const t = setTimeout(() => { setMessage(""); setError(""); }, 3000);
      return () => clearTimeout(t);
    }
  }, [message, error]);

  const getImageUrl = (url) => url ? `http://localhost:8080${url}` : null;

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const completionColor = completion < 50 ? "bg-red-500" : completion < 100 ? "bg-yellow-500" : "bg-emerald-500";

  if (!profile) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#1E293B] pt-16 pb-20 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-white/10 rounded-2xl animate-pulse" />
        </div>
      </div>
      <div className="px-[5%]">
        <div className="max-w-2xl mx-auto -mt-8 relative z-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8">
          <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative flex items-center gap-5">
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
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-900/30">
              {profile.profilePhotoUrl
                ? <img src={getImageUrl(profile.profilePhotoUrl)} className="w-full h-full object-cover" alt="Profile" />
                : <span className="text-white text-2xl font-black">{profile.user?.name?.charAt(0)?.toUpperCase() || "P"}</span>
              }
            </div>
            {profile.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#1E293B]">
                <Check size={10} className="text-white" strokeWidth={4} />
              </div>
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Provider Profile</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
              {profile.user?.name || <span className="text-blue-400">My Profile</span>}
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              {profile.city || "City not set"} · {profile.services?.length || 0} services
              {profile.verified && <span className="ml-2 text-emerald-400 font-bold">· Verified ✓</span>}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-28">
        <div className="max-w-2xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* COMPLETION */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Profile Completion</p>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full
                ${completion === 100 ? "bg-emerald-100 text-emerald-700" : completion >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
                {completion}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${completionColor}`} style={{ width: `${completion}%` }} />
            </div>
            {completion < 100 && (
              <p className="text-xs text-slate-400 mt-2">
                {!profile.city && "· Add your city  "}
                {!profile.services?.length && "· Select services  "}
                {!profile.profilePhotoUrl && "· Upload photo  "}
                {(!profile.idProofUrl || !profile.addressProofUrl) && "· Upload documents"}
              </p>
            )}
          </div>

          {/* FEEDBACK */}
          {(message || error) && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${message ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
              {message
                ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              }
              <p className={`text-sm font-bold ${message ? "text-emerald-700" : "text-red-600"}`}>{message || error}</p>
            </div>
          )}

          {/* PHOTO */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Camera size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Profile Photo</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">Upload a clear professional photo</p>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 border-2 border-slate-200">
                {photoFile
                  ? <img src={URL.createObjectURL(photoFile)} className="w-full h-full object-cover" alt="Preview" />
                  : profile.profilePhotoUrl
                  ? <img src={getImageUrl(profile.profilePhotoUrl)} className="w-full h-full object-cover" alt="Profile" />
                  : <Camera size={20} className="text-slate-400" />
                }
              </div>
              <div className="flex gap-2 flex-wrap">
                <input type="file" ref={photoRef} className="hidden" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
                <button
                  onClick={() => photoRef.current.click()}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-200 text-xs font-black text-slate-600 transition-all"
                >
                  Choose Photo
                </button>
                <button
                  onClick={uploadPhoto}
                  disabled={!photoFile || uploadingPhoto}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all
                    ${!photoFile ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"}`}
                >
                  <Upload size={12} />
                  {uploadingPhoto ? "Uploading..." : "Upload"}
                </button>
              </div>
              {photoFile && <p className="text-xs text-slate-400 truncate max-w-[120px]">{photoFile.name}</p>}
            </div>
          </div>

          {/* CITY + SERVICES */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Basic Info</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">City and services you offer</p>

            {/* City input */}
            <div className="mb-5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">City</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
              />
            </div>

            {/* Services */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3 block">
                Services Offered · <span className="text-blue-600">{selectedServices.length} selected</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map(service => {
                  const selected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`px-3 py-2 rounded-xl text-xs font-black border-2 transition-all
                        ${selected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                          : "bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200"
                        }`}
                    >
                      {selected && <Check size={10} className="inline mr-1" strokeWidth={4} />}
                      {formatService(service)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Documents</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">Required for verification and payouts</p>

            {/* Doc status rows */}
            <div className="space-y-3 mb-5">
              {[
                { label: "ID Proof", url: profile.idProofUrl },
                { label: "Address Proof", url: profile.addressProofUrl },
              ].map(({ label, url }) => (
                <div key={label} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all
                  ${url ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${url ? "bg-emerald-500" : "bg-slate-300"}`}>
                      {url ? <CheckCircle2 size={14} className="text-white" /> : <FileText size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{label}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${url ? "text-emerald-600" : "text-slate-400"}`}>
                        {url ? "Uploaded" : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  {url && (
                      <a
                      href={getImageUrl(url)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-600 text-xs font-black hover:bg-emerald-50 transition-all"
                    >
                      <Eye size={12} /> View
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Upload inputs */}
            <input type="file" ref={idRef} className="hidden" onChange={e => setIdProof(e.target.files[0])} />
            <input type="file" ref={addressRef} className="hidden" onChange={e => setAddressProof(e.target.files[0])} />

            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => idRef.current.click()}
                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all
                  ${idProof ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"}`}>
                {idProof ? `✓ ${idProof.name.substring(0, 15)}...` : "Choose ID Proof"}
              </button>
              <button onClick={() => addressRef.current.click()}
                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all
                  ${addressProof ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"}`}>
                {addressProof ? `✓ ${addressProof.name.substring(0, 15)}...` : "Choose Address Proof"}
              </button>
              <button
                onClick={uploadDocs}
                disabled={!idProof || !addressProof || uploadingDocs}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all
                  ${(!idProof || !addressProof) ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-violet-500 hover:bg-violet-600 text-white shadow-md shadow-violet-200"}`}
              >
                <Upload size={12} />
                {uploadingDocs ? "Uploading..." : "Upload Docs"}
              </button>
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
              ${saving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"}`}
          >
            <Check size={14} strokeWidth={4} />
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;