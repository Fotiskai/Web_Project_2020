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
		var newArr = [];
		let lines = e.target.result;
		var newArr = JSON.parse(lines);
		console.log(newArr.name);
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
