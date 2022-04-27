const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dplns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("volunteers").collection("volunteer");
    console.log("Volunteer connected")
    // perform actions on the collection object
    // client.close();
});

async function run() {
    try {
        await client.connect()
        const volunteerCollection = client.db("volunteers").collection("volunteer");
        const registerCollection = client.db('volunteers').collection("registers")
        app.get("/volunteer", async (req, res) => {
            const query = {}
            const cursor = volunteerCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/volunteer/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await volunteerCollection.findOne(query)
            res.send(result)
        })
        app.post('/registered', async (req, res) => {
            const user = req.body;
            const result = await registerCollection.insertOne(user)
            res.send(result)
        })

    }
    finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("volunteer is on fire")
})

app.listen(port, () => {
    console.log("Vounteer is running now", port)
})