<?php

	$servername = "localhost";
	$username = "root";
	$password = "root";
	$DB = "web2020";

  $result_array = array();
  $conn = new mysqli($servername,$username,$password,$DB);
	if($conn->connect_error){
		die("Connection Failed: " . $conn->connect_error);
	}

mysqli_set_charset($conn,'utf8');

  $query="SELECT * FROM usercred";
	$result = mysqli_query($conn, $query);

	 if (mysqli_num_rows($result) > 0) {
     // output data of each row
     while($row = mysqli_fetch_assoc($result)) {
        echo "<tr>";
        echo "<td>" . $row['userid'] . "</td>";
        echo "<td>" . $row['username'] . "</td>";
				echo "<td>" . $row['Password'] . "</td>";
        echo "</tr>";
     }
 } else {
     echo "0 results";
 }
//echo json_encode($result_array);
mysqli_close($conn);
?>
