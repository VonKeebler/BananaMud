//var introText = "Welcome to:\nBANANAMUD\n\nType /help for starter information.";

var helpText = "An Inabsolute Possible List of Commands:\n\n"+
               "  /help, /?                         - This dialog\n"+
               "  /look                             - Look around with your eyes, dude\n"+
               "  /look at <stuff>, /l <stuff>      - Look at something in particular\n"+
               "  /i, /inventory                    - Check your inventory\n"+
               "  N, S, E, W                        - Go in a direction";

var showingMessage = 0;
var messageQueue = [];

var outputText;

var outputTextArray = [];

var newMessage;

//var letterDelay = Phaser.Timer.SECOND/1000;
var letterDelay = 0;

/*function showText(Text){
    var  content=Text.split('');
    var i=0;
    var showTextLoop = game.time.events.loop(letterDelay, function() {
        if(i === content.length){
            showingMessage = 0;
            game.time.events.remove(showTextLoop);
            return;
        }
        outputText.text = outputText.text.concat(content[i]);        
        i++;
    }, this);  
}*/


// Message
function onMessage (data) {
    //showText(data.message);
    queueMessage(data);
}

function queueMessage(data){
    messageQueue.push(data);
    return;
}

function showText(data){
    showingMessage = 1;
    //var currentLength = outputText.text.length;
    //outputText.text = outputText.text.concat(data.message);        
    var textX = 32;
    var textY = game.world.height-52;
    
    outputTextArray.push(game.add.text(-1000, -1000, '', { font: "bold 15px Arial", 
                                            fill: "#19de65", 
                                            wordWrap: true, 
                                            wordWrapWidth: (game.world.width/2)-50}));
    //outputTextArray[outputTextArray.length-1].setTextBounds(0, 0, 10000, game.world.height-52);

    outputTextArray[outputTextArray.length-1].mask = outputTextMask;
    
    outputTextArray[outputTextArray.length-1].text = data.message;
    
    if(data.styles != undefined){
        for(var i = 0; i<data.styles.length; i++){
            if(!data.styles[i].position){data.styles[i].position = 0;}
            if(data.styles[i].color){
                outputTextArray[outputTextArray.length-1].addColor(data.styles[i].color, data.styles[i].position);
            }
            if(data.styles[i].weight){
                outputTextArray[outputTextArray.length-1].addFontWeight(data.styles[i].weight, data.styles[i].position);
            }
            if(data.styles[i].strokeColor){
                outputTextArray[outputTextArray.length-1].addStrokeColor(data.styles[i].strokeColor, data.styles[i].position);
            }  
            if(data.styles[i].style){
                outputTextArray[outputTextArray.length-1].addFontStyle(data.styles[i].style, data.styles[i].position);
            }
        }
    }
    
    outputTextArray[outputTextArray.length-1].position.x = 32;
    outputTextArray[outputTextArray.length-1].position.y = game.world.height-(outputTextArray[outputTextArray.length-1].height+52);
    
    game.world.sendToBack(outputTextArray[outputTextArray.length-1]);

    for(var i = 0; i<outputTextArray.length-1; i++){
        if(i>30){
            outputTextArray[i].position.y -= outputTextArray[outputTextArray.length-1].height
            outputTextArray[0].destroy();
            outputTextArray.splice(0, 1);
            outputTextArray[outputTextArray.length-1].mask = outputTextMask;
        } else {
            outputTextArray[i].position.y -= outputTextArray[outputTextArray.length-1].height
        }
    }
    
    showingMessage = 0;
 
}

/*function showText(data){ // OLD SHOW TEXT - NEED TO HANDLE BUFFER BETTER
    showingMessage = 1;
    var currentLength = outputText.text.length;
    outputText.text = outputText.text.concat(data.message);        
    showingMessage = 0;
    if(data.color){
        outputText.addColor(data.color, currentLength);
    }
    if(data.weight){
        outputText.addFontWeight(data.weight, currentLength);
    }
    if(data.strokeColor){
        outputText.addStrokeColor(data.strokeColor, currentLength);
    }  
    if(data.style){
        outputText.addFontStyle(data.style, currentLength);
    } 
    
    if(outputText.text.length > 1500){outputText.text = outputText.text.substring(outputText.text.length-1000, outputText.text.length)}
}*/


function keyPress(char) {
    //alert(char.charCodeAt(0));
    
    if(char.charCodeAt(0) === Phaser.Keyboard.ENTER || char.charCodeAt(0) === 0){
        sendMessage(selectedTextBox.text);
        //alert(inputLine.text);
    }
    
    else if(char.charCodeAt(0) === Phaser.Keyboard.BACKSPACE){
        //inputLine.text = inputLine.text.substring(0, inputLine.text.length - 1);
    }
    
    else {
        //inputLine.text = inputLine.text.concat(char.key);
        if(selectedTextBox === charSheetNameText && selectedTextBox.length >= 18){
            
        }else {
            selectedTextBox.text = selectedTextBox.text.concat(char);
        }
    }

}

function processBackspace() {
    if(selectedTextBox){
        selectedTextBox.text = selectedTextBox.text.substring(0, selectedTextBox.text.length - 1);
    }
}

function processTab() {
    if(selectedTextBox == newLoginNameText){
        loginBoxFocus({ field: 'newpassword'});
    } else if(selectedTextBox == newLoginPassText){
        loginBoxFocus({ field: 'newname'});
    } else if(selectedTextBox == loginNameText){
        loginBoxFocus({ field: 'password'});
    } else if(selectedTextBox == loginPassText){
        loginBoxFocus({ field: 'name'});
    } else {
    }
}

function sendMessage(input) {
    if(selectedTextBox === loginNameText || selectedTextBox === loginPassText){
        startOnClick();
        return;
    }
    if(selectedTextBox === newLoginNameText || selectedTextBox === newLoginPassText){
        okOnClick();
        return;
    }    
    if(selectedTextBox === chatterAskFieldText){
        chatterAskOnClick();
        return;
    }    
    if(input === ""){
        return;
    }
    if(input.charAt(0) === "/"){
        if(input.toLowerCase().search("help") != -1 || input.charAt(1) == "?"){
            queueMessage({message : helpText, color: '#ffffff', weight: 'bold'});
        }
        else if(input.toLowerCase().search("inventory") == 1 || input.toLowerCase().search("inv") == "1" || input.charAt(1) == "i"){
            socket.emit('player inventory', {id: clientID });
        }
        else if(input.toLowerCase().search("who") == 1){
            socket.emit('player who', {id: clientID });
        }
        else if(input.toLowerCase().search("ping") == 1){
            console.log('Ping!');            
            runPing();
        }        
        else if(input.toLowerCase().search("look") == 1 || (input.toLowerCase().charAt(1) == "l" || input.length == 2)){
            args = input.split(' ');
            if(args.length == 1 || (args.length == 2 && args[1] == "")){
                socket.emit('player look', {id: clientID });
            } else {
                socket.emit('player look at', {id: clientID, input: input.substring(input.search(" ")+1, input.length) });
            }
        }
        else if(input.toLowerCase().search("speak") == 1 || input.toLowerCase().search("talk") == 1){
            popChatterPrep();
        }
        else if(input.toLowerCase().search("get") == 1 || input.toLowerCase().search("take") == 1){
            socket.emit('player take', {id: clientID, item: input.substring(input.search(" ")+1, input.length) });
        }   
        else if(input.toLowerCase().search("drop") == 1){
            socket.emit('player drop', {id: clientID, item: input.substring(input.search(" ")+1, input.length) });
        }      
        else if(input.toLowerCase().search("equip") == 1 || input.toLowerCase().search("wear") == 1 ){
            socket.emit('player equip', {id: clientID, item: input.substring(input.search(" ")+1, input.length) });
        }       
        else if(input.toLowerCase().search("unequip") == 1 || input.toLowerCase().search("remove") == 1 ){
            socket.emit('player remove', {id: clientID, item: input.substring(input.search(" ")+1, input.length) });
        }  
        else if(input.toLowerCase().search("use") == 1){
            socket.emit('player use', {id: clientID, item: input.substring(input.search(" ")+1, input.length) });
        }   
        else if(input.toLowerCase().search("chat") == 1){
            socket.emit('player local say', {id: clientID, input: input.substring(input.search(" ")+1, input.length)  });
        }        

        else {
            //queueMessage({message : "That command is invalid. Use /? for more information."});
            socket.emit('player interact', {id: clientID, command: input.substring(1, input.length) });
        }
    }
    else if(input.toLowerCase() == "north" || input.toLowerCase() == "n"){
        socket.emit('player go', {id: clientID, exit: 'North'});
    }     
    else if(input.toLowerCase() == "east" || input.toLowerCase() == "e"){
        socket.emit('player go', {id: clientID, exit: 'East'});
    }  
    else if(input.toLowerCase() == "south" || input.toLowerCase() == "s"){
        socket.emit('player go', {id: clientID, exit: 'South'});
    }  
    else if(input.toLowerCase() == "west" || input.toLowerCase() == "w"){
        socket.emit('player go', {id: clientID, exit: 'West'});
    }else if(input.toLowerCase() == "northwest" || input.toLowerCase() == "nw"){
        socket.emit('player go', {id: clientID, exit: 'Northwest'});
    }     
    else if(input.toLowerCase() == "northeast" || input.toLowerCase() == "ne"){
        socket.emit('player go', {id: clientID, exit: 'Northeast'});
    }  
    else if(input.toLowerCase() == "southwest" || input.toLowerCase() == "sw"){
        socket.emit('player go', {id: clientID, exit: 'Southwest'});
    }  
    else if(input.toLowerCase() == "southeast" || input.toLowerCase() == "se"){
        socket.emit('player go', {id: clientID, exit: 'Southeast'});
    }else if(input.toLowerCase() == "up" || input.toLowerCase() == "u"){
        socket.emit('player go', {id: clientID, exit: 'Up'});
    }else if(input.toLowerCase() == "down" || input.toLowerCase() == "d"){
        socket.emit('player go', {id: clientID, exit: 'Down'});        
    } else {
        //showText(self.name+"> " + input + "\n");
        socket.emit('player say', { id: clientID, input: input });         
    }
    selectedTextBox.text = "";
}

function scrollOutput(dir) {
    switch(dir){
        case 'up':
            if(outputText.y === outputText.height-(this.game.world.height-60)){
                break;
            }
            outputText.y += 15;
            break;
        case 'down':
            if(outputText.y <= 10){
                outputText.y = 10;
                break;
            }
            outputText.y -= 15;
            break;
        case 'doubleup':
            outputText.y = outputText.height-(this.game.world.height-60);
            break;
        case 'doubledown':
            outputText.y = 10;
            break;
        default:
            break;
    }

}

function runPing() {
    socket.emit('ping'); 
}
