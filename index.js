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
app.post('/addUser', async (req , res) =>{
  const resp = {message:"Post successful"}
console.log("AddUser: "+req.body.email)
var sql = "INSERT INTO Users (email) SELECT * FROM (SELECT " + "'"+req.body.email+"'"+ " AS email) AS temp WHERE NOT EXISTS (SELECT email FROM Users WHERE email ="+"'"+req.body.email+"'" +") LIMIT 1;"
//var sql = "INSERT INTO Users (email) VALUES (" + "'" + req.body.email +"'"+")";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });

res.status(201)
  res.send(resp)
})

app.get('/toplists/:user', async (req,res) =>{
  var params=req.params.user
  var arr = params.split('+').map(function (val){
    return String(val);
  })
  var user = arr[0]
  var list = arr[1]
  //console.log("User: "+user + " List: " + list)
  var sql = "SELECT * FROM FavoriteTable WHERE UserID =" +"'"+ user+"'" +"AND List =" +"'"+ list+"'";

    con.query(sql, function (err, result, fields) {


      if (err) throw err;
      var sql1 = "SELECT title, year FROM movies WHERE id = "
      for (let i = 0; i < result.length; i++) {
        if(i+1 ==result.length){
          sql1+=result[i].MovieID
        } else{
          sql1+=result[i].MovieID + " OR id ="
        } 
      }
     //console.log(sql1);
     con.query(sql1, function (err, result1, fields) {
      // console.log(result1)
      res.send(result1)
     })

      
    });
})

app.get('/getComment/:movie_id', async (req,res) =>{
  
  //console.log("!!!!!!!!!!!!!!!!!:" + req.params.movie_id)
  
  con.query("SELECT * FROM comments where movie_id = " + "'" + req.params.movie_id+ "'", function (err, result, fields) {
    if (err) throw err;
   //console.log(result);
    res.send(result)
  }); 


})

app.post('/addComment', async (req, res)=>{
  const resp = {message:"Post successful"}
  
 // console.log("Responce: "+req.body.user_id +" "+ req.body.movie_id+" "+ req.body.comment)

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
  var sql = "INSERT INTO FavoriteTable (UserID, MovieID, List) VALUES (" + "'" + req.body.userID +"'" + ","+ req.body.movieID + ","+ req.body.list+")";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
  res.status(201)
  res.send(resp)
})


app.get('/allUsers',async (req,res) =>{
var sql = "SELECT email FROM Users"
con.query(sql, function (err, result) {
  if (err) throw err;
  //console.log("Users retrieved");
  res.send(result)
});
})
app.get('/getLikes/:userid',async (_,res)=>{

  var sql = "SELECT `List 1 likes` from Users WHERE email = "+"'"+ _.params.userid+"'"
  con.query(sql, function (err, result, fields) {
    console.log(result[0]['List 1 likes'])
    res.send(result)
  })
})

app.post('/like', async (req, res)=>{

  var listUserId;
  var sql1;
  if(req.body.listUserId ==1){
    console.log("Most liked list")
    var sql = "select email, `List 1 likes` from Users WHERE `List 1 likes` =(select MAX(`List 1 likes`) from Users)"
con.query(sql, function (err, result, fields) {
      if (err) throw err;
      listUserId = result[0].email
      sql1 = "SELECT likes from Users WHERE email = " + "'" + listUserId + "'"
  con.query(sql1, function (err, result) {
    if(result == ""){
      console.log("Empty")
      console.log(result)

      var sql3 = "UPDATE Users SET likes = CONCAT(likes, "+ "'"+ req.body.userId+", '), `List 1 likes` = (`List 1 likes` +1) WHERE email ="+ "'" +listUserId +"'"
      con.query(sql3, function (err, result) {
      })
      res.status(201)
      res.send({message:"success"})
    }else{
      console.log("not empty")
      var resp = result[0].likes
      console.log(resp)
      if(resp.includes(req.body.userId)){
        console.log(req.body.userId +" already liked this list")
        res.status(201)
        res.send({message:"Failed"})
    
      }else if(!resp.includes(req.body.userId)){
        console.log(req.body.userId +" has not liked "+ listUserId +" yet")
        var sql3 = "UPDATE Users SET likes = CONCAT(likes, "+ "'"+ req.body.userId+", '), `List 1 likes` = (`List 1 likes` +1) WHERE email ="+ "'" +listUserId +"'"
      con.query(sql3, function (err, result) {
      })
        res.status(201)
        res.send({message:"success"})
      }
    }
})

    })
  }else
  {
    console.log("Not most liked list")
    listUserId = req.body.listUserId;

    sql1 = "SELECT likes from Users WHERE email = " + "'" + listUserId + "'"
  console.log(sql1)
  con.query(sql1, function (err, result) {
    if(result == ""){
      console.log("Empty")
      console.log(result)

      var sql3 = "UPDATE Users SET likes = CONCAT(likes, "+ "'"+ req.body.userId+", '), `List 1 likes` = (`List 1 likes` +1) WHERE email ="+ "'" +listUserId +"'"
      con.query(sql3, function (err, result) {
      })
      res.status(201)
      res.send({message:"success"})
    }else{
      console.log("not empty")
      var resp = result[0].likes
      console.log(resp)
      if(resp.includes(req.body.userId)){
        console.log(req.body.userId +" already liked this list")
        res.status(201)
        res.send({message:"Failed"})
    
      }else if(!resp.includes(req.body.userId)){
        console.log(req.body.userId +" has not liked "+ listUserId +" yet")
        var sql3 = "UPDATE Users SET likes = CONCAT(likes, "+ "'"+ req.body.userId+", '), `List 1 likes` = (`List 1 likes` +1) WHERE email ="+ "'" +listUserId +"'"
      con.query(sql3, function (err, result) {
      })
        res.status(201)
        res.send({message:"success"})
      }
    }
})
    
  }
  
  
})
   

  //var sql2 = "UPDATE Users SET likes = CONCAT(likes, 'Mathias, ') WHERE email ='gardenhansen97@gmail.com'"

  


app.get('/OtherTopLists', async (req ,res) =>{
  
var sql = "select email, `List 1 likes` from Users WHERE `List 1 likes` =(select MAX(`List 1 likes`) from Users)"
con.query(sql, function (err, result, fields) {
      if (err) throw err;
     //console.log("Result: "+result[0].email);
     var sql1 = "SELECT * FROM FavoriteTable WHERE UserID =" +"'"+ result[0].email+"'" +"AND List = 1" 
     con.query(sql1, function (err, result1, fields) {
      if (err) throw err;
     //console.log(result1);
     
     var sql2 = "SELECT title, year FROM movies WHERE id = "
      for (let i = 0; i < result1.length; i++) {
        if(i+1 ==result1.length){
          sql2+=result1[i].MovieID
        } else{
          sql2+=result1[i].MovieID + " OR id ="
        } 
      }
    // console.log(sql2);
     con.query(sql2, function (err, result2, fields) {
      // console.log(result2)
      res.send(result2)
     })


    });
      
    });
    
})
app.get('/year/:year', async (req, res)=>{
  var avg=0;
  const resp = {message:"Years received"}
  var years = req.params.year
  var sql = ("SELECT id FROM movies WHERE YEAR =" + years +";")
  con.query(sql, function(err, result) {

    var sql2 = "SELECT rating FROM ratings WHERE movie_id = "

    for (let a = 0; a < result.length; a++) {
      if(a+1 == result.length){
        sql2+=result[a].id
      }else{
        sql2+=result[a].id + " OR movie_id = "
      }
      
    }
    //console.log(sql2)
    //console.log("hello")
    con.query(sql2, function(err, result2) {

  for (let b = 0; b < result2.length; b++) {
      avg+=result2[b].rating


      if(b+1 == result2.length){
        
        avg = avg/result2.length
        var endresult = {avg:avg}
        res.send(endresult)
        console.log(endresult)
      }

    }
  
    if (err) throw err 
    

  })
  })
})

app.get('/', async (req, res) => {
  // The handlebars template is stored in global state so this will only once.
  if (!template) {
    // Load Handlebars template from filesystem and compile for use.
    try {
      template = handlebars.compile(readFileSync('View/index.html.hbs', 'utf8'));
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
        //console.log(data)
      } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
      }
    });
  });
});



app.get('/actors/:actors',async (req, res) =>{
  var avg=0
  var theAverage = {0:0, 1:0, 2:0};
  

  
  var actors=req.params.actors
  var arr = actors.split(', ').map(function (val){
    return String(val);
  })
  //console.log("Length of actors: "+arr.length)
  

  for (let i = 0; i < arr.length; i++) {
    avg =0;
    
    var sql = ("SELECT id FROM people WHERE name = "+ "'" +arr[i] + "'")
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
   
   var sql1 = "SELECT movie_id FROM stars WHERE person_id = " + result[0].id + ";"
   

   
   con.query(sql1, function (err, result1, fields) {
    //console.log(result1) // list of movie id's

    var sql2 = "SELECT rating FROM ratings WHERE movie_id = "

    for (let a = 0; a < result1.length; a++) {
      if(a+1 == result1.length){
        sql2+=result1[a].movie_id
      }else{
        sql2+=result1[a].movie_id + " OR movie_id = "
      }
      
    }
    //console.log(sql2)
    
    con.query(sql2, function (err, result2, fields) {
      // list of avg
    

    for (let b = 0; b < result2.length; b++) {
      avg+=result2[b].rating
      
    }
    avg = avg/result2.length
    theAverage[i] = avg
    //console.log("The average: "+avg)
    //console.log("The variable  "+theAverage[i])

      if(i+1 == arr.length){
        console.log("End: "+theAverage)

        res.send(theAverage)
      }
  })
})
  
})
    
  }
  
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );

  
});

