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

?>