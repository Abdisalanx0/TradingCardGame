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

$sql = "SELECT * FROM trading_card"; // Assuming your table is named 'trading_card'
$result = $conn->query($sql);

$cards = [];

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $cards[] = $row;
    }
    echo json_encode($cards);
} else {
    echo "0 results";
}

$conn->close();
?>
