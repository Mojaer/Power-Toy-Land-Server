const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        const toyCollection = client.db('PowerToyLand').collection('Toys')
        const userToyCollection = client.db('PowerToyLand').collection('userToys')


        // all methods  to GET POST PUT Delete

        app.get('/toy', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })

        // get data for view details 
        app.get('/viewdetails/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);

            const quarry = { _id: new ObjectId(id) }
            // find the data from different data collections 

            const result1 = await userToyCollection.findOne(quarry);

            if (result1) {
                res.send(result1);
            }

            else {
                const result2 = await toyCollection.findOne(quarry);
                if (result2) {
                    res.send(result2);
                }
                else {
                    res.send({ error: true, message: 'data is not found' });
                }
            }
        })



        // get method to find all users toy 
        app.get('/allusertoys', async (req, res) => {
            const result = await userToyCollection.find().toArray();
            res.send(result);
        })

        //get method to find the specific user's toy collection
        app.get('/mytoys', async (req, res) => {
            const { email } = req.query;
            const quarry = { sellerEmail: email }
            const result = await userToyCollection.find(quarry).toArray()

            if (result) {
                res.send(result)
            }
        });


        //sorting data by price
        app.get('/sort/:num', async (req, res) => {
            const num = req.params.num;
            const result = await userToyCollection.find({}).sort({ price: num }).toArray();
            res.send(result);
        })



        // post method to add a new toy by user
        app.post('/addtoy', async (req, res) => {
            const userToy = req.body
            const result = await userToyCollection.insertOne(userToy)
            res.send(result)
        });



        // pathch to update the toy 
        app.patch('/toyupdate/:id', async (req, res) => {
            const toyUpdate = req.body
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    price: toyUpdate.price,
                    quantity: toyUpdate.quantity,
                    description: toyUpdate.description
                }
            }
            const result = await userToyCollection.updateOne(filter, update)
            res.send(result);
        })

        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await userToyCollection.deleteOne(query)
            res.send(result)
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