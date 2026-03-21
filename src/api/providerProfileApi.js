import api from "./axios";

export const getProviderProfile = () => {
  return api.get("/api/provider/me");
};

export const updateProviderProfile = (data) => {
  return api.put("/api/provider/me", data);
};

export const uploadProviderPhoto = (file) => {

  const formData = new FormData();
  formData.append("file", file);

  return api.post("/api/provider/me/photo", formData);
};

export const uploadProviderDocuments = (idProof, addressProof) => {

  const formData = new FormData();

  formData.append("idProof", idProof);
  formData.append("addressProof", addressProof);

  return api.post("/api/provider/me/documents", formData);
};