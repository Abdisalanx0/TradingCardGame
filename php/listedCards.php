<?php 
  include 'corsOptions.php';
  include 'dbConnection.php';
  include 'sqlHelpers.php';

  $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

  if ($conn -> connect_errno > 0) {
    die('Unable to connect to database [' . $conn -> connect_error . ']');
  }

  $responseData = array();

  // query for rows in listed_card
  $sql = 'SELECT * FROM listed_card';

  $listedCards = runQuery($sql, 'Select listed cards');

  if($listedCards) {
    $tradingCards = array();

    // for each listedCard
    while($listedCard = $listedCards -> fetch_assoc()) {
      // query for user_card row that corresponds to $listedCard
      $sql = 'SELECT * FROM user_card WHERE id = ?';
      $bindParams = array($listedCard['user_card_id']);

      $userCards = runSelectQuery($sql, $bindParams);

      $sql = 'SELECT * FROM trading_card WHERE id = ?';
      $bindParams = array($userCards[0]['card_id']);

      // query for trading_card row that corresponds to $userCards[0]
      $tradingCard = runSelectQuery($sql, $bindParams);

      $tradingCard[0]['price'] = floatval($listedCard['price']);

      $tradingCards[] = $tradingCard[0];
    }

    $responseData['items'] = $tradingCards;
    $responseData['currentPage'] = 1;

    if($_SERVER['REQUEST_METHOD'] === 'GET') {
      // sort the array by name (ascending)
      $sortColumn = array_column($responseData['items'], 'name');
      array_multisort($sortColumn, SORT_ASC, $responseData['items']);
    }
    else if($_SERVER['REQUEST_METHOD'] === 'POST') {
      // parse request body as JSON
      $body = json_decode(file_get_contents('php://input'));
      
      // parse body properties
      $sort = $body -> listedItemsSort;
      $priceFilter = $body -> listedItemsPriceFilter;
      $nameFilter = $body -> listedItemsNameFilter;
      $currentPage = $body -> listedItemsCurrentPage;

      // parse sort property and orientation
      $delimiter = strpos($sort, ' ');
      $sortProperty = substr($sort, 0, $delimiter);
      $sortOrientation = substr($sort, $delimiter + 1);
      
      // handle sort for 'rarity' property
      if($sortProperty === 'rarity') {
        function raritySort($a, $b) {
          global $sortOrientation;

          $aValue = $a['rarity'];
          $bValue = $b['rarity'];
          
          $sortOrientationMultiplier = $sortOrientation === 'asc' ? 1 : -1;

          $aNumeric =0;
          $bNumeric = 0;

          switch($aValue) {
            case 'Super-Rare':
              $aNumeric = 4;

              break;
            case 'Rare':
              $aNumeric = 3;

              break;
            case 'Uncommon':
              $aNumeric = 2;

              break;
            case 'Common':
              $aNumeric = 1;

              break;
          }

          switch($bValue) {
            case 'Super-Rare':
              $bNumeric = 4;

              break;
            case 'Rare':
              $bNumeric = 3;

              break;
            case 'Uncommon':
              $bNumeric = 2;

              break;
            case 'Common':
              $bNumeric = 1;

              break;
          }

          // a === b
          if($aNumeric === $bNumeric) {
            return 0;
          }
          // a > b
          else if($aNumeric > $bNumeric) {
            return 1 * $sortOrientationMultiplier;
          }
          // b > a
          else if($bNumeric > $aNumeric) {
            return -1 * $sortOrientationMultiplier;
          }
        }
        
        usort($responseData['items'], 'raritySort');
      }
      // handle sort for other properties
      else {
        $sortOrientationArgumentValue = $sortOrientation === 'asc' ? SORT_ASC : SORT_DESC;

        // sort the array by the given sort property and orientation
        $sortColumn = array_column($responseData['items'], $sortProperty);
        array_multisort($sortColumn, $sortOrientationArgumentValue, $responseData['items']);
      }

      // handle price filtering
      function filterByPrice($min, $max) {
        global $responseData;

        // for each item in responseData['items']
        for($i = 0; $i < count($responseData['items']); $i++) {
          // if the item is not between $min and $max
          if($responseData['items'][$i]['price'] < $min || $responseData['items'][$i]['price'] > $max) {
            // remove the item from the array
            array_splice($responseData['items'], $i, 1);

            $i--;
          }
        }
      }
  
      switch($priceFilter) {
        case '':
          break;
        case '0-50':
          filterByPrice(0, 50);

          break;
        case '50-100':
          filterByPrice(50, 100);

          break;
        case '100-1000':
          filterByPrice(100, 1000);

          break;
      }

      // handle name filtering
      if($nameFilter) {
        for($i = 0; $i < count($responseData['items']); $i++) {
          // if the item name does not contain the filtering string
          if(stripos($responseData['items'][$i]['name'], $nameFilter) === false) {
            // remove the item from the array
            array_splice($responseData['items'], $i, 1);

            $i--;
          }
        }
      }

      // set current page
      $responseData['currentPage'] = $currentPage;
    }

    // determine total items/pages
    $responseData['totalItems'] = count($responseData['items']);
    $responseData['totalPages'] = intval($responseData['totalItems'] / 10);

    if(fmod($responseData['totalItems'], 10) > 0) {
      $responseData['totalPages']++;
    }

    // save only the first 10 cards
    $responseData['items'] = array_slice($responseData['items'], $responseData['currentPage'] * 10 - 10, 10);

    // return the data
    echo json_encode($responseData);
  }

  // close the database connection
  $conn -> close();
?>