<?php
// Include your database connection file
include 'dbConnection.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Retrieve data from the POST request
  $data = json_decode(file_get_contents("php://input"));

  // Extract the data
  $sending_user_id = $data->sending_user_id;
  $receiving_username = $data->receiving_username;
  $message_content = $data->message_content;

  // Create a new database connection
  $conn = new mysqli(SERVER_NAME, DBF_USER_NAME, DBF_PASSWORD, DATABASE_NAME);

  // Check if the connection was successful
  if ($conn->connect_error) {
    die('Unable to connect to the database [' . $conn->connect_error . ']');
  }

  // Check if the receiving user exists in the database
  $query = "SELECT user_id FROM tcg_user WHERE username = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("s", $receiving_username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $receiving_user_id = $row['user_id'];

    // Insert the message into the database
    $insertQuery = "INSERT INTO user_message (content, sending_user_id, receiving_user_id)
                    VALUES (?, ?, ?)";
    $stmtInsert = $conn->prepare($insertQuery);
    $stmtInsert->bind_param("sii", $message_content, $sending_user_id, $receiving_user_id);

    if ($stmtInsert->execute()) {
      $response = [
        'status' => 'success',
        'message' => 'Message sent successfully',
        'message_id' => $stmtInsert->insert_id // Send the newly inserted message ID back to the client
      ];
      echo json_encode($response);
    } else {
      $response = [
        'status' => 'error',
        'message' => 'Error inserting message into database'
      ];
      echo json_encode($response);
    }
  } else {
    $response = [
      'status' => 'error',
      'message' => 'Receiving user not found in the database'
    ];
    echo json_encode($response);
  }

  // Close the database connection
  $stmt->close();
  $stmtInsert->close();
  $conn->close();
} else {
  // Invalid request method
  $response = [
    'status' => 'error',
    'message' => 'Invalid request method'
  ];
  echo json_encode($response);
}
?>




