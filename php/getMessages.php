<?php
// inventory.php

include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php'; 

// Decoding the JSON payload from the request
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);


$username = $dData['username'];


if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username not provided']);
    exit();
}

// Establish a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

// Fetch the user ID associated with the username
$sql = "SELECT id FROM tcg_user WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    $userId = $user['id'];

    // Fetch messages where the user is either the sender or the receiver
    $sql = "SELECT um.*, 
                   sender.username AS sender_username,
                   receiver.username AS receiver_username
            FROM user_message um
            JOIN tcg_user sender ON um.sending_user_id = sender.id
            JOIN tcg_user receiver ON um.receiving_user_id = receiver.id
            WHERE um.sending_user_id = ? OR um.receiving_user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $userId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $formattedMessages = [];
    while ($row = $result->fetch_assoc()) {
        $conversationPartner = ($row['sending_user_id'] == $userId) ? $row['receiver_username'] : $row['sender_username'];
        $originator = ($row['sending_user_id'] == $userId) ? 'self' : 'other';

        $formattedMessages[$conversationPartner][] = [
            'id' => $row['id'],
            'content' => $row['content'],
            'originator' => $originator
        ];
    }

    if ($formattedMessages) {
        echo json_encode($formattedMessages);
    } else {
        echo json_encode(['message' => 'No messages found for this user']);
    }
} else {
    echo json_encode(['message' => 'User not found']);
}

$conn->close();
?>
