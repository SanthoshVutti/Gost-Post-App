import { useState } from "react";
import axios from "axios";
import "./SecretForm.css";
const API_BASE = "https://gost-post-app-1.onrender.com"||"http://localhost:5000";
const SecretForm = ({ onNewSecret }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("random");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setError("Please enter a secret.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    console.log("Posting secret...", { text, category });

    try {
      const response = await axios.post(`${API_BASE}/api/secrets`, {
        text,
        category,
      });
      console.log("Post response:", response);
      onNewSecret(response.data);
      setText("");
      setSuccess("Secret posted!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error posting secret:", err);
      let msg = "Failed to post secret.";
      if (err.response) {
        // Server responded with a status code
        const serverMsg = err.response.data && (err.response.data.message || err.response.data.error);
        msg = `Server ${err.response.status}: ${serverMsg || err.response.statusText}`;
      } else if (err.request) {
        // Request made but no response
        msg = "No response from server. Is the backend running?";
      } else {
        // Something else happened
        msg = err.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="secret-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="what's your secret?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="3"
        aria-label="secret-text"
      ></textarea>

      <div className="form-footer">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="secret-category"
        >
          <option value="random">Random</option>
          <option value="confession">Confession</option>
          <option value="work">Work</option>
          <option value="relationship">Relationship</option>
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Secret"}
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", marginTop: "0.5rem" }}>{error}</p>}
      {success && <p style={{ color: "#16a34a", marginTop: "0.5rem" }}>{success}</p>}
    </form>
  );
};

export default SecretForm;
