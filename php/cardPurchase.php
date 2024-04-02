<?php
// inventory.php

include 'corsOptions.php';
include 'dbConnection.php';
include 'sqlHelpers.php';

// Decoding the JSON payload from the request
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$username = $dData['username'] ?? '';
$cardIds = $dData['cardIds'] ?? []; // Expecting an array of card IDs

// Check if both username and card IDs are provided
if (empty($username) || empty($cardIds)) {
    echo json_encode(['success' => false, 'message' => 'Username or Card IDs not provided']);
    exit();
}

// Establish a connection to the MySQL database.
$conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

// Checks and outputs if there's a connection error.
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit();
}

$conn->autocommit(FALSE); // Start transaction

try {
    // Fetch the user ID associated with the username
    $sql = "SELECT id FROM tcg_user WHERE username = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows == 0) {
            throw new Exception('User not found');
        }

        $userIdRow = $result->fetch_assoc();
        $userId = $userIdRow['id'];

        // Prepare to check if the cards are available for purchase
        $placeholders = implode(',', array_fill(0, count($cardIds), '?'));
        $types = str_repeat('i', count($cardIds)); // Type specifier for integers
        $sql = "SELECT id FROM trading_card WHERE id IN ($placeholders) AND id NOT IN (SELECT card_id FROM user_card)";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param($types, ...$cardIds);
            $stmt->execute();
            $availableCardsResult = $stmt->get_result();
            $stmt->close();

            $availableCards = [];
            while ($row = $availableCardsResult->fetch_assoc()) {
                $availableCards[] = $row['id'];
            }

            if (count($availableCards) !== count($cardIds)) {
                throw new Exception('One or more cards are not available for purchase');
            }

            // If all cards are available, proceed to insert them into user_card table
            foreach ($availableCards as $cardId) {
                $sql = "INSERT INTO user_card (user_id, card_id, num_owned) VALUES (?, ?, 1)";
                if ($stmt = $conn->prepare($sql)) {
                    $stmt->bind_param("ii", $userId, $cardId);
                    if (!$stmt->execute()) {
                        throw new Exception("Failed to purchase card ID: " . $cardId);
                    }
                    $stmt->close();
                } else {
                    throw new Exception("Failed to prepare statement for inserting card ID: " . $cardId);
                }
            }

            $conn->commit(); // Commit the transaction
            echo json_encode(['success' => true, 'message' => 'Cards purchased successfully']);
        } else {
            throw new Exception('Failed to prepare statement for checking available cards');
        }
    } else {
        throw new Exception('Failed to prepare statement for fetching user ID');
    }
} catch (Exception $e) {
    $conn->rollback(); // Rollback the transaction in case of error
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}

?>
