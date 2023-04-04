const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8083;
const firebase = require('firebase/app');
//const { ref, getDatabase,  onValue, set, remove} = require('firebase/database');
const { getAuth } = require('firebase/auth');
const fs = require('firebase-admin');
const { addDoc, collection, getFirestore, Timestamp, fromDate, orderBy, limit, onSnapshot, query, serverTimestamp } = require('firebase/firestore');
const {ref, getStorage, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const serviceAccount = '/Users/maamenyarko/Desktop/test/bookme-e703b-firebase-adminsdk-9o2ea-483c8c300a.json';

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

firebase.initializeApp(config);

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});
const db = fs.firestore();
const usersDb = db.collection('imagePost');
let timestamp = serverTimestamp();

let messages = [];
const recentMessageQuery = query(collection(getFirestore(), 'imagePost'), orderBy('timestamp', 'desc'), limit(12));
onSnapshot(recentMessageQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        if(change.type === 'removed') {
            //deleteMessage(change.doc.id);
            console.log('message removed');
        } else {
            // 2 - Upload the image to Cloud Storage.
            //const filePath = `${getAuth().lastNotifiedUid}/${data.imageUrl}`;
            //const newImageRef = ref(getStorage(), filePath);
            //const fileSnapshot = uploadBytesResumable(newImageRef, file);

            // 3 - Generate a public URL for the file
            //const publicImageUrl = getDownloadURL(db.collection('imagePost'));
            //updates['messages/imageUrl'] = publicImageUrl;
            //update(sRef(db), updates);
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

app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
    res.sendFile(path.join(__dirname, 'main.css'));
});
app.post('/', (req,res) => {
    app.use(cors({
        'Allow-Access-Control-Origin': 'http://localhost:'+port,
    }));
});

app.listen(port);
console.log('Server started at http://localhost:'+port);