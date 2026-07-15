import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../hooks/useDashboard";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TeamMembers = () => {
  const navigate = useNavigate();
  const { loading, members, handleGetAllMembers, handleAdminDeleteMember } = useDashboard();

  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteModalCloseRef = useRef(null);

  useEffect(() => { handleGetAllMembers() }, []);

  const openDeleteModal = (member) => setSelectedMember(member);

  const handleDelete = async () => {
    if (!selectedMember) return;
    const memberIdToDelete = selectedMember._id;

    setDeleteLoading(true);
    try {
      const success = await handleAdminDeleteMember(memberIdToDelete);
      if (success) {
        deleteModalCloseRef.current?.click();
        setSelectedMember(null);
        handleGetAllMembers();
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2>Team Members</h2>
          <p className="mb-0">Manage all registered members on the platform</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-secondary border border-secondary fw-normal p-2">Total Members: {members.length}</span>
            <button
              className="badge border border-secondary fw-normal p-2"
              style={{ background: "var(--secondary, #6c757d)" }}
              onClick={()=> { navigate('/register') }}
            >
              <i className="ti ti-users me-2"></i>
              Add Member
            </button>
        </div>
      </div>

      <div className="table-responsive scrollbar-hide border rounded-3">
        <table className="table tm-table align-middle mb-0">
          <thead>
            <tr>
              <th className="fw-medium">Username</th>
              <th className="fw-medium">Email</th>
              <th className="fw-medium text-center">Created At</th>
              <th className="fw-medium text-center">Total Blogs</th>
              <th className="fw-medium text-center">Total Portfolio</th>
              <th className="fw-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No team members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id}>
                  <td>
                    {member.username}{" "}
                    {member.role === "admin" && (
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-1 fw-normal ms-1">
                        Admin
                      </span>
                    )}
                  </td>
                  <td>{member.email}</td>
                  <td className="text-center">{formatDate(member.createdAt)}</td>
                  <td className="text-center">{member.totalBlogs ?? member.blogCount ?? 0}</td>
                  <td className="text-center">{member.totalPortfolio ?? member.portfolioCount ?? 0}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <button
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteMemberModal"
                        disabled={member.role === "admin"}
                        onClick={() => openDeleteModal(member)}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      <div className="modal fade" id="deleteMemberModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete User</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={deleteModalCloseRef}
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete{" "}
                <strong>{selectedMember?.username}</strong>'s account? This
                action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="save-btn"
                style={{ background: "var(--danger, #e74c3c)" }}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeamMembers;