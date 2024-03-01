<?php
// Database connection variables
$servername = "localhost";
$username = "root";
$password = "1384";
$dbname = "tgc";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to select data from the table
$sql = "SELECT id,username,password_hash FROM tgc_user";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    // Start the table
    echo "<table border='1'>";
    echo "<tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr>";

    // Output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row["id"] . "</td>";
        echo "<td>" . $row["username"] . "</td>";
        echo "<td>" . $row["password_hash"] . "</td>";
        echo "</tr>";
    }

    // End the table
    echo "</table>";
} else {
    echo "0 results";
}

// Close connection
$conn->close();
?>
