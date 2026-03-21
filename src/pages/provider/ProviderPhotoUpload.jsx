import { useState } from "react";
import api from "../../api/axios";

function ProviderPhotoUpload() {

  const [file,setFile] = useState(null);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  const uploadPhoto = async () => {

    if(!file){
      setMessage("Please select a photo");
      return;
    }

    try{

      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file",file);

      await api.post("/api/provider/me/photo",formData);

      setMessage("Photo uploaded successfully");

    }catch(err){

      setMessage("Upload failed");

    }finally{

      setLoading(false);

    }

  };

  return (

    <div style={{padding:"30px"}}>

      <h2>Upload Profile Photo</h2>

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={uploadPhoto} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}

    </div>

  );

}

export default ProviderPhotoUpload;