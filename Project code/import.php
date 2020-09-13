<?php
    session_start();
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$DB_fields = array_fill(0,4,"NULL"); // Πινακας για τα 5 πρωτα πεδια στην DB
	date_default_timezone_set('Europe/Athens');

	$myArr = json_decode($_POST['arr']); 
	$sql = '';
	$sql_act = '';
	$usrid_test=$_SESSION["uid"];
    $conn = mysqli_connect($servername,$username,$password,$DB);
	if(!$conn){
		die("Connection Failed: " . mysqli_connect_error());
	}
	mysqli_set_charset($conn,'utf8');

	$max_id_q = "SELECT MAX(id) as max FROM data"; // query για να παρω τον μαξ id δλδ το id της τελευταιας εγγραφης ωστε αν ο χρηστης ξανα εισαγει δεδομενα το id να συνεχεισει απο εκει π σταματησε και οχι απο το 0
	$id_res = mysqli_query($conn,$max_id_q);
	$id_max = mysqli_fetch_assoc($id_res);

	$max_conf = null; // μτβλ που αποθηκευει το μαξ confidence 
	$max_type = null; // μτβλ που αποθηκευει το activity με το μαξ confidence
	$max_time = null; // μτβλ που αποθηκευει την χρονικη στιγμη που εγινε το συγκεκριμενο activity
	$len = count($myArr);
	for($i=0;$i<$len;$i++){
		$act_timestampMs=null;
	    $type=null;
	    $act_timestampMs=null;
	    $confidence=null;
	    if(!array_key_exists('activity', $myArr[$i])) continue;

		$timestampMs = (int)$myArr[$i]->timestampMs/1000; // Date object expects the number of milliseconds since the epoch, hence the 1000-fold difference
		$timestampMs = date('Y-m-d H:i:s',$timestampMs);
		$latitude = $myArr[$i]->latitudeE7/1e7;
		$longitude = $myArr[$i]->longitudeE7/1e7;
		$accuracy = $myArr[$i]->accuracy;
		if(array_key_exists('heading', $myArr[$i])){
			$heading = $myArr[$i]->heading;
			$DB_fields[0] = "$heading";
		}
		if(array_key_exists('velocity', $myArr[$i])){
			$velocity = $myArr[$i]->velocity;
			$DB_fields[1] = "$velocity";
		}
		if(array_key_exists('altitude', $myArr[$i])){
			$altitude = $myArr[$i]->altitude;
			$DB_fields[2] = "$altitude";
		}
		if(array_key_exists('verticalAccuracy', $myArr[$i])){
			$verticalAccuracy = $myArr[$i]->verticalAccuracy;
			$DB_fields[3] = "$verticalAccuracy";
		}
		if(array_key_exists('activity', $myArr[$i])){ // μπαινει στην if αν ο πινακας που διαβαζει εχει τομεα 'activity'.
			$activity_array = $myArr[$i]->activity;
			$activity_array_len = count($activity_array);
			for($j=0;$j<$activity_array_len;$j++){
				$act_timestampMs = (int)$activity_array[$j]->timestampMs/1000; // Date object expects the number of milliseconds since the epoch, hence the 1000-fold difference
				$act_timestampMs = date('Y-m-d H:i:s',$act_timestampMs);
				$activity_sub_array = $activity_array[$j]->activity;				
				for($k=0;$k<count($activity_sub_array);$k++){
					if($k==0 and $max_conf==null){ // αν ειμαστε στην πρωτη θεση του υπο-πινακα activities που υπαρχει μεσα στον πινακα activities και η τιμη max_conf ειναι null
					   $type = $activity_sub_array[$k]->type;
					   $confidence = $activity_sub_array[$k]->confidence;
					   $max_conf = $confidence;
					   $max_type = $type;
					   $max_time = $act_timestampMs;
					}else if($k==0 and $max_conf!=null and $activity_sub_array[$k]->confidence>=$max_conf){ // αν ειμαστε στην πρωτη θεση του υπο-πινακα activities που υπαρχει μεσα στον πινακα activities και η τιμη max_conf δεν ειναι null και το confidence που εχει ενα activity ειναι μεγαλυτερο απο το max_conf τοτε αντικατεστησε τα max_conf, max_type, max_time με τις νεες μεγιστες τιμες τους
						$type = $activity_sub_array[$k]->type;
					   	$confidence = $activity_sub_array[$k]->confidence;
					   	$max_conf = $confidence;
					   	$max_type = $type;
					   	$max_time = $act_timestampMs;
					}else if($k==0 and $max_conf!=null and $activity_sub_array[$k]->confidence<$max_conf){
						$type = $activity_sub_array[$k]->type;
					   	$confidence = $activity_sub_array[$k]->confidence;
					}
					if($k>=1 && $activity_sub_array[$k]->confidence>$max_conf){
					   $type = $activity_sub_array[$k]->type;
					   $confidence = $activity_sub_array[$k]->confidence;
					   $max_conf = $confidence;
					   $max_type = $type;
					   $max_time = $act_timestampMs;				   
					}
				}
			}
		}
		if($id_max==null){ // αν δεν υπαρχουν εγγραφες στην DB
			$idq = $i; // το idq ακολουθει το i 
		}else{
			$idq = $id_max['max'] + $i + 1; // αλλιως το idq ξεκιναει απο το id της τελευταιας εγγραφης που υπαρχει στην DB και μετα αυ3ανει κατα i+1
		}
		$sql .= "('$idq','$timestampMs', $latitude, $longitude, $accuracy, ".$DB_fields[0].", ".$DB_fields[1].", ".$DB_fields[2].", ".$DB_fields[3].", '$max_type','$max_conf','$max_time','".$usrid_test."'), "; // μεταβλητη που αποθηκευει τις πιο πανω τιμες ωστε να τις εισαγω στην DB αργοτερα
		$max_conf=null;
		$max_type=null;
		$max_time = null;
	}	
	
	$len_str = strlen($sql);
	$sql[$len_str-2] = ';';
	$sql_d = "INSERT INTO data (id,timestampMs, latitude, longitude, accuracy, heading, velocity, altitude, verticalAccuracy,type,confidence,act_timestampMs ,userid) VALUES".$sql;
	if(mysqli_query($conn,$sql_d)){
		echo "Done Data\n";
	}else{
		echo "\n [+]sql Error".mysqli_error($conn)."<br>";
	}
    $lastUpload=date('Y-m-d');
	$sql="UPDATE usercred SET lastUpload='$lastUpload' WHERE userid='$usrid_test'";
	
	mysqli_query($conn,$sql);
	countscore();
	echo "done";
	mysqli_close($conn);
	//echo "Done!";


function countscore(){
	global $conn;
	global $usrid_test;
    $sql="SELECT COUNT(*) as vehicle FROM data WHERE MONTH(timestampMs) = MONTH(CURRENT_DATE()) AND YEAR(timestampMs) = YEAR(CURRENT_DATE()) AND type IN('IN_VEHICLE','IN_RAIL_VEHICLE','IN_ROAD_VEHICLE','IN_FOUR_WHEELER_VEHICLE','IN_CAR','IN_TWO_WHEELER_VEHICLE','IN_BUS')";
    $result=mysqli_query($conn,$sql);
    $veh_count=mysqli_fetch_assoc($result);
    $sql="SELECT COUNT(*) as walk FROM data WHERE MONTH(timestampMs) = MONTH(CURRENT_DATE()) AND YEAR(timestampMs) = YEAR(CURRENT_DATE()) AND type IN('ON_BICYCLE','ON_FOOT','WALKING','RUNNING',)";
    $result=mysqli_query($conn,$sql);
    $walk_count=mysqli_fetch_assoc($result);
    if($veh_c["walk"]==0) $score=0;
    else if($veh_count["vehicle"]==0) $score=100;
    else $score=round(($walk_count["walk"]/($veh_count["vehicle"]+$walk_count["walk"]))*100,2);
	$sql="UPDATE usercred SET currentScore=$score WHERE userid='$usrid_test'";
	mysqli_query($conn,$sql); 	
}	
?>