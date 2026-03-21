import { useEffect, useState } from "react";
import api from "../../api/axios";
import { SERVICES } from "../../constants/services";

function ProviderProfile() {

  const [city,setCity] = useState("");
  const [experienceYears,setExperienceYears] = useState("");
  const [pricePerHour,setPricePerHour] = useState("");

  const [selectedServices,setSelectedServices] = useState([]);

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");

  // Load provider profile
  useEffect(() => {

    api.get("/api/provider/me")
      .then(res => {

        const p = res.data;

        setCity(p.city || "");
        setExperienceYears(p.experienceYears || "");
        setPricePerHour(p.pricePerHour || "");

        setSelectedServices(p.services || []);

      })
      .catch(() => {
        setMessage("Failed to load provider profile");
      });

  }, []);

  const toggleService = (service) => {

    setSelectedServices(prev => {

      if(prev.includes(service)){
        return prev.filter(s => s !== service);
      }

      return [...prev,service];

    });

  };

  const saveProfile = async () => {

    if(selectedServices.length === 0){
      setMessage("Please select at least one service");
      return;
    }

    try{

      setLoading(true);
      setMessage("");

      await api.put("/api/provider/me",{
        city,
        experienceYears,
        pricePerHour,
        services:selectedServices
      });

      setMessage("Profile updated successfully");

    }catch(err){

      setMessage(
        err.response?.data?.message || "Failed to update profile"
      );

    }finally{

      setLoading(false);

    }

  };

  return (

    <div style={{padding:"20px"}}>

      <h2>My Profile</h2>

      <h4>City</h4>

      <input
        value={city}
        onChange={(e)=>setCity(e.target.value)}
        placeholder="City"
      />

      <br/><br/>

      <h4>Experience (years)</h4>

      <input
        type="number"
        value={experienceYears}
        onChange={(e)=>setExperienceYears(e.target.value)}
      />

      <br/><br/>

      <h4>Price Per Hour</h4>

      <input
        type="number"
        value={pricePerHour}
        onChange={(e)=>setPricePerHour(e.target.value)}
      />

      <br/><br/>

      <h4>Services Offered</h4>

      {SERVICES.map(service => (

        <div key={service}>

          <label>

            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={()=>toggleService(service)}
            />

            {" "}
            {service.replace("_"," ")}

          </label>

        </div>

      ))}

      <br/>

      <button
        onClick={saveProfile}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && (
        <p style={{marginTop:"10px",color:"green"}}>
          {message}
        </p>
      )}

    </div>

  );

}

export default ProviderProfile;