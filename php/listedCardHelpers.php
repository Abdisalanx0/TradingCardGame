<?php
  /*
    These functions are impure.

    &$cards => argument passed as variable reference => original $cards value mutated
    $cards => argument passed as variable value => original $cards value not mutated
  */

  // handle sorting
  function sortCards(&$cards, $sort) {
    // parse sort property and orientation
    $delimiter = strpos($sort, ' ');
    $sortProperty = substr($sort, 0, $delimiter);
    $sortOrientation = substr($sort, $delimiter + 1);

    // sort the array by the given sort property and orientation
    $sortColumn = array_column($cards, $sortProperty);
    array_multisort($sortColumn, $sortOrientation === 'asc' ? SORT_ASC : SORT_DESC, $cards);
  }

  // handle price filtering
  function filterByPrice(&$cards, $min, $max) {
    for($i = 0; $i < count($cards); $i++) {
      // if the card is not between $min and $max
      if($cards[$i]['price'] < $min || $cards[$i]['price'] > $max) {
        // remove the card from the array
        array_splice($cards, $i, 1);

        $i--;
      }
    }
  }

  // handle name filtering
  function filterByName(&$cards, $name) {
    if($name) {
      for($i = 0; $i < count($cards); $i++) {
        // if the card name does not contain the filtering string
        if(stripos($cards[$i]['name'], $name) === false) {
          // remove the card from the array
          array_splice($cards, $i, 1);
    
          $i--;
        }
      }
    }
  }
?>