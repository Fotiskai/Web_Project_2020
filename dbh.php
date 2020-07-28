<?php
if (isset($_POST["f2"])){
   $check=preg_match('/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/',$_POST["pwd"]);
   if(!$check){
   		header('Location: index.html');
	    exit;
   }
}    


$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST["f1"])){
  $sql="SELECT username,password FROM admincred";
  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result)>0){
	while($row = mysqli_fetch_assoc($result)){
		if ($_POST["un"]==$row["username"] && $_POST["pwd"]==$row["password"]){
			header('Location: map.html');
			exit;
		}
		else{
			header('Location: index.html');
			exit;
		}
	}
  }
}
else if(isset($_POST["f2"])){
	$username=$_POST["un"];
	$iv="1234567890123456";
	$userid=openssl_encrypt($_POST["em"],"AES-256-CBC", $_POST["pwd"],OPENSSL_RAW_DATA,$iv);
	$userid = base64_encode($userid);
	$password=md5($_POST["pwd"]);
	$sql = "INSERT INTO usercred (username,userid,password) VALUES ('$username','$userid','$password')";
    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}
else{	
  $password=md5($_POST["pwd"]);
  echo $password;
  $sql="SELECT userid,username,password FROM usercred";
  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result)>0){
	while($row = mysqli_fetch_assoc($result)){
		if ($_POST["un"]==$row["username"] && $password==$row["password"]){
			$uid=$row["userid"];  
            $file = fopen('userid.txt', "w+"); 
            $size = filesize($fn); 
            $text = fread($file, $size); 
            fwrite($file, $uid); 
            fclose($file);
			header('Location: map.html');
			exit;		
		}
	}
	echo 'Wrong';
	exit;
  }
}
    
mysqli_close($conn);
?>