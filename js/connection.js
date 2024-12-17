const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = 3000;

// Function to fetch all complaints and user details
async function fetchAllComplaints() {
  try {
    // Fetch all user documents
    const usersSnapshot = await db.collection('users').get();
    let allData = [];

    if (usersSnapshot.empty) {
      console.log('No users found.');
      return [];
    }

    // Iterate through each user document
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data(); // Fetch user details

      // Reference the "complaints" subcollection for each user
      const complaintsRef = db.collection('users').doc(userId).collection('complaints');
      const complaintsSnapshot = await complaintsRef.get();

      if (!complaintsSnapshot.empty) {
        // Store user and complaint data
        complaintsSnapshot.forEach((complaintDoc) => {
          allData.push({
            userId,
            userData,
            complaintId: complaintDoc.id,
            complaintData: complaintDoc.data(),
          });
        });
      }
    }

    return allData;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
}

// Route to display complaints on the webpage
app.get('/', async (req, res) => {
  const complaintsData = await fetchAllComplaints();
  
  if (complaintsData.length === 0) {
    res.send('<h1>No complaints found.</h1>');
  } else {
    let htmlContent = '<h1>Complaints Data</h1>';
    complaintsData.forEach((data) => {
      htmlContent += `
        <h2>User ID: ${data.userId}</h2>
        <p>User Data: ${JSON.stringify(data.userData)}</p>
        <h3>Complaint ID: ${data.complaintId}</h3>
        <p>Complaint Data: ${JSON.stringify(data.complaintData)}</p>
        <hr>
      `;
    });
    res.send(htmlContent);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
