import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (e) {
      setResponse({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  const page = {
    padding: 24,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: "#ECECEC",
    background: "#222225",
    minHeight: "100vh",
  };
  const textarea = {
    width: "100%",
    minHeight: 110,
    fontSize: 15,
    padding: 12,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#161616",
    color: "#fff",
    boxSizing: "border-box",
  };
  const button = {
    marginTop: 14,
    padding: "12px 20px",
    borderRadius: 12,
    background: "#111111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
    fontSize: 18,
  };
  const heading = { fontSize: 28, marginTop: 30, marginBottom: 12, color: "#fff" };

  const preStyle = {
    background: "#f6f7f8",
    color: "#111",
    padding: 14,
    whiteSpace: "pre-wrap",
    borderRadius: 6,
    lineHeight: 1.5,
    boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
    overflowX: "auto",
    WebkitTextFillColor: "#111",
  };

  return (
    <div style={page}>
      <h1 style={{ fontSize: 56, margin: 0, color: "#fff" }}>AI Aggregator — MVP</h1>

      <div style={{ marginTop: 18 }}>
        <textarea
          style={textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question here..."
        />
      </div>

      <div>
        <button onClick={ask} style={button} disabled={loading || !prompt.trim()}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {response && (
        <div style={{ marginTop: 20 }}>
          <h2 style={heading}>Best answer (aggregated)</h2>
          <pre style={preStyle}>
            {response.best ? JSON.stringify(response.best, null, 2) : response.error || "No best answer"}
          </pre>

          <h2 style={heading}>All provider answers</h2>
          <pre style={preStyle}>{response.all ? JSON.stringify(response.all, null, 2) : ""}</pre>
        </div>
      )}
    </div>
  );
}
