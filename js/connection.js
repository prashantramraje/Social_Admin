const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin SDK initialized successfully.");

// Reference to Firestore
const db = admin.firestore();

// Function to fetch complaints and user details dynamically for all users
async function fetchAllComplaints() {
  try {
    // Step 1: Fetch all user documents
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      console.log("No users found.");
      return;
    }

    console.log("Fetching complaints for all users...\n");

    // Step 2: Iterate through each user document
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data(); // Fetch user details
      console.log(`User ID: ${userId}`);
      console.log("User Data:", userData); // Log user details

      // Step 3: Reference the "complaints" subcollection for each user
      const complaintsRef = db
        .collection("users")
        .doc(userId)
        .collection("complaints");
      const complaintsSnapshot = await complaintsRef.get();

      if (complaintsSnapshot.empty) {
        console.log("  No complaints found for this user.\n");
        continue;
      }

      // Step 4: Iterate through all complaint documents
      complaintsSnapshot.forEach((complaintDoc) => {
        console.log(`  Complaint ID: ${complaintDoc.id}`);
        console.log("  Data:", complaintDoc.data(), "\n");
      });

      console.log("------------------------------------\n");
    }
  } catch (error) {
    console.error("Error fetching complaints:", error);
  }
}

// Run the function
fetchAllComplaints();
