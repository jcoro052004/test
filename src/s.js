const express = require('express');

const admin = require('firebase-admin');

const cors = require('cors');

 

const serviceAccount = require('../../Scraping/key.json');

admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

  databaseURL: 'https://console.firebase.google.com/u/0/project/test-cf45a/firestore/data/',

});

 

const app = express();

const db = admin.firestore();

 

app.use(cors());

 

app.use(express.json());

 

app.get('/test', async (req, res) => {

  try {

    const collectionRef = db.collection('test');

    const snapshot = await collectionRef.get();

    const data = [];

    snapshot.forEach((doc) => {

      data.push({ id: doc.id, ...doc.data() });

    });

    res.json(data);

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: error.message });

  }

});

 

app.post('/test', async (req, res) => {

  try {

    const collectionRef = db.collection('test');

    const newCryptoData = req.body;

    const result = await collectionRef.add(newCryptoData);

    res.json({ id: result.id, ...newCryptoData });

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: error.message });

  }

});

 

app.get('/test/:id', async (req, res) => {

  const id = req.params.id;

 

  try {

    const docRef = db.collection('test').doc(id);

    const doc = await docRef.get();

 

    if (!doc.exists) {

      res.status(404).json({ error: 'Crypto not found' });

    } else {

      const cryptoData = { id: doc.id, ...doc.data() };

      res.json(cryptoData);

    }

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: error.message });

  }

});

 

app.delete('/test/:id', async (req, res) => {

  const idDelete = req.params.id;

 

  try {

    const docRef = db.collection('test').doc(idDelete);

    const doc = await docRef.get();

 

    if (!doc.exists) {

      res.status(404).json({ error: 'Crypto not found' });

    } else {

      await docRef.delete();

      res.json({ message: 'Crypto deleted successfully' });

    }

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: error.message });

  }

});

 

const port = process.env.PORT || 3000;

app.listen(port, () => {

  console.log(`Servidor Express escuchando en el puerto http://localhost:${port}/test`);

});