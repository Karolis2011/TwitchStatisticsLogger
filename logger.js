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
  var databaseString = fs.readFileSync(databaseFilename, 'utf-8');
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

function getLastValue(db){
  for (var i = database[db].length; i > -1; i--) {
    if(database[db][i]){
      if(database[db][i][1]){
        return database[db][i][1];
      }
    } else {
      return -1;
    }
  }
}

function update() {
  request('https://api.twitch.tv/kraken/streams/automateallthethings', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var date = new Date().getTime();
      var workName = "views";
      var lastVal = getLastValue(workName);
      var valToPush = data.stream.viewers;
      if(valToPush == lastVal){
        valToPush = null;
      }
      dataToPush = [date, valToPush];
      database[workName].push(dataToPush);
      console.log(workName + ' ' + dataToPush);

      workName = "totalViewers";
      lastVal = getLastValue(workName);
      valToPush = data.stream.channel.views;
      if(valToPush == lastVal){
        valToPush = null;
      }
      dataToPush = [date, valToPush];
      database[workName].push(dataToPush);
      console.log(workName + ' ' + dataToPush);

      workName = "followers";
      lastVal = getLastValue(workName);
      valToPush = data.stream.channel.followers;
      if(valToPush == lastVal){
        valToPush = null;
      }
      dataToPush = [date, valToPush];
      database[workName].push(dataToPush);
      console.log(workName + ' ' + dataToPush);

      workName = "title";
      lastVal = getLastValue(workName);
      valToPush = data.stream.channel.status;
      if(valToPush == lastVal){
        valToPush = null;
      }
      dataToPush = [date, valToPush];
      database[workName].push(dataToPush);
      console.log(workName + ' ' + dataToPush);

      saveDatabase();
    }
  })
}

setInterval(update, 5000);
