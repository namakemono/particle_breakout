var FPS = 30;
var FIELD_WIDTH = 320;
var FIELD_HEIGHT = 160;

var Particle = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.speed = 10;
  this.color = color;
  this.vx = 0; // this.speed * (Math.random()-1);
  this.vy = 0; // this.speed * (Math.random()-1);
  this.update = function() {
    if ( this.x > FIELD_WIDTH ) this.vx = -Math.abs(this.vx);
    else if ( this.x < 0 ) this.vx = Math.abs(this.vx);
    if ( this.y > FIELD_HEIGHT ) this.vy = -Math.abs(this.vy);
    else if ( this.y < 0 ) this.vy = Math.abs(this.vy);
    this.x += this.vx;
    this.y += this.vy;
  };
  this.render = function(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 1, 1);
  };
};

$(function() {
  var frame_count = 0;
  var particles = [];
  function pcmp(a, b){
    if (a.x + FIELD_WIDTH * a.y < b.x + FIELD_WIDTH * b.y ) return -1;
    else if (a.x + FIELD_WIDTH * a.y > b.x + FIELD_WIDTH * b.y ) return 1;
    return 0;
  };
  for ( var x = Math.floor(FIELD_WIDTH * 0.2); x < Math.floor(FIELD_WIDTH * 0.8); ++x ) {
    for ( var y = Math.floor(FIELD_HEIGHT * 0.1); y < Math.floor(FIELD_HEIGHT * 0.4); ++y ) {
      var color = "rgb(" + Math.floor(256*x/FIELD_WIDTH) +", " + Math.floor(256*y / FIELD_HEIGHT) + "," + 255 +")";
      particles.push( new Particle(x, y, color) );
    }
  }
  var particle = new Particle(FIELD_WIDTH / 2, FIELD_HEIGHT * 0.7, "rgb(0,0,0)");
  particle.vx = Math.floor(Math.random() * particle.speed);
  particle.vy = Math.floor(Math.random() * particle.speed);
  particles.push( particle );
  console.log("particle count", particles.length);
  var context = $('canvas')[0].getContext("2d");
  function main() {
    for ( var i = 0; i < particles.length; ++i ) {
      particles[i].update();
    }
    // collision check
    particles.sort(pcmp);
    for ( var i = 0; i < particles.length - 1; ++i ) {
      if ( particles[i].x == particles[i+1].x && particles[i].y == particles[i+1].y ) {
        /*
        if ( particles[i].vy == 0 ) {
          particles[i+1].vy *= -1;
          particles[i].vy = particles[i+1].vy;
          particles[i].vx = particles[i].speed * Math.random();
        } else {
          particles[i].vy *= -1;
          particles[i+1].vy = particles[i].vy;
          particles[i+1].vx = particles[i].speed * Math.random();
        }
        */
        particles[i].vx = Math.floor(particles[i].speed * (2*Math.random() -1));
        particles[i].vy = Math.floor(particles[i].speed * (2*Math.random() -1));
        particles[i+1].vx = Math.floor(particles[i+1].speed * (2*Math.random() -1));
        particles[i+1].vy = Math.floor(particles[i+1].speed * (2*Math.random() -1));
      }
    }

    // if ( frame_count % 5 == 0 ) {
      var margin = 100;
      context.beginPath();
      context.fillStyle = "rgb(255, 255, 255)";
      context.fillRect(-margin/2, -margin/2, margin + FIELD_WIDTH, margin + FIELD_HEIGHT);
      context.fill();
    // }
    context.fillStyle = "rgb(0, 0, 0)";
    for ( var i = 0; i < particles.length; ++i ) {
      particles[i].render(context);
    }
    ++frame_count;
  };
  setInterval(main, 1000 / FPS);
});
