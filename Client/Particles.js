var particleEmitter;


function popMeleeHit(data){
    //I dunno. Lets do something with it.
    //particleEmitter.makeParticles('meleeHitParticles', [0, 1, 2, 3])
    game.world.bringToTop(particleEmitter);
    
    console.log('PRODUCE PARTICLES '+data.targetX +' '+data.targetY)
    
    particleEmitter.makeParticles('meleeHitParticles', [0, 1, 2, 3, 4])
    particleEmitter.gravity = 300;
    
    particleEmitter.minParticleScale = 2;
	particleEmitter.maxParticleScale = 4;
        
    particleEmitter.x = data.targetX;
    particleEmitter.y = data.targetY;
    
    particleEmitter.start(true, 1200, null, 10);
    
    setTimeout(fadeParticles, 100, {timer: 1200})
}

function popMeleeCriticalHit(data){
    //I dunno. Lets do something with it.
    //particleEmitter.makeParticles('meleeHitParticles', [0, 1, 2, 3])
    game.world.bringToTop(particleEmitter);
    
    console.log('PRODUCE PARTICLES '+data.targetX +' '+data.targetY)
    
    particleEmitter.makeParticles('meleeHitParticles', [0, 1, 2, 3, 4])
    particleEmitter.gravity = 300;
    
    particleEmitter.minParticleScale = 3;
	particleEmitter.maxParticleScale = 5;
        
    particleEmitter.x = data.targetX;
    particleEmitter.y = data.targetY;
    
    particleEmitter.start(true, 1200, null, 20);
    
    setTimeout(fadeParticles, 100, {timer: 1200})
}

function fadeParticles(data){
	particleEmitter.forEachAlive(function(p){
		p.alpha= p.lifespan / particleEmitter.lifespan;
	});
    if(data.timer > 0){
        setTimeout(fadeParticles, 100, {timer: data.timer - 100})
    }
}
