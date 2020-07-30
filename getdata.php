<?php
$dat="[";
$idd=[];
$lat=[];
$long=[];
$c_arr=[];
$index=[];
$max=0;
$count=0;

$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$year=$_POST["year"];
$month=$_POST["month"];
$day=$_POST["day"];
$hour=$_POST["hour"];
$activ=$_POST["act"];

$y="'".implode("','",$year)."'";
$m="'".implode("','",$month)."'";
$d="'".implode("','",$day)."'";
$h="'".implode("','",$hour)."'";
$a="'".implode("','",$activ)."'";

//echo $y. "\n" .$m. "\n".  $d. "\n" .$h. "\n".  $a;

$sql="SELECT id FROM activities WHERE LEFT(timestampMs, 4) IN ($y) AND MONTHNAME(timestampMs) IN ($m) AND DAYNAME(timestampMs) IN ($d) AND SUBSTRING(timestampMs,12,2) IN ($h) AND type IN ($a)";
$result = mysqli_query($conn, $sql);
  if(mysqli_num_rows($result)>0){
  	while($row = mysqli_fetch_assoc($result)){
      $idd[$count]=$row["id"];
      $count+=1;
  	  }
  	}    

$c_arr=array_count_values($idd);
foreach($c_arr as $value){
  if($value>$max) $max=$value;
}

$d_id=array_unique($idd);
$count=0;
foreach($d_id as $value){
  $index[$count]=$value;
	$sql="SELECT latitude,longitude FROM data where id=$value";
	$result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result)>0){
  	  while($row = mysqli_fetch_assoc($result)){
         array_push($lat,$row["latitude"]);
         array_push($long,$row["longitude"]);
  	  }
  	}
    $count+=1;
}


for($i=0;$i<count($lat);$i++){
$dat.="{lat: " .$lat[$i]. ", lng: " . $long[$i]. ", count:" .$c_arr[$index[$i]] . "}," ;
}
$dat.="]";
echo $dat. "|". $max;
mysqli_close($conn);
?>