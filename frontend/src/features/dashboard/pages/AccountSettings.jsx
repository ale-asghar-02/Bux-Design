import { useState, useEffect } from "react";
import useDashboard from "../hooks/useDashboard";
import useAuth from "../../auth/hooks/useAuth"
import defaultUserImage from "../../../assets/images/default.jpg";

const AccountSettings = () => {
  const { user, loading, handleUpdateProfile, } = useDashboard();
  const { handleLogoutAll } = useAuth();

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultUserImage);
  const [linkedIn, setLinkedIn] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [behance, setBehance] = useState("");
  const [pinterest, setPinterest] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPreviewImage(user.userImage || defaultUserImage);
      setLinkedIn(user.linkedIn || "");
      setDribbble(user.dribbble || "");
      setBehance(user.behance || "");
      setPinterest(user.pinterest || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setUserImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("username", username);
    profileData.append("linkedIn", linkedIn);
    profileData.append("dribbble", dribbble);
    profileData.append("behance", behance);
    profileData.append("pinterest", pinterest);
    if (userImage) {
      profileData.append("userImage", userImage);
    }

    await handleUpdateProfile(profileData);
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Account Settings</h2>
        <p>Update your profile details and social links</p>
      </div>

      <form className="account-settings-form" onSubmit={handleSubmit}>
        <div className="avatar-upload-row">
          <img src={previewImage} alt="Profile" className="avatar-preview" />
          <label htmlFor="userImage" className="avatar-upload-label">
            <i className="ti ti-camera"></i>
            <span>Change Photo</span>
            <input
              type="file"
              id="userImage"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailAddress">
              Email Address{" "}
              <span className="field-hint">( Email cannot be changed )</span>
            </label>
            <input
              type="email"
              id="emailAddress"
              value={user?.email || ""}
              disabled
              readOnly
            />
          </div>
        </div>

        <h6 className="form-subheading">Social Links</h6>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="linkedIn">
              <i className="ti ti-brand-linkedin"></i> LinkedIn
            </label>
            <input
              type="url"
              id="linkedIn"
              value={linkedIn}
              onChange={(e) => {
                setLinkedIn(e.target.value);
              }}
              placeholder="Add link"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dribbble">
              <i className="ti ti-brand-dribbble"></i> Dribbble
            </label>
            <input
              type="url"
              id="dribbble"
              value={dribbble}
              onChange={(e) => {
                setDribbble(e.target.value);
              }}
              placeholder="Add link"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="behance">
              <i className="ti ti-brand-behance"></i> Behance
            </label>
            <input
              type="url"
              id="behance"
              value={behance}
              onChange={(e) => {
                setBehance(e.target.value);
              }}
              placeholder="Add link"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pinterest">
              <i className="ti ti-brand-pinterest"></i> Pinterest
            </label>
            <input
              type="url"
              id="pinterest"
              value={pinterest}
              onChange={(e) => {
                setPinterest(e.target.value);
              }}
              placeholder="Add link"
            />
          </div>
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="save-btn" disabled={loading}>
            <i className="ti ti-device-floppy"></i>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button onClick={()=> { handleLogoutAll() }} type="button" className="danger-btn" disabled={loading}>
            <i className="ti ti-logout-2"></i>
            {loading ? "Loading..." : "Logout All Devices"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;