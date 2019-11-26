//<![CDATA[
'use strict';

function TelaMenu(game) {
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
    game.load.image('menu', 'img/menu.png');
    game.load.image('start', 'img/blank.png');
  };

  var button;

  this.create = function() {
    game.add.tileSprite(0, 0, 1280, 720, 'menu');
    button = game.add.image(929, 467, 'start');
    button.inputEnabled = true;
    button.input.useHandCursor = true;
    button.events.onInputDown.add(iniciar, this);
  };

  function iniciar() {
    game.state.start('TelaInicial');
  }

  this.update = function() {};
}

//]]>
