const functions = require("firebase-functions");
const path = require("path");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
const fs = require("firebase-admin");
const serviceAccount="../bookme-e703b-firebase-adminsdk-9o2ea-483c8c300a.json";
const uploads = "../public/uploads/";
const cors = require("cors");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
  databaseURL: "https://bookme-e703b-default-rtdb.firebaseio.com",
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.fileUpload = functions.https.onRequest((req, res) => {
  upload.single("file");
  res.json({message: "Successfully uploaded file"});
  const filepath = path.join(uploads, req.file.filename);
  console.log(filepath);
  // 4 - Update the chat message placeholder with the image's URL

});

cors({
  "Allow-Access-Control-Origin": ["http://localhost:8082", "https://bookme-e703b.firebaseapp.com/", "https://bookme-e703b.web.app/", "https://us-central1-bookme-e703b.cloudfunctions.net/fileUpload"],
});
