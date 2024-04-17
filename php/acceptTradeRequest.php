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

    // get request info
    $sql = 'SELECT * FROM trade_request WHERE id = ?';
    $bindParams = array($requestId);
    $requestQuery = runSelectQuery($sql, $bindParams);
    $initiatorUserId = $requestQuery[0]['initiator_user_id'];
    $targetUserId = $requestQuery[0]['target_user_id'];
    $offeredPrice = $requestQuery[0]['offered_price'];
    $requestedPrice = $requestQuery[0]['requested_price'];

    // get initiator user balance
    $sql = 'SELECT coin_balance FROM tcg_user WHERE id = ?';
    $bindParams = array($initiatorUserId);
    $userQuery = runSelectQuery($sql, $bindParams);
    $initiatorUserBalance = $userQuery[0]['coin_balance'];

    // get target user balance
    $sql = 'SELECT coin_balance FROM tcg_user WHERE id = ?';
    $bindParams = array($targetUserId);
    $userQuery = runSelectQuery($sql, $bindParams);
    $targetUserBalance = $userQuery[0]['coin_balance'];

    // if both user balances are sufficient
    if($targetUserBalance >= $requestedPrice && $initiatorUserBalance >= $offeredPrice) {
      // update initiator coin balance
      $sql = 'UPDATE tcg_user SET coin_balance = ? WHERE id = ?';
      $bindParams = array($initiatorUserBalance - $offeredPrice + $requestedPrice, $initiatorUserId);
      runParameterizedQuery($sql, $bindParams);

      // update target coin balance
      $sql = 'UPDATE tcg_user SET coin_balance = ? WHERE id = ?';
      $bindParams = array($targetUserBalance - $requestedPrice + $offeredPrice, $targetUserId);
      runParameterizedQuery($sql, $bindParams);

      // get request cards
      $sql = 'SELECT * FROM trade_request_card WHERE request_id = ?';
      $bindParams = array($requestId);
      $requestCards = runSelectQuery($sql, $bindParams);

      // for each request card
      foreach($requestCards as $card) {
        // get user card 
        $sql = 'SELECT * FROM user_card WHERE id = ?';
        $bindParams = array($card['user_card_id']);
        $userCardQuery = runSelectQuery($sql, $bindParams);
        $userCard = $userCardQuery[0];

        // if card belongs to initiator
        if($userCard['user_id'] === $initiatorUserId) {
          // set listed to 0 (false) and transfer the card to the target user
          $sql = 'UPDATE user_card SET user_id = ?, listed = 0 WHERE id = ?';
          $bindParams = array($targetUserId, $card['user_card_id']);
          runParameterizedQuery($sql, $bindParams);
        }
        // else if card belongs to target
        else {
          // set listed to 0 (false) and transfer the card to the initiator user
          $sql = 'UPDATE user_card SET user_id = ?, listed = 0 WHERE id = ?';
          $bindParams = array($initiatorUserId, $card['user_card_id']);
          runParameterizedQuery($sql, $bindParams);
        }
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
    }
?>