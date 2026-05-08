import { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, Loader2, AlertTriangle, X } from "lucide-react";

const REASONS = [
  { value: "Spam", label: "Spam", desc: "Irrelevant or promotional content" },
  { value: "Harassment", label: "Harassment", desc: "Targeting or bullying a user" },
  { value: "Inappropriate", label: "Inappropriate", desc: "Offensive or NSFW content" },
  { value: "Misinformation", label: "Misinformation", desc: "False or misleading information" },
  { value: "Other", label: "Other", desc: "Something else not listed above" },
];

const ReportModal = ({ open, onClose, onSubmit, contentType = "Post" }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ reason, description: description.trim() || undefined });
      // reset state on success
      setReason("");
      setDescription("");
      onClose();
    } catch (err) {
      // Handle duplicate report (409) with a friendly message
      if (err?.response?.status === 409 || err?.status === 409 || err?.statusCode === 409) {
        setError("You have already reported this. Please wait for it to be reviewed.");
      } else {
        const msg = err?.response?.data?.message || err?.data?.message || err?.message || "Failed to submit report";
        setError(msg === `Request failed with status code ${err?.response?.status}` ? "Something went wrong. Please try again." : msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setReason("");
    setDescription("");
    setError("");
    onClose();
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #fff8f0, #fff5eb)",
          padding: "24px 20px",
          borderRadius: "20px",
          boxShadow: "0 8px 48px rgba(251,146,60,0.25)",
          maxWidth: "400px",
          width: "calc(100vw - 32px)",
          border: "3px solid #fb923c",
          animation: "slideUp 0.3s ease-out",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            margin: "0 auto 12px",
            background: "linear-gradient(135deg, #fed7aa, #fdba74)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(251,146,60,0.3)",
          }}
        >
          <Flag size={22} style={{ color: "#ea580c" }} />
        </div>

        {/* Title */}
        <h2
          style={{
            color: "#0891b2",
            fontWeight: 800,
            fontSize: "1.1rem",
            textAlign: "center",
            margin: "0 0 4px 0",
          }}
        >
          Report {contentType}
        </h2>
        <p
          style={{
            color: "#64748b",
            textAlign: "center",
            fontSize: "0.875rem",
            marginBottom: "20px",
            fontWeight: 500,
          }}
        >
          Help us keep the community safe
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          >
            <AlertTriangle size={16} style={{ color: "#dc2626", flexShrink: 0 }} />
            <span style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {/* Reason selection */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#475569",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Reason for reporting
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {REASONS.map((r) => (
              <label
                key={r.value}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: reason === r.value ? "2px solid #fb923c" : "2px solid #e2e8f0",
                  background: reason === r.value ? "#fff7ed" : "#ffffff",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  style={{
                    marginTop: "3px",
                    accentColor: "#ea580c",
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#1e293b",
                      display: "block",
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    {r.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#475569",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Additional details{" "}
            <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Provide more context about why you're reporting this..."
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              fontSize: "0.875rem",
              resize: "vertical",
              fontFamily: "inherit",
              color: "#334155",
              background: "#ffffff",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#fb923c")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginTop: "4px",
            }}
          >
            {description.length}/1000
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSubmit}
            disabled={submitting || !reason}
            style={{
              flex: 1,
              padding: "14px 24px",
              background:
                submitting || !reason
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: submitting || !reason ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s",
              boxShadow:
                submitting || !reason ? "none" : "0 4px 16px rgba(249,115,22,0.3)",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flag size={18} />
                Submit Report
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "14px 24px",
              background: "white",
              color: "#475569",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReportModal;
