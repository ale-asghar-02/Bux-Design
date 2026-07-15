import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import useQuote from "../../quote/hooks/useQuote";

const STATUS_OPTIONS = ["pending", "reviewed", "closed"];

const ClientQuotes = () => {
  const { user } = useContext(AuthContext);
  const { loading, quotes, handleGetAllQuotes, handleUpdateQuoteStatus, handleDeleteQuote } = useQuote();

  const [expandedId, setExpandedId] = useState(null);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const deleteModalCloseRef = useRef(null);

  useEffect(() => { handleGetAllQuotes() }, []);

  const toggleExpand = (id) => { setExpandedId((prev) => (prev === id ? null : id)) };
  const onStatusChange = (id, status) => { handleUpdateQuoteStatus(id, status) };
  const openDeleteModal = (quote) => { setQuoteToDelete(quote) };

  const confirmDelete = async () => {
    if (!quoteToDelete) return;
    const success = await handleDeleteQuote(quoteToDelete._id);
    if (success) {
      deleteModalCloseRef.current?.click();
      setQuoteToDelete(null);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Client Quotes</h2>
        <p>Review and manage incoming quote requests</p>
      </div>

      {loading && quotes.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-loader-2"></i>
          <p>Loading quotes...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-receipt-off"></i>
          <p>No quote requests yet.</p>
        </div>
      ) : (
        <div className="quotes-list">
          {quotes.map((quote) => (
            <div className="quote-card" key={quote._id}>
              <div
                className="quote-card-header"
                onClick={() => toggleExpand(quote._id)}
              >
                <div className="quote-card-main">
                  <h6>{quote.username}</h6>
                  <span className="quote-meta">
                    {quote.service} • {quote.budget}
                  </span>
                </div>
                <div className="quote-card-actions">
                  <span className={`status-badge status-${quote.status}`}>
                    {quote.status}
                  </span>
                  <i
                    className={`ti ti-chevron-down expand-icon ${expandedId === quote._id ? "is-open" : ""}`}
                  ></i>
                </div>
              </div>

              {expandedId === quote._id && (
                <div className="quote-card-body">
                  <p className="fw-medium">
                    Email : <span className="quote-message">{quote.email}</span>
                  </p>
                  <p className="fw-medium">
                    Submitted :{" "}
                    <span className="quote-message">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="quote-message">{quote.projectDescription}</p>

                  {user?.role === "admin" && (
                    <div className="quote-card-controls">
                      <select
                        value={quote.status}
                        onChange={(e) =>
                          onStatusChange(quote._id, e.target.value)
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>

                      <button
                        className="delete-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteQuoteModal"
                        onClick={() => openDeleteModal(quote)}
                      >
                        <i className="ti ti-trash"></i>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <div className="modal fade" id="deleteQuoteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Quote Request</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={deleteModalCloseRef}
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete the quote request from{" "}
                <strong>{quoteToDelete?.username}</strong>? This action cannot
                be undone.
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
                className="danger-btn"
                onClick={confirmDelete}
                disabled={loading}
              >
                <i className="ti ti-trash"></i>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ClientQuotes;