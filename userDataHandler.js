mymap = null;
heatmap = null;
var x = document.referrer;
if(!x.includes("user.html")){window.location.href="index.html";} 	

// sunarthsh h opoia ekteleitai otan path8ei to btn epilogh olwn kai markarei ola ta items sto select form
function selectAll(id){
	options = id.getElementsByTagName('option');
	console.log(options);
	for(i=0;i<options.length;i++){
		options[i].selected = "true";
	}
}
// on Submit
function get_user_options(){
	reg_per_act = null;
	select_year = $('#year').val();
	select_month = $('#month').val();
	select_day = $('#day').val();
	select_hour = $('#hour').val();
	select_min = $('#min').val();
	select_act = $('#act').val();
	console.log(select_year);
	console.log(select_month);
	console.log(select_day);
	console.log(select_hour);
	console.log(select_act);
	if(select_year.length==0 || select_month.length==0 || select_day.length==0 || select_hour.length==0 || select_min.length==0 ||select_act.length==0){
		window.alert("Παρακαλώ επιλέξτε δραστηριότητες και ημ/νια-ώρα");
	}else{
		console.log('Load from DB!');
		$.ajax({
			type: "POST",
			url: "getUserData.php",
			data: { year:select_year, month:select_month, day:select_day, hour:select_hour, mins:select_min, act:select_act},
			success: function(data){
				//console.log(data);
				//console.log("there goes data needed for heatmap");
				results = data.split("|");
				//console.log(results[2]);
				percentage = results[0];
				console.log(percentage);
				hours = results[1];
				days = results[2];
				heat_arr = results[3];
				heat_arr = eval('('+heat_arr+')');
				max_heat = results[4];
				//console.log(heat_arr);
				//console.log(max_heat);
				//reg_per_act = data;
				reg_per_act = JSON.parse(percentage);
				reg_per_hour = JSON.parse(hours);
				reg_per_day = JSON.parse(days);
				console.log(reg_per_act);
				if(heatmap!=null){
					document.getElementById('div').innerHTML='';
					document.getElementById('table').innerHTML='';
					document.getElementById('para2').innerHTML='';
				}

				var node = document.getElementById('div');
				var newNode = document.createElement('p');
				newNode.appendChild(document.createTextNode('TABLE'));
				node.appendChild(newNode);

				let table = document.querySelector("table");
				generateTable(table,reg_per_act,reg_per_hour,reg_per_day);
				generateGraphs(reg_per_act,reg_per_hour,reg_per_day);
				// ------------------  HEATMAP -----------------------------------
				if(mymap==null){
					loadMap(document.getElementById('mapid'));
				}
				create_heatmap(heat_arr,max_heat);
			}
		});
	}
}

function loadMap(map){
	mymap=L.map(map,{
    	preferCanvas: true
	});
	let tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	mymap.addLayer(tiles);
	//mymap.dragging.disable();
	mymap.setView([38.2462420, 21.7350847],13);
}

function create_heatmap(coords,maxFreq){
	if(heatmap!=null) mymap.removeLayer(heatmap);
	data = {max: maxFreq, data:coords};
	//console.log(data);
	cfg = {"radius": 40, "maxOpacity": 0.8, "scaleRadius": false, "useLocalExtrema": false, latField: 'lat', lngField: 'lng', valueField: 'count' };
	heatmap = new HeatmapOverlay(cfg);
	mymap.addLayer(heatmap);
	heatmap.setData(data);
}

// functions for table generation
function generateTable(table,data,data1,data2){

	let headers = ['','Ποσοστό(%)','Ωρα με τις περισσότερες εγγραφες(24-hour form)','Μέρα με τις περισσότερες εγγραφες']; // cols
	let thead = table.createTHead();
	let row = thead.insertRow();

	//console.log(data);
	for(i=0;i<headers.length;i++){
		let tr = document.createElement("tr");
		let thr = document.createElement("th");
		let text = document.createTextNode(headers[i]);
		tr.appendChild(thr);
		thr.appendChild(text);
		row.appendChild(thr);
	}
	for(let key in data){
			row = thead.insertRow();
			let tr = document.createElement("tr");
			let thr = document.createElement("th");
			str = key.replace(/_/g," ");
			let text = document.createTextNode(str);

			// Percentage
			let thc = document.createElement("td");
			let txtc = document.createTextNode(data[key]+'%');

			// hours
			let thc1 = document.createElement("td");
			let txtc1 = document.createTextNode(data1[key]);

			//days

			let thc2 = document.createElement("td");
			let txtc2 = document.createTextNode(data2[key]);

			tr.appendChild(thr);
			thr.appendChild(text);
			row.appendChild(thr);

			thc.appendChild(txtc);
			row.appendChild(thc);

			thc1.appendChild(txtc1);
			row.appendChild(thc1);

			thc2.appendChild(txtc2);
			row.appendChild(thc2);

	}
}

function getKeyByValue(object,value){
	return Object.keys(object).find(key => object[key] === value);
}

function create_bar_diag(data,canvas){
	keys = [];
	dataset = [];
	var days = {0:'Δευτέρα',1:'Τρίτη', 2:'Τετάρτη', 3:'Πέμπτη', 4:'Παρασκευή', 5:'Σάββατο', 6:'Κυριακή'};
	i=0;
	for(let key in data){
		str = key.replace(/_/g," ");
		keys[i] = str;
		if(canvas=='draw2'){
			dataset[i] = getKeyByValue(days,data[key]);
		}else{
			dataset[i] = data[key];
		}
		i+=1;
	}
	console.log(dataset);
	if(canvas == 'draw'){
		var set = {
		labels: keys,
		datasets:[{
			data: dataset,
			 borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
            ],
            borderWidth: 1,
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
           	 ]
			}]
		};

		var opt = {
			legend:{
				display:false
			},
			scales:{
				yAxes:[{
					scaleLabel:{
						display:true,
						labelString: '%'
					}
				}],
				xAxes:[{
					scaleLabel:{
						display:true,
						labelString:'Activities'
					}
				}]
			}
		};
		var ctx = $('#draw');
		var barChart = new Chart(ctx,{
			type : 'bar',
			data: set,
			options: opt
		});
	}else if(canvas=='draw1'){
		var set = {
		labels: keys,
		datasets:[{
			data: dataset,
			 borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
            ],
            borderWidth: 1,
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
           	 ]
			}]
		};
		var opt = {
			legend:{
				display:false
			},
			scales:{
				yAxes:[{
					ticks:{
						min: 0
					},
					scaleLabel:{
						display:true,
						labelString: 'hour'
					}
				}],
				xAxes:[{
					scaleLabel:{
						display:true,
						labelString:'Activities'
					}
				}]
			}
		};

		var ctx = $('#draw1');
		var barChart = new Chart(ctx,{
			type : 'bar',
			data: set,
			options: opt
		});
	}else if(canvas=='draw2'){
		var set = {
		labels: keys,
		datasets:[{
			data: dataset,
			 borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
            ],
            borderWidth: 1,
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(217, 148, 49, 1)',
                'rgba(123, 202, 147, 1)',
                'rgba(123, 202, 26, 1)',
                'rgba(16, 202, 26, 1)',
                'rgba(225, 73, 209, 1)',
                'rgba(225, 162, 209, 1)',
                'rgba(145, 162, 209, 1)',
                'rgba(75, 64, 160, 1)',
                'rgba(200, 231, 255, 1)'
           	 ]
			}]
		};
		var opt = {
			legend:{
				display:false
			},
			scales:{
				yAxes:[{
					ticks:{
						callback: function(value,index,values){
							return days[value];
						},
						min: 0
					},
					scaleLabel:{
						display:true,
						labelString: 'day'
					}
				}],
				xAxes:[{
					scaleLabel:{
						display:true,
						labelString:'Activities'
					}
				}]
			}
		};

		var ctx = $('#draw2');
		var barChart = new Chart(ctx,{
			type : 'bar',
			data: set,
			options: opt
		});
	}
}

function generateGraphs(data,data1,data2){
	var div = document.createElement('div');
	div.setAttribute('id','gdiv');
	div.setAttribute('class','gclass');
	div.style.cssText = "width:700px;";

	var canvas = document.createElement('CANVAS');
	canvas.setAttribute('id','draw');

	var canvas1 = document.createElement('CANVAS');
	canvas1.setAttribute('id','draw1');

	var canvas2 = document.createElement('CANVAS');
	canvas2.setAttribute('id','draw2');

	document.body.appendChild(div);
	div.appendChild(canvas);
	div.appendChild(canvas1);
	div.appendChild(canvas2);

	create_bar_diag(data,'draw');
	create_bar_diag(data1,'draw1');
	create_bar_diag(data2,'draw2');

	var node = document.getElementById('para2');
	var newNode = document.createElement('p');
	newNode.appendChild(document.createTextNode('MAP'));
	node.appendChild(newNode);

}
