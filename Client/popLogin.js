
var loginPopped = 0;
var createPopped = 0;
var buildLogin;

var loginNameBoxX, loginNameBoxY, loginNameBoxWidth, loginNameBoxHeight;
var loginPassBoxX, loginPassBoxY, loginPassBoxWidth, loginPassBoxHeight;
var loginResultText;

var newLoginNameBoxX, newLoginNameBoxY, newLoginNameBoxWidth, newLoginNameBoxHeight;
var newLoginPassBoxX, newLoginPassBoxY, newLoginPassBoxWidth, newLoginPassBoxHeight;
var newLoginResultText;

var newLoginNameText, newLoginPassText, loginNameText, loginPassText;

var bananaMud, headingText;

var startButton, createButton, okButton, cancelButton;

function popLogin(){

    graphics = game.add.graphics(0, 0);

    var i=0;
    var sizeX = 0;
    var sizeY = 0;
    loginPop = graphics.drawRect((this.game.world.width/2), (this.game.world.height/2), sizeX, sizeY);

    if(loginPopped == 0){
        buildLogin = game.time.events.loop(10, function() {
            if(i >= 30){

                buildLoginDisplay();
                loginPopped = 1;
                game.time.events.remove(buildLogin);

            } else {
                graphics.lineStyle(10, 0x19de65, 1);
                graphics.beginFill(0x19de65);
                //loginPop = new Phaser.Rectangle((this.game.world.width/2), (this.game.world.height/2), 0, 0);
                loginPop = graphics.drawRect((this.game.world.width/2), (this.game.world.height/2), sizeX, sizeY);
                graphics.endFill();


                loginPop.position.x -= 10;
                loginPop.position.y -= 5;

                sizeX += 20;
                sizeY += 10;

                i++;
            }
        }, this);
    } else {
        sizeX = 580;
        sizeY = 290;

        graphics.lineStyle(10, 0x19de65, 1);
        graphics.beginFill(0x19de65);
        loginPop = graphics.drawRect((this.game.world.width/2), (this.game.world.height/2), sizeX, sizeY);
        graphics.endFill();

        loginPop.position.x -= 300;
        loginPop.position.y -= 150;
        buildLoginDisplay();
    }

}

function buildLoginDisplay(){

    bananaMud = game.add.sprite((this.game.world.width/2), (this.game.world.height/2), 'bananaMud');
    bananaMud.anchor.x = 0.5;
    bananaMud.anchor.y = 1;

    graphics.lineStyle(0, 0xffffff, 1);
    graphics.beginFill(0x222222);



    loginNameBoxX = (this.game.world.width/2)-280;
    loginNameBoxY = (this.game.world.height/2)+18;
    //loginNameBoxWidth = 200;
    //loginNameBoxHeight = 25;

    //loginName = graphics.drawRect(loginNameBoxX, loginNameBoxY, loginNameBoxWidth, loginNameBoxHeight);
    loginName = game.add.sprite(loginNameBoxX, loginNameBoxY, 'loginTextBox');
    loginName.inputEnabled = true;
    loginName.events.onInputDown.add(loginBoxFocus, { field: "name" });

    loginPassBoxX = (this.game.world.width/2)-280;
    loginPassBoxY = (this.game.world.height/2)+78;
    //loginPassBoxWidth = 200;
    //loginPassBoxHeight = 25;

    //loginPassword = graphics.drawRect(loginPassBoxX, loginPassBoxY, loginPassBoxWidth, loginPassBoxHeight);
    loginPassword = game.add.sprite(loginPassBoxX, loginPassBoxY, 'loginTextBox');
    loginPassword.inputEnabled = true;
    loginPassword.events.onInputDown.add(loginBoxFocus, { field: "password" });

    loginNameText = game.add.text((this.game.world.width/2)-275, (this.game.world.height/2)+23, '', { font: "14px Arial", fill: "#ffffff" });
    loginPassText = game.add.text((this.game.world.width/2)-275, (this.game.world.height/2)+83, '', { font: "14px Arial", fill: "#ffffff" });

    loginNameHeader = game.add.text(loginNameText.position.x, loginNameText.position.y-30, 'Login Name', {font: "20px Arial", fill: "#ffffff" });
    loginPassHeader = game.add.text(loginNameText.position.x, loginNameText.position.y+30, 'Password', {font: "20px Arial", fill: "#ffffff" });

    selectedTextBox = loginNameText;
    loginName.frame = 1;

    loginResultText = game.add.text((this.game.world.width/2)+20, (this.game.world.height/2)-7, '', {font: "20px Shadows Into Light", fill: "#ff0000" });
    //graphics.inputEnabled = true;

    //graphics.events.onInputDown.add(clickLogin, this);

    graphics.endFill();

    headingText = game.add.text((this.game.world.width/2), (this.game.world.height/2)-50, 'A GAME OF SMALL STAKES AND BIG DREAMS', { font: "700 28px Amatic SC", fill: "#ffffff" });
    headingText.anchor.x = 0.5;
    headingText.anchor.y = 1;

    createButton = game.add.button((this.game.world.width/2)+20, (this.game.world.height/2)+17, 'createButton', createOnClick, this, 2, 1, 0);

    startButton = game.add.button((this.game.world.width/2)+20, (this.game.world.height/2)+77, 'loginButton', startOnClick, this, 2, 1, 0);


}

function startOnClick () {
    socket.emit('player login', {id: clientID, name: loginNameText.text, pass: loginPassText.text});

}

function createOnClick () {
    loginPop.destroy();
    loginName.destroy();
    loginPassword.destroy();
    loginNameHeader.destroy();
    loginNameText.destroy();
    loginPassHeader.destroy();
    loginPassText.destroy();
    loginResultText.destroy();
    startButton.destroy();
    createButton.destroy();
    loginResultText.destroy();

    bananaMud.destroy();
    headingText.destroy();

    graphics = game.add.graphics(0, 0);

    var sizeX = 580;
    var sizeY = 290;
    var popX = (this.game.world.width/2)-300;
    var popY = (this.game.world.height/2)-150;

    graphics.lineStyle(10, 0x19de65, 1);
    graphics.beginFill(0x19de65);
    createPop = graphics.drawRect(popX, popY, sizeX, sizeY);
    graphics.endFill();

    graphics.lineStyle(0, 0xffffff, 1);
    graphics.beginFill(0x222222);

    newLoginNameHeader = game.add.text(loginNameText.position.x, loginNameText.position.y-30, 'Create a Login Name', {font: "20px Arial", fill: "#ffffff" });

    newLoginNameBoxX = (this.game.world.width/2)-280;
    newLoginNameBoxY = (this.game.world.height/2)+18;
   // newLoginNameBoxWidth = 200;
   // newLoginNameBoxHeight = 25;

   // newLoginName = graphics.drawRect(newLoginNameBoxX, newLoginNameBoxY, newLoginNameBoxWidth, newLoginNameBoxHeight);
    newLoginName = game.add.sprite(newLoginNameBoxX, newLoginNameBoxY, 'loginTextBox');
    newLoginName.inputEnabled = true;
    newLoginName.events.onInputDown.add(loginBoxFocus, { field: "newname" });

    newLoginPassHeader = game.add.text(loginNameText.position.x, loginNameText.position.y+30, 'Create a Password', {font: "20px Arial", fill: "#ffffff" });

    newLoginPassBoxX = (this.game.world.width/2)-280;
    newLoginPassBoxY = (this.game.world.height/2)+78;
    //newLoginPassBoxWidth = 200;
    //newLoginPassBoxHeight = 25;

    //newLoginPassword = graphics.drawRect(newLoginPassBoxX, newLoginPassBoxY, newLoginPassBoxWidth, newLoginPassBoxHeight);
    newLoginPassword = game.add.sprite(newLoginPassBoxX, newLoginPassBoxY, 'loginTextBox');
    newLoginPassword.inputEnabled = true;
    newLoginPassword.events.onInputDown.add(loginBoxFocus, { field: "newpassword" });


    newLoginResultText = game.add.text((this.game.world.width/2)+20, (this.game.world.height/2)-7, '', {font: "20px Shadows Into Light", fill: "#ff0000" });
    //graphics.inputEnabled = true;

    //graphics.events.onInputDown.add(clickLogin, this);

    graphics.endFill();

    newLoginNameText = game.add.text(newLoginNameBoxX+5, newLoginNameBoxY+3, '', { font: "14px Arial", fill: "#ffffff" });

    selectedTextBox = newLoginNameText;
    newLoginName.frame = 1;

    newLoginPassText = game.add.text(newLoginPassBoxX+5, newLoginPassBoxY+3, '', { font: "14px Arial", fill: "#ffffff" });

    okButton = game.add.button((this.game.world.width/2)+20, (this.game.world.height/2)+17, 'loginOkButton', okOnClick, this, 2, 1, 0);
    cancelButton = game.add.button((this.game.world.width/2)+20, (this.game.world.height/2)+77, 'loginCancelButton', cancelOnClick, this, 2, 1, 0);

    bananaMud = game.add.sprite((this.game.world.width/2), (this.game.world.height/2), 'bananaMud');
    bananaMud.anchor.x = 0.5;
    bananaMud.anchor.y = 1;

    headingText = game.add.text((this.game.world.width/2), (this.game.world.height/2)-50, 'A GAME OF SMALL STAKES AND BIG DREAMS', { font: "700 28px Amatic SC", fill: "#ffffff" });
    headingText.anchor.x = 0.5;
    headingText.anchor.y = 1;

    createPopped = 1;

}

function cancelOnClick () {
    createPopped = 0;

    createPop.destroy();
    newLoginName.destroy();
    newLoginPassword.destroy();
    newLoginNameHeader.destroy();
    newLoginNameText.destroy();
    newLoginPassHeader.destroy();
    newLoginPassText.destroy();
    newLoginResultText.destroy();
    okButton.destroy();
    cancelButton.destroy();
    newLoginResultText.destroy();

    bananaMud.destroy();
    headingText.destroy();

    popLogin();

}

function okOnClick () {
    socket.emit('create login', {id: clientID, name: newLoginNameText.text, pass: newLoginPassText.text});
    /*createPopped = 0;

    createPop.destroy();
    newLoginName.destroy();
    newLoginPassword.destroy();
    newLoginNameHeader.destroy();
    newLoginNameText.destroy();
    newLoginPassHeader.destroy();
    newLoginPassText.destroy();
    newLoginResultText.destroy();
    okButton.destroy();
    cancelButton.destroy();
    newLoginResultText.destroy();

    popLogin();*/

}

function onCreateResponse (data) {
    if(data.result != "CREATION SUCCESSFUL"){
        newLoginResultText.text = data.result;
    } else {
        createPopped = 0;

        createPop.destroy();
        newLoginName.destroy();
        newLoginPassword.destroy();
        newLoginNameHeader.destroy();
        newLoginNameText.destroy();
        newLoginPassHeader.destroy();
        newLoginPassText.destroy();
        newLoginResultText.destroy();
        okButton.destroy();
        cancelButton.destroy();
        newLoginResultText.destroy();

        bananaMud.destroy();
        headingText.destroy();

        popLogin();
    }

}


function loginAttemptReturn(data){

}

// Player Login
function onPlayerLogin (data) {
    console.log(data.result);
    if(data.result != "LOGIN SUCCESSFUL"){
        loginResultText.text = data.result;
    }
    else {

        loginPop.destroy();
        loginName.destroy();
        loginPassword.destroy();
        loginNameHeader.destroy();
        loginNameText.destroy();
        loginPassHeader.destroy();
        loginPassText.destroy();
        loginResultText.destroy();
        startButton.destroy();
        createButton.destroy();
        loginResultText.destroy();

        bananaMud.destroy();
        headingText.destroy();

        console.log('You have logged in.');
        self.name = loginNameText.text;
        console.log('Logging In');
        socket.emit('new player', {id: clientID, name: loginNameText.text })
        //start();

    }



}

function clickLogin() {
    if(game.input.mousePointer.x > loginNameBoxX-297 && game.input.mousePointer.x < loginNameBoxX + loginNameBoxWidth-297){

        if(game.input.mousePointer.y > loginNameBoxY - 146 && game.input.mousePointer.y < loginNameBoxY + loginNameBoxHeight - 146){
            if(createPopped == 1){
                selectedTextBox = newLoginNameText;
            } else {
                //alert("NAME");
                selectedTextBox = loginNameText;
            }
        }
        else if(game.input.mousePointer.y > loginPassBoxY - 146 && game.input.mousePointer.y < loginPassBoxY + loginPassBoxHeight - 146){
            if(createPopped == 1){
                selectedTextBox = newLoginPassText;
            } else {
                //alert("PASS");
                selectedTextBox = loginPassText;
            }
        }

    }
    return;
}

function clickCreate() {
    if(game.input.mousePointer.x > loginNameBoxX-297 && game.input.mousePointer.x < loginNameBoxX + loginNameBoxWidth-297){

        if(game.input.mousePointer.y > loginNameBoxY - 146 && game.input.mousePointer.y < loginNameBoxY + loginNameBoxHeight - 146){
            //alert("NAME");
            selectedTextBox = loginNameText;
        }
        else if(game.input.mousePointer.y > loginPassBoxY - 146 && game.input.mousePointer.y < loginPassBoxY + loginPassBoxHeight - 146){
            //alert("PASS");
            selectedTextBox = loginPassText;
        }

    }
    return;
}

function loginBoxFocus(data) {
    if(data.field == 'name' || this.field == 'name'){
        selectedTextBox = loginNameText;
        loginName.frame = 1;
        loginPassword.frame = 0;
    }
    if(data.field == 'password' || this.field == 'password'){
        selectedTextBox = loginPassText;
        loginPassword.frame = 1;
        loginName.frame = 0;
    }
    if(data.field == 'newname' || this.field == 'newname'){
        selectedTextBox = newLoginNameText;
        newLoginName.frame = 1;
        newLoginPassword.frame = 0;
    }
    if(data.field == 'newpassword' || this.field == 'newpassword'){
        selectedTextBox = newLoginPassText;
        newLoginPassword.frame = 1;
        newLoginName.frame = 0;
    }
}
