import React, { useEffect, useState } from "react";
import CreateMap from "./CreateMap";

function App() {
  const [trees, setTrees] = useState([]);
  const [selectedFile, setSelectedFile] = useState("graph.json");
  const jsonFiles = [
    "graph.json",
    "graph2.json",
    "graph3.json"
  ];

  useEffect(() => {
  fetch(`map_data/${selectedFile}`)
    .then(res => res.text()) // read as text first
    .then(text => {
      console.log("Raw JSON text:", text);
      return JSON.parse(text); // parse manually
    })
    .then(data => {setTrees(data)})
    .catch(err => console.error("Failed to load graph.json", err));
  }, [selectedFile]);

  return (
    <div className="app-background">
      <div className="central-strip">
        <h2>Map of Transformer XX</h2>
        <div className="simple-text">
          <p>
          Below is a map representation of the transformer file in graph.json.
          For now, it is a file called 'graph.json' in the map_data folder, but later I'll fix this
          </p>
          <p>
            Select a file (transformer) to load to view the nodes:
          </p>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            {jsonFiles.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
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
