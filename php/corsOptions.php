<?php
  // Enables error reporting for debugging purposes.
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

  // Setting Cross-Origin Resource Sharing (CORS) headers for security.

  /*
    local development: http://localhost:5173
    deployment: https://egg.egd.mybluehost.me
  */
  header('Access-Control-Allow-Origin: http://localhost:5173'); // Only allows requests from this origin.

  header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Allows GET and POST HTTP methods.
  header('Access-Control-Allow-Headers: Content-Type, X-Requested-With'); // Specifies allowed headers.
  header('Content-Type: application/json'); // Sets the content type of the response to JSON.
?>