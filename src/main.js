import * as d3 from "https://cdn.skypack.dev/d3@7";
import './style.css';

const textarea = document.getElementById('json-input');
const buildBtn = document.getElementById('build-btn');
const fileInput = document.getElementById('json-file');

// Ensure the SVG exists
let svg = d3.select("#tree-svg");
if (svg.empty()) {
  svg = d3.select("#tree-container")
          .append("svg")
          .attr("id", "tree-svg")
          .attr("width", 800)
          .attr("height", 600);
}

// Clear SVG and build tree
function buildTree(nodes) {
  svg.selectAll("*").remove(); // clear previous tree

  // Convert array to map
  const nodeMap = {};
  nodes.forEach(node => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  // Build tree
  let root = null;
  nodes.forEach(node => {
    if (!node.prev_nodes || node.prev_nodes.length === 0) {
      root = nodeMap[node.id];
    } else {
      node.prev_nodes.forEach(parentId => {
        if (nodeMap[parentId]) {
          nodeMap[parentId].children.push(nodeMap[node.id]);
        }
      });
    }
  });

  if (!root) {
    alert('No root node found (node with empty prev_nodes).');
    return;
  }

  // Render tree
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const g = svg.append("g").attr("transform", "translate(50,50)");

  const treeLayout = d3.tree().size([width - 100, height - 100]);
  const rootHierarchy = d3.hierarchy(root);
  treeLayout(rootHierarchy);

  // Links
  g.selectAll(".link")
    .data(rootHierarchy.links())
    .enter()
    .append("line")
    .classed("link", true)
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  // Nodes
  const nodeGroup = g.selectAll(".node")
    .data(rootHierarchy.descendants())
    .enter()
    .append("g")
    .classed("node", true)
    .attr("transform", d => `translate(${d.x},${d.y})`);

  nodeGroup.append("circle").attr("r", 20);
  nodeGroup.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(d => d.data.id.slice(0, 6));
}

// Load JSON from file input
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    textarea.value = e.target.result;
  };
  reader.readAsText(file);
});

async function loadDefaultJSON() {
  if (!textarea.value.trim()) {
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'treebrunton.json');
      const text = await response.text();
      textarea.value = text;
      buildTree(JSON.parse(text)); // auto-build on load
    } catch (e) {
      console.error('Failed to load default JSON:', e);
    }
  } else {
    buildTree(JSON.parse(textarea.value));
  }
}

loadDefaultJSON();

// Build button
buildBtn.addEventListener('click', () => {
  try {
    const nodes = JSON.parse(textarea.value);
    buildTree(nodes);
  } catch (e) {
    alert('Invalid JSON: ' + e.message);
  }
});
const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
  if (svg) {
    svg.selectAll("*").remove();  // remove all nodes and links
    textarea.value = "";  // optional: clear JSON input
  }
});