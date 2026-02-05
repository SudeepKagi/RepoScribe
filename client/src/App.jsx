import { useEffect, useState } from 'react';
import axios from 'axios';
import { Github, Layout, BookOpen, ArrowRight } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Check Login Status
  useEffect(() => {
    axios.get('/api/user')
      .then(res => {
        if (res.data) {
          setUser(res.data);
          fetchRepos(); // If logged in, fetch repos immediately
        }
      })
      .catch(() => console.log("Not logged in"));
  }, []);

  
  // 2. Function to Fetch Repos
  const fetchRepos = () => {
    setLoading(true);
    axios.get('/api/repos')
      .then(res => {
        setRepos(res.data);
      })
      .catch(err => console.error("Repo fetch error:", err))
      .finally(() => setLoading(false));
  };

  const activateRepo = (repoName) => {
  axios.post('/api/activate', { repoName })
    .then(() => alert(` processing started for ${repoName}!`))
    .catch(err => console.error(err));
  };

  const login = () => window.location.href = "http://localhost:3000/auth/github";

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px", fontFamily: "sans-serif", color: "#e1e4e8" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px", borderBottom: "1px solid #30363d", paddingBottom: "20px" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.5rem" }}>
          <Layout color="#58a6ff" /> RepoScribe
        </h1>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#21262d", padding: "8px 16px", borderRadius: "20px" }}>
             <img src={user.avatarUrl || "https://github.com/github.png"} alt="Profile" style={{ width: "32px", borderRadius: "50%" }} />
             <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{user.username}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      {!user ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Automate your Documentation</h2>
          <p style={{ color: "#8b949e", fontSize: "1.2rem", marginBottom: "40px" }}>
            Connect your repository and let AI write your README.md in seconds.
          </p>
          <button onClick={login} style={{ padding: "14px 28px", fontSize: "16px", background: "#238636", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
            <Github size={20} /> Connect with GitHub
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <BookOpen size={20} color="#8b949e" /> Your Repositories
          </h3>
          
          {loading ? (
            <p>Loading repositories...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {repos.map(repo => (
                <div key={repo.id} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "6px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ margin: "0 0 10px 0", color: "#58a6ff" }}>{repo.name}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#8b949e", margin: 0, height: "40px", overflow: "hidden" }}>
                      {repo.description || "No description provided."}
                    </p>
                  </div>
                  <button 
                    style={{ marginTop: "20px", padding: "8px", width: "100%", background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9", borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "0.2s" }}
                    onClick={() => activateRepo(repo.name)}
                  >
                    Activate Scribe <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;