var request = require('request');
var fs = require('fs');

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

function getLastValue(db){
  for (var i = database[db].length; i > -1; i--) {
    if(database[db][i]){
      if(database[db][i][1]){
        return database[db][i][1];
      }
    }
  }
  return -1;
}

function addToDatabase(workName, val, date) {
  if(typeof val === 'string' || val instanceof String){
    var lastVal = getLastValue(workName);
    if(val == lastVal){
      val = null;
    }
  }
  var dataToPush = [date, val];
  database[workName].push(dataToPush);
  //console.log(workName + ' ' + lastVal);
}

function update() {
  request('https://api.twitch.tv/kraken/streams/automateallthethings', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var date = new Date().getTime();
      if(data.stream){
        addToDatabase("views", data.stream.viewers, date);
        addToDatabase("totalViewers", data.stream.channel.views, date);
        addToDatabase("followers", data.stream.channel.followers, date);
        addToDatabase("title", data.stream.channel.status, date);
        saveDatabase();
      } else {
        request('https://api.twitch.tv/kraken/channels/automateallthethings', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var date = new Date().getTime();
            addToDatabase("views", 0, date);
            addToDatabase("totalViewers", data.views, date);
            addToDatabase("followers", data.followers, date);
            addToDatabase("title", data.status, date);
            saveDatabase();
          }
        });
      }

      
    }
  });
}
loadDatabase();
setInterval(update, 6000);
