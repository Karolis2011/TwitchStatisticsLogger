var express = require('express');
var fs = require('fs');
const spawn = require('child_process').spawn;
var app = express();

var logger = spawn('node', ['logger.js']);

logger.stdout.on('data', (data) => {
  //console.log(`${data}`);
});
logger.stderr.on('data', (data) => {
  console.log(`${data}`);
});

var databaseFilename = 'database.json';
var database = {
  views: [],
  totalViewers: [],
  followers: [],
  title: [],
};
function loadDatabase(){
  fs.access(databaseFilename, fs.F_OK, function(err) {
    if (!err) {
      var databaseString = fs.readFileSync(databaseFilename, 'utf-8');
      if (databaseString){
        database = JSON.parse(databaseString);
      }
    } else {
      saveDatabase();
    }
  });
}
function saveDatabase() {
  fs.writeFile(databaseFilename, JSON.stringify(database), 'utf8', function (err) {
    if(err){
      return console.log("Saving failed. " + err);
    }
    console.log("Save sucessfull");
  });
}
fs.watchFile(databaseFilename, function (curr, prev) {
  loadDatabase();
});

function getGraphDataForOutput(id) {
  var graphdata = [];

  for (var view in database[id]) {
    if (database[id].hasOwnProperty(view)) {
      var value = database[id][view][1];
      var date = database[id][view][0];
      if (value == null){
        value = graphdata[graphdata - 1][1];
      }
      graphdata.push([date, value]);
    }
  }
  return graphdata;
}

app.set('view engine', 'jade');
app.use('/scripts', express.static(__dirname + '/web_scripts'));

app.get('/', function(req, res) {
  
  res.render('index', {title: 'Hello Auto'});
});

app.get('/data/:name', function(req, res) {
    if(req.params.name == "views"){
      res.set('Content-Type', 'text/json');
      res.send(JSON.stringify(getGraphDataForOutput("views")));
    }
    if(req.params.name == "totalViewers"){
      res.set('Content-Type', 'text/json');
      res.send(JSON.stringify(getGraphDataForOutput("totalViewers")));
    }
    if(req.params.name == "followers"){
      res.set('Content-Type', 'text/json');
      res.send(JSON.stringify(getGraphDataForOutput("followers")));
    }
});

loadDatabase();
app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
