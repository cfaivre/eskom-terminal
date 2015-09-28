var ws;
var counter = 0;
function openSocket( command ) {
  if (document.getElementById("start").innerText == 'Restart' && command == 'start') {
    var response = confirm("Are you sure you would like to restart. You will loose all scanned data!");
    if ( response == false ) {
      return;
    }
  }
  this.ws = new WebSocket('ws://localhost:8080/');
  document.getElementById("scanning").innerHTML = "Connecting to reader...";
  document.getElementById("scanning").style.color = "black";
  setTimeout(function () {
    if (this.ws.readyState != 1) {
      document.getElementById("scanning").innerHTML = "Reader Connection Failed!";
      document.getElementById("scanning").style.color = "#FF0000";
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("start").disabled = false;
      document.getElementById("start").className = 'btn enabled'
      document.getElementById("stop").disabled = true;
      document.getElementById("stop").className = 'btn disabled'
      document.getElementById("upload").disabled = true;
      document.getElementById("upload").className = 'btn disabled'
    }
  }, 2000);
  ws = this.ws
  if (command == 'start' ) {
    counter = 0;
    document.getElementById("tags").innerHTML="";
  }
  document.getElementById("start").innerText = 'Restart'
  document.getElementById("start").disabled = true;
  document.getElementById("start").className = 'btn disabled'
  document.getElementById("continue").disabled = true;
  document.getElementById("continue").className = 'btn disabled'
  document.getElementById("stop").disabled = false;
  document.getElementById("stop").className = 'btn enabled';
  document.getElementById("scanning").style.display = 'inline-block';
  document.getElementById("spinner").style.display = 'inline-block';
  ws.onopen = function() {
    document.getElementById("scanning").innerHTML = "Scanning...";
    document.body.style.backgroundColor = '#cfc';
    ws.send( command );
  };
  ws.onclose = function() {
    document.body.style.backgroundColor = null;
  };
  ws.onmessage = function(event) {
    counter += 1;
    var table = document.getElementById("tags");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = counter;
    cell2.innerHTML = event.data;
  };
}

function closeSocket() {
  document.getElementById("start").disabled = false;
  document.getElementById("start").className = 'btn enabled';
  document.getElementById("continue").disabled = false;
  document.getElementById("continue").className = 'btn enabled';
  document.getElementById("stop").disabled = true;
  document.getElementById("stop").className = 'btn disabled';
  document.getElementById("upload").disabled = false;
  document.getElementById("upload").className = 'btn enabled';
  document.getElementById("scanning").style.display = 'none';
  document.getElementById("spinner").style.display = 'none';
  ws.close();
}

function shutdown() {
  var response = confirm("Are you sure you would like to shutdown?");
  if ( response == false ) {
    return;
  }
  ws = new WebSocket('ws://localhost:8080/');
  ws.onopen = function() {
    document.body.style.backgroundColor = '#d9534f';
    ws.send( 'shutdown' );
  };
  ws.onclose = function() {
    document.body.style.backgroundColor = null;
  };
  ws.onmessage = function(event) {
    alert('shutting down!');
    ws.close();
  };
}

function upload() {
  ws = new WebSocket('ws://localhost:8080/');
  ws.onopen = function() {
    document.body.style.backgroundColor = '#5bc0de';
    ws.send( 'upload' );
  };
  ws.onclose = function() {
    document.body.style.backgroundColor = null;
  };
  ws.onmessage = function(event) {
    alert('uploaded!');
    ws.close();
  };
}
