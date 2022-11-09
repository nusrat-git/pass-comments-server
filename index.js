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

    const servicesDataBase = client.db('passComments').collection('services');
    const reviewsDatabase = client.db('passComments').collection('reviews');
    const usersDatabase = client.db('passComments').collection('users');

    app.get('/home', async (req, res) => {

      const query = {};
      const cursor = servicesDataBase.find(query).sort({ _id: -1 }).limit(3);
      const services = await cursor.toArray();
      res.send(services);

    })

    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await servicesDataBase.insertOne(service);
      service.id = result.insertedId;

      res.send(service);

    })


    app.get('/services', async (req, res) => {

      const query = {};
      const cursor = servicesDataBase.find(query);
      const allServices = await cursor.toArray();
      res.send(allServices);

    })

    app.get('/details/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const details = await servicesDataBase.findOne(query);
      res.send(details);

    })

    app.get('/reviews', async (req, res) => {

      const query = {};
      const cursor = reviewsDatabase.find(query);
      const allReviews = await cursor.toArray();
      res.send(allReviews);

    })


    app.get('/reviews/:id', async (req, res) => {

      const id = req.params.id;
      const query = { service_id: id };
      const cursor = reviewsDatabase.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);

    })


    app.post('/users', async (req, res) => {

      const user = req.body;
      const result = await usersDatabase.insertOne(user);
      user.id = result.insertedId;

      res.send(user);
    })

    app.get('/users', async (req, res) => {

      const query = {};
      const cursor = usersDatabase.find(query);
      const users = await cursor.toArray();
      res.send(users);

    })

  }
  finally {


  }

}

run().catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Server running on ${port}`)
})