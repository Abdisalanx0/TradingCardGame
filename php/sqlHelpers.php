<?php
  /*
    This file contains SQL-query helper functions.

    Include these functions in other files by including the line:
      include 'sqlHelpers.php';
  */

  // run a non-parameterized query
  function runQuery($sql) {
    global $conn;

    // store query result, and if query succeeded
    if($result = $conn -> query($sql)) {

      // return query result
      return $result;
    }
    // else if query failed
    else {
      // return false
      return FALSE;
    }
  }

  // run a parameterized insert query
  /* 
    Example:
      // declare the SQL statement
      $sql = 'INSERT INTO item (name, price, quantity) VALUES (?, ?, ?)';

      // specify the value(s) to replace the ?(s) in the SQL statement
      $bindParams = array('My Item', 5.49, 2); 

      // store the just-inserted item's primary key value
      $insertId = runInsertQuery($sql, $bindParams);
  */
  function runInsertQuery($sql, $bindParams) {
    global $conn;

    if($stmt = $conn -> prepare($sql)) {
      $bindParamTypes = '';

      // determine $bindParams data types
      foreach($bindParams as $bindParam) {
        $type = gettype($bindParam);

        switch($type) {
          case 'integer':
            $bindParamTypes .= 'i';

            break;
          case 'double':
            $bindParamTypes .= 'd';

            break;
          case 'string':
            $bindParamTypes .= 's';

            break;
        }
      }

      // bind parameters
      $stmt -> bind_param($bindParamTypes, ...$bindParams);

      // execute the prepared statement
      $stmt -> execute();

      // close the statement
      $stmt -> close();

      // return insert id
      return $conn -> insert_id;
    }
  }

  // run a parameterized select query
  /*
    Example:
      // decalre the SQL statement
      $sql = 'SELECT * FROM item WHERE user_id = ?';

      // specify the value(s) to replace the ?(s) in the SQL statement
      $bindParams = array(1);

      // store the arrays of items selected from the SQL statement
      $result = runSelectQuery($sql, $bindParams);

      // sample $result output:
        Array( 
          [0] => Array( [id] => 1 [name] => 'My Item' [price] => 5.49 [quantity] => 2 ) 
          [1] => ...
        )
  */
  function runSelectQuery($sql, $bindParams) {
    global $conn;

    // get fields to be returned from $sql
    // run before starting prepared query due to out-of-sync error conflict

    // determine indexes and length of specified fields to return
    $returnFieldsStartIndex = strpos($sql, 'SELECT ') + 7;
    $returnFieldsEndIndex = strpos($sql, ' FROM');
    $returnFieldsCharacterLength = $returnFieldsEndIndex - $returnFieldsStartIndex;

    // store a string of the fields to return from $sql
    $returningFields = substr($sql, $returnFieldsStartIndex, $returnFieldsCharacterLength);

    // initialize a variable for the returning fields
    $bindResults = null;

    // if fields selected by wildcard
    if($returningFields == '*') {
      // determine index of ' WHERE' in $sql
      $endIndex = strpos($sql, ' WHERE');

      // return substring of $sql for simple SELECT query
      $tempSql = substr($sql, 0, $endIndex);

      // run the simple query
      $tempResult = runQuery($tempSql);

      // for each field returned from the simple query
      while($field = $tempResult -> fetch_field()) {
        // store the field names
        $bindResults[] = $field -> name;
      }
    }
    // if fields selected individually
    else {
      // store the field names in an array
      $bindResults = explode(', ', $returningFields);
    }

    // begin prepare statement
    if($stmt = $conn -> prepare($sql)) {
      $bindParamTypes = '';

      // determine $bindParams data types
      foreach($bindParams as $bindParam) {
        $type = gettype($bindParam);

        switch($type) {
          case 'integer':
            $bindParamTypes .= 'i';

            break;
          case 'double':
            $bindParamTypes .= 'd';

            break;
          case 'string':
            $bindParamTypes .= 's';

            break;
        }
      }

      // bind parameters
      $stmt -> bind_param($bindParamTypes, ...$bindParams);

      // execute the prepared statement
      $stmt -> execute();

      // array for statement fetch results
      $result = array();

      // bind results
      $br = Array(...$bindResults);

      $stmt -> bind_result(...$br);

      // fetch statement results
      while($stmt -> fetch()) {
        $currentResult = array();

        for($i = 0; $i < count($bindResults); $i++) {
          $currentResult[$bindResults[$i]] = $br[$i];
        }
    
        $result[] = $currentResult;
      }

      // close the statement
      $stmt -> close();

      // return the fetch results
      return $result;
    }
  }
?>