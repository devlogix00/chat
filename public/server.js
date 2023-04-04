const express = require('express');
const path = require('path');
const nfs = require('fs');
const cors = require('cors');
const multer = require("multer");
const upload = multer({dest: "uploads/"});
var type = upload.single('file');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8082;
const { initializeApp} = require('firebase/app');
const { getAuth } = require('firebase/auth');
const {  getDatabase,  onValue, set, remove} = require('firebase/database');
const fs = require('firebase-admin');
const { addDoc, collection, getFirestore, Timestamp, fromDate, orderBy, limit, onSnapshot, query, serverTimestamp, setDoc } = require('firebase/firestore');
const { ref, getStorage, uploadBytesResumable, getDownloadURL, uploadBytes, put } = require('firebase/storage');
const serviceAccount = 'bookme-e703b-firebase-adminsdk-9o2ea-483c8c300a.json';

app.use(express.static(__dirname));

const config = {
    apiKey: "AIzaSyACCbTDkIEWZ0XTms0YxXdjUfYFjKDOJQs",
    authDomain: "bookme-e703b.firebaseapp.com",
    databaseURL: "https://bookme-e703b-default-rtdb.firebaseio.com",
    projectId: "bookme-e703b",
    storageBucket: "bookme-e703b.appspot.com",
    messagingSenderId: "78612381866",
    appId: "1:78612381866:web:2fc12fd7d096aca3d190d3",
    measurementId: "G-9KLPH7L013"
};

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount),
    databaseURL: "https://bookme-e703b-default-rtdb.firebaseio.com",
  
});

const firebase = initializeApp(config);
const db = fs.firestore();
const database = getDatabase();

let uid;
const usersDb = db.collection('allMessages');
let timestamp = serverTimestamp();

const databaseRef = fs.database().ref('messages/');
databaseRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if(data != null){
    if(data.text != null){
        try{
            
            addDoc(collection(getFirestore(), 'allMessages'), {
              name: data.name,
              profilePicUrl: data.profilePicUrl,
              text: data.text,
              timestamp: timestamp
            });
            
        }
        catch(error){
            console.error('Error writing new message to Firebase Database', error);
        }
    } else if(data.imageUrl != null) {
        try{
              app.post("/fileUpload", upload.single('file'), 
                function uploadFiles(req, res){
                    
                    console.log(req.body);
                    
                    res.json({ message: "Successfully uploaded file" });

                    let uploads = './uploads/';
                    let filepath = path.join(uploads, req.file.filename);
                    console.log(filepath);
                    app.get('/', (req, res) => {
                        res.sendFile(filepath, { root: __dirname });
                    });

                    addDoc(collection(getFirestore(), 'allMessages'), {
                        name: data.name,
                        profilePicUrl: data.profilePicUrl,
                        imageUrl: filepath,
                        timestamp: timestamp
                      });
                      addDoc(collection(getFirestore(), 'imagePost'), {
                          name: data.name,
                          profilePicUrl: data.profilePicUrl,
                          imageUrl: filepath,
                          timestamp: timestamp
                        });
                    // 4 - Update the chat message placeholder with the image's URL
                    const updates = {};
                    updates['messages/imageUrl'] = filepath;
                    fs.database().ref().update(updates);

            }
              );

        }
        catch(error){
            console.error('Error writing new message to Firebase Database', error);
        }
    }
  }
  
});

let messages = [];
const recentMessageQuery = query(collection(getFirestore(), 'allMessages'), orderBy('timestamp', 'desc'), limit(12));
onSnapshot(recentMessageQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        if(change.type === 'removed') {
            //deleteMessage(change.doc.id);
            console.log('message removed');
        } else {
            var message = change.doc.data();
            messages.push(message);
            fs.database().ref('allMessages/').set(messages);
            //displayMessage(change.doc.id, message.timestamp, message.name, message.text, message.profilePicUrl, message.imageUrl);
        }
    })
});

// liam.set({
//     first: 'Liam',
//     last: 'Ragozzine',
//     address: '133 5th St., San Francisco, CA',
//     birthday: '05/13/1990',
//     age: '30'
//    });
//    usersDb.doc('vpeluso').set({
//     first: 'Vanessa',
//     last: 'Peluso',
//     address: '49 Main St., Tampa, FL',
//     birthday: '11/30/1977',
//     age: '47'
//    });
app.use(express.urlencoded({extended : true}));
app.use(express.json());


app.get('/', function(req, res){
    console.log(res);
    res.sendFile(path.join(__dirname, 'index.html'));
    res.sendFile(path.join(__dirname, 'main.css'));
});

app.post('/', (req,res) => {
    app.use(cors({
        'Allow-Access-Control-Origin': ['http://localhost:'+port, 'https://bookme-e703b.firebaseapp.com/', 'https://bookme-e703b.web.app/']
    }));
});

app.listen(port);
console.log('Server started at http://localhost:'+port);