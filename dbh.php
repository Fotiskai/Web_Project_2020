<?php 
session_start();
$conn=mysqli_connect("localhost","root","root","web2020");
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn,'utf8');

if(isset($_POST["em"])){
    $check=preg_match('/^\S*(?=\S{8,})(?=\S*[A-ZΑ-Ω])(?=\S*[\d])(?=\S*[#?!@$%^&*~])\S*$/',$_POST["pwd"]); //έλεγχος ορθότητας κωδικού
    if(!$check){
      echo 'Εισάγετε σωστή μορφή κωδικού';
      exit;
    }
    $username=$_POST["un"];
    $check=preg_match('/^\S+\s\S+$/',$username); //έλεγχος για κενό στο username
    //^[Α-Ωά-ώA-Za-z-]+[\s][Α-Ωά-ώA-Za-z-]+$ πιο αυστηρό αλλα δεν δουλεύει
    if(!$check){
      echo 'Εισάγετε σωστή μορφή ονόματος χρήστη';
      exit;
    }       	
	$iv="1234567890123456";
	$userid=openssl_encrypt($_POST["em"],"AES-256-CBC", $_POST["pwd"],0,$iv); //αμφίδρομη κρυπτογράφιση με string email και key password
	$sql="SELECT userid FROM usercred";
	$result=mysqli_query($conn,$sql);
	if(mysqli_num_rows($result)>0){
  	  while($row = mysqli_fetch_assoc($result)){
  		if ($userid==$row["userid"]){            //έλεγχος αν υπάρχει ήδη λογαριασμός
  			echo 'Υπάρχει ήδη λογαριασμός με τα στοιχεία που δώσατε';
  			exit;
  		}
  	  }
    }
	$password=md5($_POST["pwd"]);
	$sql = "INSERT INTO usercred (username,userid,password) VALUES ('$username','$userid','$password')";
    if (mysqli_query($conn, $sql)) {
        echo 'Επιτυχία Εγγραφής';
        exit;
    }
}
else{
  $password=md5($_POST["pwd"]);
  $sql="SELECT userid,username,password FROM usercred";
  $sql1="SELECT Username,Password FROM admincred";
  $result = mysqli_query($conn, $sql);
  $result1 = mysqli_query($conn, $sql1);

  if(mysqli_num_rows($result1)>0){
  	while($row = mysqli_fetch_assoc($result1)){
  		if ($_POST["un"]==$row["Username"] && $password==$row["Password"]){ //σύνδεση διαχειρηστή
  			exit;
  		}
  	}
  }

  if(mysqli_num_rows($result)>0){
	  while($row = mysqli_fetch_assoc($result)){
		  if ($_POST["un"]==$row["username"] && $password==$row["password"]){ //σύνδεση χρήστη
			$uid=$row["userid"];
			$_SESSION["uid"]=$uid; //χρήση session για να παραμείνει "ζωντανή" η μεταβλητή   
			exit;		
		  }
	  }
      echo 'Λάθος Στοιχεία';
      exit;
  }
}
   
mysqli_close($conn);
?>