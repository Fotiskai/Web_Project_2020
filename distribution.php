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


$sql="SELECT COUNT(*) as total FROM data WHERE type !=''";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$totalact=$result["total"];

$sql="SELECT type,COUNT(*) as count FROM data WHERE type!='' GROUP BY type";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
     // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
    	$type=$row["type"];
    	$cnt=$row["count"];
    	$percent=round(($cnt/$totalact)*100,2);
    	$dataPoints[$type]=$percent;
    }
}else{
    echo "0 results";
}


$sql="SELECT COUNT(DISTINCT(userid)) as count FROM data ";
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$count=$result["count"];
$k=ceil(sqrt($count));

$tmp=floor($totalact/$k);
$start=0;
$finish=$tmp;
$buckets[0]=$start . "-" . $finish;
for($i=1;$i<$k;$i++){
   $start=$finish+1;
   $finish=$finish + $tmp;
   $buckets[$i]=$start . "-" . $finish;
}
if($totalact-$finish!=0){
$last=($finish+1) ."-". ($finish+($totalact-$finish));
array_push($buckets,$last);
}

for($i=0;$i<$k;$i++){
	$key=$buckets[$i];
	$split=explode('-',$buckets[$i]);
	$sql="SELECT COUNT(*) as usercount FROM (SELECT DISTINCT(userid) FROM data GROUP BY userid HAVING COUNT(*) BETWEEN $split[0] AND $split[1] )sub";
    $res=mysqli_query($conn,$sql);
    $row = mysqli_fetch_assoc($res);
    if ($row["usercount"]==0) break;
    $u_r_count[$key]=$row["usercount"];
}


for($i=1;$i<=12;$i++){//fetch data from act_timestampMs pou afora tous mhnes
    $sql="SELECT COUNT(*) as monthcount FROM data WHERE MONTH(act_timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $m_count[$i]=$res["monthcount"];
}

$count_per_month=array(//store gia ka8e mhna poses eggrafes exoume
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
for($i=0;$i<7;$i++){ //fetch data from act_timestampMs pou afora tis hmeres
    $sql="SELECT COUNT(*) as daycount FROM data WHERE DAYNAME(act_timestampMs)='$tmp_array[$i]'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $d_count[$i]=$res["daycount"];
}

$count_per_day=array(//store gia ka8e mera poses eggrafes exoume
"Δευτέρα" => $d_count[0],
"Τρίτη" => $d_count[1],
"Τετάρτη" => $d_count[2],
"Πέμπτη" => $d_count[3],
"Παρασκευή" => $d_count[4],
"Σάββατο" => $d_count[5],
"Κυριακή" => $d_count[6],
);

for($i=0;$i<=23;$i++){//store ton arim8o twn wrwn
    $sql="SELECT COUNT(*) as hourcount FROM data WHERE HOUR(act_timestampMs)='$i'";
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $h_count[$i]=$res["hourcount"];
}

$sql="SELECT MIN(YEAR(act_timestampMs)) as minumum, MAX(YEAR(act_timestampMs)) as maximum FROM data";//brisoume to range ton hmeromhniwn min,max
$result=mysqli_query($conn,$sql);
$result=mysqli_fetch_assoc($result);
$mindate=$result["minumum"];
$maxdate=$result["maximum"];

for($i=$mindate;$i<=$maxdate;$i++){
    $sql="SELECT COUNT(*) as yearcount FROM data WHERE YEAR(act_timestampMs)='$i'";//
    $res=mysqli_query($conn,$sql);
    $res=mysqli_fetch_assoc($res);
    $y_count[$i]=$res["yearcount"];
}

$r = array($dataPoints,$u_r_count,$count_per_month,$count_per_day,$h_count,$y_count);//store all the data in a single array;
echo json_encode($r);

mysqli_close($conn);

?>
