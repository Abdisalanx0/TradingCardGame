<?php 
  include 'corsOptions.php';
  include 'dbConnection.php';
  include 'sqlHelpers.php';
  include 'listedCardHelpers.php';

  $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

  if ($conn -> connect_errno > 0) {
    die('Unable to connect to database [' . $conn -> connect_error . ']');
  }

  $responseData = array( 'cards' => array(), 'currentPage' => 1 );

  // query for rows in listed_card
  $sql = 'SELECT * FROM marketplace_card';

  $marketplaceCards = runQuery($sql);

  if($marketplaceCards) {
    // for each marketplaceCard
    while($marketplaceCard = $marketplaceCards -> fetch_assoc()) {
      // query for user_card row that corresponds to $marketplaceCard
      $sql = 'SELECT * FROM user_card WHERE id = ?';
      $bindParams = array($marketplaceCard['user_card_id']);

      $userCards = runSelectQuery($sql, $bindParams);

      $sql = 'SELECT * FROM trading_card WHERE id = ?';
      $bindParams = array($userCards[0]['card_id']);

      // query for trading_card row that corresponds to $userCards[0]
      $tradingCard = runSelectQuery($sql, $bindParams);

      $tradingCard[0]['price'] = floatval($marketplaceCard['price']);

      $responseData['cards'][] = $tradingCard[0];
    }
  }

  if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // parse request body as JSON
    $body = json_decode(file_get_contents('php://input'));
    
    // parse body properties
    $sort = $body -> sort;
    $priceFilter = $body -> priceFilter;
    $nameFilter = $body -> nameFilter;
    $currentPage = $body -> currentPage;

    sortCards($responseData['cards'], $sort);

    switch($priceFilter) {
      case '':
        break;
      case '0-50':
        filterByPrice($responseData['cards'], 0, 50);
  
        break;
      case '50-100':
        filterByPrice($responseData['cards'], 50, 100);
  
        break;
      case '100-1000':
        filterByPrice($responseData['cards'], 100, 1000);
  
        break;
    }

    filterByName($responseData['cards'], $nameFilter);

    $responseData['currentPage'] = $currentPage;

    // determine total cards/pages
    $responseData['totalCards'] = count($responseData['cards']);
    $responseData['totalPages'] = intval($responseData['totalCards'] / 10);

    if(fmod($responseData['totalCards'], 10) > 0) {
      $responseData['totalPages']++;
    }

    // save only the first 10 cards
    $responseData['cards'] = array_slice($responseData['cards'], $responseData['currentPage'] * 10 - 10, 10);
  }

  echo json_encode($responseData);

  // close the database connection
  $conn -> close();
?>