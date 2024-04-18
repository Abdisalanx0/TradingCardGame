<?php
  include 'corsOptions.php';
  include 'dbConnection.php';
  include 'sqlHelpers.php';

  $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

  if ($conn -> connect_errno > 0) {
    die('Unable to connect to database [' . $conn -> connect_error . ']');
  }
  
  if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'));

    $userCardId = $body -> userCardId;
    $price = intval($body -> price);

    // insert card into marketplace_card
    $sql = 'INSERT INTO marketplace_card (price, user_card_id) VALUES (?, ?)';
    $bindParams = array($price, $userCardId);
    runParameterizedQuery($sql, $bindParams);

    // set user_card listed to 1
    $sql = 'UPDATE user_card SET listed = 1 WHERE id = ?';
    $bindParams = array($userCardId);
    runParameterizedQuery($sql, $bindParams);
  }
?>