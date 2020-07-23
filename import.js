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
