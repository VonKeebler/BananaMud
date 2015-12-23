var messagesPop, messagesViewPop, messagesNewMessagePop;

var messagesPage, messagesPageText;

var messagesPageUp, messagesPageDown;

var messageFromNames = [];
var messageDates = [];
var messageSubjects = [];

var messageViewFromName;
var messageViewDate;
var messageViewSubject;
var messageViewMessage;

var messageNewToName;
var messageNewSubject;
var messageNewMessage;

var messageNewToNameField;
var messageNewSubjectField;
var messageNewMessageField;

var messageNewMessageCancelButton;

var messageViewButtons = [];
var messageDeleteButtons = [];

var newButton, messageNewMessageSendButton, messageNewMessageCancelButton;

function messagesClick () {

    if(messagesPop == undefined || messagesPop.visible == false){
        menusHide();

        graphics = game.add.graphics(0, 0);
        
        messagesPop = game.add.sprite((game.world.width/2)+38, game.world.height-391, 'messagesMenu');        
        messagesPop.anchor.x = 0;
        messagesPop.anchor.y = 0;
        
        for(var i=0; i<5; i++){
            messageFromNames[i] = messagesPop.addChild( game.add.text(9, 45 + (i * 71), '', { font: "12px Arial", fill: "#ffffff"}));
            messageDates[i] = messagesPop.addChild( game.add.text(150, 45 + (i * 71), '', { font: "12px Arial", fill: "#ffffff"}));
            messageSubjects[i] = messagesPop.addChild( game.add.text(9, 79 + (i * 71), '', { font: "12px Arial", fill: "#ffffff"}));
            
            //messageViewButtons[i] = messagesPop.addChild( game.add.button(235, 77 + (i * 71), 'messagesViewButton', messagesViewMessageClick, {index: i}) );        
            //messageDeleteButtons[i] = messagesPop.addChild( game.add.button(261, 77 + (i * 71), 'messagesDeleteButton', messagesDeleteMessageClick, {index: i}) );        
        }
        
        newButton = messagesPop.addChild( game.add.button(223, 5, 'newButton', messagesNewMessageClick, this) );        

        messagesPage = 0;
        
        messagesPageText = messagesPop.addChild( game.add.text(299, 199, messagesPage+1, { font: "12px Arial", fill: "#ffffff"}));
        
        messagesPageUp = messagesPop.addChild( game.add.button(294, 101, 'messagesMenuUp', messagesPageUpClick, this) );
        messagesPageDown = messagesPop.addChild( game.add.button(294, 287, 'messagesMenuDown', messagesPageDownClick, this) );
        
        socket.emit('player view messages', {id: clientID, messagesPage: messagesPage });     
        
    } else {
        menusHide();
    }
}

function onViewMessagesResponse (data){

    for(var i=0; i<5; i++){
        if(data.messages[i] != undefined){
            messageFromNames[i].text = data.messages[i].from;
            messageDates[i].text = data.messages[i].date;
            messageSubjects[i].text = data.messages[i].subject;

            messageViewButtons[i] = messagesPop.addChild( game.add.button(235, 77 + (i * 71), 'messagesViewButton', messagesViewMessageClick, {messageId: data.messages[i].id, messageData: data.messages[i]}) );        
            messageDeleteButtons[i] = messagesPop.addChild( game.add.button(261, 77 + (i * 71), 'messagesDeleteButton', messagesDeleteMessageClick, {messageId: data.messages[i].id}) );        
        } else {
            messageFromNames[i].text = '';
            messageDates[i].text = '';
            messageSubjects[i].text = '';
            
            if(messageViewButtons[i] != undefined){
                messageViewButtons[i].destroy();
                messageDeleteButtons[i].destroy();
            }
            
        }
        
        
    }
    
}


function messagesPageUpClick(){
    if(messagesPage != 0){
        messagesPage--;
        messagesPageText.text = messagesPage+1;
        socket.emit('player view messages', {id: clientID, messagesPage: messagesPage});     
    }
}

function messagesPageDownClick(){
    messagesPage++;
    messagesPageText.text = messagesPage+1;
    socket.emit('player view messages', {id: clientID, messagesPage: messagesPage});     
    
}

function messagesViewMessageClick (data){
    if(messagesViewPop != undefined){
        dePopMessagesViewMenu();
    }
    
    if(messagesNewMessagePop != undefined){
        dePopMessagesNewMessage();
    }
    messagesViewPop = game.add.sprite((game.world.width/2)+38+messagesPop.width, game.world.height-391, 'messagesViewMenu');        
    messagesViewPop.anchor.x = 0;
    messagesViewPop.anchor.y = 0;
    
    messageViewFromName = messagesViewPop.addChild( game.add.text(9, 23, this.messageData.from, { font: "12px Arial", fill: "#ffffff"}));
    messageViewDate = messagesViewPop.addChild( game.add.text(143, 23, this.messageData.date, { font: "12px Arial", fill: "#ffffff"}));;
    messageViewSubject = messagesViewPop.addChild( game.add.text(9, 57, this.messageData.subject, { font: "12px Arial", fill: "#ffffff"}));;
    messageViewMessage = messagesViewPop.addChild( game.add.text(9, 91, this.messageData.body, { font: "12px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 276}));
}

function messagesDeleteMessageClick (data){

    socket.emit('player delete message', {id: clientID, messageId: this.messageId });     
}

function messagesNewMessageClick () {

    if(messagesViewPop != undefined){
        dePopMessagesViewMenu();
    }
    
    messagesNewMessagePop = game.add.sprite((game.world.width/2)+38+messagesPop.width, game.world.height-391, 'messagesNewMessageMenu');        
    messagesNewMessagePop.anchor.x = 0;
    messagesNewMessagePop.anchor.y = 0;

    messageNewToNameField = messagesNewMessagePop.addChild( game.add.sprite(5, 19, 'NewMessageFromSubjectField') );
    messageNewToNameField.inputEnabled = true;
    messageNewToNameField.events.onInputDown.add(function() { selectedTextBox = messageNewToName; }, this);
    
    messageNewSubjectField = messagesNewMessagePop.addChild( game.add.sprite(5, 53, 'NewMessageFromSubjectField') );
    messageNewSubjectField.inputEnabled = true;
    messageNewSubjectField.events.onInputDown.add(function() { selectedTextBox = messageNewSubject; }, this);    
    
    messageNewMessageField = messagesNewMessagePop.addChild( game.add.sprite(5, 87, 'NewMessageBodyField') );
    messageNewMessageField.inputEnabled = true;
    messageNewMessageField.events.onInputDown.add(function() { selectedTextBox = messageNewMessage; }, this);            
    
    messageNewToName = messagesNewMessagePop.addChild( game.add.text(9, 23, '', { font: "12px Arial", fill: "#ffffff"}));
    messageNewSubject = messagesNewMessagePop.addChild( game.add.text(9, 57, '', { font: "12px Arial", fill: "#ffffff"}));;
    messageNewMessage = messagesNewMessagePop.addChild( game.add.text(9, 91, '', { font: "12px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 276}));    
    
    messageNewMessageSendButton = messagesNewMessagePop.addChild( game.add.button(8, 359, 'sendButton', messagesNewMessageSendOnClick, this) );        
    messageNewMessageCancelButton = messagesNewMessagePop.addChild( game.add.button(170, 359, 'cancelButton', messagesNewMessageCancelOnClick, this) );        

}

function messagesNewMessageSendOnClick (){

    socket.emit('player send message', {id: clientID, recipient: messageNewToName.text, subject: messageNewSubject.text, body: messageNewMessage.text });     
    //dePopMessagesNewMessage();
}

function messagesNewMessageCancelOnClick (){
    dePopMessagesNewMessage();
}

function onSentMessage (){
    onMessage({message: "Mail sent.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
    dePopMessagesNewMessage();
    socket.emit('player view messages', {id: clientID, messagesPage: messagesPage});         
}

function onDeletedMessage (){
    onMessage({message: "Mail deleted.", styles: [{color: '#ffffff', weight: 'Bold'}]});    
    socket.emit('player view messages', {id: clientID, messagesPage: messagesPage});     
}

function dePopMessagesNewMessage () {
    
    messageNewToNameField.destroy();
    messageNewSubjectField.destroy();
    messageNewMessageField.destroy();
    
    messageNewToName.destroy();
    messageNewSubject.destroy();
    messageNewMessage.destroy();
    
    messageNewMessageSendButton.destroy();
    messageNewMessageCancelButton.destroy();
    
    messagesNewMessagePop.destroy();
    
    selectedTextBox = inputLine;
}

function dePopMessagesViewMenu () {
    messageViewFromName.destroy();
    messageViewDate.destroy();
    messageViewSubject.destroy();
    messageViewMessage.destroy();
    
    messagesViewPop.destroy();
}

function dePopMessagesMenu () {
    
    newButton.destroy();
    
    messagesPageText.destroy();
    
    messagesPageUp.destroy();
    messagesPageDown.destroy();
    
    for(var i = 0; i<5; i++){
        messageFromNames[i].destroy();
        messageDates[i].destroy();
        messageSubjects[i].destroy();
        
    }
    for(var i=0; i<messageViewButtons.length; i++){
        messageViewButtons[i].destroy();
        messageDeleteButtons[i].destroy();
    }

    if(messagesViewPop != undefined){
        dePopMessagesViewMenu();
    }
    
    if(messagesNewMessagePop != undefined){
        dePopMessagesNewMessage();
    }
    
    messagesPop.destroy();
}