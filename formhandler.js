heatmapLayer=null;

function minutes_selector(){
  sel=document.getElementById("minutes");
  for(i=0;i<60;i++){
      option=document.createElement("option");
      option.text=i;
      option.value=i;
      sel.add(option);
  }
}

function year_n_activites_selector(){
    sel=document.getElementById("year");
    sel1=document.getElementById("act");
    $.ajax({ 
    type: "POST", 
    url: "selector.php", 
    dataType:"json",
    success: function(data){
      console.log(data);
      for(i=parseInt(data[0]);i<=parseInt(data[1]);i++){
        option=document.createElement("option");
        option.text=i;
        option.value=i;
        sel.add(option);
      }
      data[2].forEach(function(item,index){
        option=document.createElement("option");
        option.text=item;
        option.value=item;
        sel1.add(option);
      });
    }
  });
}


function selectAll(id){
  options = id.getElementsByTagName('option');
  console.log(options);
  for(i=0;i<options.length;i++){
    options[i].selected = "true";
  }
}

function datahandle(){
  select=$('#act').val();
  select1=$('#year').val();
  select2=$('#month').val();
  select3=$('#day').val();
  select4=$('#hour').val();
  select5=$('#minutes').val();

/*
  if(select.includes("all")) select=["IN_VEHICLE", "ON_BICYCLE", "ON_FOOT", "RUNNING", "STILL", "TILTING", "UNKNOWN", "WALKING","IN_ROAD_VEHICLE","IN_RAIL_VEHICLE", "IN_FOUR_WHEELER_VEHICLE","IN_CAR","IN_BUS","EXITING_VEHICLE","IN_TWO_WHEELER_VEHICLE"];
  if(select1.includes("all")) select1=[ "2014", "2015", "2016", "2017", "2018", "2019", "2020" ];
  if(select2.includes("all")) select2=[ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if(select3.includes("all")) select3=[ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
  if(select4.includes("all")) select4=[ "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23" ];  
  if(select5.includes("all")) select5=[ "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23","24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47","48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"];
*/  
  if(select.length==0 || select1.length==0 || select2.length==0 || select3.length==0 || select4.length==0 || select5.length==0) {window.alert("Παρακαλώ εισάγετε δραστηριότητες και ημ/νια-ώρα");}
  else{
          $.ajax({ 
          type: "POST", 
          url: "getdata.php", 
          data: { act:select, year:select1, month:select2, day:select3, hour:select4, minutes:select5 }, 
          success: function(data) {
            if(data=='Δεν υπάρχουν εγγραφές') window.alert(data);
            else{
            res=data.split("|");
            coords=res[0];
            max=res[1];
            res1=eval('(' + coords + ')');
            create_heatMap(res1,max);
            }
          } 
        });
  }
}

function create_Map(){
    mymap=L.map('mapid',{
      preferCanvas: true
  });
  let tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  mymap.addLayer(tiles);
  mymap.setView([38.2462420, 21.7350847],13);
}

function create_heatMap(coords,max){
  if(heatmapLayer!=null) mymap.removeLayer(heatmapLayer);
  testData={max: max, data: res1};
  console.log(testData);
  cfg={"radius": 40, "maxOpacity": 0.8, "scaleRadius": false, "useLocalExtrema": false, latField: 'lat', lngField: 'lng', valueField: 'count' };
  heatmapLayer=new HeatmapOverlay(cfg);
  mymap.addLayer(heatmapLayer);
  heatmapLayer.setData(testData);
}

function data_delete(){
  result = confirm("Διαγραφή Δεδομένων?");
  if(result){
        $.ajax({ 
          type: "POST", 
          url: "delete.php", 
          success: function(data) {
            window.alert(data); 
          }     
        });
}
}

function export_data(){
  select=$('#act').val();
  select1=$('#year').val();
  select2=$('#month').val();
  select3=$('#day').val();
  select4=$('#hour').val();
  select5=$('#minutes').val();
  /*
  if(select.includes("all")) select=["IN_VEHICLE", "ON_BICYCLE", "ON_FOOT", "RUNNING", "STILL", "TILTING", "UNKNOWN", "WALKING","IN_ROAD_VEHICLE","IN_RAIL_VEHICLE", "IN_FOUR_WHEELER_VEHICLE","IN_CAR","IN_BUS","EXITING_VEHICLE","IN_TWO_WHEELER_VEHICLE"];
  if(select1.includes("all")) select1=[ "2014", "2015", "2016", "2017", "2018", "2019", "2020" ];
  if(select2.includes("all")) select2=[ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if(select3.includes("all")) select3=[ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
  if(select4.includes("all")) select4=[ "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23" ];   
  if(select5.includes("all")) select5=[ "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23","24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47","48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"];
  */
  sel=document.getElementById("exp").value;
  if(select.length==0 || select1.length==0 || select2.length==0 || select3.length==0 || select4.length==0 ) {window.alert("Παρακαλώ εισάγετε δραστηριότητες και ημ/νια-ώρα");}
  else{
  	    if(sel=="XML"){
          $.ajax({ 
          type: "POST", 
          url: "export_xml.php", 
          data: { act:select, year:select1, month:select2, day:select3, hour:select4, minutes:select5}, 
          success: function(data) {
            window.alert(data);
          } 
          });
        }else{
          $.ajax({ 
          type: "POST", 
          url: "export_data.php", 
          data: { act:select, year:select1, month:select2, day:select3, hour:select4, minutes:select5, type:sel }, 
          success: function(data) {
            window.alert(data);
          } 
          });
        }
  }
}         