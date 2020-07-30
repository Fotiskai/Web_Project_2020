<?php
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql="DELETE FROM activities";
mysqli_query($conn,$sql);
$sql="DELETE FROM data";
mysqli_query($conn,$sql);

echo'Τα δεδομένα διεγράφτηκαν';

mysqli_close($conn);
?>