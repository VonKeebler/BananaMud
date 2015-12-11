var chatterPop, dialogPop;

var chattingNPCNames, chattingNPCIDs;
var NPCNameList = [];
var NPCSelectorList = [];

var chatterSubjectList = [];
var subjectSelectorList = [];
var NPCResponse;

var chatterExit, chatterAsk;
var chatterAskField, chatterAskFieldText;

var dialogPopYesButton, dialogPopNoButton, dialogPopText;

var currentNPCSelected;

function popChatterPrep(){
    if(chatterPop == undefined || chatterPop.visible == false){
        menusHide();
        socket.emit('player chat', {id: clientID });     
        
    } else {
        menusHide();
    }
    
}

function popChatter(data){
    chattingNPCs = [];
    NPCNameList = [];
    NPCSelectorList = [];
    
    graphics = game.add.graphics(0, 0);
    
    chatterPop = game.add.sprite((game.world.width/2), (game.world.height/2), 'ChatterMenu');        
    chatterPop.anchor.x = 0.5;
    chatterPop.anchor.y = 0.5;    
    
    chattingNPCNames = data.chattingNPCNames;
    chattingNPCIDs = data.chattingNPCIDs;

    for(var i=0; i<chattingNPCNames.length; i++){
        NPCNameList.push( game.add.text(chatterPop.position.x-388, chatterPop.position.y-121+(i*24), chattingNPCNames[i], { font: "18px Arial", fill: "#FFFFFF"}) );
        NPCSelectorList.push( game.add.sprite(chatterPop.position.x-390, chatterPop.position.y-120+(i*24), 'ChatterMenuSpeakerSelector') );
        NPCSelectorList[i].alpha = 0;
        NPCSelectorList[i].inputEnabled = true;
        NPCSelectorList[i].events.onInputDown.add(NPCSelect, { index: i, npcID: chattingNPCIDs[i]});
    }
    
    NPCResponse = game.add.text(chatterPop.position.x+70, chatterPop.position.y-120, '', { font: "22px Arial", fill: "#FFFFFF",  wordWrap: true, wordWrapWidth: 320});

    chatterAskField = game.add.sprite(chatterPop.position.x-393, chatterPop.position.y+140, 'ChatterMenuAskField');
    chatterAskField.inputEnabled = true;
    chatterAskField.events.onInputDown.add(chatterAskFieldOnClick, this);
    
    chatterAskFieldText = game.add.text(chatterPop.position.x-389, chatterPop.position.y+142, '', { font: "18px Arial", fill: "#FFFFFF"});    
    
    chatterAsk = game.add.button(chatterPop.position.x-6, chatterPop.position.y+139, 'ChatterMenuAsk', chatterAskOnClick, {npcID: chattingNPCIDs[i]});    
    
    chatterExit = game.add.button(chatterPop.position.x+361, chatterPop.position.y-164, 'ChatterMenuClose', chatterExitOnClick, this);

}

function dePopChatter () {
    graphics.destroy();
    chatterPop.destroy();
    
    clearSubjects();
    
    for(var i=0; i<NPCNameList.length; i++){
        NPCNameList[i].destroy();   
        NPCSelectorList[i].destroy();
    }
    NPCNameList = [];
    NPCSelectorList = [];

    NPCResponse.destroy();
    chatterAsk.destroy();
    chatterAskField.destroy();
    chatterAskFieldText.destroy();
    
    currentNPCSelected = null;
    
    chatterExit.destroy();
    
    selectedTextBox = inputLine;
    
}

function clearSubjects() {
    
    for(var i=0; i<chatterSubjectList.length; i++){
        chatterSubjectList[i].destroy();   
        subjectSelectorList[i].destroy();
    }
    chatterSubjectList = [];
    subjectSelectorList = [];
    
}

function chatterAskFieldOnClick () {
    chatterAskField.frame = 1;
    selectedTextBox = chatterAskFieldText;
}

function chatterAskOnClick () {
    if(currentNPCSelected == undefined || currentNPCSelected == null){
        NPCResponse.text = 'Select someone to talk to first.'
    } else if(chatterAskFieldText.text == ''){
        NPCResponse.text = 'Type something in the question field.'
    } else {
        NPCResponse.text = '';
        socket.emit('player chat ask', {id: clientID, npcID: currentNPCSelected, question: chatterAskFieldText.text });  
        chatterAskFieldText.text = '';   
    }
    for(var i=0; i<subjectSelectorList.length; i++){
        subjectSelectorList[i].alpha = 0;
    }
}

function chatterExitOnClick () {
    dePopChatter();
}

function NPCSelect (data) {
    for(var i=0; i<NPCSelectorList.length; i++){
        NPCSelectorList[i].alpha = 0;
    }
    NPCSelectorList[this.index].alpha = 1;
    
    currentNPCSelected = this.npcID;
    chatterAskFieldText.text = '';  
    
    clearSubjects();
    
    socket.emit('player chat subjects', {id: clientID, npcID: this.npcID });     
}

function onPlayerChatSubjects (data) {
    console.log('Loading Chat Subjects');
    
    chatterSubjectList = [];
    subjectSelectorList = [];
    
    var subjects = Object.keys(data.dialog);
    
    for(var i=0; i<subjects.length; i++){
        chatterSubjectList.push( game.add.text(chatterPop.position.x-157, chatterPop.position.y-121+(i*24), subjects[i], { font: "18px Arial", fill: "#FFFFFF"}) );
        subjectSelectorList.push( game.add.sprite(chatterPop.position.x-159, chatterPop.position.y-120+(i*24), 'ChatterMenuSpeakerSelector') );
        subjectSelectorList[i].alpha = 0;
        subjectSelectorList[i].inputEnabled = true;
        subjectSelectorList[i].events.onInputDown.add(SubjectSelect, { index: i , dialog: data.dialog[Object.keys(data.dialog)[i]]});        
    }
    
    
}

function SubjectSelect (data) {
    for(var i=0; i<subjectSelectorList.length; i++){
        subjectSelectorList[i].alpha = 0;
    }
    subjectSelectorList[this.index].alpha = 1;
    NPCResponse.text = this.dialog;
}

function onPlayerChatResponse (data) {

    NPCResponse.text = data.response;
}

function onPopDialog(data){
    
    dialogPop = game.add.sprite((game.world.width/2), (game.world.height/2), 'popDialog');        
    dialogPop.anchor.x = 0.5;
    dialogPop.anchor.y = 0.5;
    
    dialogPopText = dialogPop.addChild( game.add.text(-142, -96, data.dialog, { font: "bold 18px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 288}) );

    dialogPopYesButton = dialogPop.addChild(game.add.button(-141, 67, 'popDialogYesButton', popDialogYesButton, {dialogResponseFunction: data.dialogResponseFunction}));  
    
    dialogPopNoButton = dialogPop.addChild(game.add.button(63, 67, 'popDialogNoButton', popDialogNoButton, {dialogResponseFunction: data.dialogResponseFunction}));         
    
}

function popDialogYesButton(data){
    socket.emit('player dialog answer', {id: clientID, dialogResponseFunction: this.dialogResponseFunction, answer: "Yes" });  
    dePopDialog();
}

function popDialogNoButton(data){

    socket.emit('player dialog answer', {id: clientID, dialogResponseFunction: this.dialogResponseFunction, answer: "No" });    
    dePopDialog();
}

function dePopDialog(){
    dialogPop.destroy();
    dialogPopText.destroy();
    dialogPopYesButton.destroy();
    dialogPopNoButton.destroy();
}