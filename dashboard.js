var docRef = document.referrer;
console.log(docRef);
if((!docRef.includes("index.html") && !docRef.includes("/",24))){window.location.href="index.html";}

function redirect(){window.location.href='admin.html';}

$.post("distribution.php",
function (activities)
{
  var parse_php_array =[];//kanoume parse to ton php array apo distribution.php
  var name_key =[];//ka8e pinakas exei keys
  var php_arr_to_js_arr =[];// store ton php array se js array

  parse_php_array=JSON.parse(activities);//prwta ton kanoume json parse ton php array gia na ton epekserastoume sthn sunexeia me js
  console.log(parse_php_array);

  for(var key in parse_php_array){
    php_arr_to_js_arr.push(parse_php_array[key]);
  }
  //Tag to id tou 1ou pinaka
  var tableRef = document.getElementById('a').getElementsByTagName('tbody')[0];
  var newRow = [];
  var js_arr_vals=[];

  for (var key in php_arr_to_js_arr[0]){
      name_key.push(key);
      js_arr_vals.push(php_arr_to_js_arr[0][key]);
  }

  var i=0;//counter
  // Apo thn 8esh 0 tou js array pairnoume ta dedomena gia ton 1o pinaka
  for (var key in php_arr_to_js_arr[0]){

    td=document.createElement("td");
    td.appendChild(document.createTextNode(key));
    tableRef.appendChild(td);//store keys
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]+'%'));
    tableRef.appendChild(td);//store values
    newRow=tableRef.insertRow();
    i++;
  }

  // Apo thn 8esh 1 tou js array pairnoume ta dedomena gia ton 2o pinaka
   var tableRef = document.getElementById('b').getElementsByTagName('tbody')[0];
   newRow = [];
   js_arr_vals=[];
   name_key=[];//ton ka8arizoume gia na ton ksanaxrhsimopoihsoume

  for (var key in php_arr_to_js_arr[1]){
      name_key.push(key);
      js_arr_vals.push(php_arr_to_js_arr[1][key]);
  }
  i=0;
  name_key.forEach(function(item,index){
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]));
    tableRef.appendChild(td);//values
    td=document.createElement("td");
    td.appendChild(document.createTextNode(item));
    tableRef.appendChild(td);//keys (items)
    newRow=tableRef.insertRow();
    i++;
  });

  // Apo thn 8esh 2 tou js array pairnoume ta dedomena gia ton 3o pinaka
  var tableRef = document.getElementById('c').getElementsByTagName('tbody')[0];
  newRow = [];
  js_arr_vals=[];
  name_key=[];

  for (var key in php_arr_to_js_arr[2]){
    name_key.push(key);
    js_arr_vals.push(php_arr_to_js_arr[2][key]);
  }

  i=0;
  name_key.forEach(function(item,index){
    td=document.createElement("td");
    td.appendChild(document.createTextNode(item));
    tableRef.appendChild(td);
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]));
    tableRef.appendChild(td);
    newRow=tableRef.insertRow();
    i++;
  });

 // Apo thn 8esh 3 tou js array pairnoume ta dedomena gia ton 4o pinaka
  var tableRef = document.getElementById('d').getElementsByTagName('tbody')[0];
  newRow = [];
  js_arr_vals=[];
  name_key=[];

  for (var key in php_arr_to_js_arr[3]){
    name_key.push(key);
    js_arr_vals.push(php_arr_to_js_arr[3][key]);
  }

  i=0;
  name_key.forEach(function(item,index){
    td=document.createElement("td");
    td.appendChild(document.createTextNode(item));
    tableRef.appendChild(td);
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]));
    tableRef.appendChild(td);
    newRow=tableRef.insertRow();
    i++;
  });

  // Apo thn 8esh 4 tou js array pairnoume ta dedomena gia ton 5o pinaka
  var tableRef = document.getElementById('e').getElementsByTagName('tbody')[0];
  newRow = [];
  js_arr_vals=[];
  name_key=[];

  for (var key in php_arr_to_js_arr[4]){
    name_key.push(key);
    js_arr_vals.push(php_arr_to_js_arr[4][key]);
  }

  i=0;
  name_key.forEach(function(item,index){
    td=document.createElement("td");
    td.appendChild(document.createTextNode(item));
    tableRef.appendChild(td);
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]));
    tableRef.appendChild(td);
    newRow=tableRef.insertRow();
    i++;
  });

  // Apo thn 8esh 5 tou js array pairnoume ta dedomena gia ton 6o pinaka
  var tableRef = document.getElementById('f').getElementsByTagName('tbody')[0];
  newRow = [];
  js_arr_vals=[];
  name_key=[];

  for (var key in php_arr_to_js_arr[5]){
    name_key.push(key);
    js_arr_vals.push(php_arr_to_js_arr[5][key]);
  }

  i=0;
  name_key.forEach(function(item,index){
    td=document.createElement("td");
    td.appendChild(document.createTextNode(item));
    tableRef.appendChild(td);
    td=document.createElement("td");
    td.appendChild(document.createTextNode(js_arr_vals[i]));
    tableRef.appendChild(td);
    newRow=tableRef.insertRow();
    i++;
  });



});

$("#chartContainer").ready(function () {
  showGraphs();
});

function showGraphs()
{
        $.post("distribution.php",
        function (activities)
        {

          var parse_php_array =[];
          var name_key =[];
          var php_arr_to_js_arr =[];
          var js_arr_vals= [];
          parse_php_array=JSON.parse(activities);


         for(var key in parse_php_array){
            php_arr_to_js_arr.push(parse_php_array[key]);
         }
         for (var key in php_arr_to_js_arr[0]){
            name_key.push(key);
            js_arr_vals.push(php_arr_to_js_arr[0][key]);
         }
            var chartdata = {
                labels:name_key,
                datasets: [
                    {

                        backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                        '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                        '#800000','#808000', '#008000','#800080', '#008080',' #000080'],

                        borderColor: '#000000',
                        hoverBackgroundColor: '#CCCCCC',
                        hoverBorderColor: '#666666',
                        data: js_arr_vals
                    }
                ]
            };

            var graphTarget = $("#graphCanvas1");
            var barGraph = new Chart(graphTarget, {
                type: 'pie',
                data: chartdata,
                options: {
                    title: {
                      display: true,
                      fontSize: 20,
                      text: 'Ποσοστό ανά Δραστηριότητες'
                      },
                      tooltips: {
                        callbacks: {
                          label: function(tooltipItems, data) {
                            return data.labels[tooltipItems.index] +
                            " : " +
                            data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] +
                            ' %';
                         }
                      }
                    }
                }
            });
            name_key=[];
            js_arr_vals=[];
            for (var key in php_arr_to_js_arr[1]){
              name_key.push(key);
              js_arr_vals.push(php_arr_to_js_arr[1][key]);
            }
             var chartdata = {
                  labels:name_key,
                  datasets: [
                      {
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          barPercentage: 1.30,
                          data: js_arr_vals
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas2");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                      title: {
                        display: true,
                        fontSize: 20,
                          text: 'Kατανομή Πλήθους Εγγραφών ανά Χρήστη'
                        },
                        legend: {
                          display: false
                        },
                        tooltips: {
                          callbacks: {
                            label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                            }
                          }
                        },
                        scales: {
      					      xAxes: [{
      					        display: false,
      					      }, {
      					        display: true,
      					      }],
      					      yAxes: [{
      					        ticks: {
      					          beginAtZero:true
      					        }
      					      }]
          			    }
                }

              });
              name_key=[];
              js_arr_vals=[];
              for (var key in php_arr_to_js_arr[2]){
                name_key.push(key);
                js_arr_vals.push(php_arr_to_js_arr[2][key]);
              }
              var chartdata = {
                  labels:name_key,
                  datasets: [
                      {
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: js_arr_vals
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas3");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                      title: {
                        display: true,
                        fontSize: 20,
                          text: 'Kατανομή Πλήθους Εγγραφών ανά Μήνα'
                        },
                        legend: {
                          display: false
                        },
                        tooltips: {
                          callbacks: {
                            label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                            }
                          }
                        }
                      }

              });
              name_key=[];
              js_arr_vals=[];
              for (var key in php_arr_to_js_arr[3]){
                name_key.push(key);
                js_arr_vals.push(php_arr_to_js_arr[3][key]);
              }
              var chartdata = {
                  labels:name_key,
                  datasets: [
                      {
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: js_arr_vals
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas4");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                      title: {
                        display: true,
                        fontSize: 20,
                          text: 'Kατανομή Πλήθους Εγγραφών ανά Ημέρα της Εβδομάδας'
                        },
                        legend: {
                          display: false
                        },
                        tooltips: {
                          callbacks: {
                            label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                            }
                          }
                        }
                      }
              });
              name_key=[];
              js_arr_vals=[];
              for (var key in php_arr_to_js_arr[4]){
                name_key.push(key);
                js_arr_vals.push(php_arr_to_js_arr[4][key]);
              }
              var chartdata = {
                  labels:name_key,
                  datasets: [
                      {
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080',
                          '#ff6384','#36a2eb','#cc65fe','#ffce56','#f0f8ff','#adff2f',
                          '#483d8B','#663399'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: js_arr_vals
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas5");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                      title: {
                        display: true,
                        fontSize: 20,
                          text: 'Kατανομή Πλήθους Εγγραφών ανά Ώρα'
                        },
                        legend: {
                          display: false
                        },
                        tooltips: {
                          callbacks: {
                            label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                            }
                          }
                        }
                      }
              });
              name_key=[];
              js_arr_vals=[];
              for (var key in php_arr_to_js_arr[5]){
                name_key.push(key);
                js_arr_vals.push(php_arr_to_js_arr[5][key]);
              }
              var chartdata = {
                  labels:name_key,
                  datasets: [
                      {
                          backgroundColor: ['#49e2ff', '#fff000', '#111000', '#FF0000',
                          '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                          '#800000','#808000', '#008000','#800080', '#008080',' #000080'],
                          borderColor: '#000000',
                          hoverBackgroundColor: '#CCCCCC',
                          hoverBorderColor: '#666666',
                          data: js_arr_vals
                      }
                  ]
              };
              var graphTarget = $("#graphCanvas6");
              var barGraph = new Chart(graphTarget, {
                  type: 'bar',
                  data: chartdata,
                  options: {
                      title: {
                        display: true,
                        fontSize: 20,
                          text: 'Kατανομή Πλήθους Εγγραφών ανά Έτος'
                        },
                        legend: {
                          display: false
                        },
                        tooltips: {
                          callbacks: {
                            label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                            }
                          }
                        }
                      }
              });
              name_key=[];
              js_arr_vals=[];
        });
}
