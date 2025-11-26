<?php
session_start();
header('Content-Type: application/json');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = 'localhost';
$db   = 'DTS_Health_TRANSPARENCY';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

// Get JSON input from your JS
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$level    = trim($data['level'] ?? '');

if (empty($username) || empty($password) || empty($level)) {
      echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
      exit;
}

// Query the database
$stmt = $conn->prepare("SELECT id, password, level FROM leaders WHERE username=? AND level=?");
$stmt->bind_param("ss", $username, $level);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
      $stmt->bind_result($id, $hashed_password, $db_level);
      $stmt->fetch();

if (password_verify($password, $hashed_password)) {
      $_SESSION['leader_id'] = $id;
      $_SESSION['leader_level'] = $db_level;

      echo json_encode([
            'status' => 'success',
            'message' => "Login successful! Welcome, $db_level Leader",
            'redirect' => match($db_level) {
                  'National' => '/html/NationalDashboard.html',
                  'District' => '/html/DISTRICT DASHBOARD/Distict_Dashboard.html',
                  'Sector'   => '/html/Sector_Leader_Dashboard.html',
                  'Cell'     => '/html/umujyanama.html',
                  default    => '/index.html'
            }
      ]);
} else {
      echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
}
} else {
      echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
}

$stmt->close();
$conn->close();
?>
