const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
   "mongodb+srv://mahfuz:uH5ZpdgMjhrcobUK@cluster0.xggde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      await client.connect();
      console.log("Successfully connected");
      const database = client.db("chillGamerDB");
      const reviewsCollection = database.collection("reviewsCollection");
      const watchListCollection = database.collection("watchListCollection");
      app.get("/", (req, res) => {
         res.send("Hey mutter");
      });
      app.get("/reviews", async (req, res) => {
         const result = (await reviewsCollection.find().toArray()) || [];
         res.send(result);
      });
      app.get("/my-reviews/user/:user", async (req, res) => {
         const userMail = req.params.user;
         const query = { userEmail: userMail };
         const result = (await reviewsCollection.find(query).toArray()) || [];
         res.send(result);
      });
      app.post("/reviews", async (req, res) => {
         const newReview = req.body;
         const result = await reviewsCollection.insertOne(newReview);
         res.send(result);
      });
      app.get("/review/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await reviewsCollection.findOne(query);
         res.send(result);
      });
      app.patch("/review/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const updatedData = { $set: req.body };
         const result = await reviewsCollection.updateOne(query, updatedData);
         res.send(result);
      });
      app.delete("/review/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await reviewsCollection.deleteOne(query);
         res.send(result);
      });
      // app.get("/watchList", async (req, res) => {
      //    const result = (await watchListCollection.find().toArray()) || [];
      //    res.send(result);
      // });
      app.get("/watchList/:user", async (req, res) => {
         const userMail = req.params.user;
         const query = { userEmail: userMail };
         const result = (await watchListCollection.find(query).toArray()) || [];
         res.send(result);
      });
      app.post("/watchList", async (req, res) => {
         const newReview = req.body;
         const result = await watchListCollection.insertOne(newReview);
         res.send(result);
      });
   } catch (error) {
      console.error(error);
   }
}
run();

app.listen(port, () => console.log(`Example app listening on port ${port}`));
