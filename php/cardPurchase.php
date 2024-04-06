<?php
include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php';

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$username = $dData['username'];
$cardIds = $dData['cardIds'] ?? [];

if (empty($username) || empty($cardIds)) {
    echo json_encode(['success' => false, 'message' => 'Username or Card IDs not provided']);
    exit;
}

$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT id FROM tcg_user WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
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

$placeholders = implode(',', array_fill(0, count($cardIds), '?'));//converts to strings
$sql = "UPDATE user_card SET new_user = ? WHERE card_id IN ($placeholders)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
    exit;
}

$params = array_merge([$newUserId], $cardIds);
$types = 'i' . str_repeat('i', count($cardIds));
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $sql = "DELETE FROM listed_card WHERE user_card_id IN ($placeholders)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param(str_repeat('i', count($cardIds)), ...$cardIds);
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Failed to delete card from listed_card']);
        exit;
    }
    echo json_encode(['success' => true, 'message' => 'Card ownership updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update card ownership']);
}

$stmt->close();
$conn->close();
?>
