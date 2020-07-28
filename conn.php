<?php
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$DB_fields = array_fill(0,4,"NULL");

	$myArr = json_decode($_POST['arr']);
	$sql = '';
	$sql_act = '';
	$usrid_test=file_get_contents('userid.txt'); // anti gia to userid pou tha paragetai mesw tou reg form
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
			//$DB_fields[0] = ", heading";
			$DB_fields[0] = "$heading";
		}
		if(array_key_exists('velocity', $myArr[$i])){
			$velocity = $myArr[$i]->velocity;
			//$DB_fields[1] = ", velocity";
			$DB_fields[1] = "$velocity";
		}
		if(array_key_exists('altitude', $myArr[$i])){
			$altitude = $myArr[$i]->altitude;
			//$DB_fields[2] = ", altitude";
			$DB_fields[2] = "$altitude";
		}
		if(array_key_exists('verticalAccuracy', $myArr[$i])){
			$verticalAccuracy = $myArr[$i]->verticalAccuracy;
			//$DB_fields[3] = ", verticalAccuracy";
			$DB_fields[3] = "$verticalAccuracy";
		}
		$sql .= "('$timestampMs', $latitude, $longitude, $accuracy, ".$DB_fields[0].", ".$DB_fields[1].", ".$DB_fields[2].", ".$DB_fields[3].", '".$usrid_test."'), ";
		/*
		$sql .="INSERT INTO data (timestampMs, latitude, longitude, accuracy".$DB_fields[0].$DB_fields[1].$DB_fields[2].$DB_fields[3].") VALUES ('$timestampMs', $latitude, $longitude, $accuracy".$DB_fields[4].$DB_fields[5].$DB_fields[6].$DB_fields[7].");";*/
		$DB_fields = array_fill(0,4,"NULL");
		// https://stackoverflow.com/questions/18171615/why-we-need-to-include-quotation-mark-when-inserting-string-variable-to-mysql-da#:~:text=PHP%20is%20merely%20constructing%20the%20query%20for%20you.&text=which%20is%20invalid%20syntax.,marks%20need%20to%20be%20added.
	}
	//echo $sql;
	$len_str = strlen($sql);
	$sql[$len_str-2] = ';';
	$sql_d = "INSERT INTO data (timestampMs, latitude, longitude, accuracy, heading, velocity, altitude, verticalAccuracy, userid) VALUES".$sql;
	if(mysqli_query($conn,$sql_d)){
		echo "Done Data\n";
	}else{
		echo "\n [+]sql Error".mysqli_error($conn)."<br>";
	}
	mysqli_close($conn);
	$conn = mysqli_connect($servername,$username,$password,$DB);
	for($i=0;$i<$len;$i++){
		if(array_key_exists('activity', $myArr[$i])){
			$activity_array = $myArr[$i]->activity;
			$activity_array_len = count($activity_array);
			for($j=0;$j<$activity_array_len;$j++){
				$act_timestampMs = (int)$activity_array[$j]->timestampMs/1000; // Date object expects the number of milliseconds since the epoch, hence the 1000-fold difference
				$act_timestampMs = date('Y-m-d H:i:s',$act_timestampMs);
				$activity_sub_array = $activity_array[$j]->activity;
				//$activity_sub_array_len = count($activity_sub_array);
				for($k=0;$k<count($activity_sub_array);$k++){
					$type = $activity_sub_array[$k]->type;
					//echo "data type:".$type."<br>";
					$confidence = $activity_sub_array[$k]->confidence;
					//echo "Type:".$type.",,,,".$confidence."\n"; 
					$sql_act .="('$type', $confidence, '$act_timestampMs', '$usrid_test'), ";
				}
			}
		}
	}
	$len_str = strlen($sql_act);
	$sql_act[$len_str-2] = ';';
	$sql_t = "INSERT INTO activities (type, confidence, timestampMs, userid) VALUES".$sql_act;
	//echo $sql_t;
	if(mysqli_query($conn,$sql_t)===TRUE){ // na to 3anaprospa8hsw me multi query alla an thesh pinaka kai meta na apaloifw to variable
		echo "Done Act\n";
	}else{
		echo "\n [+]act sql Error ".mysqli_error($conn)."<br>";
	}
	echo "done";
	mysqli_close($conn);
	//echo "Done!";
?>