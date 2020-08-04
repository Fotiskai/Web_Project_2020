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

$type=[];
$percent=[];
$i=0;

$sql="SELECT COUNT(*) as total FROM data WHERE type !=''";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$totalact=$result["total"];

$sql="SELECT type,COUNT(*) as count FROM data WHERE type!='' GROUP BY type";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
     // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
    	$type[$i]=$row["type"];
    	$cnt=$row["count"];
    	$percent[$i]=round(($cnt/$totalact)*100,2);
    	$i+=1;
		/*
		if($row['type'] != 'EXITING_VEHICLE' &&  $row['type'] != 'IN_BUS' && $row['type'] != 'IN_CAR' && $row['type'] != 'IN_FOUR_WHEELER_VEHICLE' && $row['type'] != 'IN_ROAD_VEHICLE' && $row['type'] != 'IN_RAIL_VEHICLE'
		&& $row['type'] != 'WALKING' && $row['type'] != 'UNKNOWN' && $row['type'] != 'TILTING' && $row['type'] != 'STILL' && $row['type'] != 'RUNNING' && $row['type'] != 'ON_FOOT'
		&& $row['type'] != 'ON_BICYCLE' && $row['type'] != 'IN_VEHICLE' && $row['type'] != 'IN_TWO_WHEELER_VEHICLE'){
			echo $row['type'];
		}
		*/
    }
}else{
    echo "0 results";
}

$i=0;
foreach($percent as $value){
	$key=$type[$i];	
	$dataPoints[$key]=$value;
	$i+=1;
}

$sql="SELECT username,userid FROM usercred";
$result=mysqli_query($conn,$sql);
if(mysqli_num_rows($result) > 0){
    while($row = mysqli_fetch_assoc($result)) {
    	  $uid=$row["userid"];
    	  $username=$row["username"];
          $sql="SELECT COUNT(*) as usercount FROM data WHERE userid='$uid'";
          $res=mysqli_query($conn,$sql);
          $res=mysqli_fetch_assoc($res);
          $u_r_count[$username]=$res["usercount"];
          
    }
}

arsort($u_r_count);

for($i=1;$i<=12;$i++){
    $sql="SELECT COUNT(*) as monthcount FROM data WHERE MONTH(timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $m_count[$i]=$res["monthcount"];  	
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
    $d_count[$i]=$res["daycount"];    	
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
    $h_count[$i]=$res["hourcount"];    	
}

$sql="SELECT MIN(YEAR(timestampMs)) as minumum, MAX(YEAR(timestampMs)) as maximum FROM data";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$mindate=$result["minumum"];
$maxdate=$result["maximum"];

for($i=$mindate;$i<=$maxdate;$i++){
    $sql="SELECT COUNT(*) as yearcount FROM data WHERE YEAR(timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $y_count[$i]=$res["yearcount"];	
}


$r = array($dataPoints,$u_r_count,$count_per_month,$count_per_day,$h_count,$y_count);
echo json_encode($r);
mysqli_close($conn);

?>
