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
	$types = null; // μτβλ η οποια αποθηκευει ολα αυτα τα activities για τα οποια υπαρχουν δεδομένα στον χρονο / μηνα π εισαγε ο χρηστης 

	$conn=mysqli_connect($servername,$username,$password,$DB);
	if (!$conn){
  		die("Connection failed: " . mysqli_connect_error());
	}
	mysqli_set_charset($conn,'utf8'); // gia upostiri3h ths ellhnikhs glwssas

	$userid = $_SESSION["uid"];

	$year = $_POST['year'];
	$month = $_POST['month'];
	
	$y_all="'".implode("','",$year)."'";
	$m_all = "'".implode("','",$month)."'";

	// pairnw ola ta entries gia ton sugkekrimeno user
	$all_entries = "SELECT COUNT(*) FROM data WHERE type!='' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all)";
	
	if($all_entries_res = mysqli_query($conn, $all_entries)){
		$res = mysqli_fetch_row($all_entries_res);
		$all_entries_val = $res[0];
		if($all_entries_val==0){
			echo "Δεν υπάρχουν εγγραφές"; 
      		exit; 
		}
	}
	
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
	$data_per_type = array_fill(0,count($types),0); // πινακας που αποθηκευει τα ποσοστα για το καθε activity αμεσως μετα την εκτελεση του query
	for($i=0;$i<count($types);$i++){
		$tmp = $types[$i];
		$sql_select = "SELECT COUNT(*) FROM data WHERE type='$tmp' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all)";
		if($r = mysqli_query($conn, $sql_select)){
			$res = mysqli_fetch_row($r);
			$data_per_type[$i] = number_format(($res[0]/$all_entries_val)*100,2); // percentage
		}
	}

	$result=[]; // πινακας που αποθηκευει σε μορφη key->value τα ποσοστα ωστε να ειναι ετοιμα για αποστολη
	for($i=0;$i<count($data_per_type);$i++){
		$result[$types[$i]] = $data_per_type[$i];
	}
	
	$hour_max_entries = '';
	$hour_per_type = array_fill(0,count($types),0); // πινακας που αποθηκευει την ωρα με τις περισσοτερες εγγραφες για το καθε activity αμεσως μετα την εκτελεση του query με βαση χρονο/μηνα
	$hour_per_type_count = array_fill(0, count($types), 0);// πινακας που αποθηκευει τον αριθμο των εγγραφων που εγιναν εκεινη την ωρα
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

	$result_hours = []; // πινακες που αποθηκευουν σε μορφη key->value τις ωρες/αριθμο εγγραφων ωστε να ειναι ετοιμα για αποστολη
	$result_hours_count = [];
	for($i=0;$i<count($hour_per_type);$i++){
		$result_hours[$types[$i]] = $hour_per_type[$i];
		$result_hours_count[$types[$i]] = $hour_per_type_count[$i];
	}

	$day_max_entries = '';
	$day_per_type = array_fill(0, count($types), 0); // πινακας που αποθηκευει την μερα με τις περισσοτερες εγγραφες για το καθε activity αμεσως μετα την εκτελεση του query με βαση χρονο/μηνα
	$day_per_type_count = array_fill(0, count($types), 0); // πινακας που αποθηκευει τον αριθμο των εγγραφων που εγιναν εκεινη την μερα
	for($i=0;$i<count($types);$i++){
		$tmp = $types[$i];
		$day_max_entries = "SELECT DAYNAME(act_timestampMs) AS day, COUNT(*) AS count FROM data WHERE type='$tmp' AND userid='$userid' AND YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all) GROUP BY DAYNAME(act_timestampMs) ORDER BY COUNT(*) DESC LIMIT 1";
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

	$result_days = []; // πινακες που αποθηκευουν σε μορφη key->value τις μερες/αριθμο εγγραφων ωστε να ειναι ετοιμα για αποστολη
	$result_days_count = [];
	for($i=0;$i<count($day_per_type);$i++){
		$result_days[$types[$i]] = $day_per_type[$i];
		$result_days_count[$types[$i]] = $day_per_type_count[$i];
	}

	// μετατρεπω τα δεδομενα σε json obj και τα εισάγω στον πινακα all_data που περιεχει ολα τα απαραιτητα δεδομενα 
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
	
	// ------------------------------------ HEATMAP -------------------------------------------------
	$latitude = [];
	$longitude = [];
	$freq_arr = []; // πινακς με τις συνχοτητες εμφανισης των συγκεκριμενων latitude longitude
	$idx = 0;
	$max_freq = 0; // μαξ θερμη τιμη 

	$heatmap_sql = "SELECT COUNT(*) as count,latitude,longitude FROM data WHERE YEAR(act_timestampMs) IN ($y_all) AND MONTHNAME(act_timestampMs) IN ($m_all) AND userid='$userid' GROUP BY latitude,longitude";

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