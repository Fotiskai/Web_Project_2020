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
mysqli_set_charset($conn,'utf8');

$year=$_POST["year"];
$month=$_POST["month"];
$day=$_POST["day"];
$hour=$_POST["hour"];
$minutes=$_POST["minutes"];
$activ=$_POST["act"];

$y="'".implode("','",$year)."'";
$m="'".implode("','",$month)."'";
$d="'".implode("','",$day)."'";
$h="'".implode("','",$hour)."'";
$min="'".implode("','",$minutes)."'";
$a="'".implode("','",$activ)."'";

//echo $y. "\n" .$m. "\n".  $d. "\n" .$h. "\n".  $a;

$sql="SELECT COUNT(*) as count,latitude,longitude FROM(SELECT latitude,longitude FROM data WHERE YEAR(act_timestampMs) IN ($y) AND MONTHNAME(act_timestampMs) IN ($m) AND DAYNAME(act_timestampMs) IN ($d) AND HOUR(act_timestampMs) IN ($h) AND MINUTE(act_timestampMs) IN ($min) AND type IN ($a))sub GROUP BY sub.latitude,sub.longitude";
$result = mysqli_query($conn, $sql);
  if(mysqli_num_rows($result)>0){
  	while($row = mysqli_fetch_assoc($result)){
      $lat[$count]=$row["latitude"];
      $long[$count]=$row["longitude"];
      $c_arr[$count]=$row["count"];
      $count+=1;
  	  }
  	}else{
      echo "Δεν υπάρχουν εγγραφές";
      exit;
    }    

foreach($c_arr as $value){
  if($value>$max) $max=$value;
}


for($i=0;$i<count($lat);$i++){
$dat.="{lat: " .$lat[$i]. ", lng: " . $long[$i]. ", count:" .$c_arr[$i] . "}," ;
}
$dat.="]";
echo $dat. "|". $max;

mysqli_close($conn);
?>