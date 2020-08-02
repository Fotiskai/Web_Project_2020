<?php

	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";
  $conn = new mysqli($servername,$username,$password,$DB);
	if($conn->connect_error){
		die("Connection Failed: " . $conn->connect_error);
	}
mysqli_set_charset($conn,'utf8');

$cnt_IN_VEHICLE=0;
$cnt_ON_BICYCLE=0;
$cnt_ON_FOOT=0;
$cnt_RUNNING=0;
$cnt_STILL=0;
$cnt_TILTING=0;
$cnt_UNKNOWN=0;
$cnt_WALKING=0;
$cnt_IN_RAIL_VEHICLE=0;
$cnt_IN_ROAD_VEHICLE=0;
$cnt_IN_FOUR_WHEELER_VEHICLE=0;
$cnt_IN_CAR=0;
$cnt_IN_BUS=0;
$cnt_EXITING_VEHICLE=0;
$cnt_IN_TWO_WHEELER_VEHICLE=0;

$sql="SELECT COUNT(*) as total FROM activities";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$totalact=$result["total"];

$query="SELECT type FROM activities";
$result = mysqli_query($conn, $query);
if (mysqli_num_rows($result) > 0) {
     // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
		if($row['type'] == 'IN_VEHICLE'){
			$cnt_IN_VEHICLE++;
		}
		if($row['type'] == 'ON_BICYCLE'){
			$cnt_ON_BICYCLE++;
		}
		if($row['type'] == 'ON_FOOT'){
			$cnt_ON_FOOT++;
		}
		if($row['type'] == 'RUNNING'){
			$cnt_RUNNING++;
		}
		if($row['type'] == 'STILL'){
			$cnt_STILL++;
		}
		if($row['type'] == 'TILTING'){
			$cnt_TILTING++;
		}
		if($row['type'] == 'UNKNOWN'){
			$cnt_UNKNOWN++;
		}
		if($row['type'] == 'WALKING'){
			$cnt_WALKING++;
		}
		if($row['type'] == 'IN_RAIL_VEHICLE'){
			$cnt_IN_RAIL_VEHICLE++;
		}
		if($row['type'] == 'IN_ROAD_VEHICLE'){
			$cnt_IN_ROAD_VEHICLE++;
		}
		if($row['type'] == 'IN_FOUR_WHEELER_VEHICLE'){
			$cnt_IN_FOUR_WHEELER_VEHICLE++;
		}
		if($row['type'] == 'IN_CAR'){
			$cnt_IN_CAR++;
		}
		if($row['type'] == 'IN_BUS'){
			$cnt_IN_BUS++;
		}
		if($row['type'] == 'EXITING_VEHICLE'){
			$cnt_EXITING_VEHICLE++;
		}
		if($row['type'] == 'IN_TWO_WHEELER_VEHICLE'){
			$cnt_IN_TWO_WHEELER_VEHICLE++;
		}
		if($row['type'] != 'EXITING_VEHICLE' &&  $row['type'] != 'IN_BUS' && $row['type'] != 'IN_CAR' && $row['type'] != 'IN_FOUR_WHEELER_VEHICLE' && $row['type'] != 'IN_ROAD_VEHICLE' && $row['type'] != 'IN_RAIL_VEHICLE'
		&& $row['type'] != 'WALKING' && $row['type'] != 'UNKNOWN' && $row['type'] != 'TILTING' && $row['type'] != 'STILL' && $row['type'] != 'RUNNING' && $row['type'] != 'ON_FOOT'
		&& $row['type'] != 'ON_BICYCLE' && $row['type'] != 'IN_VEHICLE' && $row['type'] != 'IN_TWO_WHEELER_VEHICLE'){
			echo $row['type'];
		}
    }
}else{
    echo "0 results";
}

$IN_VEHICLE = round(($cnt_IN_VEHICLE/$totalact)*100,2);
$ON_BICYCLE = round(($cnt_ON_BICYCLE/$totalact)*100,2);
$ON_FOOT = round(($cnt_ON_FOOT/$totalact)*100,2);
$RUNNING = round(($cnt_RUNNING/$totalact)*100,2);
$STILL = round(($cnt_STILL/$totalact)*100,2);
$TILTING= round(($cnt_TILTING/$totalact)*100,2);
$UNKNOWN= round(($cnt_UNKNOWN/$totalact)*100,2);
$WALKING = round(($cnt_WALKING/$totalact)*100,2) ;
$IN_RAIL_VEHICLE = round(($cnt_IN_RAIL_VEHICLE/$totalact)*100,2) ;
$IN_ROAD_VEHICLE = round(($cnt_IN_ROAD_VEHICLE/$totalact)*100,2);
$IN_FOUR_WHEELER_VEHICLE= round(($cnt_IN_FOUR_WHEELER_VEHICLE/$totalact)*100,2);
$IN_CAR= round(($cnt_IN_CAR/$totalact)*100,2);
$IN_BUS = round(($cnt_IN_BUS/$totalact)*100,2) ;
$EXITING_VEHICLE = round(($cnt_EXITING_VEHICLE/$totalact)*100,2);
$IN_TWO_WHEELER_VEHICLE = round(($cnt_IN_TWO_WHEELER_VEHICLE/$totalact)*100,2);


$dataPoints = array("IN_VEHICLE"=> $IN_VEHICLE,
	"ON_BICYCLE"=> $ON_BICYCLE,
	"ON_FOOT"=> $ON_FOOT,
	"RUNNING"=> $RUNNING,
	"STILL"=> $STILL,
	"TILTING"=> $TILTING,
	"UNKNOWN"=> $UNKNOWN,
	"WALKING" => $WALKING,
	"IN_RAIL_VEHICLE" => $IN_RAIL_VEHICLE,
	"IN_ROAD_VEHICLE" => $IN_ROAD_VEHICLE,
	"IN_FOUR_WHEELER_VEHICLE" => $IN_FOUR_WHEELER_VEHICLE,
	"IN_CAR" => $IN_CAR,
	"IN_BUS" => $IN_BUS,
	"EXITING_VEHICLE" => $EXITING_VEHICLE,
	"IN_TWO_WHEELER_VEHICLE" => $IN_TWO_WHEELER_VEHICLE
);


$sql="SELECT COUNT(*) as total FROM data";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$total=$result["total"];

$sql="SELECT username,userid FROM usercred";
$result=mysqli_query($conn,$sql);
if(mysqli_num_rows($result) > 0){
    while($row = mysqli_fetch_assoc($result)) {
    	  $uid=$row["userid"];
    	  $username=$row["username"];
          $sql="SELECT COUNT(*) as usercount FROM data WHERE userid='$uid'";
          $res=mysqli_query($conn,$sql);
          $res=mysqli_fetch_assoc($res);
          $u_r_count[$username]=round(($res["usercount"]/$total)*100,2);
          
    }
}

for($i=1;$i<=12;$i++){
    $sql="SELECT COUNT(*) as monthcount FROM data WHERE MONTH(timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $m_count[$i]=round(($res["monthcount"]/$total)*100,2);  	
}

$count_per_month=array(
"Ιανουάριος" => $m_count[1],
"Φεβρουάριος" => $m_count[2],
"Μάρτιος" => $m_count[3],
"Απρίλιος" => $m_count[4],
"Μάιος" => $m_count[5],
"Ιούνιος" => $m_count[6],
"Ιούλιος" => $m_count[7],
"Αύγουστος" => $m_count[8],
"Σεμπτέμβρης" => $m_count[9],
"Οκτόβρης" => $m_count[10],
"Νοέμβριος" => $m_count[11],
"Δεκέμβριος" => $m_count[12],
);

$tmp_array=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
for($i=0;$i<7;$i++){
    $sql="SELECT COUNT(*) as daycount FROM data WHERE DAYNAME(timestampMs)='$tmp_array[$i]'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $d_count[$i]=round(($res["daycount"]/$total)*100,2);    	
}

$count_per_day=array(
"Δευτέρα" => $d_count[0],
"Τρίτη" => $d_count[1],
"Τετάρτη" => $d_count[2],
"Πέμπτη" => $d_count[3],
"Παρασκευή" => $d_count[4],
"Σάββατο" => $d_count[5],
"Κυριακή" => $d_count[6],
);

for($i=0;$i<=23;$i++){
    $sql="SELECT COUNT(*) as hourcount FROM data WHERE HOUR(timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $h_count[$i]=round(($res["hourcount"]/$total)*100,2);    	
}

$tmp=2014;
for($i=0;$i<=6;$i++){
    $sql="SELECT COUNT(*) as yearcount FROM data WHERE YEAR(timestampMs)='$tmp'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $y_count[$i]=round(($res["yearcount"]/$total)*100,2);
    $tmp+=1;	
}

$count_per_year=array(
"2014" => $y_count[0],
"2015" => $y_count[1],
"2016" => $y_count[2],
"2017" => $y_count[3],
"2018" => $y_count[4],
"2019" => $y_count[5],
"2020" => $y_count[6],
);

$r = array($dataPoints,$u_r_count,$count_per_month,$count_per_day,$h_count,$count_per_year);
echo json_encode($r);

mysqli_close($conn);

?>
