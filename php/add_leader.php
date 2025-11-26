<?php
$host = 'localhost';
$db   = 'DTS_Health_TRANSPARENCY';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

// Example: add a user
$username = "district";
$password = "district123";
$level = "District";

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO leaders (username, password, level) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $hashed_password, $level);
$stmt->execute();

echo "User added successfully!";
$stmt->close();
$conn->close();
?>
