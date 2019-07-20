var Game = function () {
    //获取dom元素
    var gameDiv;
    var nextDiv;
    var timeSpan;
    var scoreSpan;
    var score = 0;
    var gameOver;
    //初始化矩阵数据
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    //divs
    var gameDivs = [];
    var nextDivs = [];
    //当前方块
    var cur;
    //下一个方块
    var next;

    //检查点是否合法
    var check = function (pos, x, y) {
        if (pos.x + x < 0) {
            return false;
        } else if (pos.x + x >= gameData.length) {
            return false;
        } else if (pos.y + y < 0) {
            return false;
        } else if (pos.y + y >= gameData[0].length) {
            return false
        } else if (gameData[pos.x + x][pos.y + y] === 1) {
            return false;
        } else {
            return true;
        }
    };
    //检查数据是否合法
    var isVal = function (pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] !== 0) {
                    if (!check(pos, i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    //清空
    var clearSquare = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    };
    //设置方块
    var setSquare = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    };
    //下移
    var moveDown = function () {
        if (cur.canDown(isVal)) {
            clearSquare();
            cur.down();
            setSquare();
            refleshDiv(gameData, gameDivs);
            return true;
        } else {
            return false;
        }
    };
    //左移
    var moveLeft = function () {
        if (cur.canLeft(isVal)) {
            clearSquare();
            cur.left();
            setSquare();
            refleshDiv(gameData, gameDivs);
        }
    };
    //右移
    var moveRight = function () {
        if (cur.canRight(isVal)) {
            clearSquare();
            cur.right();
            setSquare();
            refleshDiv(gameData, gameDivs);
        }
    };
    //旋转
    var rotate = function () {
        if (cur.canRotate(isVal)) {
            clearSquare();
            cur.rotate();
            setSquare();
            refleshDiv(gameData, gameDivs);
        }
    };
    //下落到底部固定
    var fixed = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refleshDiv(gameData, gameDivs);
    };
    //消行
    var clearLine = function () {
        var lineCount = 0;
        for (var i = gameData.length - 1; i >= 0; i--) {
            var clearFlag = true;
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] !== 1) {
                    clearFlag = false;
                }
            }
            if (clearFlag) {
                lineCount++;
                for (var m = i; m > 0; m--) {
                    for (var n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n];
                    }
                }
                for (var n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return lineCount;
    };
    //随机生成行
    var createLines = function(lineNum){
        var lines = [];
        for(var i=0; i<lineNum; i++){
            var line = [];
            for(var j=0; j<10; j++){
                line.push(Math.round(Math.random()));
            }
            lines.push(line);
        }
        return lines;
    };
    //增加干扰行
    var addTailLines = function(lines) {
        for (var i = 0; i < gameData.length - lines.length; i++) {
            gameData[i] = gameData[i + lines.length];
        }
        for (var i = 0; i < lines.length; i++) {
            gameData[gameData.length - lines.length + i] = lines[i];
        }
        cur.origin.x = cur.origin.x -lines.length;
        if(cur.origin.x < 0){
            cur.origin.x = 0;
        }

        refleshDiv(gameData, gameDivs);
    };
    // 检测游戏结束
    var checkGameOver = function () {
        var gameFlag = false;
        for (var i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] === 1) {
                gameFlag = true
            }
        }
        return gameFlag;
    };
    //游戏结束
    var GameOver = function (win) {
        if (win) {
            gameOver.innerHTML = "你赢了！！！"
        } else {
            gameOver.innerHTML = "你输了！！！"
        }
    };
    //固定后刷新下一个方块
    var performNext = function (type, dir) {
        cur = next;
        setSquare();
        next = SquareFactory.prototype.make(type, dir);
        refleshDiv(gameData, gameDivs);
        refleshDiv(next.data, nextDivs);
    };
    //设置时间
    var setTime = function (time) {
        timeSpan.innerHTML = time;
    };
    //加分
    var addScore = function (lineCount) {
        var addGrade = 0;
        switch (lineCount) {
            case 1:
                addGrade = 10;
                break;
            case 2:
                addGrade = 30;
                break;
            case 3:
                addGrade = 60;
                break;
            case 4:
                addGrade = 100;
                break;
            default:
                break;
        }
        score = score + addGrade;
        scoreSpan.innerHTML = score;
    };
    // 底部增加行
    // var addLine = function(lines) {
    //     var linesArr = [];
    //     for (var i = 0; i < lines; i++) {
    //         var lineArr = [];
    //         for (var j = 0; j < gameData[0].length; j++) {
    //             lineArr[j] = Math.round(Math.random());
    //         }
    //         linesArr.push(lineArr);
    //     }
    //     for (var i = 0; i < gameData.length - lines; i++) {
    //         for (var j = 0; j < gameData[0].length; j++) {
    //             gameData[i][j] = gameData[i + lines][j];
    //         }
    //     }
    //     for (var i = 0; i < lines; i++) {
    //         for (var j = 0; j < gameData[0].length; j++) {
    //             gameData[gameData.length - lines + i][j] = linesArr[i][j];
    //         }
    //         linesArr.push(lineArr);
    //     }
    // };
    //创建Div
    var initDiv = function (contener, data, divs) {
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement("div");
                newNode.className = "none";
                newNode.style.top = (i * 20) + "px";
                newNode.style.left = (j * 20) + "px";
                contener.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    };
    //刷新Div
    var refleshDiv = function (data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] === 0) {
                    divs[i][j].className = "none";
                } else if (data[i][j] === 1) {
                    divs[i][j].className = "done";
                }
                else if (data[i][j] === 2) {
                    divs[i][j].className = "current";
                }
            }
        }
    };
    //------------测错数据-----------
    // var addTailLines = function(){};
    // this.addTailLines = addTailLines;
    // var A = function(){};
    // this.A = A;
    // var ABC = function(){};
    // this.ABC = ABC;
    // var addLine = function(){};
    // this.addLine = addLine;

    //初始化
    var init = function (doms, type, dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeSpan = doms.timeSpan;
        scoreSpan = doms.scoreSpan;
        gameOver = doms.gameOver;

        next = new SquareFactory.prototype.make(type, dir);

        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refleshDiv(next.data, nextDivs);
    };

    //导出API
    this.init = init;
    this.moveDown = moveDown;
    this.moveLeft = moveLeft;
    this.moveRight = moveRight;
    this.rotate = rotate;
    this.fall = function () {
        while (moveDown()) {
        }
    };
    this.fixed = fixed;
    this.performNext = performNext;
    this.clearLine = clearLine;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.GameOver = GameOver;
    var that = this;
    that.addTailLines = addTailLines;
    that.createLines = createLines;
};
