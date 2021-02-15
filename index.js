const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const fileUpload = require("express-fileupload");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7adfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("customers"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("it is working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const courseCollection = client.db("creativeAgency").collection("courseInfo");

  const reviewCollection = client.db("creativeAgency").collection("review");

  const addServiceCollection = client.db("creativeAgency").collection("customerService");

  const adminCollection = client.db("creativeAgency").collection("admin");

  const statusCollection = client.db("creativeAgency").collection("status");

  
  //order components a click kore with out pic a rakha hoise
  // app.post('/addCourse',(req,res)=> {
  //     const courseData = req.body;
  //     courseCollection.insertOne(courseData)
  //     .then(result =>{
  //         res.send(result.insertedCount)
  //     })
  // })

  /////order ar data + servicecard ar data + loggiedInUser ar data +picture sob akhne create kora hoise//////////////
  app.post("/addACustomer", (req, res) => {
    const file = req.files.file;
    const gmailName = req.body.gmailName;
    const inputName = req.body.inputName;
    const email = req.body.email;
    const inputEmail = req.body.inputEmail;
    const photoURL = req.body.photoURL;
    const id = req.body.id;
    const img = req.body.img;
    const description = req.body.description;
    const inputDescription = req.body.inputDescription;
    const title = req.body.title;
    const price = req.body.price;
    // console.log(file,gmailName,photoURL,email,id,img,description,title,inputName,inputDescription,price, inputEmail);

    courseCollection
      .insertOne({
        file,
        gmailName,
        photoURL,
        email,
        id,
        img,
        description,
        title,
        inputName,
        inputDescription,
        price,
        inputEmail,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
    file.mv(`${__dirname}/customers/${file.name}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "can not upload" });
      }
      return res.send({ name: file.name, path: `/${file.name}` });
    });
  });

  //order list a read korte
  app.get("/getOrderCard", (req, res) => {
    courseCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //feedBackData page a order ar input theke pic ta show korate
  app.get("/getOrderPic", (req, res) => {
    courseCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //review data
  app.post("/addReview", (req, res) => {
    const reviewData = req.body;
    reviewCollection.insertOne(reviewData).then((result) => {
      res.send(result.insertedCount);
    });
  });

  //feedback read
  app.get("/feedBackCard", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //customerService adding addService components
  app.post("/addACustomerService", (req, res) => {
    const file = req.files.file;
    const title = req.body.addTitle;
    const description = req.body.addDescription;
    const newImg = file.data;
    const encImg = newImg.toString("base64");
  
    var addImage = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    addServiceCollection.insertOne({ title,description,addImage}).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //new service add read korte newService Component a
  app.get("/newService", (req, res) => {
    addServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  
  app.post("/admin", (req, res) => {
    const adminData = req.body;
    adminCollection.insertOne(adminData)
    .then((result) => {
      res.send(result.insertedCount);
    });
  });

  //chck admin to show sidebar data
  // app.post("/isAdminData", (req, res) => {
  //   const email = req.body.email;
  //   adminCollection.find({email: email})
  //    .toArray((err, admin))
  //    res.send(admin.length > 0)
  //   });

  //for showing status 
  app.post("/statusData", (req, res) => {
    const statusInfo = req.body;
    statusCollection.insertOne(statusInfo).then((result) => {
      res.send(result.insertedCount);
    });
  });

  




});

app.listen(process.env.PORT || port);
