$.post("distribution.php",
function (activities)
{
  var x =[];
  var n =[];
  var v =[];

  x=JSON.parse(activities);
  console.log(x);

  for(var key in x){
    v.push(x[key]);
  }
  console.log(v);
  var tableRef = document.getElementById('a').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];
  for (var key in v[0]){
      z.push(v[0][key]);
  }
  newRow=tableRef.insertRow();
  for (var i=0; i<z.length;i++){
    newCell  = newRow.insertCell(-1);
    val  = document.createTextNode(z[i] +'%');
    newCell.appendChild(val);
  }
   var tableRef = document.getElementById('b').getElementsByTagName('tbody')[0];
   var newRow = [];
   var val =[];
   var newCell=[];
   var z=[];
   var m=[];
  for (var key in v[1]){
      n.push(key);
      z.push(v[1][key]);
  }
  console.log(n);
  n.forEach(function(item,index){
    th=document.createElement("th");
    th.appendChild(document.createTextNode(item));
    tableRef.appendChild(th);
  });
  n=[];
  newRow=tableRef.insertRow();
  for (var i=0; i<z.length;i++){
    newCell  = newRow.insertCell(-1);
    val  = document.createTextNode(z[i] +'%');
    newCell.appendChild(val);
  }
  var tableRef = document.getElementById('c').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];  
  for (var key in v[2]){
    z.push(v[2][key]);
  }
  newRow   = tableRef.insertRow();
  for (var i=0; i<z.length;i++){
    newCell  = newRow.insertCell(-1);
    val  = document.createTextNode(z[i] +'%');
    newCell.appendChild(val);
  }
  var tableRef = document.getElementById('d').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];
  for (var key in v[3]){
  z.push(v[3][key]);
  }
  newRow   = tableRef.insertRow();
  for (var i=0; i<z.length;i++){
    newCell  = newRow.insertCell(-1);
    val  = document.createTextNode(z[i] +'%');
    newCell.appendChild(val);
  }
  var tableRef = document.getElementById('e').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];
  for (var key in v[4]){
    z.push(v[4][key]);
  }
  newRow   = tableRef.insertRow();
  for (var i=0; i<z.length;i++){
    newCell  = newRow.insertCell(-1);
    val  = document.createTextNode(z[i] +'%');
    newCell.appendChild(val);
  }
  var tableRef = document.getElementById('f').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];
  for (var key in v[5]){
    n.push(key);
    z.push(v[5][key]);
  }
  n.forEach(function(item,index){
    th=document.createElement("th");
    th.appendChild(document.createTextNode(item));
    tableRef.appendChild(th);
  });
  newRow=tableRef.insertRow();
  for (var i=0; i<z.length;i++){
     newCell  = newRow.insertCell(-1);
     val  = document.createTextNode(z[i] +'%');
     newCell.appendChild(val);
  }    
});