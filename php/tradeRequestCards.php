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
    $responseData = array( 'initiatedTrades' => array(), 'receivedTrades' => array() );

    // parse request body as JSON
    $body = json_decode(file_get_contents('php://input'));

    // parse body properties
    $sort = $body -> sort;
    $priceFilter = $body -> priceFilter;
    $nameFilter = $body -> nameFilter;
    $username = $body -> username;

    $sql = 'SELECT id FROM tcg_user WHERE username = ?';
    $bindParams = array($username);

    $userQuery = runSelectQuery($sql, $bindParams);
    $userId = $userQuery[0]['id'];

    // get initiated trade requests
    $sql = 'SELECT * FROM trade_request WHERE initiator_user_id = ?';
    $bindParams = array($userId);

    $initiatedTradeRequests = runSelectQuery($sql, $bindParams);

    for($i = 0; $i < count($initiatedTradeRequests); $i++) {
      // $initiatedTradeRequests[$i]['id']
      // $initiatedTradeRequests[$i]['initiator_user_id']
      // $initiatedTradeRequests[$i]['target_user_id']
      // $initiatedTradeRequests[$i]['price']

      $sql = 'SELECT username FROM tcg_user WHERE id = ?';
      $bindParams = array($initiatedTradeRequests[$i]['target_user_id']);

      $userQuery = runSelectQuery($sql, $bindParams);
      $targetUsername = $userQuery[0]['username'];

      $initiatedTrade = array( 
        'id' => $initiatedTradeRequests[$i]['id'], 
        'targetUsername' => $targetUsername, 
        'price' => $initiatedTradeRequests[$i]['price'], 
        'offeredCards' => array(),
        'requestedCards' => array()
      );
      
      $sql = 'SELECT * FROM trade_request_card WHERE request_id = ?';
      $bindParams = array($initiatedTradeRequests[$i]['id']);
      
      $tradeRequestCards = runSelectQuery($sql, $bindParams);
      
      for($j = 0; $j < count($tradeRequestCards); $j++) {
        // $tradeRequestCards[$j]['id']
        // $tradeRequestCards[$j]['request_id']
        // $tradeRequestCards[$j]['user_card_id']
        
        $sql = 'SELECT * FROM trading_card tc JOIN user_card uc ON tc.id = uc.card_id WHERE uc.id = ?';
        $bindParams = array($tradeRequestCards[$j]['user_card_id']);
        
        $userCard = runSelectQuery($sql, $bindParams);

        if(isset($userCard[0])) {
          if($userCard[0]['user_id'] === $initiatedTradeRequests[$i]['initiator_user_id']) {
            $initiatedTrade['offeredCards'][] = $userCard[0];
          }
          else {
            $initiatedTrade['requestedCards'][] = $userCard[0];
          }
        }
      }

      $responseData['initiatedTrades'][] = $initiatedTrade;
    }

    // get received trade requests
    $sql = 'SELECT * FROM trade_request WHERE target_user_id = ?';
    $bindParams = array($userId);

    $receivedTradeRequests = runSelectQuery($sql, $bindParams);

    for($i = 0; $i < count($receivedTradeRequests); $i++) {
      // $receivedTradeRequests[$i]['id']
      // $receivedTradeRequests[$i]['initiator_user_id']
      // $receivedTradeRequests[$i]['price']

      $sql = 'SELECT username FROM tcg_user WHERE id = ?';
      $bindParams = array($initiatedTradeRequests[$i]['initiator_user_id']);

      $userQuery = runSelectQuery($sql, $bindParams);
      $initiatorUsername = $userQuery[0]['username'];

      $receivedTrade = array( 
        'id' => $receivedTradeRequests[$i]['id'], 
        'initiatorUsername' => $initiatorUsername,
        'price' => $receivedTradeRequests[$i]['price'], 
        'offeredCards' => array(),
        'requestedCards' => array()
      );

      $sql = 'SELECT * FROM trade_request_card WHERE request_id = ?';
      $bindParams = array($receivedTradeRequests[$i]['id']);

      $tradeRequestCards = runSelectQuery($sql, $bindParams);

      for($j = 0; $j < count($tradeRequestCards); $j++) {
        // $tradeRequestCards[$j]['id']
        // $tradeRequestCards[$j]['request_id']
        // $tradeRequestCards[$j]['user_card_id']

        $sql = 'SELECT * FROM trading_card tc JOIN user_card uc ON tc.id = uc.card_id WHERE uc.id = ?';
        $bindParams = array($tradeRequestCards[$j]['user_card_id']);

        $userCard = runSelectQuery($sql, $bindParams);

        if(isset($userCard[0])) {
          if($userCard[0]['user_id'] === $receivedTradeRequests[$i]['initiator_user_id']) {
            $receivedTrade['offeredCards'][] = $userCard[0];
          }
          else {
            $receivedTrade['requestedCards'][] = $userCard[0];
          }
        }
      }

      $responseData['receivedTrades'][] = $receivedTrade;
    }

    for($i = 0; $i < count($responseData['initiatedTrades']); $i++) {
      // sort
      sortCards($responseData['initiatedTrades'][$i]['offeredCards'], $sort);
      sortCards($responseData['initiatedTrades'][$i]['requestedCards'], $sort);

      // price filter
      switch($priceFilter) {
        case '':
          break;
        case '0-50':
          filterByPrice($responseData['initiatedTrades'][$i], 0, 50);
    
          break;
        case '50-100':
          filterByPrice($responseData['initiatedTrades'][$i], 50, 100);
    
          break;
        case '100-1000':
          filterByPrice($responseData['initiatedTrades'][$i], 100, 1000);
    
          break;
      }

      // name filter
      filterByName($responseData['initiatedTrades'][$i]['offeredCards'], $nameFilter);
      filterByName($responseData['initiatedTrades'][$i]['requestedCards'], $nameFilter);
    }
    
    for($i = 0; $i < count($responseData['receivedTrades']); $i++) {
      // sort
      sortCards($responseData['receivedTrades'][$i]['offeredCards'], $sort);
      sortCards($responseData['receivedTrades'][$i]['requestedCards'], $sort);

      // price filter
      switch($priceFilter) {
        case '':
          break;
        case '0-50':
          filterByPrice($responseData['receivedTrades'][$i], 0, 50);
    
          break;
        case '50-100':
          filterByPrice($responseData['receivedTrades'][$i], 50, 100);
    
          break;
        case '100-1000':
          filterByPrice($responseData['receivedTrades'][$i], 100, 1000);
    
          break;
      }

      // name filter
      filterByName($responseData['receivedTrades'][$i]['offeredCards'], $nameFilter);
      filterByName($responseData['receivedTrades'][$i]['requestedCards'], $nameFilter);
    }

    // return json
    echo json_encode($responseData);
  }
?>