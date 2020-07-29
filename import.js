var filtered_map_data_json; // μεταβλητη που αποθηκευει μονο τα δεδομενα που αφορουν Πατρα, απο το json file.
var features_Geojson = []; // μεταβλητη που αποθηκευει coords σε geoJSON.
let mymap; // metablhth gia to map
function loadMap(map){
	mymap=L.map(map,{
    	preferCanvas: true
	});
	let tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	mymap.addLayer(tiles);
	//mymap.dragging.disable();
	mymap.setView([38.2462420, 21.7350847],13);
}


function import_files(x){
	console.log(x);
	var file,fr;
	file = x.files[0];
	//console.log(file);
	fr = new FileReader();
	fr.onload = receive;
	fr.readAsText(file);

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
		var geo = L.geoJson(geo_form,{
			pointToLayer: function(feature, latlng){
				return new L.CircleMarker(latlng, {
					radius: 1,
    				color: '#3388ff'
				});
			}}).addTo(mymap);
		mymap.fitBounds(geo.getBounds());
		console.log('END!');
		console.log(filtered_map_data_json.length);
		console.log(filtered_map_data_json);
		mymap.on('click',function(e){
			var bounds = [[e.latlng.lat, e.latlng.lng], [e.latlng.lat+0.0005, e.latlng.lng+0.0005]]; // fixed step
			var l = L.rectangle(bounds,{color: 'blue',wieght: 4}).addTo(mymap);
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

/*
$(document).on("change",function(){
		var x = document.getElementById('Import');
		console.log(x.files[0]);
		$.getJSON(JSON.stringify(x.files[0]),function(data){
			var items = [];
			console.log(data.locations[0])
		})
	});
*/
