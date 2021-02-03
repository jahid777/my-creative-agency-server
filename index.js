const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const fileUpload = require('express-fileupload');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7adfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('customers'));
app.use(fileUpload());



const port = 5000;

app.get("/", (req, res) => {
  res.send("it is working");
});


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const courseCollection = client.db("creativeAgency").collection("courseInfo");
  const reviewCollection = client.db("creativeAgency").collection("review");
  
  //order components a click kore with out pic a rakha hoise
  // app.post('/addCourse',(req,res)=> {
  //     const courseData = req.body;
  //     courseCollection.insertOne(courseData)
  //     .then(result =>{
  //         res.send(result.insertedCount)
  //     })
  // })



  /////order ar data + servicecard ar data + loggiedInUser ar data +picture sob akhne create kora hoise//////////////
    app.post('/addACustomer',(req, res)=>{
      const file = req.files.file;
      const gmailName= req.body.gmailName;
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
      
      courseCollection.insertOne({ file,gmailName,photoURL,email,id,img,description,title,inputName,inputDescription,price, inputEmail })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
      file.mv(`${__dirname}/customers/${file.name}`,err =>{
        if(err){
          console.log(err)
          return res.status(500).send({msg:"can not upload"});
        }
        return res.send({name: file.name, path: `/${file.name}`})
      })
    })

  //order list a read korte
  app.get('/getOrderCard',(req, res)=>{
    courseCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });


  //feedBackData page a order ar input theke pic ta show korate
  app.get('/getOrderPic',(req, res)=>{
    courseCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });


  //review data
  app.post('/addReview',(req,res)=> {
    const reviewData = req.body;
    reviewCollection.insertOne(reviewData)
    .then(result =>{
        res.send(result.insertedCount)
    })
})

  //feedback read
  app.get('/feedBackCard',(req, res)=>{
    reviewCollection.find({}).limit(3)
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });









});


app.listen(process.env.PORT || port);