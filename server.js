const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");

const app = express();

const PORT = process.env.PORT || 8080;

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection;
if(process.env.JAWSDB_URL){
  connection = mysql.createConnection(process.env.JAWSDB_URL)
}else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "burgers_db"
  });
};

app.get("/", function(req, res) {
    connection.query("SELECT * FROM burgers;", function(err, data) {
      if (err) {
        return res.status(500).end();
      }
  
      res.render("index", { burgers: data });
    });
});

app.post('/api/burgers', (req, res)=>{
    connection.query("INSERT INTO burgers SET ?", req.body,
    function(err, results) {
      if (err) throw err;
      res.sendStatus(200)
    })
});

app.put('/api/burgers/:id', (req,res)=>{
    const id  = req.params.id;
    connection.query("UPDATE burgers SET ? WHERE ?",
    [
        {
            devoured: 1
        },
        {
            id: id
        }
    ], function(err,data){
        if (err){
        console.log(err)
        res.sendStatus(500)
        return
    }
    console.log(data)
    res.sendStatus(200)
    })
})

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});