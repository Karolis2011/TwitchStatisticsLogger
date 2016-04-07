google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function processData(data){
  var tmpData = [];
  for (var index in data) {
    if (data.hasOwnProperty(index)) {
      var item = data[index];
      var date = new Date(item[0]);
      tmpData.push([date.toTimeString(), item[1]]);
    }
  }
  return tmpData;
}

function drawBackgroundColor() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Time');
    data.addColumn('number', 'Views');

    data.addRows(processData(graphdata));

    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Viewers'
      },
      backgroundColor: '#ffffff'
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph'));
    chart.draw(data, options);
  }
