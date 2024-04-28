<?php
//https://www.php.net/manual/en/function.password-hash.php

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
    echo json_encode(['success' => false, 'message' => 'Invalid request: username and password are required']);
    exit();
}

$user = $dData['username'];
$pass = $dData['password'];

// Prepares an SQL statement to check if the username already exists.
$stmt = $conn->prepare("SELECT * FROM tcg_user WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$res = $stmt->get_result();

// Checks if the username already exists.
if ($res && $res->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists, please choose a different one.']);
} else {
    // Username does not exist, proceed with registration.
    $hashedPassword = password_hash($pass, PASSWORD_DEFAULT);
    $coinbalance = 100;
    $stmt = $conn->prepare("INSERT INTO tcg_user (username, password_hash, coin_balance) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $user, $hashedPassword, $coinbalance);
    
    // Executes the SQL statement and checks if the user was successfully registered.
    if ($stmt->execute()) {
        $newUserId = $conn->insert_id; // Get the ID of the newly registered user
        echo json_encode(['success' => true, 'message' => 'User registered successfully!', 'coinBalance' => 100]);

        // Prepare a sample message to insert into user_message table
        $sampleMessage = "Welcome to our platform!";
        $adminUserId = 1; 
        $stmt = $conn->prepare("INSERT INTO user_message (content, sending_user_id, receiving_user_id) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $sampleMessage, $newUserId, $adminUserId);
        
        // Executes the statement and checks for success.
        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Failed to send welcome message.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed, please try again.']);
    }
}

// Closes the database connection.
$conn->close();
exit();


