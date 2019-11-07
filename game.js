//<![CDATA[
"use strict";

// Essa não é a forma mais "prosissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(1280, 720, Phaser.AUTO, "divJogo");

var map;
var tileset;
var layer;
var player;
var doubleJumpAllowed;
var doubleJumpButtonAllowed;
var facing = 'left';
var anim = 'idle';
var jumpTimer = 0;
var cursors;
var jumpButton;
var lamp;
var bg;

function TelaInicial(game) {
  // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)
  this.init = function() {
    game.input.maxPointers = 1;

    // Deixar o jogo executando, mesmo se o browser mudar de aba?
    game.stage.disableVisibilityChange = true;

    if (game.device.desktop) {
      // Configurações específicas para desktop

      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    } else {
      // Configurações específicas para celulares

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // Especifica o tamanho mímino e máximo para a área do jogo (de 400x300 até 800x600)
      game.scale.setMinMax(400, 300, 800, 600);
      game.scale.forceLandscape = true;
      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    }
  };

  this.preload = function() {
    game.load.tilemap('level1', 'img/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'img/tiles-1.png');
    game.load.spritesheet('char', 'img/char.png', 64, 64);
    game.load.spritesheet('poste', 'img/poste.png', 32, 32);
    game.load.image('starSmall', 'img/star.png');
    game.load.image('starBig', 'img/star2.png');
    game.load.image('background', 'img/skyline_purple.png');
    game.load.image('posteluz', 'img/posteluz.png');
  };

  this.create = function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1280, 720, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 9 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 1000;

    player = game.add.sprite(96, 96, 'char');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.5;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 64, 22, 0);

    player.animations.add('left', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('idle-left', [0], 10, true);
    player.animations.add('jump-left', [6], 10, true);
    player.animations.add('right', [13, 12, 11, 10, 9], 10, true);
    player.animations.add('idle-right', [13], 10, true);
    player.animations.add('jump-right', [7], 10, true);
    player.animations.play('idle-left');
    facing = 'left';
    anim = 'idle-left';
    doubleJumpAllowed = false;
    doubleJumpButtonAllowed = false;

    game.camera.follow(player);

    lamp = game.add.sprite(20, 800, 'poste');
    lamp.frame = 1;


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  this.update = function() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    var onFloor = player.body.onFloor();
    var newAnim = 'idle-left';

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;

        facing = 'left';
        if (onFloor) {
          newAnim = 'left';
        } else {
          newAnim = 'jump-left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;

        facing = 'right';
        if (onFloor) {
          newAnim = 'right';
        } else {
          newAnim = 'jump-right';
        }
    }
    else
    {
        if (facing == 'left')
        {
          if (onFloor) {
            newAnim = 'idle-left';
          } else {
            newAnim = 'jump-left';
          }
        }
        else
        {
          if (onFloor) {
            newAnim = 'idle-right';
          } else {
            newAnim = 'jump-right';
          }
        }
    }
    
    if (anim != newAnim) {
      anim = newAnim;
      player.animations.play(anim);
    }

    if (onFloor) {
      doubleJumpAllowed = true;
      doubleJumpButtonAllowed = false;
    } else if (doubleJumpAllowed) {
      if (!jumpButton.isDown) {
        doubleJumpButtonAllowed = true;
      } else if (doubleJumpButtonAllowed) {
        doubleJumpAllowed = false;
        doubleJumpButtonAllowed = false;
        player.body.velocity.y = -700;
        jumpTimer = game.time.now + 750;
      }
    }

    if (jumpButton.isDown && onFloor && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -700;
        jumpTimer = game.time.now + 750;
    }

  };
}

// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.start("TelaInicial");

//]]>
