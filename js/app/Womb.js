define(function(require, exports, module) {

  var a = require( 'js/lib/three.min.js'  ),
      b = require( 'js/lib/underscore.js' ),
      c = require( 'js/lib/stats.min.js'  );


  //var math      = require( 'app/utils/math.js'      );
  var Loader            = require( 'app/utils/loader'          );
  var Animator          = require( 'app/utils/animator'        );
  var AudioController   = require( 'app/audio/AudioController' );
  var World             = require( 'app/three/World'           );
  var Tweener           = require( 'app/utils/Tweener'         );
  var Scene             = require( 'app/three/Scene'           );
  
  function Womb(){

    this.loader           = new Loader(           this );
    this.tweener          = new Tweener(          this );
    this.animator         = new Animator(         this );
    this.audioController  = new AudioController(  this );
    this.world            = new World(            this );

  }


  // This is what will be called in our loaded
  Womb.prototype._start = function(){
    this.animator.start();
    this.start();
  }

  Womb.prototype.start = function(){

  }

  Womb.prototype._update = function(){

    this.update();

    TWEEN.update();

    this.audioController._update();
    this.world._update();

    this.world.render();

  }

  Womb.prototype.update = function(){

  }

  module.exports = Womb;

});
