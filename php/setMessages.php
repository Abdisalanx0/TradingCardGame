<?php
// inventory.php

include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php'; 

// Decoding the JSON payload from the request
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$senderUsername = $dData['sendingUsername'] ?? null;
$receiverUsername = $dData['receiverUsername'] ?? null;
$messageContent = $dData['message'] ?? null;
if (empty($senderUsername) || empty($receiverUsername) || empty($messageContent)) {
    echo json_encode(['success' => false, 'message' => $senderUsername ,$receiverUsername,$messageContent]);
    exit();
}

// Establish a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

// Fetch the user ID for the sender
$sql = "SELECT id FROM tcg_user WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $senderUsername);
$stmt->execute();
$result = $stmt->get_result();
$sender = $result->fetch_assoc();

// Fetch the user ID for the receiver
$stmt->bind_param("s", $receiverUsername);
$stmt->execute();
$result = $stmt->get_result();
$receiver = $result->fetch_assoc();

if (!$sender || !$receiver) {
    echo json_encode(['success' => false, 'message' => 'Sender or receiver not found']);
    exit();
}

// Insert the message into the database
$sql = "INSERT INTO user_message (sending_user_id, receiving_user_id, content) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $sender['id'], $receiver['id'], $messageContent);
$success = $stmt->execute();

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully', 'messageId' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}

$conn->close();
?>
