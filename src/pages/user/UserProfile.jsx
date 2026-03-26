import { useState, useEffect } from "react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import api from "../../api/axios";

function UserProfile() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: ""
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROFILE FROM BACKEND
  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 SAVE PROFILE TO BACKEND
  const saveProfile = async () => {
    try {
      await api.put("/api/users/profile", user);

      setEditing(false);
      alert("Profile updated successfully ✅");

    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile ❌");
    }
  };

  if (loading) {
    return (
      <Container>
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          My Profile 👤
        </h2>
        <p className="text-gray-500 text-sm">
          Manage your personal details
        </p>
      </div>

      {/* PROFILE CARD */}
      <Card className="max-w-xl mx-auto p-6">

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-6">

          <div className="
            w-20 h-20 rounded-full
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white text-2xl font-bold
            flex items-center justify-center
            shadow-md
          ">
            {user.name?.charAt(0) || "U"}
          </div>

          <p className="mt-3 font-medium text-gray-700">
            {user.name}
          </p>

        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              name="email"
              value={user.email}
              disabled
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Add phone number"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-sm text-gray-500">City</label>
            <input
              name="city"
              value={user.city || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Add city"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>
            {/* ADDRESS */}
            <div>
            <label className="text-sm text-gray-500">Address</label>
            <textarea
                name="address"
                value={user.address || ""}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Add your full address"
                rows={3}
                className="
                w-full mt-1 px-3 py-2 border rounded-lg
                focus:ring-2 focus:ring-blue-500 outline-none
                disabled:bg-gray-100
                resize-none
                "
            />
            </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-between">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="
                  px-5 py-2 rounded-lg text-white font-medium
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  hover:scale-[1.03] active:scale-[0.97]
                  transition-all
                "
              >
                Save Changes
              </button>
            </>
          )}

        </div>

      </Card>

    </Container>
  );
}

export default UserProfile;