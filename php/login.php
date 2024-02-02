<?php
// Enables error reporting for debugging purposes.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Setting Cross-Origin Resource Sharing (CORS) headers for security.
header('Access-Control-Allow-Origin: http://localhost:5173'); // Only allows requests from this origin.
header('Access-Control-Allow-Methods: GET, POST'); // Allows GET and POST HTTP methods.
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With'); // Specifies allowed headers.
header('Content-Type: application/json'); // Sets the content type of the response to JSON.

// Database connection variables.
$servername = "localhost";
$username = "root";
$password = "1384";
$dbname = "tcg";

// Establishing a connection to the MySQL database.
$conn = new mysqli($servername, $username, $password, $dbname);

// Checks and outputs if there's a connection error.
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

// Retrieves and decodes JSON input from the request body.
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

// Checks if username and password are present in the request.
if (!isset($dData["username"]) || !isset($dData["password"])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request: username and password required']);
    exit();
}

// Extracts the username and password from the decoded data.
$user = $dData['username'];
$pass = $dData['password'];

// Prepares an SQL statement to prevent SQL injection.
$stmt = $conn->prepare("SELECT * FROM tcg_user WHERE username = ? AND password_hash = ?");
$stmt->bind_param("ss", $user, $pass); // Binds parameters to the SQL statement.
$stmt->execute(); // Executes the SQL statement.
$res = $stmt->get_result(); // Gets the result of the query.

// Checks if the user exists and the password is correct.
if ($res && $res->num_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Login Successful! Redirecting...']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

// Closes the database connection.
$conn->close();
exit();
?>
