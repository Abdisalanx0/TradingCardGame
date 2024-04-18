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

    // remove card from marketplace_card
    $sql = 'DELETE FROM marketplace_card WHERE user_card_id = ?';
    $bindParams = array($userCardId);
    runParameterizedQuery($sql, $bindParams);

    // set user_card listed to 0
    $sql = 'UPDATE user_card SET listed = 0 WHERE id = ?';
    $bindParams = array($userCardId);
    runParameterizedQuery($sql, $bindParams);
  }
?>