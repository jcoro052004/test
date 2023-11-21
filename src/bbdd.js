const admin = require('firebase-admin');

const serviceAccount = require("../../Scraping/key.json");

const data = require("./coches2.json");

const collectionKey = "test";

admin.initializeApp({

    credential: admin.credential.cert(serviceAccount),

});

const firestore = admin.firestore();

const settings = { timestampsInSnapshots: true };

firestore.settings(settings);

if (data && (typeof data === "object")) {

    Object.keys(data).forEach(docKey => {

        firestore.collection(collectionKey).doc(docKey).set(data[docKey]).then((res) => {

            console.log("Document " + docKey + " successfully written!");

        }).catch((error) => {

            console.error("Error writing document: ", error);

        });

    });

}