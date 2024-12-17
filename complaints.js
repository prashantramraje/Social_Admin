// Global variable to store complaints data
let complaintsData = [];

// Function to fetch and render complaints data
async function renderComplaints() {
  try {
    // Fetch the JSON data from a local file (ensure the path is correct)
    const response = await fetch('list_of_complaints.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON data
    complaintsData = await response.json();

    // Get the table body element where rows will be inserted
    const complaintsTable = document.getElementById("complaints-table");
    complaintsTable.innerHTML = "";  // Clear existing rows before rendering new data

    // Loop through each complaint and create table rows dynamically
    complaintsData.forEach((complaint, index) => {
      const row = document.createElement("tr");

      // Sr. No. Column
      const srNoCell = document.createElement("td");
      srNoCell.textContent = index + 1; // Serial number is index + 1
      row.appendChild(srNoCell);

      // Complaint Type Column
      const complaintTypeCell = document.createElement("td");
      complaintTypeCell.textContent = complaint.complaintType || "N/A";
      row.appendChild(complaintTypeCell);

      // Address Column
      const addressCell = document.createElement("td");
      addressCell.textContent = complaint.address || "N/A";
      row.appendChild(addressCell);

      // Landmark Column
      const landmarkCell = document.createElement("td");
      landmarkCell.textContent = complaint.landmark || "N/A";
      row.appendChild(landmarkCell);

      // Status Column
      const statusCell = document.createElement("td");
      statusCell.textContent = complaint.status || "N/A";
      row.appendChild(statusCell);

      // Phone Column
      const phoneCell = document.createElement("td");
      phoneCell.textContent = complaint.phone === "Hidden" ? "Anonymous" : complaint.phone || "N/A";
      row.appendChild(phoneCell);

      // Timestamp Column
      const timestampCell = document.createElement("td");
      timestampCell.textContent = complaint.timestamp || "N/A";
      row.appendChild(timestampCell);

      // Append the new row to the table
      complaintsTable.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching complaints data:', error);
  }
}

// Handle form submission
document.getElementById('complaint-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const srno = document.getElementById('srno').value;
  const status = document.getElementById('status').value;
  const description = document.getElementById('description').value;
  const complaintPhotos = document.getElementById('complaint-photos').files;

  // Find the complaint based on SR No.
  const complaint = complaintsData.find(c => c.srno == srno);

  if (complaint) {
    // Update the complaint status
    complaint.status = status;

    // Optionally add description and handle photos
    complaint.description = description;
    complaint.photos = Array.from(complaintPhotos).map(file => file.name); // Store photo file names

    // Render the updated complaints table
    renderComplaints();

    // Clear form fields after submission
    document.getElementById('srno').value = '';
    document.getElementById('description').value = '';
    document.getElementById('complaint-photos').value = '';

    alert('Complaint status updated successfully!');
  } else {
    alert('Complaint with that SR No. not found!');
  }
});

// Call renderComplaints when the page loads
window.onload = renderComplaints;

// ============================================

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files like the HTML page

// File path to your JSON
const jsonFilePath = path.join(__dirname, "list_of_complaints.json");

// Endpoint to handle complaint updates
app.post("/update-complaint", (req, res) => {
  const { srno, photos, description, status } = req.body;

  // Read existing complaints from JSON file
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).json({ success: false, message: "Server error while reading data." });
    }

    let complaints = JSON.parse(data);

    // Find the complaint with the given SR number
    const complaintIndex = complaints.findIndex(complaint => complaint.srno === srno);

    if (complaintIndex === -1) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Update the complaint
    complaints[complaintIndex] = {
      ...complaints[complaintIndex],
      photos: photos || complaints[complaintIndex].photos,
      description: description || complaints[complaintIndex].description,
      status: status || complaints[complaintIndex].status
    };

    // Write updated data back to the file
    fs.writeFile(jsonFilePath, JSON.stringify(complaints, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing to JSON file:", err);
        return res.status(500).json({ success: false, message: "Server error while updating data." });
      }

      res.json({ success: true, message: "Complaint updated successfully." });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
