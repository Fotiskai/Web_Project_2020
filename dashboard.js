var x = document.referrer;
console.log(x);
if((!x.includes("index.html") && !x.includes("/",24))){window.location.href="index.html";} 

function redirect(){window.location.href='admin.html';}

$.post("distribution.php",
function (activities)
{
  var x =[];
  var n =[];
  var v =[];

  console.log(activities);
  x=JSON.parse(activities);
  console.log(x);

  for(var key in x){
    v.push(x[key]);
  }
  var tableRef = document.getElementById('a').getElementsByTagName('tbody')[0];
  var newRow = [];
  var val =[];
  var newCell=[];
  var z=[];
  var m=[];
  for (var key in v[0]){
      n.push(key);
      z.push(v[0][key]);
  }
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
    val  = document.createTextNode(z[i]);
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
    val  = document.createTextNode(z[i]);
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
    val  = document.createTextNode(z[i]);
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
    val  = document.createTextNode(z[i]);
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
     val  = document.createTextNode(z[i]);
     newCell.appendChild(val);
  }    
});

$("#chartContainer").ready(function () {
  showGraphs();
});

function showGraphs()
{
        $.post("distribution.php",
        function (activities)
        {

          var x =[];
          var n =[];
          var v =[];
          var z= [];
          x=JSON.parse(activities);
          console.log(x);

         for(var key in x){
            v.push(x[key]);
         }
         for (var key in v[0]){
            n.push(key);
            z.push(v[0][key]);
         }
            var chartdata = {
                labels:n,
                datasets: [
                    {
                        label: 'pososto',
                        backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                        '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                        '#800000','#808000', '#008000','#800080', '#008080',' #000080'],

                        borderColor: '#000000',
                        hoverBackgroundColor: '#CCCCCC',
                        hoverBorderColor: '#666666',
                        data: z
                    }
                ]
            };

            var graphTarget = $("#graphCanvas1");
            var barGraph = new Chart(graphTarget, {
                type: 'pie',
                data: chartdata
            });
            n=[];
            z=[];
            for (var key in v[1]){
              n.push(key);
              z.push(v[1][key]);
            }
             var chartdata = {
                  labels:n,
                  datasets: [
                      {
                          label: 'pososto',
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: z
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas2");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                        scales: {
                          xAxes: [{
                            display: false,
                            barPercentage: 1.3,
                            ticks: {
                              max: 3,
                            }
                          }, {
                            display: true,
                            ticks: {
                              autoSkip: false,
                              max: 4,
                            }
                          }],
                          yAxes: [{
                            ticks: {
                              beginAtZero: true,
                              stepSize: 100
                            }
                          }]
                        }
                    }              
              });
              n=[];
              z=[];
              for (var key in v[2]){
                n.push(key);
                z.push(v[2][key]);
              }
              var chartdata = {
                  labels:n,
                  datasets: [
                      {
                          label: 'pososto',
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: z
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas3");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata
              });
              n=[];
              z=[];
              for (var key in v[3]){
                n.push(key);
                z.push(v[3][key]);
              }
              var chartdata = {
                  labels:n,
                  datasets: [
                      {
                          label: 'pososto',
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: z
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas4");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata
              });
              n=[];
              z=[];
              for (var key in v[4]){
                n.push(key);
                z.push(v[4][key]);
              }
              var chartdata = {
                  labels:n,
                  datasets: [
                      {
                          label: 'pososto',
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: z
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas5");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata
              });
              n=[];
              z=[];
              for (var key in v[5]){
                n.push(key);
                z.push(v[5][key]);
              }
              var chartdata = {
                  labels:n,
                  datasets: [
                      {
                          label: 'pososto',
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: z
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas6");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata
              });                                                                   
        });
}