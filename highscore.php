<?php

function sortEntries($entry, $entry2) {
    if ((int) $entry['score'][0] == (int) $entry2['score'][0])
        return 0;

    return ((int) $entry['score'][0] < (int) $entry2['score'][0]) ? 1 : -1;
}


$highscore = simplexml_load_file("highscore.xml");

if ($_POST['score'] !== null) {

    $newEntry = $highscore->addChild("entry");
    $newEntry->addAttribute('name', $_POST['name']);
    $newEntry->addAttribute('score', $_POST['score']);
    $newEntry->addAttribute('date', date("d.m.y - H:i:s"));

    $highscore->saveXML("highscore.xml");

} else {
    $highscoreArray = array();
    foreach($highscore->entry as $entry)
        $highscoreArray[] = $entry;

    usort($highscoreArray, "sortEntries");

    $counter = 1;
    foreach($highscoreArray as $entry) {
        echo "<tr>";
            echo "<td>" . $counter . "</td>";
            echo "<td>" . $entry['name'] . "</td>";
            echo "<td>" . $entry['score'] . "</td>";
            echo "<td>" . $entry['date'] . "</td>";
        echo "</tr>";

        $counter++;
    }

}
