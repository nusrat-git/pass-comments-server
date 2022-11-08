const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

require('dotenv').config();


app.get('/', (req, res) => {
  res.send('Pass comments server running')
})


const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.rydkcco.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {

    const dataBase = client.db('passComments').collection('services');

    app.get('/home', async (req, res) => {

      const query = {};
      const cursor = dataBase.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);

    })

    app.get('/services', async (req, res) => {

      const query = {};
      const cursor = dataBase.find(query);
      const AllServices = await cursor.toArray();
      res.send(AllServices);

    })

    app.get('/details/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const details = await dataBase.findOne(query);
      res.send(details);

    })

  }
  finally {


  }

}

run().catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Server running on ${port}`)
})