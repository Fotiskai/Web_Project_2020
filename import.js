function import_files(x){
	console.log(x);
	var input,file,fr;
	input = x;
	file = input.files[0];
	console.log(file);
	fr = new FileReader();
	fr.onload = receive;
	fr.readAsText(file);

	function receive(e){
		var filtered_data=[];
		let lines = e.target.result;
		var json_data_arr = JSON.parse(lines);
		var i,len;
		len = json_data_arr.locations.length;
		console.log(json_data_arr);
		for(i=0;i<len;i++){
			var tmp;
			tmp = json_data_arr.locations[i];
			var dist = cut_distance(tmp.latitudeE7/1e7, tmp.longitudeE7/1e7);
			//console.log('dist is:',dist);
			if(dist <= 10000){ // filtrarw ta dedomena kai pairnw mono auta p einai katw apo 10km
				console.log(i)
				filtered_data.push(tmp);
			}
		}
		console.log(filtered_data);
		console.log('END!');
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
/* gia txt 
function import_files(e) {
  const reader = new FileReader();
  reader.onload = function fileReadCompleted() {
    // when the reader is done, the content is in reader.result.
    console.log(reader.result);
  };
  reader.readAsText(this.files[0]);
}
*/
