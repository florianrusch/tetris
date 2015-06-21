<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="utf-8">
        <title>Tetris</title>
        <link href="css/styles.css" rel="stylesheet" />
        
        <script src="js/functions.js"></script>
        <script src="js/game.js"></script>
    </head>
    <body>
        
        <div id="wrapper">

            <header>
                <h1>Tetris</h1>
                <div id="scoring">
                    Level: <span id="level">0</span><br />
                    Score: <span id="score">0</span><br />
                </div>
            </header>

            <div id="leftSidebar" class="sidebar">
                <h2>Anleitung:</h2>
                <br />
                <strong>Gespielt wird mit den Pfeil-Tasten:</strong><br />
                <br />
                <dfn>Hoch</dfn>: Figur drehen<br />
                <dfn>Runter</dfn>: ein Feld nach unten<br />
                <dfn>Links</dfn>: ein Feld nach links<br />
                <dfn>Rechts</dfn>: ein Feld nach rechts<br />
                <dfn>Leertaste</dfn>: nach ganz unten<br />
            </div>

            <div id="mainPanel">
                <canvas id="gamearea" width="200px" height="400px"></canvas>
            </div>

            <div id="rightSidebar" class="sidebar">
                <h2>Highscore:</h2>
                <br />
                <table>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Score</td>
                            <td>Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        <?php include 'highscore.php' ?>
                    </tbody>
                </table>
            </div>
            <div class="cb"></div>

            <footer>
                <div class="tac">&copy; Florian Rusch</div>
            </footer>
        </div>

        <!-- Piwik -->
        <script type="text/javascript">
          var _paq = _paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="//piwik.florianrusch.de/";
            _paq.push(['setTrackerUrl', u+'piwik.php']);
            _paq.push(['setSiteId', 4]);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
          })();
        </script>
        <noscript><p><img src="//piwik.florianrusch.de/piwik.php?idsite=4" style="border:0;" alt="" /></p></noscript>
        <!-- End Piwik Code -->


        <script>
            var game;
            window.onload = function () {
                game = new TetrisGame();
                game.init();

                var gamearea = get("gamearea", "id");
                gamearea.addEventListener('click', function() {
                    game.startBreakGame();
                });
            };
            document.onselectstart = new Function ("return false")
        </script>
    </body>
</html>