<?php
   session_start();
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

	$all_entries_val = 0;
	$all_data = []; // pinakas p periexei ola ta apotelesmata apo ta queries se json obj
	$all_data_heat = null;
	$max_freq = null;
	$flag = false; // shmaia h opoio deixnei an o heatmap exei data gia to sugkekrimeno timestamp
	$types = null;

	$conn=mysqli_connect($servername,$username,$password,$DB);
	if (!$conn){
  		die("Connection failed: " . mysqli_connect_error());
	}
	mysqli_set_charset($conn,'utf8'); // gia upostiri3h ths ellhnikhs glwssas

	$userid = $_SESSION["uid"]; //file_get_contents('userid.txt');
	//echo $userid;
	//echo "\n";
	$year = $_POST['year'];
	$month = $_POST['month'];
	//$day = $_POST['day'];
	//$hour = $_POST['hour'];
	//$min  = $_POST['mins'];
	//$act = $_POST['act'];
	//
	$y_all="'".implode("','",$year)."'";
	$m_all = "'".implode("','",$month)."'";

	// pairnw ola ta entries gia ton sugkekrimeno user
	$all_entries = "SELECT COUNT(*) FROM data WHERE type!='' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all)";
	//echo $all_entries;
	//echo "\n";
	if($all_entries_res = mysqli_query($conn, $all_entries)){
		$res = mysqli_fetch_row($all_entries_res);
		$all_entries_val = $res[0];
		if($all_entries_val==0){
			echo "Δεν υπάρχουν εγγραφές"; 
      		exit; 
		}
	}
	//echo $all_entries_val;
	$type_sql = "SELECT DISTINCT type FROM data WHERE userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all)";
	if($type_res = mysqli_query($conn,$type_sql)){
		$idx = 0;
		if(mysqli_num_rows($type_res)>0){
			while($row = mysqli_fetch_assoc($type_res)){
				$types[$idx] = $row['type'];
				$idx+=1;
			}
		}else{
			echo "Error!";
			exit;
		}
	}

	$sql_select = '';
	$data_per_type = array_fill(0,count($types),0);
	for($i=0;$i<count($types);$i++){
		$tmp = $types[$i];
		$sql_select = "SELECT COUNT(*) FROM data WHERE type='$tmp' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all)";
		if($r = mysqli_query($conn, $sql_select)){
			$res = mysqli_fetch_row($r);
			$data_per_type[$i] = number_format(($res[0]/$all_entries_val)*100,2); // percentage
		}
	}

	$result=[]; // pososta
	for($i=0;$i<count($data_per_type);$i++){
		$result[$types[$i]] = $data_per_type[$i];
	}
	
	$hour_max_entries = '';
	$hour_per_type = array_fill(0,count($types),0);
	$hour_per_type_count = array_fill(0, count($types), 0);
	for($i=0;$i<count($types);$i++){
		$tmp = $types[$i];
		$hour_max_entries = "SELECT HOUR(act_timestampMs), COUNT(*) as count  FROM data WHERE type='$tmp' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all) GROUP BY HOUR(act_timestampMs) ORDER BY COUNT(*) DESC LIMIT 1";
		if($r = mysqli_query($conn,$hour_max_entries)){
			$res = mysqli_fetch_row($r);
			if($res==null){
				$hour_per_type[$i] = 'None';
				$hour_per_type_count[$i] = 'None';
			}else{
				$hour_per_type[$i] = $res[0];
				$hour_per_type_count[$i] = $res[1];
			}
		}
	}

	$result_hours = []; // wres
	$result_hours_count = [];
	for($i=0;$i<count($hour_per_type);$i++){
		$result_hours[$types[$i]] = $hour_per_type[$i];
		$result_hours_count[$types[$i]] = $hour_per_type_count[$i];
	}
	/*
	//language query
	$lang = "SET @@lc_time_names = 'el_GR'";
	if(mysqli_query($conn,$lang)){
		//pass
	}*/

	$day_max_entries = '';
	$day_per_type = array_fill(0, count($types), 0);
	$day_per_type_count = array_fill(0, count($types), 0);
	for($i=0;$i<count($types);$i++){
		$tmp = $types[$i];
		$day_max_entries = "SELECT DAYNAME(act_timestampMs) AS day, COUNT(*) AS count FROM data WHERE type='$tmp' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all) GROUP BY DAY(act_timestampMs) ORDER BY COUNT(*) DESC LIMIT 1";
		if($r = mysqli_query($conn,$day_max_entries)){
			$res = mysqli_fetch_assoc($r);
			if($res['day']==null){
				$day_per_type[$i] = 'None';
				$day_per_type_count = 'None';
			}else{
				$day_per_type[$i] = $res['day'];
				$day_per_type_count[$i] = $res['count'];
			}
		}
	}

	$result_days = []; // meres
	$result_days_count = [];
	for($i=0;$i<count($day_per_type);$i++){
		$result_days[$types[$i]] = $day_per_type[$i];
		$result_days_count[$types[$i]] = $day_per_type_count[$i];
	}

	$counts = json_encode($result);
	$hours = json_encode($result_hours);
	$days = json_encode($result_days);
	$h_count = json_encode($result_hours_count);
	$d_count = json_encode($result_days_count);
	$all_data[0] = $counts;
	$all_data[1] = $hours;
	$all_data[2] = $days;
	$all_data[3] = $h_count;
	$all_data[4] = $d_count;
	/*
	$lang = "SET @@lc_time_names = 'en_US'"; // reset sto default
	if(mysqli_query($conn,$lang)){
		//pass
	}*/
	
	// ------------------------------------ HEATMAP -------------------------------------------------
	$latitude = [];
	$longitude = [];
	$freq_arr = [];
	$idx = 0;
	$max_freq = 0;
	/*
	$y_all="'".implode("','",$year)."'";
	$m_all="'".implode("','",$month)."'";
	$d_all="'".implode("','",$day)."'";
	$h_all="'".implode("','",$hour)."'";
	$min_all="'".implode("','",$min)."'";
	$a_all="'".implode("','",$act)."'";
	*/
	//echo $y_all;
	//echo $m_all;
	//echo $d_all;
	//echo $h_all;
	//echo $min_all;

	$heatmap_sql = "SELECT COUNT(*) as count,latitude,longitude FROM(SELECT latitude,longitude FROM data WHERE YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all) AND userid='$userid')filterred_arr GROUP BY filterred_arr.latitude,filterred_arr.longitude";

	if($heatmap_res = mysqli_query($conn,$heatmap_sql)){
		if(mysqli_num_rows($heatmap_res)>0){
			while($row = mysqli_fetch_assoc($heatmap_res)){
				$latitude[$idx] = $row["latitude"];
				$longitude[$idx] = $row["longitude"];
				$freq_arr[$idx] = $row["count"];
				$idx+=1;
			}
		}else{
			$flag = true;
		}
	}
	if($flag==false){
		// briskoume thn pio thermh timh
		foreach($freq_arr as $value){
			if($value>$max_freq) $max_freq = $value;
		}

		$all_data_heat = '[';
		for($i=0;$i<count($latitude);$i++){
			$all_data_heat .= "{lat: ".$latitude[$i].", lng: ".$longitude[$i].", count: ".$freq_arr[$i]."},";
		}
		$all_data_heat.="]";
		echo $all_data[0]."|".$all_data[1]."|".$all_data[2]."|".$all_data_heat."|".$max_freq."|".$all_data[3]."|".$all_data[4];
	}else{
		echo $all_data[0]."|".$all_data[1]."|".$all_data[2]."|".'null'."|".'null'."|".$all_data[3]."|".$all_data[4];
	}

	mysqli_close($conn);

?>