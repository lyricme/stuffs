define(function(require, exports, module) {

                          require( 'lib/three'                );
                          require( 'lib/underscore'               );
                          require( 'lib/stats.min'                );
 

  // NON-THREE parts of the WOMB
  var Interface         = require( 'app/utils/Interface'          );
  var Detector          = require( 'app/utils/Detector'           );
  var Loader            = require( 'app/utils/Loader'             );
  var Animator          = require( 'app/utils/Animator'           );
  var AudioController   = require( 'app/audio/AudioController'    );
  var Tweener           = require( 'app/utils/Tweener'            );
  var MassController    = require( 'app/physics/MassController'   );
  var SpringController  = require( 'app/physics/SpringController' );
  var LeapController    = require( 'app/utils/LeapController'     );



  // THREE Extras
  var CameraController  = require( 'app/three/CameraController' );
  var Raycaster         = require( 'app/three/Raycaster'        );
  var TextCreator       = require( 'app/three/TextCreator'      );
  var SceneController   = require( 'app/three/SceneController'  );
  var ImageLoader       = require( 'app/three/ImageLoader'      );
  var ModelLoader       = require( 'app/three/ModelLoader'      );
  var ObjLoader         = require( 'app/three/ObjLoader'        );
  var JSONLoader        = require( 'app/three/JSONLoader'       );
  var EffectComposer    = require( 'app/three/EffectComposer'   );
  var UserMediaTexture  = require( 'app/three/UserMediaTexture' );

  function Womb(params){

    this.params = _.defaults( params || {} , {
      raycaster:        false,
      cameraController: false,
      massController:   false,
      springController: false,
      leapController:   false,
      textCreator:      false,
      size:               100,
      color:         '#000000',
    });


    // Time uniform
    this.time = { type: "f", value: 1.0 } ;

    /*
     *
     * SETTING UP THE SCENE
     *
     */


    this.size = this.params.size;

    this.scene = new THREE.Scene();


    // CAMERA
    this.width = window.innerWidth;
    this.height = window.innerHeight;
 
    this.camera = new THREE.PerspectiveCamera( 
      40 ,
      this.width / this.height ,
      this.size / 100,
      this.size  * 4
    );

    this.camera.position.z = this.size;

    var c = this.params.color.replace( "#" , "0x" );
    this.color = new THREE.Color( );
    this.color.setHex( c );
   
    this.scene.fog = new THREE.Fog( this.color , this.size , this.camera.far * .8 );

    // Getting the container in the right location
    this.container = document.createElement( 'div' );
    this.container.id = 'renderingContainer';

    document.body.appendChild( this.container );

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

 
    this.renderer.domElement.style.background = this.params.color;
    this.container.appendChild( this.renderer.domElement );


    if( this.params.cameraController )
      this.cameraController = new CameraController( this , this.params.cameraController );
      
    if( this.params.raycaster )
      this.raycaster = new Raycaster( this );

    if( this.params.imageLoader )
      this.imageLoader = new ImageLoader( this );

    if( this.params.modelLoader )
      this.modelLoader = new ModelLoader( this );

    if( this.params.objLoader )
      this.objLoader = new ObjLoader( this );

    if( this.params.JSONLoader )
      this.JSONLoader = new JSONLoader( this );

    if( this.params.effectComposer )
      this.effectComposer  = new EffectComposer(  this );

    if( this.params.userMediaTexture )
      this.userMediaTexture = new UserMediaTexture( this );

    if( this.params.textCreator )
      this.textCreator = new TextCreator( this );

    this.sceneController  = new SceneController( this );

    window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );



    this.interface        = new Interface(        this );
    this.loader           = new Loader(           this );
    this.tweener          = new Tweener(          this );

    this.animator         = new Animator(         this );
    this.audioController  = new AudioController(  this );

    this.clock            = new THREE.Clock();

    if( this.params.massController )
      this.massController   = new MassController( this );

    if( this.params.springController )
      this.springController = new SpringController( this , this.massController );

  }

  // This is what will be called in our loaded
  Womb.prototype._start = function(){
   
    if( this.leapController ){
      this.leapController.connect();
    }
    
    this.start();

    this.animator.start();

  }


  Womb.prototype.console = function(){ 
    console.log( this ); 
  }

  Womb.prototype.start = function(){

  }

  Womb.prototype._update = function(){

    this.delta = this.clock.getDelta();

    this.time.value += this.delta;
    
    TWEEN.update();

    if( this.massController   ) this.massController._update();
    if( this.springController ) this.springController._update();
   
    this.audioController._update();
     
    this.sceneController._update();
    
    if( this.raycaster ) 
      this.raycaster._update();
    
    if( this.cameraController )
      this.cameraController._update( this.delta );

    if( this.userMediaTexture )
      this.userMediaTexture._update();


    this.update();

    this.render();


  }

  Womb.prototype.render = function(){

    if( this.effectComposer )
      this.effectComposer.render();
    else
      this.renderer.render( this.scene , this.camera );

  }

  Womb.prototype.onWindowResize = function(){

    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }



  Womb.prototype.update = function(){

  }

  module.exports = Womb;

});
