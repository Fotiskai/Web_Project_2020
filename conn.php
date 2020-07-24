<?php
	//include('draw.html');
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$myArr = json_decode($_POST['arr']);

	$conn = new mysqli($servername,$username,$password,$DB);
	if($conn->connect_error){
		die("Connection Failed: " . $conn->connect_error);
	}

	$len = count($myArr);
	for($i=0;$i<$len;$i++){
		$lan = $myArr[$i]->latitudeE7/1e7;
		$lon = $myArr[$i]->longitudeE7/1e7;
		$sql="INSERT INTO data (lan, lon) VALUES ($lan, $lon)";
		if($conn->query($sql)===TRUE){ // isws uparxei kai pio grhgoros tropos
		}else{
			echo "<p>Error!</p>";
		}
	}
	$conn->close();
?>