<?php
session_start();

$host = 'localhost';
$db   = 'dts_health_transparency';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

$full_name = trim($_POST['full_name'] ?? '');
$password  = trim($_POST['password'] ?? '');

if(empty($full_name) || empty($password)){
    die("Please fill all fields.");
}

$stmt = $conn->prepare("SELECT id, password FROM citizens WHERE full_name = ?");
$stmt->bind_param("s", $full_name);
$stmt->execute();
$stmt->store_result();

if($stmt->num_rows == 0){
    die("No account found with that name. <a href='../html/CitizenLogin.html'>Try again</a>");
}

$stmt->bind_result($id, $hashedPassword);
$stmt->fetch();

if(password_verify($password, $hashedPassword)){
    $_SESSION['citizen_id'] = $id;
    $_SESSION['citizen_name'] = $full_name;

    echo "Login successful! <a href='../html/NationalDashboard.html'>Go to Dashboard</a>";
} else {
    die("Incorrect password. <a href='../html/CitizenLogin.html'>Try again</a>");
}

$stmt->close();
$conn->close();
?>
