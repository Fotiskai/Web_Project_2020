<?php
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn,'utf8');
$count=0;
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

$sql="SELECT heading,velocity,accuracy,verticalAccuracy,longitude,latitude,altitude,timestampMs,userid,id FROM data WHERE LEFT(timestampMs, 4) IN ($y) AND MONTHNAME(timestampMs) IN ($m) AND DAYNAME(timestampMs) IN ($d) AND SUBSTRING(timestampMs,12,2) IN ($h)";
$result = mysqli_query($conn, $sql);
if(mysqli_num_rows($result)>0){
  	while($row = mysqli_fetch_assoc($result)){	
      $heading=$row["heading"];
      $verticalAccuracy=$row["verticalAccuracy"];      
      $velocity=$row["velocity"];
      $accuracy=$row["accuracy"];
      $longitude=$row["longitude"]*1e7;
      $latitude=$row["latitude"]*1e7;      
      $altitude=$row["altitude"];
      $timestampMs=strtotime($row["timestampMs"])*1000;
      $userid=$row["userid"];
      $id=$row["id"];
      $sql="SELECT type,confidence,timestampMs FROM activities WHERE id=$id";
      $result1=mysqli_query($conn, $sql);
      while($row1=mysqli_fetch_assoc($result1)){
      	$type=$row1["type"];
      	$confidence=$row1["confidence"];
      	$a_timestampMs=strtotime($row1["timestampMs"])*1000;
      	$list[$count]=[$heading,$type,$confidence,$a_timestampMs,$verticalAccuracy,$velocity,$accuracy,$longitude,$latitude,$altitude,$timestampMs,$userid];
      }
      $count+=1;
  	  }	  
}

if($_POST["type"]=="CSV"){
	$fp=fopen('export.csv','w');
    fwrite($fp,"heading|activity.type|activity.confidence|activity.timestampMs|verticalAccuracy|velocity|accuracy|longitude|latitude|altitude|timestampMs|userid"."\n");	
    foreach($list as $data){
	    fputcsv($fp, $data);
    }
}
if($_POST["type"]=="JSON"){
	$fp=fopen('export.json','w');
    $export_json="[". "\n";
    foreach($list as $data){
    	$export_json.='{' . "\n". '"heading"' . ':' . '"' . $data[0] . '",'. "\n" . '"activity.type"' . ':' . '"' . $data[1] . '",'. "\n"  . '"activity.confidence"' .':' . '"' . $data[2] . '",'. "\n" . '"activity.timestampMs"'. ':' . '"' . $data[3] . '",'. "\n" . '"verticalAccuracy"' . ':' . '"' . $data[4] . '",'. "\n" . '"velocity"' . ':' . '"' . $data[5] . '",'. "\n" . '"accuracy"' . ':' . '"' . $data[6] . '",'. "\n" . '"longitude"' . ':' . '"' . $data[7] . '",'. "\n" .'"latitude"' . ':' . '"' . $data[8] . '",'. "\n" . '"altitude"' . ':' . '"' . $data[9] . '",'. "\n" . '"timestampMs"' . ':' . '"' . $data[10] . '",'. "\n" . '"userid"' . ':' . '"' . $data[11] . '"' . "\n" . '},';
    }
    $export_json=substr($export_json, 0, -1);
    $export_json.="\n"."]";
    fwrite($fp,$export_json);
}

echo 'Εξαγωγή Ολοκληρώθηκε';
mysqli_close($conn);
?>