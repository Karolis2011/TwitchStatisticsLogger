// Old logger code

var request = require('request');
var fs = require('fs');

function update() {
  request('https://api.twitch.tv/kraken/streams/automateallthethings', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body)
      //console.log(data);
      var CSVSep = "§";
      var CSVdata = new Date().getTime() + CSVSep + data.stream.channel.status + CSVSep + data.stream.channel.game + CSVSep + data.stream.viewers + CSVSep + data.stream.channel.views + CSVSep + data.stream.channel.followers + "\r\n";
      CSVdata = CSVdata.replace(/,/g, '');
      CSVdata = CSVdata.replace(/§/g, ',');
      console.log("Data: " + CSVdata);
      fs.appendFile('data.csv', CSVdata, function (err) {
        //console.log("Error while updating data. " + err);
      });
    }
  })
}

setInterval(update, 5000);
