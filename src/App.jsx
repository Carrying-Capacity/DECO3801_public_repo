import React, { useEffect, useState } from "react";
import CreateMap from "./CreateMap";

function App() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [customJson, setCustomJson] = useState("");
  const jsonFiles = [
    "custom",
    "tx1.json",
    "tx4.json",
    "tx10.json",
    "tx16.json"
  ];

  useEffect(() => {
    if (!selectedFile) {
      setTrees([]);
      setLoading(false)
      return;
    }

    if (selectedFile === "custom") {
      try {
        const data = JSON.parse((customJson || "[]").trim());
        setTrees(data);
      } catch (err) {
        console.error("Invalid JSON string", err);
        setTrees([]);
      }
      setLoading(false);
      return;
    }
    setLoading(true); // start loading
    fetch(`map_data/${selectedFile}`)  
      .then(res => res.text()) // read as text first
      .then(text => {
        // console.log("Raw JSON text:", text);
        return JSON.parse(text); // parse manually
      })
      .then(data => {setTrees(data)})
      .catch(err => console.error("Failed to load graph.json", err))
      .finally(() => setLoading(false)); // end loading
  }, [selectedFile]);
  
  const handleUpdate = () => {
    try {
      const data = JSON.parse(customJson || "[]");
      setTrees(data);
      setLoading(false);
      console.log('successfully loaded JSON')
    } catch (err) {
      console.error("Invalid JSON string");
      alert("Invalid JSON! Please fix the syntax.");
      setTrees([]);
    }
  };

  return (
    <div className="app-background">
      <div className="central-strip">
        <h2>Carrying Capacity's Transformer Mapper</h2>
        <div className="simple-text">
          <p>
          Below is a map representation of the transformer file. For now the data is bullshit but that's not my job.
          Blue lines represent the connected houses.
          </p>
          <p>
            Select a file (transformer) to load to view the abstract map representation of the transformer:
          </p>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >          
            <option value="">No file Selected</option>
            {jsonFiles.map((file) => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
          {selectedFile === "custom" && (
            <div style={{marginTop:"1rem"}}>
              <textarea
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                placeholder="Paste your JSON string here"
                rows={5}
                style={{ width: "100%", marginTop: "1rem" }}
              />
              <button onClick={handleUpdate} style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                Update Map
              </button>
            </div>
          )}
        {/* Show loading indicator */}
        </div>
        {loading && <div className="loading-overlay">Loading map...</div>}
        <CreateMap trees={trees} />

        <div className="simple-text">
          <p>
          Do some yapping about how the transformer function works by using Chow Liu and brunton spaghetti code
          How does the algorithm actually work, do some explanation on how things are
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

// {/* Perhaps it's actually possible to make a MST using pure leaflet. */}
// {/* I'll attempt this today */}
