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
	heat_arr = null;
	max_heat = null;
	select_year = $('#year').val();
	select_month = $('#month').val();
	//console.log(select_year);
	//console.log(select_month);
	if(select_year.length==0 || select_month.length==0){
		window.alert("Παρακαλώ επιλέξτε δραστηριότητες και ημ/νια-ώρα");
	}else{
		console.log('Load from DB!');
		$.ajax({
			type: "POST",
			url: "getUserData.php",
			data: { year:select_year, month:select_month},
			success: function(data){
				if(data=='Δεν υπάρχουν εγγραφές'){
					window.alert(data);
					document.getElementById('div').innerHTML='';
					document.getElementById('table').innerHTML='';
					document.getElementById('graphp').innerHTML='';
					if(document.getElementById('contain_id')){
						document.getElementById('contain_id').innerHTML='';
					}
					if(heatmap!=null){
						mymap.removeLayer(heatmap);// to bazw wste n ka8arisei to map an den mpei sto heatmap func
						heatmap = null;
					}
					//console.log(window.location);
					//$('document').load('index.html');
				}
				else{
					//console.log(data);
					results = data.split("|");
					percentage = results[0];
					console.log(percentage);
					hours = results[1];
					days = results[2];
					hours_counts = results[5];
					days_counts = results[6];
					//console.log(results[5]);
					//console.log(results[4]);
					if(results[3]!='null' && results[4]!='null'){
						console.log('in if');
						heat_arr = results[3];
						heat_arr = eval('('+ heat_arr +')');
						max_heat = results[4];
						document.getElementById('div').innerHTML='';
						document.getElementById('table').innerHTML='';
						document.getElementById('graphp').innerHTML='';
						//document.getElementById('para2').innerHTML='';
					}
					//console.log(heat_arr);
					//console.log(max_heat);
					//reg_per_act = data;
					reg_per_act = JSON.parse(percentage);
					reg_per_hour = JSON.parse(hours);
					reg_per_day = JSON.parse(days);
					reg_per_hour_counts = JSON.parse(hours_counts);
					reg_per_day_counts = JSON.parse(days_counts);
					console.log(reg_per_day);
					for(var key in reg_per_day){
						if(reg_per_day[key]=='Monday'){
							reg_per_day[key] = 'Δευτέρα'

						}else if(reg_per_day[key]=='Tuesday'){
							reg_per_day[key] = 'Τρίτη';

						}else if(reg_per_day[key]=='Wednesday'){
							reg_per_day[key] = 'Τετάρτη';

						}else if(reg_per_day[key]=='Thursday'){
							reg_per_day[key] = 'Πέμπτη';

						}else if(reg_per_day[key]=='Friday'){
							reg_per_day[key] = 'Παρασκευή';

						}else if(reg_per_day[key]=='Saturday'){
							reg_per_day[key] = 'Σάββατο';

						}else if(reg_per_day[key]=='Sunday'){
							reg_per_day[key] = 'Κυριακή';

						}
					}
					console.log(reg_per_act);
					if(heatmap!=null){
						document.getElementById('div').innerHTML='';
						document.getElementById('table').innerHTML='';
						document.getElementById('graphp').innerHTML='';
						//document.getElementById('para2').innerHTML='';
						mymap.removeLayer(heatmap);// to bazw wste n ka8arisei to map an den mpei sto heatmap func
						heatmap = null;
						//console.log(heatmap);
					}

					var node = document.getElementById('div');
					var newNode = document.createElement('p');
					newNode.setAttribute('class','text-center');
					newNode.appendChild(document.createTextNode('TABLE'));
					node.appendChild(newNode);

					let table = document.querySelector("table");
					generateTable(table,reg_per_act,reg_per_hour,reg_per_day,reg_per_hour_counts,reg_per_day_counts);
					generateGraphs(reg_per_act,reg_per_hour,reg_per_day);
					// ------------------  HEATMAP -----------------------------------
					//if(mymap==null){
					//	loadMap(document.getElementById('mapid'));
					//}
					//console.log(heat_arr);
					//console.log(max_heat);
					if(heat_arr!=null && max_heat!=null)
						create_heatmap(heat_arr,max_heat);
					else{
						window.alert('Δεν υπαρχουν δεδομένα για τον heatmap για την χρονική περίοδο που εισήγαγες');
					}
				}
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
function generateTable(table,data,data1,data2,data3,data4){

	let headers = ['','Ποσοστό(%)','Ωρα με τις περισσότερες εγγραφες(24-hour form),Εγγραφές','Μέρα με τις περισσότερες εγγραφες, Εγγραφές']; // cols
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
	let tbody = table.createTBody();
	for(let key in data){
			row = tbody.insertRow();
			let tr = document.createElement("tr");
			let thr = document.createElement("th");
			str = key.replace(/_/g," ");
			let text = document.createTextNode(str);

			// Percentage
			let thc = document.createElement("td");
			let txtc = document.createTextNode(data[key]+'%');

			// hours
			let thc1 = document.createElement("td");
			let txtc1 = document.createTextNode(data1[key]+' ('+data3[key]+')');

			//days

			let thc2 = document.createElement("td");
			let txtc2 = document.createTextNode(data2[key]+' ('+data4[key]+')');

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
			title: {
				display: true,
				fontSize: 18,
				text: 'Ποσοστό εγγραφών ανά τύπο δραστηριότητας'
				},			
			legend:{
				display:true
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
		};
		var ctx = $('#draw');
		var barChart = new Chart(ctx,{
			type : 'pie',
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
			title: {
				display: true,
				fontSize: 18,
				text: 'Ώρα με τις περισσότερες εγγραφές ανα τύπο δραστηριότητας'
				},			
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
			 pointBorderColor: [
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
            borderColor:'rgba(79,20,242,1)',
            pointBackgroundColor: [
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
			title: {
				display: true,
				fontSize: 18,
				text: 'Ημέρα με τις περισσότερες εγγραφές ανα τύπο δραστηριότητας'
				},
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
			},
			elements:{
				line:{
					fill:false
				}
			}
		};

		var ctx = $('#draw2');
		var barChart = new Chart(ctx,{
			type : 'line',
			data: set,
			options: opt
		});
	}
}

function generateGraphs(data,data1,data2){
	var node = document.getElementById('graphp');
	var newNode = document.createElement('p');
	newNode.setAttribute('class','text-center');
	newNode.appendChild(document.createTextNode('Διαγράμματα'));
	node.appendChild(newNode);

	if(document.getElementById('contain_id')){
		document.getElementById('contain_id').innerHTML='';
	}
	var cont = document.getElementById('contain_id');

	var canvas = document.createElement('CANVAS');
	canvas.setAttribute('id','draw');
	canvas.setAttribute('class','draw_c');

	var canvas1 = document.createElement('CANVAS');
	canvas1.setAttribute('id','draw1');
	canvas1.setAttribute('class','draw1_c');

	var canvas2 = document.createElement('CANVAS');
	canvas2.setAttribute('id','draw2');
	canvas2.setAttribute('class','draw2_c');

	cont.appendChild(canvas);
	cont.appendChild(canvas1);
	cont.appendChild(canvas2);

	create_bar_diag(data,'draw');
	create_bar_diag(data1,'draw1');
	create_bar_diag(data2,'draw2');

}
