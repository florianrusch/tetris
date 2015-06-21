<?php

$highscore = simplexml_load_file("highscore.xml");

if ($_POST['score'] !== null) {

    $newEntry = $highscore->addChild("entry");
    $newEntry->addAttribute('name', $_POST['name']);
    $newEntry->addAttribute('score', $_POST['score']);
    $newEntry->addAttribute('date', date("d.m.y - H:i:s"));

    $highscore->saveXML("highscore.xml");

} else {

    $highscoreArray = (array) $highscore;
    usort($highscoreArray, "sortEntries");

    $counter = 1;
    foreach ($highscore->entry as $entry) {
        echo "<tr>";
            echo "<td>" . $counter . "</td>";
            echo "<td>" . $entry['name'] . "</td>";
            echo "<td>" . $entry['score'] . "</td>";
            echo "<td>" . $entry['date'] . "</td>";
        echo "</tr>";
        $counter++;
    }

}


function sortEntries($entry, $entry2) {
    if ($entry['score'] > $entry2['score'])
        return 1;
    else if ($entry['score'] < $entry2['score'])
        return -1;

    return 0;
}