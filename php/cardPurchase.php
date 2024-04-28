<?php
include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php';

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$username = $dData['username'];
$cardIds = $dData['cardIds'] ?? [];
$totalPrice = $dData['tPrice']; 

if (empty($username) || empty($cardIds)) {
    echo json_encode(['success' => false, 'message' => 'Username or Card IDs not provided']);
    exit;
}

$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT id, coin_balance FROM tcg_user WHERE username = ?";
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
$currentBalance = $userRow['coin_balance'];

if ($currentBalance < $totalPrice) {
    echo json_encode(['success' => false, 'message' => 'Insufficient funds']);
    exit;
}

$newBalance = $currentBalance - $totalPrice;

$sql = "SELECT user_id FROM user_card WHERE id IN (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $cardIds[0]); 
$stmt->execute();
$sellerResult = $stmt->get_result();
$sellerRow = $sellerResult->fetch_assoc();
$sellerId = $sellerRow['user_id'];

$sql = "UPDATE tcg_user SET coin_balance = CASE id WHEN ? THEN ? WHEN ? THEN coin_balance + ? END WHERE id IN (?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("iiiiii", $newUserId, $newBalance, $sellerId, $totalPrice, $newUserId, $sellerId);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to update user balances']);
    exit;
}

// Update card ownership
$placeholders = implode(',', array_fill(0, count($cardIds), '?'));
$sql = "UPDATE user_card SET listed = 0, user_id = ? WHERE id IN ($placeholders)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
    exit;
}
$params = array_merge([$newUserId], $cardIds);
$types = 'i' . str_repeat('i', count($cardIds));
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Card purchased successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update card ownership']);
}

$stmt->close();
$conn->close();
?>
