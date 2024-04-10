<?php
// inventory.php

include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php'; 

// Decoding the JSON payload from the request
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

// Correctly using $dData to access 'username'
$username = $dData['username'];
//$username = "Abdisalan";
// Check if username is provided
if(empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username not provided']);
    exit();
}

// Establish a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

// Checks and outputs if there's a connection error.
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

// Fetch the user ID associated with the username
$sql = "SELECT id FROM tcg_user WHERE username = ?";
$bindParams = array($username);
$userId = runSelectQuery($sql, $bindParams);

if ($userId) {
    $userId = $userId[0]['id']; // Extract the user ID from the result array

    // Fetch cards associated with the user ID
    $sql = "SELECT * FROM trading_card tc JOIN user_card uc ON tc.id = uc.card_id WHERE uc.user_id = ?";
    $bindParams = array($userId);
    $cards = runSelectQuery($sql, $bindParams);

    if ($cards) {
        echo json_encode($cards); // Return the cards associated with the user
    } else {
        echo json_encode(['success' => false, 'message' => 'No cards found for this user']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$conn->close();
?>
