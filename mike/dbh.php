<?php
$conn=mysqli_connect("localhost","root","","userdb");

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

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

mysqli_close($conn);
?>