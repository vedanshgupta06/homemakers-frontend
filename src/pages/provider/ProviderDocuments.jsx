import { useState } from "react";
import api from "../../api/axios";

function ProviderDocuments(){

  const [idProof,setIdProof] = useState(null);
  const [addressProof,setAddressProof] = useState(null);

  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  const uploadDocuments = async () => {

    if(!idProof || !addressProof){
      setMessage("Please upload both documents");
      return;
    }

    try{

      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("idProof",idProof);
      formData.append("addressProof",addressProof);

      await api.post("/api/provider/me/documents",formData);

      setMessage("Documents uploaded successfully");

    }catch(err){

      setMessage("Upload failed");

    }finally{

      setLoading(false);

    }

  };

  return(

    <div style={{padding:"30px"}}>

      <h2>Upload Verification Documents</h2>

      <h4>ID Proof</h4>

      <input
        type="file"
        onChange={(e)=>setIdProof(e.target.files[0])}
      />

      <br/><br/>

      <h4>Address Proof</h4>

      <input
        type="file"
        onChange={(e)=>setAddressProof(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={uploadDocuments} disabled={loading}>
        {loading ? "Uploading..." : "Upload Documents"}
      </button>

      {message && <p>{message}</p>}

    </div>

  );

}

export default ProviderDocuments;