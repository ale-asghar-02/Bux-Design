import React, { useState, useRef, useEffect } from "react";
import useBlog from "../../blog/hooks/useBlog";
import useAuth from "../../auth/hooks/useAuth";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BlogsManager = () => {
  const { user } = useAuth();
  const { loading, blog, blogs, handleCreateBlog, handleGetAllBlogs, handleGetAllMyBlogs, handleUpdateBlog, handleDeleteBlog } = useBlog();

  const [title, setTitle] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const modalCloseRef = useRef(null);
  const deleteModalCloseRef = useRef(null);

  useEffect(() => {
    handleGetAllBlogs();
    handleGetAllMyBlogs();
  }, []);

  const openCreateModal = () => {
    setTitle("");
    setBlogImage(null);
    setImagePreview("");
    setSelectedBlog(null);
    setModalMode("create");
  };

  const openEditModal = (blog) => {
    setTitle(blog.title);
    setBlogImage(null);
    setImagePreview(blog.blogImage?.[0]?.url || blog.coverImage || "");
    setSelectedBlog(blog);
    setModalMode("edit");
  };

  const openDeleteModal = (blog) => { setSelectedBlog(blog) };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (blogImage) formData.append("blogImage", blogImage);

    let success;
    if (modalMode === "create") {
      success = await handleCreateBlog(formData);
    } else {
      success = await handleUpdateBlog(selectedBlog._id, formData);
    }

    if (success) {
      modalCloseRef.current?.click();
      handleGetAllMyBlogs();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlog) return;
    const success = await handleDeleteBlog(selectedBlog._id);
    if (success) {
      deleteModalCloseRef.current?.click();
      handleGetAllBlogs();
      handleGetAllMyBlogs();
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Blogs</h2>
          <p>Create and manage your portfolio blog posts</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === "admin" && (
            <button
              className="create-btn"
              style={{ background: "var(--secondary, #6c757d)" }}
              data-bs-toggle="modal"
              data-bs-target="#viewMemberBlogsModal"
              onClick={blogs}
            >
              <i className="ti ti-users"></i>
              View Member Blogs
            </button>
          )}
          <button
            className="create-btn"
            data-bs-toggle="modal"
            data-bs-target="#blogModal"
            onClick={openCreateModal}
          >
            <i className="ti ti-plus"></i>
            New Blog
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading blogs...</p>
        </div>
      ) : blog.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-article-off"></i>
          <p>No blogs yet. Create your first post.</p>
        </div>
      ) : (
        <div className="card-grid">
          {blog.map((blog) => (
            <div className="content-card" key={blog._id}>
              <div className="content-card-image">
                <img
                  src={blog.blogImage || "https://via.placeholder.com/400x250"}
                  alt={blog.title}
                />
              </div>
              <div className="content-card-body">
                <h6 className="lh-2 mb-0">{blog.title}</h6>
                <span className="content-card-date">
                  By Bux Designs -
                  {(() => {
                    const date = new Date(blog.createdAt);
                    const day = date.getDate();
                    const month = date.toLocaleDateString("en-GB", {
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
                  data-bs-target="#blogModal"
                  onClick={() => openEditModal(blog)}
                  title="Edit"
                >
                  <i className="ti ti-pencil"></i>
                </button>
                <button
                  className="icon-btn icon-btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => openDeleteModal(blog)}
                  title="Delete"
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <div className="modal fade" id="blogModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalMode === "create" ? "Create New Blog" : "Update Blog"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={modalCloseRef}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label
                    htmlFor="title"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Title
                    <small
                      style={{
                        color: title.length >= 80 ? "#e74c3c" : "#888",
                        fontWeight: "normal",
                      }}
                    >
                      {title.length}/80
                    </small>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      if (e.target.value.length <= 80) {
                        setTitle(e.target.value);
                      }
                    }}
                    placeholder="Enter blog title"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="blogImage">Cover Image</label>
                  <input
                    type="file"
                    id="blogImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        borderRadius: "8px",
                        maxHeight: "180px",
                        objectFit: "cover",
                      }}
                    />
                  )}
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
                  {loading
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Create Blog"
                      : "Update Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View Member Blogs Modal */}
      <div className="modal fade" id="viewMemberBlogsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">All Member Blogs</h5>
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
                    ) : blogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No blogs found.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((blog) => (
                        <tr key={blog._id}>
                          <td>
                            <img
                              src={
                                blog.blogImage ||
                                "https://via.placeholder.com/60x60"
                              }
                              alt={blog.title}
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          </td>
                          <td>
                            {blog.owner?.name || blog.owner?.username || "N/A"}
                          </td>
                          <td>{blog.owner?.email || "N/A"}</td>
                          <td>{blog.title}</td>
                          <td className="text-center">
                            {formatDate(blog.createdAt)}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center">
                              <button
                                className="icon-btn icon-btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                                onClick={() => openDeleteModal(blog)}
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

      {/* Unified Delete Confirm Modal - handles both "own" and "member" blog deletion */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Blog</h5>
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
                <strong>"{selectedBlog?.title}"</strong>
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

export default BlogsManager;