const express = require('express');
const {readFileSync} = require('fs');
const handlebars = require('handlebars');
const browserify = require("browserify");
const { connect } = require("http2");
const mysql = require("mysql");
const { waitForDebugger } = require('inspector');
var bodyParser = require('body-parser');
const req = require('express/lib/request');

const app = express();
app.use(bodyParser.json());
// Serve the files in /assets at the URI /assets.
app.use('/assets', express.static('assets'));

// The HTML content is produced by rendering a handlebars template.
// The template values are stored in global state for reuse.
const data = {
  service: process.env.K_SERVICE || '???',
  revision: process.env.K_REVISION || '???',
  maybe: "no",
};
let template;

const con = mysql.createConnection({
  host: "34.159.166.233",
  user: "root",
  password: "k4j4mnzswek",
  port: "3306",
  database: "MyDB",
});

con.connect(function(err) {
  if (err) throw err;
});

//const bob = {message:"Hello"}
app.get('/search', async (_,res) =>{
console.log("Search")
res.send(bob)
})

app.get('/toplists', async (_,res) =>{
  
  
    con.query("SELECT * FROM FavoriteTable where UserID = 'Mathias'", function (err, result, fields) {
      if (err) throw err;
     //console.log(result);
      res.send(result)
    });
 
  
})

app.get('/getComment/:movie_id', async (req,res) =>{
  
  console.log("!!!!!!!!!!!!!!!!!:" + req.params.movie_id)
  
  con.query("SELECT * FROM comments where movie_id = " + "'" + req.params.movie_id+ "'", function (err, result, fields) {
    if (err) throw err;
   //console.log(result);
    res.send(result)
  }); 


})

app.post('/addComment', async (req, res)=>{
  const resp = {message:"Post successful"}
  
  console.log("Responce: "+req.body.user_id +" "+ req.body.movie_id+" "+ req.body.comment)

  var sql = "INSERT INTO comments (user_id, movie_id,  comment) VALUES (" + "'" + req.body.user_id +"'" + ","+"'" + req.body.movie_id +"'" + ","+ "'" + req.body.comment + "'" + ")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  
  
  res.status(201)
  res.send(resp)

})

app.post('/addToToplist', async (req, res)=>{
  const resp = {message:"Post successful"}
  
  console.log("Responce: "+req.body.userID +" "+ req.body.movieID)

  var sql = "INSERT INTO FavoriteTable (UserID, MovieID) VALUES (" + "'" + req.body.userID +"'" + ","+ req.body.movieID + ")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  
  
  res.status(201)
  res.send(resp)

})

app.get('/searchById/:user', async (req ,res) =>{
  const user = req.params.user
  console.log(user)
  //res.send(user)

con.query("SELECT * FROM FavoriteTable WHERE MovieID ='112'", function (err, result, fields) {
      if (err) throw err;
     //console.log(result);
      res.send(result)
    });

})

app.get('/', async (req, res) => {
  // The handlebars template is stored in global state so this will only once.
  if (!template) {
    // Load Handlebars template from filesystem and compile for use.
    try {
      template = handlebars.compile(readFileSync('Views/index.html.hbs', 'utf8'));
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
  }
  const con = mysql.createConnection({
    host: "34.159.166.233",
    user: "root",
    password: "k4j4mnzswek",
    port: "3306",
    database: "MyDB",
  });



  data.maybe = "no";

  con.connect(function (err) {
    data.maybe = "yes";
    if (err) data.maybe = err.toString();

    con.query("SELECT * FROM FavoriteTable", function (err, result) {
      if (err) throw err;
      data.maybe = result;
      data.maybe = data.maybe.map(function (item) {
        return item.MovieID;
      });
      // Apply the template to the parameters to generate an HTML string.
      try {
        const output = template(data);
        res.status(200).send(output);
        console.log(data)
      } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
      }
    });
  });
});

function calldatabase(){
  console.log("METHOD IN INDEXJS")
}

module.exports = calldatabase;

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});

