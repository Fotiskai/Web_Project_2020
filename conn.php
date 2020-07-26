<?php
	//include('draw.html');
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$DB_fields = array_fill(0,8,"");

	$myArr = json_decode($_POST['arr']);

	$conn = mysqli_connect($servername,$username,$password,$DB);
	if(!$conn){
		die("Connection Failed: " . mysqli_connect_error());
	}

	$len = count($myArr);
	for($i=0;$i<$len;$i++){
		$timestampMs = (int)$myArr[$i]->timestampMs/1000; // Date object expects the number of milliseconds since the epoch, hence the 1000-fold difference
		$timestampMs = date('Y-m-d H:i:s',$timestampMs);
		$latitude = $myArr[$i]->latitudeE7/1e7;
		$longitude = $myArr[$i]->longitudeE7/1e7;
		$accuracy = $myArr[$i]->accuracy;
		if(array_key_exists('heading', $myArr[$i])){
			$heading = $myArr[$i]->heading;
			$DB_fields[0] = ", heading";
			$DB_fields[4] = ", $heading";
		}
		if(array_key_exists('velocity', $myArr[$i])){
			$velocity = $myArr[$i]->velocity;
			$DB_fields[1] = ", velocity";
			$DB_fields[5] = ", $velocity";
		}
		if(array_key_exists('altitude', $myArr[$i])){
			$altitude = $myArr[$i]->altitude;
			$DB_fields[2] = ", altitude";
			$DB_fields[6] = ", $altitude";
		}
		if(array_key_exists('verticalAccuracy', $myArr[$i])){
			$verticalAccuracy = $myArr[$i]->verticalAccuracy;
			$DB_fields[3] = ", verticalAccuracy";
			$DB_fields[7] = ", $verticalAccuracy";
		}
		$sql .="INSERT INTO data (timestampMs, latitude, longitude, accuracy".$DB_fields[0].$DB_fields[1].$DB_fields[2].$DB_fields[3].") VALUES ('$timestampMs', $latitude, $longitude, $accuracy".$DB_fields[4].$DB_fields[5].$DB_fields[6].$DB_fields[7].");";
		$DB_fields = array_fill(0,8,"");
		echo "<p>{$sql}</p>";
		/* parsing gia to activity section tou json   , heading, velocity, altitude, verticalAccuracy   , $heading, $velocity, $altitud, $verticalAccuracy
		if(isset($myArr[$i]->activity)){
			$type = $myArr[$i]->activity->activity->type;
			$confidence = $myArr[$i]->activity->activity->confidence;
			$sql="INSERT INTO data (timestampMs, latitude, longitude, accuracy, activity, act_accuracy) VALUES ('$timestampMs', $latitude, $longitude, $accuracy, '$type', $confidence)";
		}else{
			$sql="INSERT INTO data (timestampMs, latitude, longitude, accuracy, activity, act_accuracy) VALUES ('$timestampMs', $latitude, $longitude, $accuracy,NULL, NULL)";
		}*/
		// https://stackoverflow.com/questions/18171615/why-we-need-to-include-quotation-mark-when-inserting-string-variable-to-mysql-da#:~:text=PHP%20is%20merely%20constructing%20the%20query%20for%20you.&text=which%20is%20invalid%20syntax.,marks%20need%20to%20be%20added.
	}
	if(mysqli_multi_query($conn,$sql)===TRUE){
	}else{
		echo "<p>Error!</p>";
	}
	mysqli_close($conn);
?>