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

// Extracts the username and password from the decoded data.
$user = $dData['username'];
$pass = $dData['password'];

// Prepares an SQL statement to check if the username already exists.
$stmt = $conn->prepare("SELECT * FROM tcg_user WHERE username = ?");
$stmt->bind_param("s", $user); // Binds parameters to the SQL statement.
$stmt->execute(); // Executes the SQL statement.
$res = $stmt->get_result(); // Gets the result of the query.

// Checks if the username already exists.
if ($res && $res->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists, please choose a different one.']);
} else {
    // Username does not exist, proceed with registration.
    
    // Hashing the password before storing it in the database.
    $hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

    // Prepares an SQL statement for inserting the new user.
    $stmt = $conn->prepare("INSERT INTO tcg_user (username, password_hash, coin_balance) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $user, $hashedPassword, 100); // Binds parameters to the SQL statement.
    
    // Executes the SQL statement and checks if the user was successfully registered.
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User registered successfully!', 'coinBalance' => 100]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed, please try again.']);
    }
}

// Closes the database connection.
$conn->close();
exit();
?>
