import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePortfolio from "../../portfolio/hooks/usePortfolio";
import useAuth from "../../auth/hooks/useAuth";

const FIELDS = ["Website", "Mobile-app", "Featured"];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PortfolioManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, portfolio, portfolios, handleGetAllPortfolios, handleGetAllMyPortfolios, handleUpdatePortfolio, handleDeletePortfolio} = usePortfolio();
 
  const [modalMode, setModalMode] = useState("edit");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit form states
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("Website");
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const modalCloseRef = useRef(null);
  const deleteModalCloseRef = useRef(null);

  useEffect(() => {
    handleGetAllMyPortfolios();
    handleGetAllPortfolios();
  }, []);

  const openEditModal = (item) => {
    setSelectedPortfolio(item);
    setTitle(item.title);
    setSubTitle(item.subTitle);
    setDescription(item.description);
    setField(item.field);
    setExistingImages(item.images || []);
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const openDeleteModal = (item) => { setDeleteTarget(item) };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("field", field);
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => formData.append("images", img));

    const success = await handleUpdatePortfolio(
      selectedPortfolio._id,
      formData,
    );
    if (success) {
      modalCloseRef.current?.click();
      handleGetAllMyPortfolios();
      handleGetAllPortfolios();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await handleDeletePortfolio(deleteTarget._id);
    if (success) {
      deleteModalCloseRef.current?.click();
      setDeleteTarget(null);
      handleGetAllMyPortfolios();
      handleGetAllPortfolios();
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Portfolio</h2>
          <p>Showcase your best work</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === "admin" && (
            <button
              className="create-btn"
              style={{ background: "var(--secondary, #6c757d)" }}
              data-bs-toggle="modal"
              data-bs-target="#viewMemberPortfoliosModal"
            >
              <i className="ti ti-users"></i>
              View Member Portfolios
            </button>
          )}
          <button
            className="create-btn"
            onClick={() => navigate("/user/create/portfolio")}
          >
            <i className="ti ti-plus"></i>
            New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading portfolios...</p>
        </div>
      ) : portfolio.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-briefcase-off"></i>
          <p>No portfolio items yet. Add your first project.</p>
        </div>
      ) : (
        <div className="card-grid">
          {portfolio.map((item) => (
            <div className="content-card" key={item._id}>
              <div className="content-card-image">
                <img
                  src={
                    item.images?.[0] || "https://via.placeholder.com/400x250"
                  }
                  alt={item.title}
                />
              </div>
              <div className="content-card-body">
                <span className="content-card-category">{item.field}</span>
                <h6>{item.title}</h6>
                <p>{item.description}</p>
                <span className="content-card-date">
                  <span>By Bux Designs -</span>
                  {(() => {
                    const date = new Date(item.createdAt);
                    const day = date.getDate();
                    const month = date.toLocaleDateString("en-US", {
                      month: "long",
                    });
                    const year = date.getFullYear();
                    return `${day} ${month}, ${year}`;
                  })()}
                </span>
              </div>
              <div className="content-card-actions">
                <button
                  className="icon-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#portfolioModal"
                  onClick={() => openEditModal(item)}
                  title="Edit"
                >
                  <i className="ti ti-pencil"></i>
                </button>
                <button
                  className="icon-btn icon-btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deletePortfolioModal"
                  onClick={() => openDeleteModal(item)}
                  title="Delete"
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <div className="modal fade" id="portfolioModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Project</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={modalCloseRef}
              ></button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-body">
                {existingImages.length > 0 && (
                  <div className="form-group">
                    <label>Current Images</label>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {existingImages.map((src, index) => (
                        <div
                          key={index}
                          className="position-relative"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <img
                            src={src}
                            alt={`existing-${index}`}
                            className="rounded-2 object-fit-cover w-100 h-100"
                            style={{ border: "1px solid #eee" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="position-absolute top-0 end-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "20px",
                              height: "20px",
                              background: "#ff4d4f",
                              color: "#fff",
                              fontSize: "11px",
                              transform: "translate(30%, -30%)",
                            }}
                          >
                            <i className="ti ti-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Add More Images</label>
                  <div
                    className="border rounded-3 p-3 text-center"
                    style={{
                      borderStyle: "dashed",
                      cursor: "pointer",
                      background: "rgba(0,0,0,0.01)",
                    }}
                    onClick={() =>
                      document.getElementById("newImageInput").click()
                    }
                  >
                    <i
                      className="ti ti-photo-up"
                      style={{ fontSize: "22px", opacity: 0.4 }}
                    ></i>
                    <p
                      className="mb-0 mt-1 text-secondary"
                      style={{ fontSize: "13px" }}
                    >
                      Click to upload
                    </p>
                    <input
                      type="file"
                      id="newImageInput"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  {newImagePreviews.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {newImagePreviews.map((src, index) => (
                        <div
                          key={index}
                          className="position-relative"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <img
                            src={src}
                            alt={`new-${index}`}
                            className="rounded-2 object-fit-cover w-100 h-100"
                            style={{ border: "1px solid #eee" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="position-absolute top-0 end-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "20px",
                              height: "20px",
                              background: "#ff4d4f",
                              color: "#fff",
                              fontSize: "11px",
                              transform: "translate(30%, -30%)",
                            }}
                          >
                            <i className="ti ti-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <div className="d-flex gap-2 flex-wrap mt-1">
                    {FIELDS.map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setField(f)}
                        className="px-3 py-2 rounded-3 border fw-medium"
                        style={{
                          fontSize: "13px",
                          background: field === f ? "#000" : "transparent",
                          color: field === f ? "#fff" : "inherit",
                          transition: "all 0.2s",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="d-flex justify-content-between">
                    <label>Subtitle</label>
                    <span
                      className="text-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      {subTitle.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    maxLength={30}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="d-flex justify-content-between">
                    <label>Title</label>
                    <span
                      className="text-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      {title.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="d-flex justify-content-between">
                    <label>Description</label>
                    <span
                      className={
                        description.length >= 380
                          ? "text-danger"
                          : "text-secondary"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {description.length}/400
                    </span>
                  </div>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={400}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View Member Portfolios Modal */}
      <div className="modal fade" id="viewMemberPortfoliosModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">All Member Portfolios</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive scrollbar-hide border rounded-3">
                <table className="table tm-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="fw-medium">Image</th>
                      <th className="fw-medium">Owner</th>
                      <th className="fw-medium">Email</th>
                      <th className="fw-medium">Title</th>
                      <th className="fw-medium text-center">Date</th>
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
                    ) : portfolios.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No portfolios found.
                        </td>
                      </tr>
                    ) : (
                      portfolios.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <img
                              src={
                                item.images?.[0] ||
                                "https://via.placeholder.com/60x60"
                              }
                              alt={item.title}
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          </td>
                          <td>
                            {item.owner?.name || item.owner?.username || "N/A"}
                          </td>
                          <td>{item.owner?.email || "N/A"}</td>
                          <td>{item.title}</td>
                          <td className="text-center">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center">
                              <button
                                className="icon-btn icon-btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#deletePortfolioModal"
                                onClick={() => openDeleteModal(item)}
                                title="Delete"
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
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <div className="modal fade" id="deletePortfolioModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Project</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={deleteModalCloseRef}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>"{deleteTarget?.title}"</strong>
                {deleteTarget?.owner && (
                  <>
                    {" "}
                    by{" "}
                    <strong>
                      {deleteTarget?.owner?.name ||
                        deleteTarget?.owner?.username}
                    </strong>
                  </>
                )}
                ? This action cannot be undone.
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
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PortfolioManager;