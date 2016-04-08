/* global google */
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(init);
var chart = {};
var dataSources = {};
var data = {};
var rawData = {};
var options = {};

function processData(data){
    var tmpData = [];
    var item;
    var date;
    for (var index in data) {
        if (data.hasOwnProperty(index)) {
            item = data[index];
            date = new Date(item[0]);
            tmpData.push([date.toString(), item[1]]);
            item = null;
            date = null;
        }
    }
    return tmpData;
}

function initGraph(id, source, htmlId, opt) {
    dataSources[id] = source;
    options[id] = opt;
    chart[id] = new google.visualization.LineChart(document.getElementById(htmlId));
    var request = new XMLHttpRequest();
    request.open('GET', dataSources[id], true);
    
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                rawData[id] = JSON.parse(this.responseText);
                data[id] = new google.visualization.DataTable();
                data[id].addColumn('string', opt.hAxis.title);
                data[id].addColumn('number', opt.vAxis.title);
                data[id].addRows(processData(rawData[id]));
                chart[id].draw(data[id], options[id]);
            }
        }
    };
    
    request.send();
    request = null;
}

function init() {
    console.log("Init called!");
    initGraph("Views", '/data/views', 'graphViewer', {
        hAxis: {
        title: 'Time'
        },
        vAxis: {
        title: 'Viewers'
        }
    });
    initGraph("totalViewers", '/data/totalViewers', 'graphViews', {
        hAxis: {
        title: 'Time'
        },
        vAxis: {
        title: 'Views'
        }
    });
    initGraph("followers", '/data/followers', 'graphFollowers', {
        hAxis: {
        title: 'Time'
        },
        vAxis: {
        title: 'Followers'
        }
    });
    setInterval(update, 12000);
}

function reDrawGraph(id) {
    var request = new XMLHttpRequest();
    request.open('GET', dataSources[id], true);
    
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                rawData[id] = JSON.parse(this.responseText);
                data[id] = new google.visualization.DataTable();
                data[id].addColumn('string', options[id].hAxis.title);
                data[id].addColumn('number', options[id].vAxis.title);
                data[id].addRows(processData(rawData[id]));
                chart[id].draw(data[id], options[id]);
            }
        }
    };
    
    request.send();
    request = null;
}

function update() {
    reDrawGraph("Views");
    reDrawGraph("totalViewers");
    reDrawGraph("followers");
}