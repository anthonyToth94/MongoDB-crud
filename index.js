const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config();


function mongoClient() {
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6x9nh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  return new MongoClient(uri, { useNewUrlParser: true });
}

//EJS Template Engine

//PUBLIC MAPPA
app.use(express.static("public"));
//GET  /
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//GET  /heroes
app.get("/heroes", function (req, res) {
  const client = mongoClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    // perform actions on the collection object
    const heroes = await collection.find().toArray();
    res.status(200).send(heroes);
    client.close();
  });
});

function getId(param) {
  try {
    return new ObjectId(param);
  } catch (err) {
    return "";
  }
}

//GET BY ID
app.get("/heroes/:id", function (req, res) {
  const id = getId(req.params.id);
  if (!id) {
    res.status(404);
    res.send({ error: "Invalid Id!" });
    return;
  }
  const client = mongoClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    // perform actions on the collection object
    const hero = await collection.findOne({ _id: id });
    if (!hero) {
      res.status(404);
      res.send({ error: "Hero is not found!" });
      return;
    }
    res.status(200).send(hero);
    client.close();
  });
});

//DELETE BY ID
app.delete("/heroes/:id", function (req, res) {
  const id = getId(req.params.id);
  if (!id) {
    res.status(404);
    res.send({ error: "Invalid Id!" });
    return;
  }
  const client = mongoClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    // perform actions on the collection object
    const hero = await collection.deleteOne({ _id: id });
    if (!hero.deletedCount) {
      res.status(404);
      res.send({ error: "Hero is not found!" });
      return;
    }
    res.status(200).send({ id: req.params.id });
    client.close();
  });
});

//UPDATE BY ID MIDDLEWARE
app.put("/heroes/:id", bodyParser.json(), function (req, res) {
  const id = getId(req.params.id);
  if (!id) {
    res.status(404);
    res.send({ error: "Invalid Id!" });
    return;
  }

  const updateHero = {
    name: req.body.name,
    dmg: req.body.dmg,
  };

  const client = mongoClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    // perform actions on the collection object
    const hero = await collection.findOneAndUpdate(
      { _id: id },
      { $set: updateHero },
      { returnOriginal: false }
    );
    if (!hero.ok) {
      res.status(404);
      res.send({ error: "Hero is not found!" });
      return;
    }
    res.status(200).send(hero.value);
    client.close();
  });
});

//CREATE BY ID MIDDLEWARE
app.post("/heroes", bodyParser.json(), function (req, res) {
  const newHero = {
    name: req.body.name,
    dmg: req.body.dmg,
    skills: [],
  };

  const client = mongoClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    // perform actions on the collection object
    const hero = await collection.insertOne(newHero);
    if (!hero.insertedCount) {
      res.status(404);
      res.send({ error: "Hero is not found!" });
      return;
    }
    res.status(200).send(newHero);
    client.close();
  });
});

app.listen(3000);

/*

























const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectID;
const path = require("path");

function getClient() {
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://anthonyToth94:disznokoton312@cluster0.6x9nh.mongodb.net/<dbname>?retryWrites=true&w=majority";
  return new MongoClient(uri, { useNewUrlParser: true });
}

app.use(express.static("public"));

//Website
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/heroes", function (req, res) {
  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    const heroes = await collection.find().toArray();
    res.send(heroes);
    client.close();
  });
});

function getId(raw) {
  try {
    return new ObjectId(raw);
  } catch (err) {
    return "";
  }
}

app.get("/heroes/:id", function (req, res) {
  const id = getId(req.params.id);
  if (!id) {
    res.send({ error: "invalid id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    const hero = await collection.findOne({ _id: id });
    if (!hero) {
      res.send({ error: "not found" });
      return;
    }
    res.send(hero);
    client.close();
  });
});

app.delete("/heroes/:id", function (req, res) {
  const id = getId(req.params.id);
  if (!id) {
    res.send({ error: "invalid id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    const result = await collection.deleteOne({ _id: id });
    if (!result.deletedCount) {
      res.send({ error: "not found" });
      return;
    }
    res.send({ id: req.params.id });
    client.close();
  });
});

const bodyParser = require("body-parser");

app.put("/heroes/:id", bodyParser.json(), function (req, res) {
  const updatedHero = {
    name: req.body.name,
    dmg: req.body.dmg,
  };

  const id = getId(req.params.id);
  if (!id) {
    res.status(404);
    res.send({ error: "invalid id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: updatedHero },
      { returnOriginal: false }
    );

    if (!result.ok) {
      res.send({ error: "not found" });
      return;
    }
    res.send(result.value);
    client.close();
  });
});

app.post("/heroes", bodyParser.json(), function (req, res) {
  const newHero = {
    name: req.body.name,
    dmg: req.body.dmg,
    skills: [],
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("hero_app").collection("heroes");
    const result = await collection.insertOne(newHero);
    if (!result.insertedCount) {
      res.send({ error: "insert error" });
      return;
    }

    res.send(newHero);
    client.close();
  });
});

app.listen(3000);
*/
