

import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import {
  User, MapPin, FileText, Camera,
  CheckCircle2, AlertCircle, Upload, Eye, Check, X, ArrowLeft, Navigation, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  "CLEANING", "COOKING", "BABYSITTING", "LAUNDRY",
  "DISH_WASHING", "ELDER_CARE", "DUSTING",
];

const NAGPUR_LOCALITIES = [
  { name: "Abhyankar Nagar",     pincode: "440010" },
  { name: "Ajni",                pincode: "440001" },
  { name: "Ambazari",            pincode: "440010" },
  { name: "Amravati Road",       pincode: "440033" },
  { name: "Ayodhya Nagar",       pincode: "440024" },
  { name: "Bajaj Nagar",         pincode: "440010" },
  { name: "Beltarodi",           pincode: "440034" },
  { name: "Bhandara Road",       pincode: "440008" },
  { name: "Bharat Nagar",        pincode: "440026" },
  { name: "Butibori",            pincode: "441108" },
  { name: "Civil Lines",         pincode: "440001" },
  { name: "Cotton Market",       pincode: "440018" },
  { name: "Dharampeth",          pincode: "440010" },
  { name: "Dhantoli",            pincode: "440012" },
  { name: "Gandhibagh",          pincode: "440002" },
  { name: "Gorewada",            pincode: "440013" },
  { name: "Gokulpeth",           pincode: "440010" },
  { name: "Hanuman Nagar",       pincode: "440024" },
  { name: "Hingna",              pincode: "440016" },
  { name: "Itwari",              pincode: "440002" },
  { name: "Jafar Nagar",         pincode: "440013" },
  { name: "Jaripatka",           pincode: "440014" },
  { name: "Kamptee",             pincode: "441002" },
  { name: "Kalamna",             pincode: "440030" },
  { name: "Katol Road",          pincode: "440013" },
  { name: "Khamla",              pincode: "440025" },
  { name: "Khapri",              pincode: "441108" },
  { name: "Koradi",              pincode: "441111" },
  { name: "Laxmi Nagar",         pincode: "440022" },
  { name: "Mahal",               pincode: "440032" },
  { name: "Manewada",            pincode: "440024" },
  { name: "Mankapur",            pincode: "440030" },
  { name: "Manas Nagar",         pincode: "440024" },
  { name: "Medical Square",      pincode: "440009" },
  { name: "Mouda",               pincode: "441104" },
  { name: "Nandanvan",           pincode: "440009" },
  { name: "Nagpur Railway",      pincode: "440001" },
  { name: "New Subhedar Layout", pincode: "440024" },
  { name: "Pratap Nagar",        pincode: "440022" },
  { name: "Ramdaspeth",          pincode: "440010" },
  { name: "Reshimbagh",          pincode: "440009" },
  { name: "Sadar",               pincode: "440001" },
  { name: "Sakkardara",          pincode: "440009" },
  { name: "Shankar Nagar",       pincode: "440010" },
  { name: "Sitabuldi",           pincode: "440012" },
  { name: "Somalwada",           pincode: "440015" },
  { name: "Subhedar Layout",     pincode: "440024" },
  { name: "Telecom Nagar",       pincode: "440022" },
  { name: "Trimurti Nagar",      pincode: "440022" },
  { name: "Umred Road",          pincode: "440009" },
  { name: "Wadi",                pincode: "440023" },
  { name: "Wardha Road",         pincode: "440015" },
  { name: "Wathoda",             pincode: "440035" },
  { name: "Yashodhara Nagar",    pincode: "440022" },
  { name: "Zingabai Takli",      pincode: "440030" },
];

function ProviderProfile() {
  const [profile, setProfile]                   = useState(null);
  const [city, setCity]                         = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  // geo state
  const [homeLatitude, setHomeLatitude]         = useState(null);
  const [homeLongitude, setHomeLongitude]       = useState(null);
  const [travelRadiusKm, setTravelRadiusKm]     = useState(10);
  const [willingToTravel, setWillingToTravel]   = useState(false);
  const [serviceablePincodes, setServiceablePincodes] = useState([]);

  // pincode search
  const [pincodeInput, setPincodeInput]               = useState("");
  const [showPinSuggestions, setShowPinSuggestions]   = useState(false);
  const pinSuggestionsRef = useRef(null);

  const [locating, setLocating]           = useState(false);
  const [locError, setLocError]           = useState("");
  const [photoFile, setPhotoFile]         = useState(null);
  const [idProof, setIdProof]             = useState(null);
  const [addressProof, setAddressProof]   = useState(null);
  const [completion, setCompletion]       = useState(0);
  const [saving, setSaving]               = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocs, setUploadingDocs]   = useState(false);
  const [message, setMessage]             = useState("");
  const [error, setError]                 = useState("");

  const photoRef   = useRef();
  const idRef      = useRef();
  const addressRef = useRef();
  const navigate   = useNavigate();

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (pinSuggestionsRef.current && !pinSuggestionsRef.current.contains(e.target)) {
        setShowPinSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/provider/me");
      const p = res.data;
      setProfile(p);
      setCity(p.city || "");
      setSelectedServices(p.services || []);
      setHomeLatitude(p.homeLatitude   || null);
      setHomeLongitude(p.homeLongitude || null);
      setTravelRadiusKm(p.travelRadiusKm ?? 10);
      setWillingToTravel(p.willingToTravel ?? false);
      setServiceablePincodes(p.serviceablePincodes || []);
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
    if (p.homeLatitude && p.homeLongitude) score++;
    setCompletion(Math.round((score / 5) * 100));
  };

  const toggleService = (service) =>
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );

  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHomeLatitude(pos.coords.latitude);
        setHomeLongitude(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocError("Location access denied. Please allow location access.");
        setLocating(false);
      }
    );
  };

  const selectLocalityForPincode = (locality) => {
    const pin = locality.pincode;
    if (!serviceablePincodes.includes(pin)) {
      setServiceablePincodes(prev => [...prev, pin]);
    }
    setPincodeInput("");
    setShowPinSuggestions(false);
  };

  const addPincode = () => {
    const pin = pincodeInput.trim();
    if (!pin || pin.length < 5) return;
    if (!serviceablePincodes.includes(pin)) {
      setServiceablePincodes(prev => [...prev, pin]);
    }
    setPincodeInput("");
    setShowPinSuggestions(false);
  };

  const removePincode = (pin) =>
    setServiceablePincodes(prev => prev.filter(p => p !== pin));

  const filteredLocalities = NAGPUR_LOCALITIES.filter(l =>
    l.name.toLowerCase().includes(pincodeInput.toLowerCase()) ||
    l.pincode.includes(pincodeInput)
  );

  const getPincodeLabel = (pin) => {
    const match = NAGPUR_LOCALITIES.find(l => l.pincode === pin);
    return match ? `${match.name} · ${pin}` : pin;
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
      await api.put("/api/provider/me", {
        city,
        services: selectedServices,
        homeLatitude,
        homeLongitude,
        travelRadiusKm,
        willingToTravel,
        serviceablePincodes,
      });
      setMessage("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (message || error) {
      const t = setTimeout(() => { setMessage(""); setError(""); }, 3000);
      return () => clearTimeout(t);
    }
  }, [message, error]);

  const getImageUrl = (url) => url ? `{import.meta.env.VITE_API_BASE_URL}${url}` : null;

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
            type="button"
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

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
                {(!profile.idProofUrl || !profile.addressProofUrl) && "· Upload documents  "}
                {(!profile.homeLatitude || !profile.homeLongitude) && "· Set home location"}
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
                <button type="button" onClick={() => photoRef.current.click()} className="px-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-200 text-xs font-black text-slate-600 transition-all">
                  Choose Photo
                </button>
                <button
                  type="button"
                  onClick={uploadPhoto}
                  disabled={!photoFile || uploadingPhoto}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all
                    ${!photoFile ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"}`}
                >
                  <Upload size={12} />
                  {uploadingPhoto ? "Uploading..." : "Upload"}
                </button>
              </div>
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

            <div className="mb-5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">City</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3 block">
                Services Offered · <span className="text-blue-600">{selectedServices.length} selected</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map(service => {
                  const selected = selectedServices.includes(service);
                  return (
                    <button
                      type="button"
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

          {/* SERVICE AREA */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <Navigation size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Service Area</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">
              Set where you're willing to work — customers in your area will find you first
            </p>

            {/* Home location */}
            <div className="mb-5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Home Location</label>
              {homeLatitude && homeLongitude ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-emerald-700 flex-1">
                    Location set ({Number(homeLatitude).toFixed(4)}, {Number(homeLongitude).toFixed(4)})
                  </span>
                  <button
                    type="button"
                    onClick={() => { setHomeLatitude(null); setHomeLongitude(null); }}
                    className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-200 disabled:opacity-60"
                >
                  <Navigation size={12} />
                  {locating ? "Getting location..." : "Use My Home Location"}
                </button>
              )}
              {locError && <p className="mt-2 text-xs text-red-500 font-medium">{locError}</p>}
              <p className="mt-2 text-[10px] text-slate-400">
                Your exact location is never shown to customers — only used to match you with nearby bookings.
              </p>
            </div>

            {/* Travel radius */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Travel Radius</label>
                <span className="text-sm font-black text-blue-600">{travelRadiusKm} km</span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                step={1}
                value={travelRadiusKm}
                onChange={e => setTravelRadiusKm(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Serviceable areas */}
            <div className="mb-5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 block">
                Serviceable Areas
              </label>
              <p className="text-[10px] text-slate-400 mb-3">
                Search by area name or type a pincode directly
              </p>

              {serviceablePincodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {serviceablePincodes.map(pin => (
                    <span key={pin} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-black text-blue-700">
                      {getPincodeLabel(pin)}
                      <button type="button" onClick={() => removePincode(pin)} className="hover:text-red-500 transition-colors ml-0.5">
                        <X size={10} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative" ref={pinSuggestionsRef}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={e => { setPincodeInput(e.target.value); setShowPinSuggestions(true); }}
                    onFocus={() => pincodeInput.length > 0 && setShowPinSuggestions(true)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (/^\d{5,6}$/.test(pincodeInput.trim())) addPincode();
                        else if (filteredLocalities.length > 0) selectLocalityForPincode(filteredLocalities[0]);
                      }
                    }}
                    placeholder="Type area name or 6-digit pincode..."
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (/^\d{5,6}$/.test(pincodeInput.trim())) addPincode();
                      else if (filteredLocalities.length > 0) selectLocalityForPincode(filteredLocalities[0]);
                    }}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-200"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {showPinSuggestions && pincodeInput.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="max-h-52 overflow-y-auto">
                      {filteredLocalities.length > 0 ? (
                        filteredLocalities.map(l => {
                          const alreadyAdded = serviceablePincodes.includes(l.pincode);
                          return (
                            <button
                              type="button"
                              key={l.name + l.pincode}
                              onMouseDown={() => !alreadyAdded && selectLocalityForPincode(l)}
                              disabled={alreadyAdded}
                              className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0
                                ${alreadyAdded ? "opacity-40 cursor-not-allowed bg-slate-50" : "hover:bg-blue-50"}`}
                            >
                              <span className="text-sm font-bold text-slate-800">{l.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{l.pincode}</span>
                                {alreadyAdded && <span className="text-[10px] font-black text-emerald-500">✓ Added</span>}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3">
                          <p className="text-xs text-slate-500 font-medium">No area found for "{pincodeInput}"</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-100 p-3 bg-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                        Not in the list? Enter pincode manually
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pincodeInput}
                          onChange={e => setPincodeInput(e.target.value)}
                          placeholder="6-digit pincode e.g. 440014"
                          maxLength={6}
                          className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-800 outline-none focus:border-blue-500 placeholder:text-slate-300"
                        />
                        <button
                          type="button"
                          onMouseDown={addPincode}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Willing to travel toggle — fixed for mobile ── */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800">Willing to travel anywhere in city</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Turn on to appear as fallback when no nearby provider is found
                </p>
              </div>
              {/* Toggle — native checkbox hidden, styled div on top */}
              <div
                role="switch"
                aria-checked={willingToTravel}
                onClick={() => setWillingToTravel(prev => !prev)}
                className={`relative flex-shrink-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200
                  ${willingToTravel ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200
                    ${willingToTravel ? "left-6" : "left-0.5"}`}
                />
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

            <div className="space-y-3 mb-5">
              {[
                { label: "ID Proof",      url: profile.idProofUrl },
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
                    <a href={getImageUrl(url)} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-600 text-xs font-black hover:bg-emerald-50 transition-all">
                      <Eye size={12} /> View
                    </a>
                  )}
                </div>
              ))}
            </div>

            <input type="file" ref={idRef}      className="hidden" onChange={e => setIdProof(e.target.files[0])} />
            <input type="file" ref={addressRef} className="hidden" onChange={e => setAddressProof(e.target.files[0])} />

            <div className="flex flex-wrap gap-2 mb-3">
              <button type="button" onClick={() => idRef.current.click()}
                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all
                  ${idProof ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"}`}>
                {idProof ? `✓ ${idProof.name.substring(0, 15)}...` : "Choose ID Proof"}
              </button>
              <button type="button" onClick={() => addressRef.current.click()}
                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all
                  ${addressProof ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"}`}>
                {addressProof ? `✓ ${addressProof.name.substring(0, 15)}...` : "Choose Address Proof"}
              </button>
              <button
                type="button"
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
            type="button"
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