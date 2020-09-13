<?php
session_start();
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn,'utf8');


$i=0;
if(!isset($_SESSION["uid"])){                                                         //αν συνδέεται διαχειρηστής
	/*---------------------Εύρεση μέγιστης και ελάχιστης χρονιάς-----------------*/
	$sql="SELECT MIN(YEAR(act_timestampMs)) as minumum, MAX(YEAR(act_timestampMs)) as maximum FROM data";
	$result=mysqli_query($conn,$sql);
	$result=mysqli_fetch_assoc($result);
	$mindate=$result["minumum"];
	$maxdate=$result["maximum"];

    /*----Εύρεση διαφορετικών τύπων δραστηριότητας που υπάρχουν στην ΒΔ----*/
	$sql="SELECT DISTINCT type FROM data WHERE type!=''";
	$result=mysqli_query($conn,$sql);
	if(mysqli_num_rows($result) > 0){
	    while($row = mysqli_fetch_assoc($result)) {
	          $type[$i]=$row["type"];
	          $i+=1;         
	    }
    }
}
else{                                                                                //αν συνδέεται χρήστης
	$uid=$_SESSION["uid"];
	$sql="SELECT MIN(YEAR(act_timestampMs)) as minumum, MAX(YEAR(act_timestampMs)) as maximum FROM data WHERE userid='$uid'";
	$result=mysqli_query($conn,$sql);
	$result=mysqli_fetch_assoc($result);
	$mindate=$result["minumum"];
	$maxdate=$result["maximum"];

	$sql="SELECT DISTINCT type FROM data WHERE type!='' AND userid='$uid'";
	$result=mysqli_query($conn,$sql);
	if(mysqli_num_rows($result) > 0){
	    while($row = mysqli_fetch_assoc($result)) {
	          $type[$i]=$row["type"];
	          $i+=1;         
	    }
	}
}

$out=[$mindate,$maxdate,$type];

echo json_encode($out);

mysqli_close($conn);
?>