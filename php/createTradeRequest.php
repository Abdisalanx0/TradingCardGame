<?php
  include 'corsOptions.php';
  include 'dbConnection.php';
  include 'sqlHelpers.php';
  include 'listedCardHelpers.php';

  $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

  if ($conn -> connect_errno > 0) {
    die('Unable to connect to database [' . $conn -> connect_error . ']');
  }
  
  if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // parse request body as JSON
    $body = json_decode(file_get_contents('php://input'));

    $username = $body -> username;
    $targetUsername = $body -> targetUsername;
    $offeredCards = $body -> offeredCards;
    $requestedCards = $body -> requestedCards;
    $offeredPrice = intval($body -> offeredPrice);
    $requestedPrice = intval($body -> requestedPrice);

    // ensure only one price is set
    if($offeredPrice) {
      $requestedPrice = 0;
    }
    else if($requestedPrice) {
      $offeredPrice = 0;
    }

    // get initiator user id from $username
    $sql = 'SELECT id FROM tcg_user WHERE username = ?';
    $bindParams = array($username);
    $userQuery = runSelectQuery($sql, $bindParams);
    $initiatorUserId = $userQuery[0]['id'];

    // get target user id from $targetUsername
    $bindParams = array($targetUsername);
    $userQuery = runSelectQuery($sql, $bindParams);
    $targetUserId = $userQuery[0]['id'];

    // insert trade_request
    $sql = 'INSERT INTO trade_request (initiator_user_id, target_user_id, offered_price, requested_price) VALUES (?, ?, ?, ?)';
    $bindParams = array($initiatorUserId, $targetUserId, $offeredPrice, $requestedPrice);
    $tradeRequestId = runInsertQuery($sql, $bindParams);

    // for each offered card
    foreach($offeredCards as $card) {
      // insert into trade_request_cards
      $sql ='INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
      $bindParams = array($tradeRequestId, $card -> id);
      runParameterizedQuery($sql, $bindParams);

      // update user_card listed to 2 (in trade request)
      $sql = 'UPDATE user_card SET listed = 2 WHERE id = ?';
      $bindParams = array($card -> id);
      runParameterizedQuery($sql, $bindParams);
    }

    // for each requested card
    foreach($requestedCards as $card) {
      // insert into trade_request_cards
      $sql ='INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
      $bindParams = array($tradeRequestId, $card -> id);
      runParameterizedQuery($sql, $bindParams);

      // listed stays 0 (false)
    }
  }
?>