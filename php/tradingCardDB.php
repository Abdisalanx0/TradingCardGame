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
    runQuery($sql, "DROP " . DATABASE_NAME);

    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS " . DATABASE_NAME;
    runQuery($sql, "Creating " . DATABASE_NAME);

    // select the database
    $conn->select_db(DATABASE_NAME);

    // Create Table: tcg_user
    $sql = "CREATE TABLE IF NOT EXISTS tcg_user (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      coin_balance INT(11) NOT NULL
    )";
    runQuery($sql, "Creating tcg_user table");

    // Create Table: trading_card
    $sql = "CREATE TABLE IF NOT EXISTS trading_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description VARCHAR(255),
      rarity VARCHAR(255),
      image VARCHAR(255)
    )";
    runQuery($sql, "Creating trading_card table");

    // Create Table: user_card
    $sql = "CREATE TABLE IF NOT EXISTS user_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      new_user INT(11) UNSIGNED,
      card_id INT(11) UNSIGNED,
      is_listed BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (new_user) REFERENCES tcg_user(id),
      FOREIGN KEY (card_id) REFERENCES trading_card(id)
    )";
    runQuery($sql, "Creating user_card table");

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
    runQuery($sql, "Creating user_message table");

    // Create Table: listed_card
    $sql = "CREATE TABLE IF NOT EXISTS listed_card (
      id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      price DECIMAL(11, 2),
      user_card_id INT(11) UNSIGNED,
      recipient_user_id INT(11) UNSIGNED,
      FOREIGN KEY (user_card_id) REFERENCES user_card(id),
      FOREIGN KEY (recipient_user_id) REFERENCES tcg_user(id)
    )";
    runQuery($sql, "Creating listed_card table");

    // Insert Table Data

    // Pokemon cards
    $pokemonCards = array(
      array("Rattata", "A normal type pokemon that likes to bite.", "Common","Rattata.png"),
      array("Pidgeotto", "A normal and flying-type pokemon that is commonly found.", "Common","Pidgeotto.png"),
      array("Geodude", "A rock and ground-type Pokemon with a tough exterior.", "Common", "Geodude.png"),
      array("Squirtle", "A water-type starter Pokemon with powerful water attacks.", "Common", "Squirtle.png"),
      array("Meowth", "A normal-type Pokemon known for its ability to pick up coins.", "Common", "Meowth.png"),
      array("Bulbasaur", "A grass and poison-type starter pokemon.", "Common", "Bulbasaur.png"),
      array("Eevee", "A versatile normal-type Pokemon capable of evolving into various powerful forms.", "Uncommon", "Eevee.png"),
      array("Vulpix", "A fire-type Pokemon with six beautiful tails .", "Uncommon", "Vulpix.png"),
      array("Dratini", "A rare dragon-type Pokemon known for its immense potential.", "Uncommon", "Dratini.png"),
      array("Growlithe", "A fire-type pokemon that grows stronger with its evolution.", "Uncommon", "Growlithe.png"),
      array("Jigglypuff", "A fairy and normal-type pokemon ", "Uncommon", "Jigglypuff.png"),
      array("Gengar", "A Ghost/posion-type that is the last of its evolution.", "Uncommon", "Gengar.png"),
      array("Snorlax", "A huge and lazy normal-type pokemon that does a lot of damange.", "Rare", "Snorlax.png"),
      array("Ponyta", "A fire-type pokemon that evolves into Rapidash.", "Rare", "Ponyta.png"),
      array("Charizard", "A powerful fire and flying-type pokemon that is the last of its evolution.", "Rare", "Charizard.png"),
      array("Kangaskhan", "A protective and powerful normal-type Pokemon known for its maternal instincts.", "Rare", "Kangaskhan.png"),
      array("Lapras", "A gentle water and ice-type Pokemon that is often seen carrying people on its back across the sea.", "Rare", "Lapras.png"),
      array("Alakazam", "A psychic-type Pokemon with an exceptionally high IQ and extraordinary telekinetic powers.", "Rare", "Alakazam.png"),
      array("Dragonite", "A majestic dragon and flying-type Pokemon capable of flying faster than the speed of sound.", "Super-Rare", "Dragonite.png"),
      array("Mewtwo", "A super rare psychic-type pokemon that packs a punch.", "Super-Rare", "Mewtwo.png")
    );

    // Table: tcg_user
    // $2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O => 'password'
    $sql = 'INSERT INTO tcg_user (username, password_hash, coin_balance) VALUES 
      ("admin", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100),
      ("Chase", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100),
      ("Abdisalan", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100),
      ("Hamze", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100)';
    
    runQuery($sql, 'tcg_user insert');

    $sql = 'SELECT id FROM tcg_user';

    $users = runQuery($sql, 'tcg_user select');

    $usersArray = array();

    while($user = $users -> fetch_assoc()) {
      $usersArray[] = $user['id'];
    }

    for($i = 0; $i < count($pokemonCards); $i++) {
      // Table: trading_card
      $sql = "INSERT INTO trading_card (name, description, rarity, image) VALUES (?, ?, ?, ?)";
      $bindParams = array($pokemonCards[$i][0], $pokemonCards[$i][1], $pokemonCards[$i][2], $pokemonCards[$i][3]);
      
      $insertId = runInsertQuery($sql, $bindParams);
      
      // table: user_card
      $sql = 'INSERT INTO user_card (new_user, card_id, is_listed) VALUES (?, ?, ?)';
  
      // generate random number owned
      $numOwned = rand(1, 5);

      // assign card to user with id of 1 (i.e., 'admin,' as inserted above)
      $bindParams = array(1, $insertId,0);
  
      runInsertQuery($sql, $bindParams);

      $randRecipientId = NULL;
      $randRecipientIndex = rand(0, count($usersArray) + 4);

      if($randRecipientIndex < count($usersArray)) {
        $randRecipientId = $usersArray[$randRecipientIndex];

        $sql = "INSERT INTO listed_card (price, user_card_id, recipient_user_id) VALUES (?, ?, $randRecipientId)";
      }
      else {
        $sql = "INSERT INTO listed_card (price, user_card_id) VALUES (?, ?)";
      }

      // Table: listed_card
  
      // generate random price
      $randPrice = rand(1, 100);

      $bindParams = array($randPrice, $insertId);

      runInsertQuery($sql, $bindParams);
    }
  ?>

</body>

</html>