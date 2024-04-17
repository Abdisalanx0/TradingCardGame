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

    $username = $body -> username;

    $sql = 'SELECT * FROM tcg_user WHERE username = ?';
    $bindParams = array($username);

    $result = runSelectQuery($sql, $bindParams);

    // echo json_encode($result);

    $coinBalance = $result[0]['coin_balance'];
    $userId = $result[0]['id'];

    $responseData = array('coinBalance' => $coinBalance, 'userId' => $userId);

    echo json_encode($responseData);
  }

  // echo json_encode(array());

  $conn -> close();
?>