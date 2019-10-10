//<![CDATA[
"use strict";

// Essa não é a forma mais "prosissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
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
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
    game.load.spritesheet('droid', 'img/droid.png', 32, 32);
    game.load.image('starSmall', 'img/star.png');
    game.load.image('starBig', 'img/star2.png');
    game.load.image('background', 'img/background2.png');
  };

  this.create = function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 1000;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  this.update = function() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -300;
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
