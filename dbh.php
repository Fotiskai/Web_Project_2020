<?php 
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}


if(isset($_POST["em"])){
  $check=preg_match('/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])(?=\S*[#?!@$%^&*~])\S*$/',$_POST["pwd"]);
    if(!$check){
      echo 'Εισάγετε σωστή μορφή κωδικού';
      exit;
    }     
	$username=$_POST["un"];
	$iv="1234567890123456";
	$userid=openssl_encrypt($_POST["em"],"AES-256-CBC", $_POST["pwd"],OPENSSL_RAW_DATA,$iv);
	$userid = base64_encode($userid);
	$password=md5($_POST["pwd"]);
	$sql = "INSERT INTO usercred (username,userid,password) VALUES ('$username','$userid','$password')";
    if (mysqli_query($conn, $sql)) {
        echo 'Επιτυχία Εγγραφής';
        exit;
    }
}
else{
  if($_POST["pwd"]!="admin") $password=md5($_POST["pwd"]);
  else $password=$_POST["pwd"];
  $sql="SELECT userid,username,password FROM usercred";
  $sql1="SELECT Username,Password FROM admincred";
  $result = mysqli_query($conn, $sql);
  $result1 = mysqli_query($conn, $sql1);

  if(mysqli_num_rows($result1)>0){
  	while($row = mysqli_fetch_assoc($result1)){
  		if ($_POST["un"]==$row["Username"] && $password==$row["Password"]){
  			exit;
  		}
  	}
  }

  if(mysqli_num_rows($result)>0){
	  while($row = mysqli_fetch_assoc($result)){
		  if ($_POST["un"]==$row["username"] && $password==$row["password"]){
			      $uid=$row["userid"];  
            $file = fopen('userid.txt', "w+"); 
            $size = filesize($fn); 
            $text = fread($file, $size); 
            fwrite($file, $uid); 
            fclose($file);     
			      exit;		
		  }
	  }
    echo 'Λάθος Στοιχεία';
    exit;
  }
}
   
mysqli_close($conn);
?>