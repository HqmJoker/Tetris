var Local = function(socket){
    //游戏对象
    var game;
    var INTERVER = 200;    //下落时间间隔,游戏的速度

    var timer = null;
    var timeCount = 0;
    var time = 0;
    //绑定键盘事件
    var bindKeyEvent = function(){
        document.onkeydown = function(e){
            if (e.keyCode === 38){   //up
                game.rotate();
                socket.emit("rotate");
            }else if (e.keyCode === 39){  //right
                game.moveRight();
                socket.emit("moveRight");
            }else if (e.keyCode === 40){  //down
                game.moveDown();
                socket.emit("moveDown");
            }else if (e.keyCode === 37){  //left
                game.moveLeft();
                socket.emit("moveLeft");
            }else if (e.keyCode === 32){  //space
                game.fall();
                socket.emit("fall");
            }
        };
    };
    //设置时间
    var TimeFuc = function(){
        timeCount++;
        if(timeCount === 5){
            timeCount = 0;
            time++;
        }
        game.setTime(time);
        socket.emit("time", time);
    };
    //移动
    var move = function(){
        TimeFuc();
        if(!game.moveDown()){
            game.fixed();
            socket.emit("fixed");
            var lineCount = game.clearLine();
            if(lineCount){
                game.addScore(lineCount);
                socket.emit("addScore", lineCount);
                if(lineCount > 1){
                    socket.emit("addTailLines", lineCount-1);
                }
            }
            var gameFlag = game.checkGameOver();
            if(gameFlag){
                game.GameOver(false);
                document.getElementById("remote_gameOver").innerHTML = "你赢了！！！";
                stop();
                socket.emit("stop");
            }else{
                var t = getSquareType();
                var d =getSquareDir();
                game.performNext(t, d);
                socket.emit("performNext", {type:t,dir:d});
            }
        }else{
            socket.emit("moveDown");
        }
    };
    //停止游戏
    var stop = function(){
        if(timer){
            clearInterval(timer);
            timer = null;
            document.onkeydown = null;
        }
    };
    //随机生成方块种类
    var getSquareType = function(){
        return (Math.floor(Math.random()*7)+1);
    };
    //随机生成旋转次数
    var getSquareDir = function(){
        return (Math.floor(Math.random()*4)+1);
    };

    //开始游戏
    var start = function(){
        var doms = {
            gameDiv:document.getElementById("local_game"),
            nextDiv:document.getElementById("local_next"),
            timeSpan:document.getElementById("local_time"),
            scoreSpan:document.getElementById("local_score"),
            gameOver:document.getElementById("local_gameOver")
        };
        game = new Game();
        var type = getSquareType();
        var dir = getSquareDir();
        game.init(doms, type, dir);
        socket.emit("init", {type:type,dir:dir});
        bindKeyEvent();
        var t = getSquareType();
        var d =getSquareDir();
        game.performNext(t, d);
        socket.emit("performNext", {type:t,dir:d});
        timer = setInterval(move,INTERVER);
    };

    socket.on("start", function(){
        document.getElementById("waiting").innerHTML = "";
        start();
    });
    socket.on("stop", function(data){
        game.GameOver(true);
        stop();
    });
    socket.on("leave", function(data){
        document.getElementById("local_gameOver").innerHTML = "对方已掉线！！！";
        document.getElementById("remote_gameOver").innerHTML = "已掉线！！！";
        stop();
    });
    socket.on("addTailLines", function(data){
        var lines = game.createLines(data);
        game.addTailLines(lines);
        socket.emit("syncCreateLines", lines);
    });
};