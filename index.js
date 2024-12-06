try {
   require("dotenv").config();
} catch (error) {
   console.error("Module not found:", error.message);
}
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xggde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

      // home route to test API
      app.get("/", (req, res) => {
         res.send("Hallo Bruder, wie geht's?");
      });

      // get all reviews
      app.get("/reviews", async (req, res) => {
         const result = (await reviewsCollection.find().toArray()) || [];
         res.send(result);
      });

      // post review
      app.post("/reviews", async (req, res) => {
         const newReview = req.body;
         const result = await reviewsCollection.insertOne(newReview);
         res.send(result);
      });

      // get all reviews that has rating 5
      app.get("/top-rated-ever", async (req, res) => {
         const result =
            (await reviewsCollection
               .find({ rating: 5 }, { limit: 6 })
               .toArray()) || [];
         res.send(result);
      });

      // get all my reviews based on loged in user
      app.get("/my-reviews/user/:user", async (req, res) => {
         const userMail = req.params.user;
         const result =
            (await reviewsCollection.find({ userEmail: userMail }).toArray()) ||
            [];
         res.send(result);
      });

      // get a specific review details based on id
      app.get("/review/:id", async (req, res) => {
         const id = req.params.id;
         const result = await reviewsCollection.findOne({
            _id: new ObjectId(id),
         });
         res.send(result);
      });

      // Uopdate specific review
      app.patch("/review/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const updatedData = { $set: req.body };
         const result = await reviewsCollection.updateOne(query, updatedData);
         res.send(result);
      });

      // Delete specific review
      app.delete("/review/:id", async (req, res) => {
         const id = req.params.id;
         const result = await reviewsCollection.deleteOne({
            _id: new ObjectId(id),
         });
         res.send(result);
      });

      // get all my watchlist based on loged in user
      app.get("/watchList/:user", async (req, res) => {
         const userMail = req.params.user;
         const result =
            (await watchListCollection.find({ mail: userMail }).toArray()) ||
            [];
         res.send(result);
      });

      // post to my watchlist
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
