const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5010;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017"; // MongoDB URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const touristSpotsCollection = client.db('furry_travel').collection('touristSpots');


    //  all tourist spots
    app.get('/tourist-spot', async (req, res) => {
      const result = await touristSpotsCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // You can uncomment the following line if you want to close the client after running
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Furry Travel server is running');
});

app.listen(port, () => {
  console.log(`Furry Travel server is running on port: ${port}`);
});
