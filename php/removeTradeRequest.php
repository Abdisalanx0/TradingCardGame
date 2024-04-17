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

    $requestId = intval($body -> requestId);

    // get initiator user id
    $sql = 'SELECT initiator_user_id FROM trade_request WHERE id = ?';
    $bindParams = array($requestId);
    $requestQuery = runSelectQuery($sql, $bindParams);
    $initiatorUserId = $requestQuery[0]['initiator_user_id'];

    // get request cards
    $sql = 'SELECT * FROM trade_request_card WHERE request_id = ?';
    $bindParams = array($requestId);
    $requestCards = runSelectQuery($sql, $bindParams);

    // for each request card
    foreach($requestCards as $card) {
      // set listed to 0 (false) for user cards in the request that belong to the initiator user
      $sql = 'UPDATE user_card SET listed = 0 WHERE id = ? AND user_id = ?';
      $bindParams = array($card['user_card_id'], $initiatorUserId);
      runParameterizedQuery($sql, $bindParams);
    }

    // delete all request cards
    $sql = 'DELETE FROM trade_request_card WHERE request_id = ?';
    $bindParams = array($requestId);
    runParameterizedQuery($sql, $bindParams);

    // delete request
    $sql = 'DELETE FROM trade_request WHERE id = ?';
    $bindParams = array($requestId);
    runParameterizedQuery($sql, $bindParams);
  }
?>