<?php
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql="DELETE FROM data"; //διαγραφή δεδομένων τοποθεσίας
mysqli_query($conn,$sql);

//$sql="DELETE FROM usercred"; //διαγραφή χρηστών
//mysqli_query($conn,$sql);
echo'Τα δεδομένα διεγράφτηκαν';

mysqli_close($conn);
?>