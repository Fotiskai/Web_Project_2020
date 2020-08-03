<?php
session_start();
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn,'utf8');
$sql="SET lc_time_names = 'el_GR'";
mysqli_query($conn, $sql);

$uid=$_SESSION["uid"];
$tmp=12;
for($i=0;$i<13;$i++){
	$sql="SELECT MONTHNAME(DATE_SUB(curdate(), INTERVAL $tmp MONTH)) as month ,YEAR(DATE_SUB(curdate(), INTERVAL $tmp MONTH)) as year";
	$result=mysqli_query($conn, $sql);
	$res=mysqli_fetch_assoc($result);
	$mon_year[$i]=$res["month"]. " " . $res["year"];	
	$sql="SELECT COUNT(DISTINCT(id)) as vehicle FROM data WHERE userid='$uid' AND timestampMs <= LAST_DAY(DATE_SUB(CURDATE(), INTERVAL $tmp MONTH)) AND timestampMs > DATE_ADD(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL $tmp MONTH)),interval 1 DAY),interval -1 MONTH) AND type IN('IN_VEHICLE','IN_RAIL_VEHICLE','IN_ROAD_VEHICLE','IN_FOUR_WHEELER_VEHICLE','IN_CAR','IN_TWO_WHEELER_VEHICLE','IN_BUS')";
	$result=mysqli_query($conn, $sql);
	$veh_c=mysqli_fetch_assoc($result);	
	$sql="SELECT COUNT(DISTINCT(id)) as walk FROM data WHERE userid='$uid' AND timestampMs <= LAST_DAY(DATE_SUB(CURDATE(), INTERVAL $tmp MONTH)) AND timestampMs > DATE_ADD(DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL $tmp MONTH)),interval 1 DAY),interval -1 MONTH) AND type IN('ON_BICYCLE','ON_FOOT','WALKING','RUNNING')";
	$result=mysqli_query($conn, $sql);
	$c=mysqli_fetch_assoc($result);
    if($veh_c["vehicle"]==0 and $c["walk"]==0) $lscore[$i]=0;
    elseif($veh_c["vehicle"]==0) $lscore[$i]=100;
    else $lscore[$i]=round(($c["walk"]/($veh_c["vehicle"]+$c["walk"]))*100,2);
    $tmp-=1;	
}

$sql="SELECT MIN(timestampMs) as minn, MAX(timestampMs) as maxn FROM data WHERE userid='$uid'";
$result = mysqli_query($conn, $sql);
$res=mysqli_fetch_assoc($result);
if($res["minn"]=="" and $res["maxn"]==""){
	$mindate="";
	$maxdate="";
}else{
    $dt=new DateTime($res["minn"]);
    $mindate=$dt->format('Y-m-d');
    $dt=new DateTime($res["maxn"]);
    $maxdate=$dt->format('Y-m-d');
}


$sql="SELECT lastUpload,username FROM usercred WHERE userid='$uid'";
$result=mysqli_query($conn, $sql);
$data=mysqli_fetch_assoc($result);
$lastdate=$data["lastUpload"];
$i=0;

$sql="SELECT currentScore,username FROM usercred ORDER BY currentScore DESC LIMIT 3";
$result=mysqli_query($conn, $sql);
if(mysqli_num_rows($result)>0){
    while($row = mysqli_fetch_assoc($result)){
    	$scores[$i]=$row["currentScore"];
    	$names[$i]=$row["username"];
    	$temp=preg_split("/[\s]/",$names[$i]);
    	$names[$i]=$temp[0]. " " . mb_substr($temp[1],0,1);
    	$names[$i].=".";
    	$i+=1;
	}
}
$temp=preg_split("/[\s]/",$data["username"]);
$username=$temp[0]. " " . mb_substr($temp[1],0,1) . ".";
array_push($names,$username);
$sql="SET @rank:=0";
$result=mysqli_query($conn, $sql);
$sql="SELECT @rank as ranking FROM (SELECT userid,@rank := @rank + 1 FROM usercred ORDER BY currentScore DESC)sub WHERE sub.`userid`='$uid'";
$result=mysqli_query($conn, $sql);
$result=mysqli_fetch_assoc($result);
$usr_rank=$result["ranking"];

$out=[$lscore,$mon_year,$mindate,$maxdate,$lastdate,$scores,$names,$usr_rank];
echo json_encode($out);
$sql="SET lc_time_names = 'en_US'";
mysqli_query($conn, $sql);
mysqli_close($conn);
?>