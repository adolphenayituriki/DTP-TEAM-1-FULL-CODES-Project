<?php
$host = 'localhost';
$db   = 'DTS_Health_TRANSPARENCY';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// List of citizens to add
$citizens = [
    ['fullname' => 'John Doe', 'password' => 'citizen123'],
    ['fullname' => 'Alice Uwase', 'password' => 'alice2025'],
    ['fullname' => 'David Nkusi', 'password' => 'david123'],
    ['fullname' => 'Claire Mukamana', 'password' => 'claire321'],
    ['fullname' => 'Eric Nkurunziza', 'password' => 'eric2025']
];

foreach ($citizens as $citizen) {
    $hashed_password = password_hash($citizen['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO citizens (fullname, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $citizen['fullname'], $hashed_password);
    $stmt->execute();
    $stmt->close();
}

echo "Citizens added successfully!";
$conn->close();
?>
