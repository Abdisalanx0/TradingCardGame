<?php
include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php'; 

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$username = $dData['username'] ?? null;
$cardIds = $dData['cardIds'] ?? [];
// Basic validation
if (empty($username) || empty($cardIds)) {
    echo json_encode(['success' => false, 'message' => 'Username or Card IDs not provided']);
    exit;
}

// Establish a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

// Checks and outputs if there's a connection error.
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

// First, get the user ID for the given username
$sql = "SELECT id FROM tcg_user WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare the statement for fetching user ID']);
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}
$userRow = $result->fetch_assoc();
$newUserId = $userRow['id'];
$stmt->close();

// Now, update the card ownership using the fetched user ID
$sql = "UPDATE user_card SET new_user = ? WHERE card_id IN (" . implode(',', array_fill(0, count($cardIds), '?')) . ")";
$types = 'i' . str_repeat('i', count($cardIds)); // Types string
$params = array_merge([$newUserId], $cardIds); // Parameters array

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare the SQL statement for updating card ownership']);
    exit;
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Card ownership updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update card ownership']);
}

$stmt->close();
$conn->close();
?>
