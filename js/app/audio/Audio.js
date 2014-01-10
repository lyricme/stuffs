
define(function(require, exports, module) {

  var AudioTexture = require( 'app/utils/AudioTexture' );

  function Audio( controller , file , params ){

    this.loader
    this.params = _.defaults( params || {}, {
        
      looping:      false,
      fbc:            128,
      fadeTime:         1,
      texture:      true,

    });

    this.controller = controller;
    this.file       = file;

    this.playing    = false;

    this.looping    = this.params.looping;

    this.buffer;

    this.filterOn       = false;
    this.filter         = this.controller.ctx.createBiquadFilter();
    this.analyser       = this.controller.ctx.createAnalyser();
    this.analyser.array = new Uint8Array( this.params.fbc );
    this.gain           = this.controller.ctx.createGain();


    this.gain.connect( this.analyser );

    if( this.params.texture ){

      this.texture = new AudioTexture( this );

      console.log('TEXTURESSS');
      console.log( this.texture );
    }


    this.loadFile();

  }


  Audio.prototype.loadFile = function(){
  
    this.controller.womb.loader.addToLoadBar();

    var request=new XMLHttpRequest();
	request.open("GET",this.file,true);
	request.responseType="arraybuffer";
      
    var self = this;
    
    request.onload = function(){

      self.controller.ctx.decodeAudioData(request.response,function(buffer){

        if(!buffer){
          alert('error decoding file data: '+url);
          return;
        }

        self.buffer = buffer;
        self.onDecode();

      })
    },

    request.send();

  }

  Audio.prototype.onDecode = function(){

    //gets just the track name, removing the mp3
    this.trackID= this.file.split('.')[this.file.split('.').length-2];

    this.createSource();

    this.onLoad( this );

    //var self = this;
    //if( this.params.onLoad ) this.params.onLoad( self );

    this.controller.womb.loader.loadBarAdd();

  }


  Audio.prototype.createSource = function() {

    this.source         = this.controller.ctx.createBufferSource();
    this.source.buffer  = this.buffer;
    this.source.loop    = this.looping;
           
    this.source.connect( this.gain  );

    this.gain.gain.value = 1;

    if( this.looping ){
      this.analyser.connect( this.controller.loops.gain );
    }else{
      this.analyser.connect( this.controller.notes.gain );
    }

  };

  Audio.prototype.destroySource = function(){
      
    this.source.disconnect(this.gain);
    this.analyser.disconnect(this.gain);
    this.source = undefined;
    this.analyser = undefined;

  };

  Audio.prototype.fadeOut = function( time ){
 
    var t = this.controller.ctx.currentTime;
    if( !time ) time = this.params.fadeTime;
    this.gain.gain.linearRampToValueAtTime( this.gain.gain.value , t );
    this.gain.gain.linearRampToValueAtTime( 0.0 , t + time );

  }
  
  Audio.prototype.fadeIn = function( time , value ){
  
    if( !time  ) time  = this.params.fadeTime;
    if( !value ) value = 1;

    console.log( this.gain.gain );
    this.gain.gain.linearRampToValueAtTime( 1 , this.controller.ctx.currentTime + time );

  }

  Audio.prototype.turnOffFilter = function(){
    this.filterOn = false;
    this.filter.disconnect(0);
    this.source.disconnect( 0 );
    this.source.connect( this.gain );
  }

  Audio.prototype.turnOnFilter = function(){
    this.filterOn = true;
    this.source.disconnect( 0 );
    this.source.connect( this.filter );
    this.filter.connect( this.gain );
  }



  Audio.prototype.stop = function(){

    this.playing = false;
    this.source.noteOff(0);

  };
		
  Audio.prototype.play = function(){
		
    this.playing = true;
    this.source.noteOn(0);
   
    // Creates a new source for the audio right away
    // so we can play the next one with no delay
    if(this.source.loop == false){
      this.createSource();	
    }

  };

  Audio.prototype.onLoad = function(){


  }


  Audio.prototype._update = function(){

    this.analyser.getByteFrequencyData( this.analyser.array );

    if( this.texture )
      this.texture.update();

    this.update();

  }

  Audio.prototype.update = function(){

  }


  return Audio

});
