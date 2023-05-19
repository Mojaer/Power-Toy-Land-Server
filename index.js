const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_ACC}:${process.env.DB_PASS}@cluster0.8odccbh.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toyCollection = client.db('PowerToyLand').collection('Toys')
        const userToyCollection = client.db('PowerToyLand').collection('userToys')


        // all methods  to GET POST PUT Delete

        app.get('/toy', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })

        // post method to add a new toy by user

        app.post('/addtoy', async (req, res) => {
            const userToy = req.body
            const result = await userToyCollection.insertOne(userToy)
            res.send(result)
        });

        // get method to find all users toy 
        app.get('/allusertoys', async (req, res) => {
            const result = await userToyCollection.find().toArray();
            res.send(result);
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running');
})

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});