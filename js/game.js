function TetrisGame() {

    // Config
    var highScore = true;

    // Variables
    var activeTetromino = null;
    var timer = 0;
    var halt = true;
    var gameOverState = false;
    var audio = new Audio();

    // Canvas Element
    var canvas = null;
    var ctx = null;


    // Audio
    var codecs = {};
    var sounds = {
        woosh: {
            ogg: 'sounds/woosh.ogg',
            wav: 'sounds/woosh.wav',
            mp3: 'sounds/woosh.mp3'
        },
        blob: {
            ogg: 'sounds/blob.ogg',
            wav: 'sounds/blob.wav',
            mp3: 'sounds/blob.mp3'
        }
    };

    // Level
    var level = 1;
    var score = 0;
    var levelSpeed = [
        [400, 0],
        [350, 7],
        [300, 14],
        [280, 21],
        [270, 28],
        [260, 35],
        [250, 42],
        [240, 49],
        [230, 56],
        [220, 63],
        [200, 70],
        [190, 999]
    ];
    var gamearea = {
        size: [10, 20],
        gridElementSize: 20,
        blocks: []
    };

    var tetromioFigures = [
        ["T", '#cc9900', [4, 0], [
            [0, 0],
            [0, 1],
            [-1, 0],
            [1, 0]
        ]],
        ["I", '#33cc00', [4, 1], [
            [0, -1],
            [0, 0],
            [0, 1],
            [0, 2]
        ]],
        ["O", '#0033cc', [4, 0], [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ]],
        ["Z", '#9900cc', [4, 0], [
            [-1, 0],
            [0, 0],
            [0, 1],
            [1, 1]
        ]],
        ["S", '#cc0033', [4, 0], [
            [1, 0],
            [0, 0],
            [0, 1],
            [-1, 1]
        ]],
        ["J", '#cc0099', [5, 1], [
            [0, -1],
            [0, 0],
            [0, 1],
            [-1, 1]
        ]],
        ["L", '#99cc00', [4, 1], [
            [0, -1],
            [0, 0],
            [0, 1],
            [1, 1]
        ]]
    ];


    /**
     * Game initialisieren
     */
    this.init = function() {
        canvas = get("gamearea");
        ctx = canvas.getContext("2d");
        initSound();
        drawGrid();
        drawStartButton();
        window.document.onkeydown = keyListener;
    };


    var drawStartButton = function() {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'lightgray';
        ctx.fill();

        ctx.beginPath();
        var mitte = [canvas.width/2+5, canvas.height/2];
        ctx.moveTo(mitte[0] - 20, mitte[1] - 20);

        ctx.lineTo(mitte[0] + 20, mitte[1]);
        ctx.lineTo(mitte[0] - 20, mitte[1] + 20);
        ctx.lineTo(mitte[0] - 20, mitte[1] + 20);

        ctx.fillStyle = 'white';
        ctx.fill();
    };


    var drawBreakButton = function() {
        drawButtonBackground();

        var mitte = [canvas.width/2, canvas.height/2];

        ctx.fillStyle = 'white';
        ctx.fillRect(
            mitte[0] - 17, mitte[1] - 20,
            10, 40
        );
        ctx.fillRect(
            mitte[0] + 7, mitte[1] - 20,
            10, 40
        );
    };


    var drawButtonBackground = function() {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'lightgray';
        ctx.fill();
    };


    var removeButton = function() {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    };


    /**
     * Game starten/pausieren
     */
    this.startBreakGame = function() {
        if (halt == false) {

            // Break the game
            clearTimeout(timer);
            halt = true;
            drawBreakButton();

        } else {
            if (gameOverState == false) {
                // Start the game
                halt = false;
                removeButton();
                drawGrid();
                initLoop();
            }
        }
    };


    /**
     * Grid und Blocks zeichnen
     */
    var drawGrid = function() {
        var cx = ctx.canvas.width;
        var cy = ctx.canvas.height;

        // blocks
        for (var i = 0; i < gamearea.blocks.length; i++) {
            var fromX = gamearea.blocks[i][0] * gamearea.gridElementSize;
            var fromY = gamearea.blocks[i][1] * gamearea.gridElementSize;
            ctx.fillStyle = gamearea.blocks[i][2];
            ctx.fillRect(fromX, fromY, gamearea.gridElementSize, gamearea.gridElementSize);
        }

        // vertical lines
        for (var k = 1; k <= (gamearea['size'][0] - 1); k++) {
            ctx.beginPath();
            ctx.moveTo(0.5 + (k * gamearea.gridElementSize), 0.5);
            ctx.lineTo(0.5 + (k * gamearea.gridElementSize), cy + 0.5);
            ctx.stroke();
            ctx.closePath();
        }

        // horizontal lines
        for (var l = 1; l <= (gamearea['size'][1] - 1); l++) {
            ctx.beginPath();
            ctx.moveTo(0.5, 0.5 + (l * gamearea.gridElementSize));
            ctx.lineTo(cx + 0.5, 0.5 + (l * gamearea.gridElementSize));
            ctx.stroke();
            ctx.closePath();
        }
    };


    /**
     * Grid und Blöcke löschen
     */
    var destroyGrid = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };


    /**
     * Starten eines Loops
     */
    var initLoop = function() {
        if (!gameOverState) {
            loop();
            refreshScoreDisplay();
            timer = setTimeout(initLoop, levelSpeed[level - 1][0]);
        }
    };


    /**
     * Loop Funktion, in der entweder ein neues
     * Tetromino angelegt wird, oder das bestehende
     * eine Zeile nach unten verschoben wird.
     */
    var loop = function() {
        if (activeTetromino == null) {
            activeTetromino = tetromioFigures[Math.floor(Math.random() * tetromioFigures.length)].clone();

            if (!collisionDetection("create")) {
                drawTetromino(activeTetromino);
                drawGrid();
            } else {
                gameOver();
                drawTetromino(activeTetromino);
                drawGrid();
            }
        } else {
            moveTetrominoDown();
        }
    };


    var gameOver = function() {
        gameOverState = true;
        var xmlhttp;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                console.log(xmlhttp.responseText);
            }
        };
        var fd = new FormData();
        fd.append("name", prompt("Game Over\nName für Highscore eingeben:", ""));
        fd.append("score", score);
        xmlhttp.open("POST", "http://tetris.florianrusch.de/version2/highscore.php");
        xmlhttp.send(fd);
    };



    /**
     * Tetromino zeichnen
     *
     * @param tetromio
     */
    var drawTetromino = function(tetromio) {
        for (var i = 0; i < tetromio[3].length; i++)
            drawBlock(
                tetromio[2][0] + tetromio[3][i][0],
                tetromio[2][1] + tetromio[3][i][1],
                tetromio[1]
            );
    };


    /**
     * Tetromino löschen
     *
     * @param tetromio
     */
    var hideTetromino = function(tetromio) {
        for (var i = 0; i < tetromio[3].length; i++)
            hideBlock(
                tetromio[2][0] + tetromio[3][i][0],
                tetromio[2][1] + tetromio[3][i][1]
            );
    };


    /**
     * Einzelnen Block eines Tetronimos zeichnen
     *
     * @param x         X-Wert (Keine Welt-Koordinate)
     * @param y         Y-Wert (Keine Welt-Koordinate)
     * @param color     Farbe
     */
    var drawBlock = function(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * gamearea.gridElementSize,
            y * gamearea.gridElementSize,
            gamearea.gridElementSize,
            gamearea.gridElementSize
        );
    };


    /**
     * Einzelnen Block eines Tetrominos löschen
     *
     * @param x         X-Wert (Keine Welt-Koordinate)
     * @param y         Y-Wert (Keine Welt-Koordinate)
     */
    var hideBlock = function(x, y) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(
            x * gamearea.gridElementSize,
            y * gamearea.gridElementSize,
            gamearea.gridElementSize,
            gamearea.gridElementSize
        );
    };


    /**
     * Das aktuelle Tetromino nach unten verschieben
     */
    var moveTetrominoDown = function() {
        hideTetromino(activeTetromino);
        activeTetromino[2][1]++;

        if (collisionDetection("down")) {

            // Play blob sound
            playsound('blob');

            activeTetromino[2][1]--;
            for (var i = 0; i < activeTetromino[3].length; i++) {
                var paX = activeTetromino[2][0] + activeTetromino[3][i][0];
                var paY = activeTetromino[2][1] + activeTetromino[3][i][1];
                gamearea.blocks[gamearea.blocks.length] = [paX, paY, activeTetromino[1]];
            }
            activeTetromino = null;

            checkLines();

            loop();
            return false;
        }
        drawTetromino(activeTetromino);
        drawGrid();
        return true;
    };


    /**
     * Zeilen oberhalb einer gelöschten Linie nach unten verschieben
     *
     * @param row
     */
    var moveBlocksAboveDown = function(row) {
        // Alle Blöchte auf der Gamearea löschen
        for (var blockId = 0; blockId < gamearea.blocks.length; blockId++)
            hideBlock(gamearea.blocks[blockId][0], gamearea.blocks[blockId][1]);

        for (var blockId = 0; blockId < gamearea.blocks.length; blockId++) {
            if(gamearea.blocks[blockId][1] < row)
                gamearea.blocks[blockId][1]++;

            drawBlock(gamearea.blocks[blockId][0], gamearea.blocks[blockId][1], gamearea.blocks[blockId][2])
        }
    };


    /**
     * Überprüfung, ob vollständige Linien entstanden sind
     */
    var checkLines = function() {

        // Zeilen durch loopen
        for (var i = gamearea.size[1]; i >= 0; i--) {
            var cut = [];

            for (var j = 0; j < gamearea.blocks.length; j++) {
                // check if in row
                if (gamearea.blocks[j][1] == i) {
                    // put the id of the block into the cut array
                    cut[cut.length] = j;
                }
            }

            // check if the amount of blocks are right
            if (cut.length === gamearea.size[0]) {

                // Play woosh sound
                playsound('woosh');

                // go the cut array backwards
                for (var k = cut.length; k > 0; k--) {
                    var blockId = cut[k - 1];

                    // hide the block on the gamearea
                    hideBlock(gamearea.blocks[blockId][0], gamearea.blocks[blockId][1]);

                    // remove the block frome block array
                    gamearea.blocks.splice((blockId), 1);
                }
                score++;

                moveBlocksAboveDown(i);
                checkLines();
            }
        }
    };


    /**
     * Tetromino nach links oder rechts verschieben.
     *
     * @param direction     Richtung, in die verschoben werden soll. (link, rechts)
     */
    var moveLeftRightTetromino = function(direction) {
        hideTetromino(activeTetromino);

        if (direction == "left") {
            activeTetromino[2][0]--;
            if (collisionDetection("left")) {
                activeTetromino[2][0]++;
            }
        } else if (direction == "right") {
            activeTetromino[2][0]++;
            if (collisionDetection("right")) {
                activeTetromino[2][0]--;
            }
        }

        drawTetromino(activeTetromino);
        drawGrid();
    };


    /**
     * Tetromino drehen
     */
    var rotate = function() {
        if (activeTetromino[0] !== "O") {
            hideTetromino(activeTetromino);

            for (var i = 0; i < activeTetromino[3].length; i++) {
                var fromX = activeTetromino[3][i][0];
                var fromY = activeTetromino[3][i][1];
                activeTetromino[3][i][0] = fromY * (-1);
                activeTetromino[3][i][1] = fromX;
            }
            if (collisionDetection("rotate")) {
                for (var i = 0; i < activeTetromino[3].length; i++) {
                    var fromX = activeTetromino[3][i][0];
                    var fromY = activeTetromino[3][i][1];
                    activeTetromino[3][i][0] = fromY;
                    activeTetromino[3][i][1] = fromX * (-1);
                }
            }

            drawTetromino(activeTetromino);
            drawGrid();
        }
    };


    /**
     * Überprüfung, ob das Tretromino überhaupt
     * gedreht, oder bewegt werden kann.
     *
     * @param direction     Richtung, in die das Tretromino verschoben werden soll, oder ob es rotiert werden soll.
     * @returns {boolean}   True wenn Kollision entdeckt wurde, false wenn keine entdeckt wurde
     */
    var collisionDetection = function(direction) {
        var tmp = false;

        for (var i = 0; i < activeTetromino[3].length; i++) {
            var paX = activeTetromino[2][0] + activeTetromino[3][i][0];
            var paY = activeTetromino[2][1] + activeTetromino[3][i][1];

            switch (direction) {
                case "left":
                    if (paX < 0)
                        tmp = true;
                    else if (existsBlockAtCoordiantes(paX, paY))
                        tmp = true;
                    break;


                case "right":
                    if (paX > (gamearea['size'][0] - 1))
                        tmp = true;
                    else if (existsBlockAtCoordiantes(paX, paY))
                        tmp = true;
                    break;


                case "down":
                    if (paY > (gamearea['size'][1] - 1))
                        tmp = true;
                    else if (existsBlockAtCoordiantes(paX, paY))
                        tmp = true;
                    break;


                case "rotate":
                    if (paX < 0 || paX > (gamearea['size'][0] - 1) || paY > (gamearea['size'][1] - 1))
                        tmp = true;
                    else if (existsBlockAtCoordiantes(paX, paY))
                        tmp = true;
                    break;


                case "create":
                    if (existsBlockAtCoordiantes(paX, paY))
                        tmp = true;
                    break;
            }
        }
        return tmp;
    };


    /**
     * Überprüft, ob an der angegeben Stelle bereits ein Block sich befindet
     *
     * @param x                 X-Wert (Keine Welt-Koordinate)
     * @param y                 Y-Wert (Keine Welt-Koordinate)
     * @returns {boolean}       True wenn ein Block existiert, false wenn nicht.
     */
    var existsBlockAtCoordiantes = function(x, y) {
        for (var i = 0; i < gamearea.blocks.length; i++)
            if (gamearea.blocks[i][0] == x && gamearea.blocks[i][1] == y)
                return true;

        return false;
    };


    /**
     * Spiel-Daten löschen
     */
    this.clearGame = function() {
        clearTimeout(timer);
        activeTetromino = null;
        gamearea.blocks = [];
        level = 0;
        score = 0;
        gameOverState = false;
        refreshScoreDisplay();
        destroyGrid();
    };


    /**
     * Score-Anzeige aktualisieren
     */
    var refreshScoreDisplay = function() {
        for (var i = 1; i <= levelSpeed.length; i++)
            if (score >= levelSpeed[i-1][1])
                level = i;

        var levelElement = get('level');
        levelElement.innerText = level.toString();

        var scoreElement = get('score');
        scoreElement.innerText = score + '/' + (levelSpeed[level][1]-1);
    };


    /**
     * Key Listener
     *
     * @param e    Key-Event
     */
    var keyListener = function(e) {
        //for IE
        if (!e) { e = window.event; }

        // Check ob das spiel angehalten oder beendet ist
        if (gameOverState == false) {
            if (halt == false) {
                switch (e.keyCode) {
                    case 32:
                        // spacebar
                        while(moveTetrominoDown()){}
                        break;

                    case 37:
                        // left arrow
                        moveLeftRightTetromino("left");
                        break;

                    case 39:
                        // right arrow
                        moveLeftRightTetromino("right");
                        break;

                    case 38:
                        // up arrow
                        rotate();
                        break;

                    case 40:
                        // down arrow
                        moveTetrominoDown();
                        break;
                }

            }
        }
    };

    /**
     * Sound-System initialisieren
     */
    var initSound = function() {
        codecs = {
            mp3: !!audio.canPlayType('audio/mpeg;').replace(/^no$/, ''),
            ogg: !!audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            wav: !!audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
        };
    };


    /**
     * Sound ausgeben
     * @param sound     Sound der abgespielt werden soll.
     */
    var playsound = function(sound) {
        var codec = getCodec();
        audio.src = sounds[sound][codec];
        audio.play();
    };


    /**
     * Rückgabe des erstbesten, vom Browser
     * unterstützten Audioformats.
     *
     * @returns {string}        Unterstütztes Audioformat (mp3,ogg,wav
     */
    var getCodec = function() {
        if (codecs.mp3) {
            return 'mp3';
        } else if (codecs.ogg) {
            return 'ogg';
        } else if (codecs.wav) {
            return 'wav';
        }
    };
}