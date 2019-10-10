//<![CDATA[
"use strict";

// Essa não é a forma mais "prosissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");

var player;
var arrowKeys;
var jumpKey;

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
    game.stage.backgroundColor = "#85b5e1";
    game.load.image("player", "./img/mikey.png");
  };

  this.create = function() {
    player = game.add.sprite(0, 0, "player");
    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    arrowKeys = game.input.keyboard.createCursorKeys();
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  this.update = function() {
    // game.physics.arcade.collide(player);

    player.body.velocity.x = 0;

    if (arrowKeys.left.isDown) {
      player.body.velocity.x = -250;
    } else if (arrowKeys.right.isDown) {
      player.body.velocity.x = 250;
    }

    if (
      jumpKey.isDown &&
      (player.body.onFloor() || player.body.touching.down)
    ) {
      player.body.velocity.y = -400;
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
