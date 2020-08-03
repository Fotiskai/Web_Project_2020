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

$sql="SELECT heading,velocity,accuracy,verticalAccuracy,longitude,latitude,altitude,timestampMs,userid,id FROM data WHERE YEAR(timestampMs) IN ($y) AND MONTHNAME(timestampMs) IN ($m) AND DAYNAME(timestampMs) IN ($d) AND HOUR(timestampMs) IN ($h) AND MINUTE(timestampMs) IN ($min)";
$result = mysqli_query($conn, $sql);
if(mysqli_num_rows($result)>0){
  	while($row = mysqli_fetch_assoc($result)){	
      $id=$row["id"];
      $row["longitude"]=$row["longitude"]*1e7;
      $row["latitude"]=$row["latitude"]*1e7;
      $row["timestampMs"]=strtotime($row["timestampMs"])*1000;
      $sql="SELECT type,confidence,timestampMs FROM activities WHERE id=$id";
      $result1=mysqli_query($conn, $sql);
      while($row1=mysqli_fetch_assoc($result1)){
      	$row1["timestampMs"]=strtotime($row1["timestampMs"])*1000;
      	$node=$dom->createElement('location');
        $values=[$row[$keys[0]],$row1["type"],$row1["confidence"],$row1["timestampMs"],$row[$keys[4]],$row[$keys[5]],$row[$keys[6]],$row[$keys[7]],$row[$keys[8]],$row[$keys[9]],$row[$keys[10]],$row[$keys[11]]]; 
        for($i=0;$i<12;$i++){
           $child=$dom->createElement($keys[$i]);
           $child->appendChild($dom->createCDATASection($values[$i]));
           $node->appendChild($child);
        }
        $root->appendChild($node);
      }      	  
    }
}
$dom->save('export.xml');
echo 'Εξαγωγή Ολοκληρώθηκε';
mysqli_close($conn);
?>