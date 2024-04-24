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
      listed TINYINT(1) NOT NULL DEFAULT FALSE,
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
      offered_price INT(11) DEFAULT 0,
      requested_price INT(11) DEFAULT 0,
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
      array("Mewtwo", "A super rare psychic-type pokemon that packs a punch.", "Pokemon", "Mewtwo.png"),
      array("Rattata", "A normal type pokemon that likes to bite.", "Pokemon", "Rattata.png"),
      array("Pidgeotto", "A normal and flying-type pokemon that is commonly found.", "Pokemon", "Pidgeotto.png"),
      array("Geodude", "A rock and ground-type Pokemon with a tough exterior.", "Pokemon", "Geodude.png"),
      array("Squirtle", "A water-type starter Pokemon with powerful water attacks.", "Pokemon", "Squirtle.png"),
      array("Meowth", "A normal-type Pokemon known for its ability to pick up coins.", "Pokemon", "Meowth.png"),
      array("Bulbasaur", "A grass and poison-type starter pokemon.", "Pokemon", "Bulbasaur.png"),
      array("Eevee", "A versatile normal-type Pokemon capable of evolving into various powerful forms.", "Pokemon", "Eevee.png"),
      array("Vulpix", "A fire-type Pokemon with six beautiful tails.", "Pokemon", "Vulpix.png"),
      array("Dratini", "A rare dragon-type Pokemon known for its immense potential.", "Pokemon", "Dratini.png"),
      array("Growlithe", "A fire-type pokemon that grows stronger with its evolution.", "Pokemon", "Growlithe.png"),
      array("Jigglypuff", "A fairy and normal-type pokemon.", "Pokemon", "Jigglypuff.png"),
      array("Gengar", "A Ghost/poison-type that is the last of its evolution.", "Pokemon", "Gengar.png"),
      array("Snorlax", "A huge and lazy normal-type pokemon that does a lot of damage.", "Pokemon", "Snorlax.png"),
      array("Ponyta", "A fire-type pokemon that evolves into Rapidash.", "Pokemon", "Ponyta.png"),
      array("Charizard", "A powerful fire and flying-type pokemon that is the last of its evolution.", "Pokemon", "Charizard.png"),
      array("Kangaskhan", "A protective and powerful normal-type Pokemon known for its maternal instincts.", "Pokemon", "Kangaskhan.png"),
      array("Lapras", "A gentle water and ice-type Pokemon that is often seen carrying people on its back across the sea.", "Pokemon", "Lapras.png"),
      array("Alakazam", "A psychic-type Pokemon with an exceptionally high IQ and extraordinary telekinetic powers.", "Pokemon", "Alakazam.png"),
      array("Dragonite", "A majestic dragon and flying-type Pokemon capable of flying faster than the speed of sound.", "Pokemon", "Dragonite.png"),
      array("Mewtwo", "A super rare psychic-type pokemon that packs a punch.", "Pokemon", "Mewtwo.png"),
      array("Ronald Acuna Jr.", "An outfielder for the Atlanta Braves.", "Baseball", "Ronald Acuna Jr.png"),
      array("Mookie Betts", "An outfielder for the Los Angeles Dodgers.", "Baseball", "Mookie Betts.png"),
      array("Aaron Judge", "An outfielder for the New York Yankees.", "Baseball", "Aaron Judge.png"),
      array("Shohei Ohtani", "A pitcher and designated hitter for the Los Angeles Dodgers.", "Baseball", "Shohei Ohtani.png"),
      array("Freddie Freeman", "A first baseman for the Los Angeles Dodgers.", "Baseball", "Freddie Freeman.png"),
      array("Corey Seager", "A shortstop for the Texas Rangers.", "Baseball", "Corey Seager.png"),
      array("Juan Soto", "An outfielder for the New York Yankees.", "Baseball", "Juan Soto.png"),
      array("Yordan Alvarez", "A designated hitter and outfielder for the Houston Astros.", "Baseball", "Yordan Alvarez.png"),
      array("Gerrit Cole", "A pitcher for the New York Yankees.", "Baseball", "Gerrit Cole.png"),
      array("Julio Rodriguez", "An outfielder for the Seattle Mariners.", "Baseball", "Julio Rodriguez.png"),
      array("Bryce Harper", "An outfielder for the Philadelphia Phillies.", "Baseball", "Bryce Harper.png"),
      array("Mike Trout", "An outfielder for the Los Angeles Angels.", "Baseball", "Mike Trout.png"),
      array("Matt Olson", "A first baseman for the Atlanta Braves.", "Baseball", "Matt Olson.png"),
      array("Jose Ramirez", "A third baseman for the Cleveland Guardians.", "Baseball", "Jose Ramirez.png"),
      array("Austin Riley", "A third baseman for the Atlanta Braves.", "Baseball", "Austin Riley.png"),
      array("Trea Turner", "A shortstop for the Philadelphia Phillies.", "Baseball", "Trea Turner.png"),
      array("Spencer Strider", "A pitcher for the Atlanta Braves.", "Baseball", "Spencer Strider.png"),
      array("Corbin Carroll", "An outfielder for the Arizona Diamondbacks.", "Baseball", "Corbin Carroll.png"),
      array("Adley Rutschman", "A catcher for the Baltimore Orioles.", "Baseball", "Adley Rutschman.png"),
      array("Bobby Witt Jr.", "A shortstop for the Kansas City Royals.", "Baseball", "Bobby Witt Jr.png"),
      array("Nikola Jokic", "A center for the Denver Nuggets.", "Basketball", "Nikola Jokic.png"),
      array("Giannis Antetokounmpo", "A forward for the Milwaukee Bucks.", "Basketball", "Giannis Antetokounmpo.png"),
      array("Stephen Curry", "A guard for the Golden State Warriors.", "Basketball", "Stephen Curry.png"),
      array("Luka Doncic", "A guard for the Dallas Mavericks.", "Basketball", "Luka Doncic.png"),
      array("Kevin Durant", "A forward for the Phoenix Suns.", "Basketball", "Kevin Durant.png"),
      array("Joel Embiid", "A center for the Philadelphia 76ers.", "Basketball", "Joel Embiid.png"),
      array("Jayson Tatum", "A forward for the Boston Celtics.", "Basketball", "Jayson Tatum.png"),
      array("Devin Booker", "A guard for the Phoenix Suns.", "Basketball", "Devin Booker.png"),
      array("Jimmy Butler", "A forward for the Miami Heat.", "Basketball", "Jimmy Butler.png"),
      array("Damian Lillard", "A guard for the Milwaukee Bucks.", "Basketball", "Damian Lillard.png"),
      array("Shai Gilgeous-Alexander", "A guard for the Oklahoma City Thunder.", "Basketball", "Shai Gilgeous-Alexander.png"),
      array("LeBron James", "A forward for the Los Angeles Lakers.", "Basketball", "Lebron James.png"),
      array("Anthony Davis", "A forward for the Los Angeles Lakers.", "Basketball", "Anthony Davis.png"),
      array("Ja Morant", "A guard for the Memphis Grizzlies.", "Basketball", "Ja Morant.png"),
      array("Kawhi Leonard", "A forward for the Los Angeles Clippers.", "Basketball", "Kawhi Leonard.png"),
      array("Donovan Mitchell", "A guard for the Cleveland Cavaliers.", "Basketball", "Donovan Mitchell.png"),
      array("Paul George", "A forward for the Los Angeles Clippers.", "Basketball", "Paul George.png"),
      array("Anthony Edwards", "A guard for the Minnesota Timberwolves.", "Basketball", "Anthony Edwards.png"),
      array("Jamal Murray", "A guard for the Denver Nuggets.", "Basketball", "Jamal Murray.png"),
      array("Bam Adebayo", "A center for the Miami Heat.", "Basketball", "Bam Adebayo.png"),
      array("Patrick Mahomes", "A quarterback for the Kansas City Chiefs.", "Football", "Patrick Mahomes.png"),
      array("Justin Jefferson", "A wide receiver for the Minnesota Vikings.", "Football", "Justin Jefferson.png"),
      array("Jalen Hurts", "A quarterback for the Philadelphia Eagles.", "Football", "Jalen Hurts.png"),
      array("Nick Bosa", "A defensive end for the San Francisco 49ers.", "Football", "Nick Bosa.png"),
      array("Travis Kelce", "A tight end for the Kansas City Chiefs.", "Football", "Travis Kelce.png"),
      array("Joe Burrow", "A quarterback for the Cincinnati Bengals.", "Football", "Joe Burrow.png"),
      array("Tyreek Hill", "A wide receiver for the Miami Dolphins.", "Football", "Tyreek Hill.png"),
      array("Josh Allen", "A quarterback for the Buffalo Bills.", "Football", "Josh Allen.png"),
      array("Micah Parsons", "A linebacker for the Dallas Cowboys.", "Football", "Micah Parsons.png"),
      array("Chris Jones", "A defensive tackle for the Kansas City Chiefs.", "Football", "Chris Jones.png"),
      array("Aaron Donald", "A defensive tackle for the Los Angeles Rams.", "Football", "Aaron Donald.png"),
      array("Josh Jacobs", "A running back for the Green Bay Packers.", "Football", "Josh Jacobs.png"),
      array("Davante Adams", "A wide receiver for the Las Vegas Raiders.", "Football", "Davante Adams.png"),
      array("Trent Williams", "An offensive tackle for the San Francisco 49ers.", "Football", "Trent Williams.png"),
      array("Fred Warner", "A linebacker for the San Francisco 49ers.", "Football", "Fred Warner.png"),
      array("Stefon Diggs", "A wide receiver for the Houston Texans.", "Football", "Stefon Diggs.png"),
      array("Maxx Crosby", "A defensive end for the Las Vegas Raiders.", "Football", "Maxx Crosby.png"),
      array("Minkah Fitzpatrick", "A safety for the Pittsburgh Steelers.", "Football", "Minkah Fitzpatrick.png"),
      array("George Kittle", "A tight end for the San Francisco 49ers.", "Football", "George Kittle.png"),
      array("Myles Garrett", "A defensive end for the Cleveland Browns.", "Football", "Myles Garrett.png"),
      array("Connor McDavid", "A center for the Edmonton Oilers.", "Hockey", "Connor McDavid.png"),
      array("Cale Makar", "A defenseman for the Colorado Avalanche.", "Hockey", "Cale Makar.png"),
      array("Nathan MacKinnon", "A center for the Colorado Avalanche.", "Hockey", "Nathan MacKinnon.png"),
      array("Jack Hughes", "A center for the New Jersey Devils.", "Hockey", "Jack Hughes.png"),
      array("Auston Matthews", "A center for the Toronto Maple Leafs.", "Hockey", "Auston Matthews.png"),
      array("Leon Draisaitl", "A center for the Edmonton Oilers.", "Hockey", "Leon Draisaitl.png"),
      array("Mikko Rantanen", "A right wing for the Colorado Avalanche.", "Hockey", "Mikko Rantanen.png"),
      array("Nikita Kucherov", "A right wing for the Tampa Bay Lightning.", "Hockey", "Nikita Kucherov.png"),
      array("Jack Eichel", "A center for the Vegas Golden Knights.", "Hockey", "Jack Eichel.png"),
      array("David Pastrnak", "A right wing for the Boston Bruins.", "Hockey", "David Pastrnak.png"),
      array("Matthew Tkachuk", "A left wing for the Florida Panthers.", "Hockey", "Matthew Tkachuk.png"),
      array("Jason Robertson", "A left wing for the Dallas Stars.", "Hockey", "Jason Robertson.png"),
      array("Adam Fox", "A defenseman for the New York Rangers.", "Hockey", "Adam Fox.png"),
      array("Connor Hellebuyck", "A goaltender for the Winnipeg Jets.", "Hockey", "Connor Hellebuyck.png"),
      array("Aleksander Barkov", "A center for the Florida Panthers.", "Hockey", "Aleksander Barkov.png"),
      array("Elias Pettersson", "A center for the Vancouver Canucks.", "Hockey", "Elias Pettersson.png"),
      array("Kirill Kaprizov", "A left wing for the Minnesota Wild.", "Hockey", "Kirill Kaprizov.png"),
      array("Victor Hedman", "A defenseman for the Tampa Bay Lightning.", "Hockey", "Victor Hedman.png"),
      array("Brady Tkachuk", "A left wing for the Ottawa Senators.", "Hockey", "Brady Tkachuk.png"),
      array("Mitchell Marner", "A right wing for the Toronto Maple Leafs.", "Hockey", "Mitchell Marner.png")
    );

    // Table: tcg_user
    // $2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O => 'password'
    $sql = 'INSERT INTO tcg_user (username, password_hash, coin_balance) VALUES 
      ("admin", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 100000000),
      ("Chase", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Abdisalan", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Hamze", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Joe12", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Bobbert26", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000),
      ("Coolguy12", "$2y$10$vh4FwBnC9r3sO.MoOwdRveuPw6rdfvxFuoyF7teLOVVstUA89EY6O", 1000)
      ';
    
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
        $sql = 'INSERT INTO user_card (user_id, card_id, listed) VALUES (?, ?, ?)';

        // set admin cards as listed on marketplace and other users' cards as not listed
        $bindParams = array($usersArray[$j], $tradingCardInsertId, $usersArray[$j] === 1 ? 1 : 0);
    
        runInsertQuery($sql, $bindParams);
      }
    }

    $tradeRequests = array( 'usedUserCardIds' => array() );

    $sql = 'SELECT * FROM user_card WHERE user_id = 1';
    $adminCards = runQuery($sql);

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
          $sql = 'INSERT INTO trade_request (initiator_user_id, target_user_id, offered_price, requested_price) VALUES (?, ?, ?, ?)';
          
          // determine if price is offered or requested
          $offerOrRequestPrice = rand(0, 1);

          if($offerOrRequestPrice === 0) {
            $bindParams = array(1, $usersArray[$randTargetUserIndex], 0, $randPrice);
          }
          else {
            $bindParams = array(1, $usersArray[$randTargetUserIndex], $randPrice, 0);
          }
          
          $tradeRequestInsertId = runInsertQuery($sql, $bindParams);

          // store the trade_request id and target user id 
          $tradeRequests[$usersArray[$randTargetUserIndex]] = $tradeRequestInsertId;
        }

        // insert the current adminCard into trade_request_card for the current trade_request
        $sql = 'INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
        $bindParams = array($tradeRequests[$usersArray[$randTargetUserIndex]], $adminCard['id']);
        runInsertQuery($sql, $bindParams);

        // set listed to 2 to indicate it is in a trade
        $sql = 'UPDATE user_card SET listed = 2 WHERE id = ?';
        $bindParams = array($adminCard['id']);
        runParameterizedQuery($sql, $bindParams);

        $sql = 'SELECT * FROM user_card WHERE user_id = ?';
        $bindParams = array($usersArray[$randTargetUserIndex]);
        $otherUserCards = runSelectQuery($sql, $bindParams);

        // select a random other user card to insert into trade_request_card for the current trade reqeust
        $randomRequestedCardIndex = rand(0, count($otherUserCards) - 1);  

        // get the card's user_card row
        $sql = 'SELECT listed FROM user_card WHERE id = ?';
        $bindParams = array($otherUserCards[$randomRequestedCardIndex]['id']);

        $cardQuery = runSelectQuery($sql, $bindParams);

        // if the card is not used in a trade request
        if(!isset($tradeRequests['usedUserCardIds'][$otherUserCards[$randomRequestedCardIndex]['id']])) {
          // insert it into trade_request_card
          $sql = 'INSERT INTO trade_request_card (request_id, user_card_id) VALUES (?, ?)';
          $bindParams = array($tradeRequests[$usersArray[$randTargetUserIndex]], $otherUserCards[$randomRequestedCardIndex]['id']);
  
          runInsertQuery($sql, $bindParams);

          $tradeRequests['usedUserCardIds'][$otherUserCards[$randomRequestedCardIndex]['id']] = true;
        }
      }
    }
    $messageData = array(
    array("Hey, would you like to trade your Charizard?", 1, 2), // message from admin to Chase
    array("no!", 2, 1), // message from chase to Admin
    array("Can you lower the price for Dratini?", 3, 1), // message from Abdisalan to admin
    array("Nope", 1, 3), // message from Admin to Abdisalan
    array("Thanks for the trade yesterday!", 4, 1), // message from Hamze to admin
    array("No problem!", 1, 4)// message from Hamze to admin
  );

  foreach ($messageData as $msg) {
    $sql = "INSERT INTO user_message (content, sending_user_id, receiving_user_id) VALUES (?, ?, ?)";
    $bindParams = array($msg[0], $msg[1], $msg[2]);
    runInsertQuery($sql, $bindParams);
  }




  ?>

</body>

</html>