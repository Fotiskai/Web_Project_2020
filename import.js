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
var arr = new Array();
function import_files(x){
	console.log(x);
	var file,fr;
	file = x.files[0];
	console.log(file);
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
			var dist = cut_distance(tmp.latitudeE7/1e7, tmp.longitudeE7/1e7);
			//console.log('dist is:',dist);
			if(dist <= 10000){ // filtrarw ta dedomena kai pairnw mono auta p einai katw apo 10km
				//console.log(i)
				filtered_data.push(tmp);
			}
		}
		console.log(filtered_data);
		arr = filtered_data;
		console.log('END!');
		console.log(arr.length);
		if(arr.length>0){
			$.ajax({ 
       			type: "POST", 
       			url: "conn.php", 
       			data: { "arr" : JSON.stringify(arr)}, 
       			success: function() { 
       					//console.log(data);
              			alert("Load to DB!"); 
        		} 
			});
		}
	}

	function cut_distance(la,lo){
		var la_const,lo_const,dist;
		la_const = 38.230462; // latitude pou to dinei katw sthn ekfwnhsh
		lo_const = 21.753150; // longitude pou to dinei katw sthn ekfwnhsh
		// ton tupo ton eida apo edw http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
		dist = Math.acos(Math.sin(la) * Math.sin(la_const) + Math.cos(la)*Math.cos(la_const)*Math.cos(lo - lo_const))*10000;
		return dist;

	} 

}
