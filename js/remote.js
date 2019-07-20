var Remote = function(socket){
    //游戏对象
    var game;

    //绑定键盘事件
    var bindEvents = function(){
        socket.on("init", function(data){
            start(data.type,data.dir);
        });
        socket.on("performNext", function(data){
            game.performNext(data.type,data.dir);
        });
        socket.on("rotate", function(data){
            game.rotate();
        });
        socket.on("moveRight", function(data){
            game.moveRight();
        });
        socket.on("moveDown", function(data){
            game.moveDown();
        });
        socket.on("moveLeft", function(data){
            game.moveLeft();
        });
        socket.on("fall", function(data){
            game.fall();
        });
        socket.on("fixed", function(data){
            game.fixed();
        });
        socket.on("addScore", function(data){
            game.clearLine();
            game.addScore(data);
        });
        socket.on("time", function(data){
            game.setTime(data);
        });
        socket.on("stop", function(data){
            game.GameOver(false);
        });
        socket.on("clearLines", function(data){
            game.clearLine();
        });
        socket.on("syncCreateLines", function(data){
            game.addTailLines(data);
        });
    };
    //开始游戏
    var start = function(type, dir){
        var doms = {
            gameDiv:document.getElementById("remote_game"),
            nextDiv:document.getElementById("remote_next"),
            timeSpan:document.getElementById("remote_time"),
            scoreSpan:document.getElementById("remote_score"),
            gameOver:document.getElementById("remote_gameOver")
        };
        game = new Game();
        game.init(doms, type, dir);
    };

    bindEvents();

};