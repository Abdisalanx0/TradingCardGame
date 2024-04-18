<!DOCTYPE html>
<html lang='en'>

<head>
   <meta charset="utf-8" />
   <title>Trading Card Database Create</title>
</head>

<body>
  <?php
    include 'dbConnection.php';
    include 'sqlHelpers.php';

    $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD);

    // Start with a new database to start primary keys at 1
    $sql = "DROP DATABASE " . DATABASE_NAME;
    runQuery($sql);

    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS " . DATABASE_NAME;
    runQuery($sql);

    // select the database
    $conn->select_db(DATABASE_NAME);

    // Create Table: tcg_user
    $sql = "CREATE TABLE IF NOT EXISTS tcg_user (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      coin_balance INT(11) NOT NULL
    )";
    runQuery($sql);

    // Create Table: trading_card
    $sql = "CREATE TABLE IF NOT EXISTS trading_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description VARCHAR(255),
      card_set VARCHAR(255), -- the set the card belongs to (e.g., Pokemon, Baseball)
      image VARCHAR(255)
    )";
    runQuery($sql);

    // Create Table: user_card
    $sql = "CREATE TABLE IF NOT EXISTS user_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT(11) UNSIGNED,
      card_id INT(11) UNSIGNED,
      is_listed BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES tcg_user(id),
      FOREIGN KEY (card_id) REFERENCES trading_card(id)
    )";
    runQuery($sql);

    // Create Table: user_message
    $sql = "CREATE TABLE IF NOT EXISTS user_message (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sending_user_id INT(11) UNSIGNED,
      receiving_user_id INT(11) UNSIGNED,
      FOREIGN KEY (sending_user_id) REFERENCES tcg_user(id),
      FOREIGN KEY (receiving_user_id) REFERENCES tcg_user(id)
    )";
    runQuery($sql);

    // Create Table: marketplace_card
    $sql = "CREATE TABLE IF NOT EXISTS marketplace_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      price INT(11) DEFAULT 0,
      user_card_id INT(11) UNSIGNED,
      FOREIGN KEY (user_card_id) REFERENCES user_card(id)
    )";
    runQuery($sql);

    // create table trade_request
    $sql = "CREATE TABLE IF NOT EXISTS trade_request (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      initiator_user_id INT(11) UNSIGNED,
      target_user_id INT(11) UNSIGNED,
      price INT(11) DEFAULT 0,
      FOREIGN KEY (initiator_user_id) REFERENCES tcg_user(id),
      FOREIGN KEY (target_user_id) REFERENCES tcg_user(id)
    )";
    runQuery($sql);

    // create table trade_request_card
    $sql = "CREATE TABLE IF NOT EXISTS trade_request_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      request_id INT(11) UNSIGNED,
      user_card_id INT(11) UNSIGNED,
      FOREIGN KEY (request_id) REFERENCES trade_request(id),
      FOREIGN KEY (user_card_id) REFERENCES user_card(id)
    )";
    runQuery($sql);

    // Insert Table Data

    // Pokemon cards
    $pokemonCards = array(
      array("Rattata", "A normal type pokemon that likes to bite.", "Pokemon","Rattata.png"),
      array("Pidgeotto", "A normal and flying-type pokemon that is commonly found.", "Pokemon","Pidgeotto.png"),
      array("Geodude", "A rock and ground-type Pokemon with a tough exterior.", "Pokemon", "Geodude.png"),
      array("Squirtle", "A water-type starter Pokemon with powerful water attacks.", "Pokemon", "Squirtle.png"),
      array("Meowth", "A normal-type Pokemon known for its ability to pick up coins.", "Pokemon", "Meowth.png"),
      array("Bulbasaur", "A grass and poison-type starter pokemon.", "Pokemon", "Bulbasaur.png"),
      array("Eevee", "A versatile normal-type Pokemon capable of evolving into various powerful forms.", "Pokemon", "Eevee.png"),
      array("Vulpix", "A fire-type Pokemon with six beautiful tails .", "Pokemon", "Vulpix.png"),
      array("Dratini", "A rare dragon-type Pokemon known for its immense potential.", "Pokemon", "Dratini.png"),
      array("Growlithe", "A fire-type pokemon that grows stronger with its evolution.", "Pokemon", "Growlithe.png"),
      array("Jigglypuff", "A fairy and normal-type pokemon ", "Pokemon", "Jigglypuff.png"),
      array("Gengar", "A Ghost/posion-type that is the last of its evolution.", "Pokemon", "Gengar.png"),
      array("Snorlax", "A huge and lazy normal-type pokemon that does a lot of damange.", "Pokemon", "Snorlax.png"),
      array("Ponyta", "A fire-type pokemon that evolves into Rapidash.", "Pokemon", "Ponyta.png"),
      array("Charizard", "A powerful fire and flying-type pokemon that is the last of its evolution.", "Pokemon", "Charizard.png"),
      array("Kangaskhan", "A protective and powerful normal-type Pokemon known for its maternal instincts.", "Pokemon", "Kangaskhan.png"),
      array("Lapras", "A gentle water and ice-type Pokemon that is often seen carrying people on its back across the sea.", "Pokemon", "Lapras.png"),
      array("Alakazam", "A psychic-type Pokemon with an exceptionally high IQ and extraordinary telekinetic powers.", "Pokemon", "Alakazam.png"),
      array("Dragonite", "A majestic dragon and flying-type Pokemon capable of flying faster than the speed of sound.", "Pokemon", "Dragonite.png"),
      array("Mewtwo", "A super rare psychic-type pokemon that packs a punch.", "Pokemon", "Mewtwo.png")
    );

    // Table: tcg_user
    // $2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O => 'password'
    $sql = 'INSERT INTO tcg_user (username, password_hash, coin_balance) VALUES 
      ("admin", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100000000),
      ("Chase", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Abdisalan", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Hamze", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000)';
    
    runQuery($sql);

    $sql = 'SELECT id FROM tcg_user';

    $users = runQuery($sql);

    $usersArray = array();

    while($user = $users -> fetch_assoc()) {
      $usersArray[] = intval($user['id']);
    }
    
    for($i = 0; $i < count($pokemonCards); $i++) {
      // Table: trading_card
      $sql = "INSERT INTO trading_card (name, description, card_set, image) VALUES (?, ?, ?, ?)";
      $bindParams = array($pokemonCards[$i][0], $pokemonCards[$i][1], $pokemonCards[$i][2], $pokemonCards[$i][3]);
      
      $tradingCardInsertId = runInsertQuery($sql, $bindParams);
      
      for($j = 0; $j < count($usersArray); $j++) {
        // table: user_card
        $sql = 'INSERT INTO user_card (user_id, card_id, is_listed) VALUES (?, ?, ?)';

        // set admin cards as listed and other users' cards as not listed
        $bindParams = array($usersArray[$j], $tradingCardInsertId, $usersArray[$j] === 1 ? 1 : 0);
    
        runInsertQuery($sql, $bindParams);
      }
    }

    $tradeRequests = array( 'usedUserCardIndexes' => array() );

    $sql = 'SELECT * FROM user_card WHERE user_id = 1';
    $adminCards = runQuery($sql);

    $sql = 'SELECT * FROM user_card WHERE user_id <> 1';
    $otherUserCardsResult = runQuery($sql);

    $otherUserCards = array();

    while($otherUserCard = $otherUserCardsResult -> fetch_assoc()) {
      $otherUserCards[] = $otherUserCard;
    }

    // for each admin card,
    // determine if it is listed on the marketplace or part of a trade request
    while($adminCard = $adminCards -> fetch_assoc()) {
      // excludes usersArray[0] (admin)
      $randTargetUserIndex = rand(1, 10);

      // generate random price
      $randPrice = rand(0, 100);

      // if random value is 4 through 10
      if($randTargetUserIndex > 3) {
        // insert card into marketplace_card
        $sql = 'INSERT INTO marketplace_card (price, user_card_id) VALUES (?, ?)';
  
        $bindParams = array($randPrice, $adminCard['id']);
  
        runInsertQuery($sql, $bindParams);
      }
      // else if random value is 1 through 3
      else {
        // if there is no trade request entry for the target user indentified in usersArray by the random index
        if(!isset($tradeRequests[$usersArray[$randTargetUserIndex]])) {
          // insert a trade_request entity in the database
          $sql = 'INSERT INTO trade_request (initiator_user_id, target_user_id, price) VALUES (?, ?, ?)';
          $bindParams = array(1, $usersArray[$randTargetUserIndex], $randPrice);
          
          $tradeRequestInsertId = runInsertQuery($sql, $bindParams);

          // store the trade_request id and target user id 
          $tradeRequests[$usersArray[$randTargetUserIndex]] = $tradeRequestInsertId;
        }

        // insert the current adminCard into trade_request_card for the current trade_request
        $sql = 'INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
        $bindParams = array($tradeRequests[$usersArray[$randTargetUserIndex]], $adminCard['id']);

        runInsertQuery($sql, $bindParams);

        // select a random other user card to insert into trade_request_card for the current trade reqeust
        $randomRequestedCardIndex = rand(0, count($otherUserCards) - 1);  

        // get the card's user_card row
        $sql = 'SELECT is_listed FROM user_card WHERE id = ?';
        $bindParams = array($otherUserCards[$randomRequestedCardIndex]['id']);

        $cardQuery = runSelectQuery($sql, $bindParams);

        // if the card is not used in a trade request
        if(!isset($tradeRequests['usedUserCardIndexes'][$randomRequestedCardIndex])) {
          // insert it into trade_request_card
          $sql = 'INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
          $bindParams = array($tradeRequests[$usersArray[$randTargetUserIndex]], $otherUserCards[$randomRequestedCardIndex]['id']);
  
          runInsertQuery($sql, $bindParams);

          $tradeRequests['usedUserCardIndexes'][$randomRequestedCardIndex] = true;
        }
      }
    }
    $messageData = array(
    array("Hey, would you like to trade your Charizard?", 1, 2), // message from admin to Chase
    array("no!", 2, 1), // message from chase to Admin
    array("Can you lower the price for Dratini?", 3, 1), // message from Abdisalan to admin
    array("Thanks for the trade yesterday!", 4, 1) // message from Hamze to admin
  );

  foreach ($messageData as $msg) {
    $sql = "INSERT INTO user_message (content, sending_user_id, receiving_user_id) VALUES (?, ?, ?)";
    $bindParams = array($msg[0], $msg[1], $msg[2]);
    runInsertQuery($sql, $bindParams);
  }




  ?>

</body>

</html>