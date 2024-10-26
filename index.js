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


    app.post('/add-tourist-spot', async (req, res) => {
      const newSpot = req.body;
      const result = await touristSpotsCollection.insertOne(newSpot);
      res.send(result);
    });


    app.get('/singleSpot/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await touristSpotsCollection.findOne({ _id: id });
      res.send(result);
    });

    app.get('/all-tourist-spot/:email', async (req, res) => {
      const email = req.params.email;
      const result = await touristSpotsCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });



    app.put('/updateSpot/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      console.log(id)
      const updateData = {
        $set: {
          imgURLs: req.body.imgURLs,
          touristSpotName: req.body.touristSpotName,
          countryName: req.body.countryName,
          location: req.body.location,
          shortDescription: req.body.shortDescription,
          seasonName: req.body.seasonName,
          avrCost: req.body.avrCost,
          travelTime: req.body.travelTime,
          totalVisitors: req.body.totalVisitors
        }
      };
      const result = await touristSpotsCollection.updateOne({ _id: id }, updateData);
      res.send(result);
    });

    app.delete('/deleteItem/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      const result = await touristSpotsCollection.deleteOne({ _id: id });
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
