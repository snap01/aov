//If a new world then create a default scene
Hooks.on('ready', () => {
  console.log("Adding a default scene")
  const isNewWorld = !(game.actors.size + game.items.size + game.journal.size);
  if (game.scenes.filter(doc => doc.id !== 'NUEDEFAULTSCENE0').length === 0) {
    Scene.create({name:'Default',active:true,background:{src:'systems/aov/art-assets/vikings-launch.jpg'},foregroundElevation:4,thumb:'systems/aov/art-assets/vikings-launch.jpg',grid:{type:0},tokenVision:false,fog:{exploration:false},initial:{scale: 0.3868}})
  }
})
