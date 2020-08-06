filtered_map_data_json = new Array(); // μεταβλητη που αποθηκευει μονο τα δεδομενα που αφορουν Πατρα, απο το json file.
features_Geojson = []; // μεταβλητη που αποθηκευει coords σε geoJSON.
all_rects = []; // pinakas pou krataei ola ta rects .
mymap=null; // metablhth gia to map
geo=null;
group = L.layerGroup();

function redirect1(){window.location.href="d_analysis.html";}
function redirect2(){window.location.href="import.html";}

var geo_options = {pointToLayer: function(feature, latlng){
					return new L.CircleMarker(latlng, {
						radius: 1,
    					color: '#3388ff'
					});
				}};	

function loadMap(map){
	mymap=L.map(map,{
    	preferCanvas: true
	});
	let tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	mymap.addLayer(tiles);
	mymap.doubleClickZoom.disable();
	mymap.setView([38.2462420, 21.7350847],13);
}

function import_files(x){
	if(geo!=null){
		// init variables
		//console.log('all_rects',all_rects);
		//console.log('group',group);
		//console.log('geo',geo);
		filtered_map_data_json =[] ;// μεταβλητη που αποθηκευει μονο τα δεδομενα που αφορουν Πατρα, απο το json file.
		features_Geojson = []; // μεταβλητη που αποθηκευει coords σε geoJSON.
		all_rects = []; // pinakas pou krataei ola ta rects .
		mymap.off('click'); // kleinw ta events wste na mhn kanoun trigger twice logo tou prohgoumenou import
		group.clearLayers();
		geo.clearLayers(); // ka8arizw to group p exw apo8ukeumeno ta layers apo to geo
		geo=null;
		//console.log('all_rects',all_rects);
		//console.log('group',group);
		//console.log('geo',geo);
	}
	var file,fr;
	file = x.files[0];
	if(file!=null){
		fr = new FileReader();
		fr.onload = receive;
		fr.readAsText(file);
	}else{
		window.alert('No file found!');
		return ;
	}

	function receive(e){
		let filtered_data=[];
		let lines = e.target.result;
		var json_data_arr = JSON.parse(lines);
		var i,len;
		len = json_data_arr.locations.length;
		console.log("JSON data: ",json_data_arr);
		console.log("JSON length: ",len);
		for(i=0;i<len;i++){ // mikro sample gia na einai pio elenxomenh h katastash
			// stou fwth balteto kanonika i=0 < len stou mike afhste to etsi.
			var tmp;
			tmp = json_data_arr.locations[i];
			var lat = tmp.latitudeE7/1e7;
			var long = tmp.longitudeE7/1e7;
			
			var dist = cut_distance(lat, long);
			//console.log('dist is:',dist);
			if(dist <= 10){ // filtrarw ta dedomena kai pairnw mono auta p einai katw apo 10km
				//console.log(i)
				filtered_data.push(tmp);
				var feature = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [long, lat]
					}
				};
				features_Geojson.push(feature);
			}
		}
		filtered_map_data_json = filtered_data; // pairnw ta filtrarismena data kai ta bazw thn global var wste na ta steilw meta mesw AJAX sthn php
		var geo_form = { type: 'FeatureCollection', features: features_Geojson };

		geo = L.geoJson(geo_form,geo_options).addTo(mymap);
		mymap.fitBounds(geo.getBounds());
		console.log('END!');
		console.log(filtered_map_data_json.length);
		console.log(filtered_map_data_json);
		// --------------- EVENTS ----------------------
		var bounds = [];// pinakas p krataei tis proswrines theseis twn rects.
		var rect=null;
		var flag = false;
		group.addTo(mymap);
		mymap.on('click',function(e){
			console.log('1st_event:',e.latlng);
			bounds.push(e.latlng);
			rect = L.rectangle(bounds,{color: 'red',wieght: 2}).on('contextmenu',function(e){
				bounds = [];
				this.remove();
				index = all_rects.indexOf(this);
				all_rects.splice(index,1);
				console.log('all_rects_after_del:',all_rects);
			});
			//console.log(bounds);
			if(bounds.length%2==0 && flag == true){
				//all_bounds.push(bounds);
				all_rects.push(rect);
				//group.addLayer(rect);
				console.log('all rects: ',all_rects);
				bounds = [];
			}
		}).on('mousemove',function(e){
			if(bounds.length == 1){
				flag = true;
				xy = [bounds[0],e.latlng];
				console.log('2st_event:',xy);
				rect.setBounds(xy).addTo(group);
			}else{
				flag = false;
			}
			});
	}

	function cut_distance(lat,lon){
		//https://www.movable-type.co.uk/scripts/latlong.html
		var la_const,lo_const,dist;
		la_const = 38.230462; // latitude pou to dinei sthn ekfwnhsh
		lo_const = 21.753150; // longitude pou to dinei sthn ekfwnhsh
		const R = 10e3; // metres
		const φ1 = lat * Math.PI/180; // φ, λ in radians
		const φ2 = la_const * Math.PI/180;
		const Δφ = (la_const-lat) * Math.PI/180;
		const Δλ = (lo_const-lon) * Math.PI/180;

		const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		const d = R * c; // in metres
		return d;

	} 

}

function upload(){
	if(all_rects.length >0){
		var final_processed_data=[];
		var idx = [];
		for(r in all_rects){
			var rect = all_rects[r];
			var latlng = rect._latlngs[0];
			var x = [latlng[0].lng, latlng[1].lng, latlng[2].lng, latlng[3].lng];
			var y = [latlng[0].lat, latlng[1].lat, latlng[2].lat, latlng[3].lat ];
			console.log('[+]x:',x,"y:",y);
			for(var i=0;i<filtered_map_data_json.length;i++){
				var lat = filtered_map_data_json[i].latitudeE7/1e7;
				var lng = filtered_map_data_json[i].longitudeE7/1e7;
				if((lng > x[0] && lng>x[1] && lng <x[2] && lng < x[3])&&(lat > y[0] && lat > y[3] && lat <y[1] && lat < y[2])){ //(lng > x[0] && lng>x[1] && lng <x[2] && lng < x[3])&&
					idx.push(i);
				}
			}
			for(var i=idx.length-1;i>=0;i--){
				filtered_map_data_json.splice(idx[i],1);
			}
			//console.log('size after rect:',filtered_map_data_json.length);
		}
		console.log('final:',filtered_map_data_json);
	}
	if(filtered_map_data_json.length>0){
		$.ajax({ 
       		type: "POST", 
       		url: "conn.php", 
       		data: { "arr" : JSON.stringify(filtered_map_data_json)}, 
       		success: function(data) { 
       			console.log('PHP:',data);
              	//alert("Load to DB!"); 
        	} 
		});
	}else{
		window.alert('No data found!');
	}
}

function show_data(){
			$.ajax({ 
       		type: "POST", 
       		url: "getusrdata.php",
       		dataType:"json", 
       		success: function(data) {
       		    console.log(data);
       			document.getElementById("score").innerHTML=data[0][12] + '%';
       			graph(data[0],data[1]);
       			document.getElementById("period").innerHTML=data[2]+ "\t"+ "-" + "\t" +data[3];
       			document.getElementById("date").innerHTML=data[4];
       			leaderboard(data[0][12],data[5],data[6],data[7]);
        	}
		});

}

function graph(data,labels){
    let myChart=document.getElementById("myChart").getContext("2d");
    let barchart=new Chart(myChart,{
    	type:'bar',
    	data:{
    		labels:labels,
    		datasets: [{
    			label:'Ποσοστό οικολογικής κίνησης (%)',
    			data: data,
    			backgroundColor:'#1164f4'
    		}]
    	},
		options:{	
		  scales:{
		    yAxes:[{
		      scaleLabel:{
		        display: true,
		        labelString: 'Score οικολογικής μετακίνησης (%)'
		      }
		    }],
		    xAxes:[{
		      scaleLabel:{
		        display: true,
		        labelString: 'Μήνας-Έτος'
		      }
		    }]
		  }     
       }
    });
}

function leaderboard(current,top3,names,rank){

	document.getElementById("r1").innerHTML="1";
    document.getElementById("r2").innerHTML="2";
    document.getElementById("r3").innerHTML="3";
    document.getElementById("r4").innerHTML=rank;
    document.getElementById("n1").innerHTML=names[0];
    document.getElementById("n2").innerHTML=names[1];
    document.getElementById("n3").innerHTML=names[2];
    document.getElementById("n4").innerHTML=names[3];
    document.getElementById("s1").innerHTML=top3[0] + "%";
    document.getElementById("s2").innerHTML=top3[1] + "%";
    document.getElementById("s3").innerHTML=top3[2] + "%";
    document.getElementById("s4").innerHTML=current + "%";

   /*
    ranks=["1","2","3",rank];
    top3[3]=current;
	table=document.getElementById("tb");
	tableBody=document.createElement("tbody");
    th=document.createElement("th");
	th.appendChild(document.createTextNode('Rank'));
	table.appendChild(th);
	th=document.createElement("th");
	th.appendChild(document.createTextNode('Username'));
	table.appendChild(th);
	th=document.createElement("th");
	th.appendChild(document.createTextNode('Score'));
	table.appendChild(th);
	for(i=0;i<4;i++){
		tr=document.createElement("tr");
		td1=document.createElement("td");
		td2=document.createElement("td2");
		td3=document.createElement("td3");
		datatd1=document.createTextNode(ranks[i]);
		datatd2=document.createTextNode(names[i]);
		datatd3=document.createTextNode(top3[i]);
		td1.appendChild(datatd1);
        td2.appendChild(datatd2);
        td3.appendChild(datatd3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
	}
	table.appendChild(tableBody);
	*/
}