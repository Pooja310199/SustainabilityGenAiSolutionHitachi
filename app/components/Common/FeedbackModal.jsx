import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const options = [
  "Overall risk calculation is incorrect",
  "Risk level is incorrect (RED / ORANGE / GREEN wrong)",
  "Information is outdated",
  "Details are irrelevant",
  "Other/explain more about the issue",
];

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [selected, setSelected] = useState([]);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");

  // ✅ FIX: Hook INSIDE component + controlled by isOpen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ AFTER hooks
  if (!isOpen) return null;

  const toggle = (opt) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const handleSubmit = () => {
    onSubmit(selected, comment, email);
    setSelected([]);
    setComment("");
    setEmail("");
  };

  return createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Submit Feedback</h3>
          <span style={styles.close} onClick={onClose}>
            ✕
          </span>
        </div>

        <p style={styles.subtitle}>
          Your feedback will improve this experience. Why wasn’t this response
          helpful?
        </p>

        {/* Checkboxes */}
        <div style={styles.checkboxContainer}>
          {options.map((opt) => (
            <label key={opt} style={styles.checkboxRow}>
              <input type="checkbox" onChange={() => toggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {/* Textarea */}
        {selected.includes("Other/explain more about the issue") && (
          <textarea
            placeholder="Describe your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.textarea}
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Your email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* Buttons */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{
              ...styles.submitBtn,
              opacity: selected.length === 0 ? 0.6 : 1,
            }}
            disabled={selected.length === 0}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body, // ✅ REQUIRED
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "420px",
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
  },
  close: {
    cursor: "pointer",
    fontSize: "18px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginTop: "5px",
    marginBottom: "15px",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    marginTop: "12px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    minHeight: "70px",
  },
  input: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    background: "#e60023",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default FeedbackModal;
