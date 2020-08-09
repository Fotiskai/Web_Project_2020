<?php
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn,'utf8');
$arg_list=[];
$keys=["heading","activity.type","activity.confidence","activity.timestampMs","verticalAccuracy","velocity","accuracy","longitude","latitude","altitude","timestampMs","userid"];

$dom=new DOMDocument('1.0','utf-8');
$dom->formatOutput=true;
$root=$dom->createElement('data');
$dom->appendChild($root);


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

$sql="SELECT heading,velocity,accuracy,verticalAccuracy,longitude,latitude,altitude,timestampMs,type,confidence,act_timestampMs,userid FROM data WHERE YEAR(act_timestampMs) IN ($y) AND MONTHNAME(act_timestampMs) IN ($m) AND DAYNAME(act_timestampMs) IN ($d) AND HOUR(act_timestampMs) IN ($h) AND MINUTE(act_timestampMs) IN ($min) AND type IN ($a)";
$result = mysqli_query($conn, $sql);
if(mysqli_num_rows($result)>0){
  	while($row = mysqli_fetch_assoc($result)){
      $node=$dom->createElement('location');
      $heading=$row["heading"];
      $verticalAccuracy=$row["verticalAccuracy"];      
      $velocity=$row["velocity"];
      $accuracy=$row["accuracy"];
      $longitude=$row["longitude"]*1e7;
      $latitude=$row["latitude"]*1e7;      
      $altitude=$row["altitude"];
      $timestampMs=strtotime($row["timestampMs"])*1000;
      $userid=$row["userid"];
      $type=$row["type"];
      $confidence=$row["confidence"];
      $act_timestampMs=strtotime($row["timestampMs"])*1000;	
      $values=[$heading,$type,$confidence,$act_timestampMs,$verticalAccuracy,$velocity,$accuracy,$longitude,$latitude,$altitude,$timestampMs,$userid]; 
      for($i=0;$i<12;$i++){
          $child=$dom->createElement($keys[$i]);
          $child->appendChild($dom->createCDATASection($values[$i]));
          $node->appendChild($child);
      }
      $root->appendChild($node);     	  
    }
}else{
  echo 'Δεν βρέθηκαν εγγραφές';
  exit;
}
$dom->save('export.xml');
echo 'Εξαγωγή Ολοκληρώθηκε';
mysqli_close($conn);
?>