var express = require('express');
var fs = require('fs');
const spawn = require('child_process').spawn;
var app = express();
var logger = spawn('node', ['logger.js']);

logger.stdout.on('data', (data) => {
  console.log(`${data}`);
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
  var databaseString = fs.readFileSync(databaseFilename, 'utf-8')
  if (databaseString){
    database = JSON.parse(databaseString);
  }
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


app.set('view engine', 'jade');
app.use('/scripts', express.static(__dirname + '/web_scripts'));

app.get('/', function(req, res) {
  var graphdata = [];

  for (var view in database["views"]) {
    if (database["views"].hasOwnProperty(view)) {
      var value = database["views"][view][1];
      var date = database["views"][view][0];
      if (value == null){
        value = graphdata[graphdata - 1][1];
      }
      graphdata.push([date, value]);
    }
  }

  /*fs.readFile('data.csv', 'utf-8' , function (err,data) {
    if (err) {
      return console.log(err);
    }
    //console.log(data);
    var lines = data.split("\r\n");
    //console.log(lines);
    for (var line in lines) {
      if (lines.hasOwnProperty(line)) {
        //console.log(lines[line]);
        var ddata = lines[line].split(",");
        var date = new Date(Number(ddata[0]));
        var views = Number(ddata[3]);
        //var totalViews = ddata[4];
        //var followers = ddata[5];
        var convData = [date.toTimeString(), views];
        //var convData = "[" + date.toTimeString() + ", " + views + "]";
        graphdata.push(convData);
        //console.log(ddata);
      }
    }
  });*/
  res.render('index', {title: 'Hello Auto', message: 'Date: ' + new Date().getTime(), data: graphdata});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
