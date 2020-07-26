<?php
	//include('draw.html');
	$servername = "localhost";
	$username = "root";
	$password = "";
	$DB = "web2020";

	$myArr = json_decode($_POST['arr']);

	$conn = new mysqli($servername,$username,$password,$DB);
	if($conn->connect_error){
		die("Connection Failed: " . $conn->connect_error);
	}

	$len = count($myArr);
	for($i=0;$i<$len;$i++){
		$timestampMs = (int)$myArr[$i]->timestampMs/1000; // Date object expects the number of milliseconds since the epoch, hence the 1000-fold difference
		$timestampMs = date('Y-m-d H:i:s',$timestampMs);
		//$timestampMs = strtotime($timestampMs);
		$latitude = $myArr[$i]->latitudeE7/1e7;
		$longitude = $myArr[$i]->longitudeE7/1e7;
		$accuracy = $myArr[$i]->accuracy;
		/* parsing gia to activity section tou json
		if(isset($myArr[$i]->activity)){
			$type = $myArr[$i]->activity->activity->type;
			$confidence = $myArr[$i]->activity->activity->confidence;
			$sql="INSERT INTO data (timestampMs, latitude, longitude, accuracy, activity, act_accuracy) VALUES ('$timestampMs', $latitude, $longitude, $accuracy, '$type', $confidence)";
		}else{
			$sql="INSERT INTO data (timestampMs, latitude, longitude, accuracy, activity, act_accuracy) VALUES ('$timestampMs', $latitude, $longitude, $accuracy,NULL, NULL)";
		}*/
		$sql="INSERT INTO data (timestampMs, latitude, longitude, accuracy) VALUES ('$timestampMs', $latitude, $longitude, $accuracy)";
		// https://stackoverflow.com/questions/18171615/why-we-need-to-include-quotation-mark-when-inserting-string-variable-to-mysql-da#:~:text=PHP%20is%20merely%20constructing%20the%20query%20for%20you.&text=which%20is%20invalid%20syntax.,marks%20need%20to%20be%20added.
		if($conn->query($sql)===TRUE){ // uparxei kai pio grhgoros tropos
		}else{
			echo "<p>Error!</p>";
		}
	}
	$conn->close();
?>