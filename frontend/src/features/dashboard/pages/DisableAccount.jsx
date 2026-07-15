import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../hooks/useDashboard";

const DisableAccount = () => {
  const navigate = useNavigate();
  const { user, loading, handleAccountToggleStatus, handleUserDeleteAccount } =
    useDashboard();

  const [confirmText, setConfirmText] = useState("");

  const deleteModalCloseRef = useRef(null);

  const isAdmin = user?.role === "admin";

  // Admin ko "disable" type karna hai, user ko "delete"
  const requiredWord = isAdmin ? "disable" : "delete";
  const isConfirmed = confirmText.trim().toLowerCase() === requiredWord;

  const openDeleteModal = () => setConfirmText("");

  const handleToggle = async () => {
    if (user?.isActive && !isConfirmed) return;
    await handleAccountToggleStatus();
    setConfirmText("");
  };

  const handleDelete = async () => {
    if (!isConfirmed) return;
    const success = await handleUserDeleteAccount();
    if (success) {
      deleteModalCloseRef.current?.click();
      setConfirmText("");
      navigate("/");
    }
  };

  return (
    <div className="dashboard-section">
      {isAdmin ? (
        <div className="admin-disable-account">
          <div className="section-header">
            <h2>{user?.isActive ? "Disable Account" : "Account Disabled"}</h2>
            <p>Temporarily deactivate your portfolio dashboard access</p>
          </div>

          <div className="danger-zone">
            <div className="danger-zone-info">
              <i
                className={`ti ${user?.isActive ? "ti-alert-triangle" : "ti-circle-check text-success"}`}
              ></i>
              <div>
                <h6>
                  {user?.isActive
                    ? "This will disable your account"
                    : "Your account is currently disabled"}
                </h6>
                <p>
                  {user?.isActive
                    ? "Your portfolio will be hidden from public view and quote requests will be disabled. Your data will not be deleted."
                    : "Click the button below to reactivate your account and resume normal operations."}
                </p>
              </div>
            </div>

            <div className="danger-zone-confirm">
              {user?.isActive ? (
                <>
                  <label htmlFor="confirmDisable">
                    Type <strong>disable</strong> to confirm
                  </label>
                  <input
                    type="text"
                    id="confirmDisable"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="disable"
                  />
                  <button
                    className="danger-btn"
                    disabled={!isConfirmed || loading}
                    onClick={handleToggle}
                  >
                    <i className="ti ti-user-off"></i>
                    {loading ? "Processing..." : "Disable My Account"}
                  </button>
                </>
              ) : (
                <button
                  className="success-btn"
                  disabled={loading}
                  onClick={handleToggle}
                >
                  <i className="ti ti-user-check"></i>
                  {loading ? "Processing..." : "Activate My Account"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="user-delete-account">
          <div className="section-header">
            <h2>Delete Account</h2>
            <p>Permanently delete your account and all associated data</p>
          </div>

          <div className="danger-zone">
            <div className="danger-zone-info">
              <i className="ti ti-alert-triangle"></i>
              <div>
                <h6>This action cannot be undone</h6>
                <p>
                  Deleting your account will permanently remove your profile,
                  data, and access. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="danger-zone-confirm">
              <button
                className="danger-btn"
                data-bs-toggle="modal"
                data-bs-target="#deleteAccountModal"
                onClick={openDeleteModal}
                disabled={loading}
              >
                <i className="ti ti-trash"></i>
                Delete My Account
              </button>
            </div>
          </div>

          {/* Delete Confirm Modal */}
          <div className="modal fade" id="deleteAccountModal" tabIndex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteAccountModalLabel">
                    Confirm Account Deletion
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={deleteModalCloseRef}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-danger fw-semibold mb-2">
                    <i className="ti ti-alert-triangle me-1"></i>
                    This action cannot be undone.
                  </p>
                  <p>
                    Deleting your account will permanently remove your profile,
                    data, and access. Please type <strong>delete</strong> below
                    to confirm.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    id="confirmDelete"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="delete"
                    autoFocus
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={!isConfirmed || loading}
                    onClick={handleDelete}
                  >
                    <i className="ti ti-trash"></i>{" "}
                    {loading ? "Processing..." : "Delete My Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisableAccount;