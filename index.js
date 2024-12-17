// Resolution Rate Chart
const resolutionRateChart = new Chart(
    document.getElementById('chart-options-example').getContext('2d'),
    {
        type: 'bar',
        data: {
            labels: ["Pending", "Resolved"], // X-axis labels for complaint status
            datasets: [{
                label: 'Number of Complaints',
                data: [650, 100], // Example data: pending vs resolved complaints
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // Light red
                    'rgba(54, 162, 235, 0.2)'  // Light blue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)', // Red border
                    'rgba(54, 162, 235, 1)'  // Blue border
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Complaint Status', // X-axis title
                        color: '#000'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Complaints', // Y-axis title
                        color: '#000'
                    },
                    beginAtZero: true
                }
            }
        }
    }
);

// Resolution Time Chart
const resolutionTimeChart = new Chart(
    document.getElementById('resolutionTimeChart').getContext('2d'),
    {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April'], // X-axis time labels
            datasets: [{
                label: 'Resolution Time (hrs)',
                data: [4.5, 3.2, 3.8, 2.9], // Example resolution times
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        color: '#000'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Time (hrs)',
                        color: '#000'
                    },
                    beginAtZero: true
                }
            }
        }
    }
);

// Complaint Trend Chart
const complaintTrendChart = new Chart(
    document.getElementById('complaintTrendChart').getContext('2d'),
    {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Example weeks
            datasets: [{
                label: 'Complaints Received',
                data: [100, 120, 80, 140], // Example data
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Weeks',
                        color: '#000'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Complaints',
                        color: '#000'
                    },
                    beginAtZero: true
                }
            }
        }
    }
);



document.addEventListener("DOMContentLoaded", () => {
    // Fetch the JSON data
    fetch("list_of_complaints.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load complaints data");
        }
        return response.json(); // Parse the JSON
      })
      .then(complaintsData => {
        // Initialize counters
        let totalComplaints = complaintsData.length;
        let pendingComplaints = complaintsData.filter(c => c.status === "Pending").length;
        let resolvedComplaints = complaintsData.filter(c => c.status === "Succeeded").length;
        let inprogressComplaints = complaintsData.filter(c => c.status === "In Progress").length;
        let cancledComaplaints = complaintsData.filter(c => c.status === "Canceled").length;

  
        // Update the DOM
        document.getElementById("totalComplaints").textContent = totalComplaints;
        document.getElementById("pendingComplaints").textContent = pendingComplaints;
        document.getElementById("resolvedComplaints").textContent = resolvedComplaints;
        document.getElementById("inprogressComplaints").textContent = pendingComplaints;
        document.getElementById("cancledComaplaints").textContent = cancledComaplaints;

      })
      .catch(error => {
        console.error("Error fetching or processing JSON data:", error);
      });
  });
  