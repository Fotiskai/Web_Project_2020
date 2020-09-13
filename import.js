filtered_map_data_json = new Array(); // μεταβλητη που αποθηκευει μονο τα δεδομενα που αφορουν Πατρα, απο το json file.
//features_Geojson = []; // μεταβλητη που αποθηκευει coords σε geoJSON.
all_rects = []; // πινακας που αποθηκευω ολα τα ορθογωνια
mymap=null; // metablhth gia to map
//geo=null;
re_entry_data=null; // μτβλ που κοιταει για το οταν ο χρηστης εισαγει δεδομενα για δευτερη φορα να αντικαταστησει τα παλια με τα καινουργια
group = L.layerGroup();
/*
var geo_options = {pointToLayer: function(feature, latlng){
					return new L.CircleMarker(latlng, {
						radius: 1,
    					color: '#3388ff'
					});
				}};	
*/
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
	if(re_entry_data!=null){
		// init variables
		//console.log('all_rects',all_rects);
		//console.log('group',group);
		//console.log('geo',geo);
		filtered_map_data_json =[] ;// μεταβλητη που αποθηκευει μονο τα δεδομενα που αφορουν Πατρα, απο το json file.
		//features_Geojson = []; // μεταβλητη που αποθηκευει coords σε geoJSON.
		all_rects = []; // pinakas pou krataei ola ta rects .
		mymap.off('click'); // kleinw ta events wste na mhn kanoun trigger twice logo tou prohgoumenou import
		group.clearLayers();
		//geo.clearLayers(); // ka8arizw to group p exw apo8ukeumeno ta layers apo to geo
		re_entry_data=null;
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
		window.alert('Δεν βρέθηκε αρχείο.');
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
		for(i=0;i<len;i++){ 
			var tmp;
			tmp = json_data_arr.locations[i];
			var lat = tmp.latitudeE7/1e7;
			var long = tmp.longitudeE7/1e7;
			
			var dist = cut_distance(lat, long);
			if(dist <= 10){ // filtrarw ta dedomena kai pairnw mono auta p einai katw apo 10km
				filtered_data.push(tmp);
				/*
				var feature = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [long, lat]
					}
				};
				features_Geojson.push(feature);
				*/
			}
		}
		filtered_map_data_json = filtered_data; // pairnw ta filtrarismena data kai ta bazw thn global var wste na ta steilw meta mesw AJAX sthn php
		//var geo_form = { type: 'FeatureCollection', features: features_Geojson };
		re_entry_data = 'data'; // βαζω τιμη στην μτβλ geo ωστε αν ο χρηστης ξανα εισαγει δεδομενα πριν κανει submit 
		//τα παλια δεδομενα να αντικαταστηθουν απο τα νεα αντι να προστεθουν στα παλια.
		//geo = L.geoJson(geo_form,geo_options).addTo(mymap);
		//mymap.fitBounds(geo.getBounds());
		console.log('END!');
		console.log(filtered_map_data_json.length);
		console.log(filtered_map_data_json);
		window.alert('Τα δεδομένα φορτώθηκαν στον χάρτη.');
		// --------------- EVENTS ----------------------
		var bounds = [];// pinakas p krataei tis proswrines theseis twn rects.
		var rect=null;
		var flag = false;
		var moveflag= false;
		group.addTo(mymap);
		mymap.on('click',function(e){// event που ενεργοποιειται οταν ο χρηστης κλικαρει στον χαρτη
			bounds.push(e.latlng);
			// δημιουργω ενα ορθογωνιο με τα lantitude , longitude που βρισκονται στον πινακα bounds
			// και εισαγω και ενα ακομα event το οποιο κοιταει αν ο χρηστης ειναι μεσα στο ορθογωνιο και αν ναι τοτε αν πατησει δεξι κλικ το διαγραφει
			rect = L.rectangle(bounds,{color: 'red',wieght: 2}).on('contextmenu',function(e){
				bounds = [];
				this.remove();
				index = all_rects.indexOf(this);
				all_rects.splice(index,1); // αφαιρω το ορθογωνιο απο τον πινακα
			});
			// αν υπαρχουν πολλαπασια του 2 θεσεις στον πινακα bounds και το flag εχει την τιμη true τοτε προσθετω 
			//το ορθογωνιο που δημιουργηθηκε στον πινακα που κραταω ολα τα ορθογωνια
			if(bounds.length%2==0 && flag == true){
				all_rects.push(rect);
				console.log('all rects: ',all_rects);
				bounds = [];
				moveflag=true;
			}
		}).on('mousemove',function(e){ // αφου πατησω κλικ μετα καθως κουναω το ποντικι δημιουργειται το ορθογωνιο προσωρινα στην θεση που δειχνει το ποντικι
			// και οταν πατησει ο χρηστης παλι κλικ τοτε το ορθογωνιο δημιουγειται 'μονιμα' στις συντεταγμενες που ορισε ο χρηστης
			if(bounds.length == 1){
				flag = true; // σημαια που δηλωνει οτι εχει δημιουγηθει και το δευτρο συνολο συντεταγμενων που χρειαζεται ωστε να δημιουργηθει το ορθογωνιο
				moveflag=false;
				xy = [bounds[0],e.latlng];
				rect.setBounds(xy).addTo(group);
			}else{
				flag = false;
				moveflag=true;
			}
		});
		document.getElementById('mapid').ontouchend=function(e){if(moveflag===true) e.preventDefault(); mymap.dragging.enable();}
		document.getElementById('mapid').ontouchmove=function(e){ if(moveflag===false){
			e.preventDefault(); 
		    mymap.dragging.disable();
		    }
	    }
	

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
	if(all_rects.length >0){ // αν υπαρχουν ορθογωνια στον χαρτη
		var final_processed_data=[]; // πινακας που περιεχει τα τελικα δεδομενα αφου 
		//εχουν διαγραφτει τα δεδομενα που βρισκονται μεσα στα ορθογωνια
		var idx = [];
		for(r in all_rects){
			var rect = all_rects[r];
			var latlng = rect._latlngs[0];
			var x = [latlng[0].lng, latlng[1].lng, latlng[2].lng, latlng[3].lng];
			var y = [latlng[0].lat, latlng[1].lat, latlng[2].lat, latlng[3].lat ];
			//console.log('[+]x:',x,"y:",y);
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
		}
		console.log('final:',filtered_map_data_json);
	}
	if(filtered_map_data_json.length>0){
		$.ajax({ 
       		type: "POST", 
       		url: "import.php", 
       		data: { "arr" : JSON.stringify(filtered_map_data_json)}, 
       		success: function(data) { 
       			window.alert("Τα δεδομένα ανέβηκαν επιτυχώς.");
        	} 
		});
	}else{
		window.alert('Δεν βρέθηκαν δεδομένα για ανέβασμα.');
	}
}