<!DOCTYPE html>
<html lang='en'>

<head>
   <meta charset="utf-8" />
   <title>Trading Card Database Create</title>
</head>

<body>
   <h1></h1>
   <?php
   define("SERVER_NAME", "localhost");
   define("DBF_USER_NAME", "root");
   define("DBF_PASSWORD", "mysql");
   define("DATABASE_NAME", "tradingCardDB");
   $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD);
   // Start with a new database to start primary keys at 1
   $sql = "DROP DATABASE " . DATABASE_NAME;
   runQuery($sql, "DROP " . DATABASE_NAME, true);

   // Check connection
   if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
   }

   // Create database if it doesn't exist
   $sql = "CREATE DATABASE IF NOT EXISTS " . DATABASE_NAME;
   runQuery($sql, "Creating " . DATABASE_NAME, true);
   $conn->select_db(DATABASE_NAME);
   // Create Table: tcg_user
   $sql = "CREATE TABLE IF NOT EXISTS tcg_user (
        id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL
        )";
   runQuery($sql, "Creating tcg_user table", false);

   // Create Table: trading_card
   $sql = "CREATE TABLE IF NOT EXISTS trading_card (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    rarity VARCHAR(255)
    )";
   runQuery($sql, "Creating trading_card table", false);

   // Populate trading_card table with Pokemon cards
$pokemonCards = array(
   array("Rattata", "A normal type pokemon that likes to bite.", "Common"),
   array("Pidgeotto", "A normal and flying-type pokemon that is commonly found.", "Common"),
   array("Bulbasaur", "A grass and poison-type starter pokemon.", "Common"),
   array("Growlithe", "A fire-type pokemon that grows stronger with its evolution.", "Uncommon"),
   array("Jigglypuff", "A fairy and normal-type pokemon ", "Uncommon"),
   array("Gengar", "A Ghost/posion-type that is the last of its evolution.", "Uncommon"),
   array("Snorlax", "A huge and lazy normal-type pokemon that does a lot of damange.", "Rare"),
   array("Ponyta", "A fire-type pokemon that evolves into Rapidash.", "Rare"),
   array("Charizard", "A powerful fire and flying-type pokemon that is the last of its evolution.", "Rare"),
   array("Mewtwo", "A super rare psychic-type pokemon that packs a punch.", "Super Rare")
);

foreach ($pokemonCards as $card) {
   $sql = "INSERT INTO trading_card (name, description, rarity) VALUES ('" . $card[0] . "', '" . $card[1] . "', '" . $card[2] . "')";
   runQuery($sql, "Pokemon card inserted: " . $card[0], false);
}

   // Create Table: user_card
   $sql = "CREATE TABLE IF NOT EXISTS user_card (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    num_owned INT(11),
    user_id INT(11) UNSIGNED,
    card_id INT(11) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES tgc_user(id),
    FOREIGN KEY (card_id) REFERENCES trading_card(id)
  )";
  runQuery($sql, "Creating user_card table", false);


   // Create Table: user_message
   $sql = "CREATE TABLE IF NOT EXISTS user_message (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sending_user_id INT(11) UNSIGNED,
    receiving_user_id INT(11) UNSIGNED,
    FOREIGN KEY (sending_user_id) REFERENCES tgc_user(id),
    FOREIGN KEY (receiving_user_id) REFERENCES tgc_user(id)
    )";
   runQuery($sql, "Creating user_message table", false);

   // Create Table: listed_card
   $sql = "CREATE TABLE IF NOT EXISTS listed_card (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(11,2),
    user_card_id INT(11) UNSIGNED,
    FOREIGN KEY (user_card_id) REFERENCES user_card(id)
    )";
   runQuery($sql, "Creating listed_card table", false);



   function runQuery($sql, $msg, $echoSuccess)
   {
      global $conn;

      if ($conn->query($sql) === TRUE) {
         if ($echoSuccess) {
            echo $msg . " successful.<br />";
         }
      } else {
         echo "<strong>Error when: " . $msg . "</strong> using SQL: " . $sql . "<br />" . $conn->error;
      }
   }
   ?>

</body>

</html>