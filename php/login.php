<?php
//https://www.php.net/manual/en/function.json-encode.php

include 'corsOptions.php';
include 'dbConnection.php';

// Establishing a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

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

// Extracts the username from the decoded data.
$user = $dData['username'];
$pass = $dData['password'];

// Prepares an SQL statement to retrieve the user by username.
$stmt = $conn->prepare("SELECT password_hash FROM tcg_user WHERE username = ?");
$stmt->bind_param("s", $user); // Binds the username parameter to the SQL statement.
$stmt->execute(); // Executes the SQL statement.
$res = $stmt->get_result(); // Gets the result of the query.

if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $hashedPassword = $row['password_hash'];
    
    // Verifies the password against the hashed password in the database.
    if (password_verify($pass, $hashedPassword)) {
        echo json_encode(['success' => true, 'message' => 'Login Successful! Redirecting...']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

// Closes the database connection.
$conn->close();
exit();
?>
