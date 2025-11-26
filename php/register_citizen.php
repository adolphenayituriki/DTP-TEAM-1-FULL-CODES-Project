<?php
session_start();

$host = 'localhost';
$db   = 'DTS_Health_TRANSPARENCY';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

if($conn->connect_error){
      die("Connection failed: " . $conn->connect_error);
}

$full_name = trim($_POST['full_name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = trim($_POST['phone'] ?? '');
$password  = trim($_POST['password'] ?? '');
$confirm   = trim($_POST['confirm_password'] ?? '');

if($password !== $confirm){
      die("Passwords do not match. <a href='citizenRegister.html'>Go back</a>");
}

// Check duplicate email
$stmt = $conn->prepare("SELECT id FROM citizens WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if($stmt->num_rows > 0){
      $stmt->close();
      die("Email already registered. <a href='citizenLogin.html'>Login here</a>");
}
$stmt->close();

// Hash password
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Insert citizen
$stmt = $conn->prepare("INSERT INTO citizens (full_name, email, phone, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $full_name, $email, $phone, $hashed);

if($stmt->execute()){
      echo "Registration successful! <a href='citizenLogin.html'>Login here</a>";
} else {
      echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
