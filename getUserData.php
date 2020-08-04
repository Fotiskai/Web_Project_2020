<?php
    session_start();
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$all_entries_val = 0;
	$all_data = []; // pinakas p periexei ola ta apotelesmata apo ta queries se json obj

	$conn=mysqli_connect("localhost","root","root","web2020");
	if (!$conn){
  		die("Connection failed: " . mysqli_connect_error());
	}
	mysqli_set_charset($conn,'utf8'); // gia upostiri3h ths ellhnikhs glwssas

	$userid =$_SESSION["uid"];
	//echo $userid;
	//echo "\n";
	$year = $_POST['year'];
	$month = $_POST['month'];
	$day = $_POST['day'];
	$hour = $_POST['hour'];
	$min  = $_POST['mins'];
	$act = $_POST['act'];
	//$a_all="'".implode("','",$act)."'";

	//language query
	$lang = "SET @@lc_time_names = 'el_GR'";
	if(mysqli_query($conn,$lang)){
		//pass
	}

	// pairnw ola ta entries gia ton sugkekrimeno user
	$all_entries = "SELECT COUNT(*) FROM data WHERE type!='' AND userid='$userid'";
	//echo $all_entries;
	//echo "\n";
	if($all_entries_res = mysqli_query($conn, $all_entries)){
		$res = mysqli_fetch_row($all_entries_res);
		$all_entries_val = $res[0];
	}
	//echo $all_entries_val;

	$sql_select = '';
	$data_per_type = array_fill(0,count($act),0);
	for($i=0;$i<count($act);$i++){
		$tmp = $act[$i];
		$sql_select = "SELECT COUNT(*) FROM data WHERE type='$tmp' AND userid='$userid'";
		if($r = mysqli_query($conn, $sql_select)){
			$res = mysqli_fetch_row($r);
			$data_per_type[$i] = number_format(($res[0]/$all_entries_val)*100,2); // percentage
		}
	}

	$result=[]; // pososta
	for($i=0;$i<count($data_per_type);$i++){
		$result[$act[$i]] = $data_per_type[$i];
	}
	
	$hour_max_entries = '';
	$hour_per_type = array_fill(0,count($act),0);
	for($i=0;$i<count($act);$i++){
		$tmp = $act[$i];
		$hour_max_entries = "SELECT HOUR(timestampMs) FROM data WHERE type='$tmp' AND userid='$userid' GROUP BY DAY(timestampMs) ORDER BY COUNT(*) DESC LIMIT 1";
		if($r = mysqli_query($conn,$hour_max_entries)){
			$res = mysqli_fetch_row($r);
			if($res==null){
				$hour_per_type[$i] = 'None';
			}else{
				$hour_per_type[$i] = $res[0];
			}
		}
	}

	$result_hours = []; // wres
	for($i=0;$i<count($hour_per_type);$i++){
		$result_hours[$act[$i]] = $hour_per_type[$i];
	}

	$day_max_entries = '';
	$day_per_type = array_fill(0, count($act), 0);
	for($i=0;$i<count($act);$i++){
		$tmp = $act[$i];
		$day_max_entries = "SELECT DAYNAME(timestampMs) FROM data WHERE type='$tmp' AND userid='$userid' GROUP BY WEEK(timestampMs) ORDER BY COUNT(*) DESC LIMIT 1";
		if($r = mysqli_query($conn,$day_max_entries)){
			$res = mysqli_fetch_row($r);
			if($res==null){
				$day_per_type[$i] = 'None';
			}else{
				$day_per_type[$i] = $res[0];
			}
		}
	}

	$result_days = []; // meres
	for($i=0;$i<count($day_per_type);$i++){
		$result_days[$act[$i]] = $day_per_type[$i];
	}

	$counts = json_encode($result);
	$hours = json_encode($result_hours);
	$days = json_encode($result_days);
	$all_data[0] = $counts;
	$all_data[1] = $hours;
	$all_data[2] = $days;
	$lang = "SET @@lc_time_names = 'en_US'"; // reset sto default
	if(mysqli_query($conn,$lang)){
		//pass
	}
	
	// ------------------------------------ HEATMAP -------------------------------------------------
	$latitude = [];
	$longitude = [];
	$freq_arr = [];
	$idx = 0;
	$max_freq = 0;

	$y_all="'".implode("','",$year)."'";
	$m_all="'".implode("','",$month)."'";
	$d_all="'".implode("','",$day)."'";
	$h_all="'".implode("','",$hour)."'";
	$min_all="'".implode("','",$min)."'";
	$a_all="'".implode("','",$act)."'";
	//echo $y_all;
	//echo $m_all;
	//echo $d_all;
	//echo $h_all;
	//echo $min_all;

	$heatmap_sql = "SELECT COUNT(*) as count,latitude,longitude FROM(SELECT latitude,longitude FROM data WHERE YEAR(timestampMs) IN ($y_all) AND MONTHNAME(timestampMs) IN ($m_all) AND DAYNAME(timestampMs) IN ($d_all) AND HOUR(timestampMs) IN ($h_all) AND MINUTE(timestampMs) IN ($min_all) AND type IN ($a_all) AND userid='$userid')filterred_arr GROUP BY filterred_arr.latitude,filterred_arr.longitude";

	if($heatmap_res = mysqli_query($conn,$heatmap_sql)){
		if(mysqli_num_rows($heatmap_res)>0){
			while($row = mysqli_fetch_assoc($heatmap_res)){
				$latitude[$idx] = $row["latitude"];
				$longitude[$idx] = $row["longitude"];
				$freq_arr[$idx] = $row["count"];
				$idx+=1;
			}
		}
	}
	// briskoume thn pio thermh timh
	foreach($freq_arr as $value){
		if($value>$max_freq) $max_freq = $value;
	}

	$all_data_heat = '[';
	for($i=0;$i<count($latitude);$i++){
		$all_data_heat .= "{lat: ".$latitude[$i].", lng: ".$longitude[$i].", count: ".$freq_arr[$i]."},";
	}
	$all_data_heat.="]";

	// --------------------------- SEND DATA --------------------------------------
	echo $all_data[0]."|".$all_data[1]."|".$all_data[2]."|".$all_data_heat."|".$max_freq;

	mysqli_close($conn);

?>