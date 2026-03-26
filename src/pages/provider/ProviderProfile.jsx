import { useEffect, useState } from "react";
import api from "../../api/axios";
import { SERVICES } from "../../constants/services";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function ProviderProfile() {

  const [profile, setProfile] = useState(null);
  const [city, setCity] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  const [photoFile, setPhotoFile] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  const [completion, setCompletion] = useState(0);

  // ✅ NEW STATES
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/api/provider/me");
    const p = res.data;

    setProfile(p);
    setCity(p.city || "");
    setSelectedServices(p.services || []);
    calculateCompletion(p);
  };

  const calculateCompletion = (p) => {
    let score = 0;
    let total = 4;

    if (p.city) score++;
    if (p.services?.length) score++;
    if (p.profilePhotoUrl) score++;
    if (p.idProofUrl && p.addressProofUrl) score++;

    setCompletion(Math.round((score / total) * 100));
  };

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const uploadPhoto = async () => {
    if (!photoFile) return alert("Select photo first");

    const formData = new FormData();
    formData.append("file", photoFile);

    await api.post("/api/provider/me/photo", formData);
    fetchProfile();
  };

  const uploadDocs = async () => {
    if (!idProof || !addressProof) {
      return alert("Upload both documents");
    }

    const formData = new FormData();
    formData.append("idProof", idProof);
    formData.append("addressProof", addressProof);

    await api.post("/api/provider/me/documents", formData);
    fetchProfile();
  };

  // ✅ UPDATED SAVE PROFILE
  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      await api.put("/api/provider/me", {
        city,
        services: selectedServices
      });

      setMessage("✅ Profile updated successfully");
      fetchProfile();

    } catch (err) {
      setMessage(
        err?.response?.data?.message || "❌ Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ✅ AUTO HIDE MESSAGE
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getImageUrl = (url) =>
    url ? `http://localhost:8080${url}` : null;

  if (!profile) return null;

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="relative mb-10 animate-fadeIn">

        <div className="
          absolute -top-16 -left-10 w-72 h-72 
          bg-pink-400/20 blur-3xl rounded-full
          pointer-events-none
        "></div>

        <div className="relative">
          <h2 className="
            text-3xl font-bold 
            bg-brand-gradient bg-clip-text text-transparent
          ">
            My Profile 👤
          </h2>

          <p className="text-textSub mt-2">
            Complete your profile to start receiving bookings
          </p>
        </div>

      </div>

      {/* 📊 PROGRESS */}
      <div className="mb-6 animate-fadeIn">

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gradient transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="text-sm mt-2 text-gray-600">
          Profile Completion: {completion}%
        </p>

        {completion < 100 && (
          <p className="text-sm text-red-500 mt-1">
            ⚠ Complete profile to start receiving bookings
          </p>
        )}

      </div>

      {/* 🧾 CARD */}
      <Card className="space-y-6 animate-fadeIn hover:shadow-glow">

        {/* 👤 PHOTO */}
        <div className="flex items-center gap-6">

          <img
            src={
              getImageUrl(profile.profilePhotoUrl) ||
              "https://via.placeholder.com/80"
            }
            className="w-20 h-20 rounded-full object-cover"
          />

          <input
            type="file"
            id="photoUpload"
            className="hidden"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />

          <div className="flex gap-3">
            <label htmlFor="photoUpload">
              <Button variant="secondary">Choose Photo</Button>
            </label>

            <Button onClick={uploadPhoto}>
              Upload Photo
            </Button>
          </div>

        </div>

        {/* 📍 CITY */}
        <div>
          <p className="text-sm text-textSub mb-1">City</p>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="
              w-full border rounded-lg px-3 py-2
              focus:ring-2 focus:ring-pink-400
            "
          />
        </div>

        {/* 🛠 SERVICES */}
        <div>
          <p className="text-sm text-textSub mb-2">Services</p>

          <div className="flex flex-wrap gap-2">
            {SERVICES.map(service => (
              <span
                key={service}
                onClick={() => toggleService(service)}
                className={`
                  px-3 py-1 rounded-full text-sm cursor-pointer
                  transition-all duration-300 hover:scale-105

                  ${selectedServices.includes(service)
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "bg-gray-200 hover:bg-gray-300"}
                `}
              >
                {service.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {/* 📄 DOCUMENTS */}
        <div>
          <p className="text-sm text-textSub mb-2">Documents</p>

          <p className="text-sm">
            ID Proof: {profile.idProofUrl ? "✅ Uploaded" : "❌ Not uploaded"}
          </p>
          <p className="text-sm mb-2">
            Address Proof: {profile.addressProofUrl ? "✅ Uploaded" : "❌ Not uploaded"}
          </p>

          <div className="flex gap-4 flex-wrap">

            <label className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              ID Proof
              <input type="file" hidden onChange={(e)=>setIdProof(e.target.files[0])}/>
            </label>

            <label className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              Address Proof
              <input type="file" hidden onChange={(e)=>setAddressProof(e.target.files[0])}/>
            </label>

          </div>

          <div className="mt-3">
            <Button variant="secondary" onClick={uploadDocs}>
              Upload Documents
            </Button>
          </div>

        </div>

        {/* 💬 MESSAGE */}
        {message && (
          <p className="text-sm font-medium">
            {message}
          </p>
        )}

        {/* 💾 SAVE */}
        <div className="pt-2">
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>

      </Card>

    </Container>
  );
}

export default ProviderProfile;