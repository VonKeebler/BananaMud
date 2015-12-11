var poppedImage, imageExit;

function onPopImage(data){ // on receipt of pop image
    menusHide();
    poppedImage = game.add.sprite((game.world.width/2), (game.world.height/2), data.image);        
    poppedImage.anchor.x = 0.5;
    poppedImage.anchor.y = 0.5;
    //poppedImage.inputEnabled = true;
    //poppedImage.input.enableDrag(false);
    
    imageExit = poppedImage.addChild(game.add.button((poppedImage.width/2)-32, 0-(poppedImage.height/2), 'ChatterMenuClose', popImageExitOnClick, this));
}

function popImageExitOnClick(){
    poppedImage.destroy();
}