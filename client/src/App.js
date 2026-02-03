import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import SecretForm from "./SecretForm"; // <-- add this import

function App() {
  const [secrets, setSecrets] = useState([]);
  const [likingId, setLikingId] = useState(null);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const response = await axios.get("/api/secrets");
        setSecrets(response.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchSecrets();
  }, []);

  // handler to add newly posted secret to the top of the feed
  const handleNewSecret = (newSecret) => {
    setSecrets((prev) => [newSecret, ...prev]);
  };

  // handler to like a secret
  const handleLike = async (id) => {
    try {
      setLikingId(id);
      const res = await axios.put(`/api/secrets/${id}/like`);
      // update the secret in state with the response
      setSecrets((prev) => prev.map((s) => (s._id === id ? res.data : s)));
    } catch (err) {
      console.error("Like error:", err);
      // optional: show an error toast or console message
    } finally {
      setLikingId(null);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><span className="emoji">💀</span> <span className="title">GHOST POST</span><span className="emoji">💀</span></h1>
        <p>Drop your Thoughts anonymously</p>
      </header> 

      {/* Render the form and wire the onNewSecret handler */}
      <SecretForm onNewSecret={handleNewSecret} />

      <div className="secrets-feed">
        {secrets.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>
            No secrets yet...
          </p>
        ) : (
          secrets.map((secret) => (
            <div key={secret._id} className="secret-card">
              <div className="card-header">
                <span className="category-tag">{secret.category}</span>
                <span className="timestamp">
                  {formatDistanceToNow(new Date(secret.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="secret-text">{secret.text}</p>

              <button
                className="like-btn"
                onClick={() => handleLike(secret._id)}
                disabled={likingId === secret._id}
                aria-label={`like-${secret._id}`}
              >
                {likingId === secret._id ? "Liking..." : `👍 ${secret.likes} Likes`}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default App;