var FPS = 30;
var FIELD_WIDTH = 160;
var FIELD_HEIGHT = 240;
var PARTICLE_SIZE = 1;
var FEVER_RATE = 0.1;

var Particle = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.speed = 6;
  this.color = color;
  this.is_active = true;
  this.vx = 0;
  this.vy = 0;
  this.update = function() {
    if ( this.is_active ) {
      if ( this.x > FIELD_WIDTH ) this.vx = -Math.abs(this.vx);
      else if ( this.x < 0 ) this.vx = Math.abs(this.vx);
      // if ( this.y > FIELD_HEIGHT ) this.vy = -Math.abs(this.vy);
      if ( this.y > FIELD_HEIGHT ) this.is_active = false;
      if ( this.y < 0 ) this.vy = Math.abs(this.vy);
      this.x += this.vx;
      this.y += this.vy;
    }
  };
  this.render = function(context) {
    if ( this.is_active ) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, PARTICLE_SIZE, PARTICLE_SIZE);
      /*
      if ( this.vy == 0 ) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, PARTICLE_SIZE, PARTICLE_SIZE);
      } else {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = this.color;
        context.moveTo(this.x - this.vx, this.y - this.vy);
        context.lineTo(this.x, this.y);
        context.stroke();
      } */
    }
  };
};

var Bar = function() {
  this.x = Math.floor(FIELD_WIDTH / 2);
  this.y = Math.floor(FIELD_HEIGHT * 1.0);
  this.w = 60;
  this.h = 8;
  this.render = function(context) {
    context.fillStyle = "rgba(255, 0, 0, 100)";
    context.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  };
};

$(function() {
  var frame_count = 0;
  var bar = new Bar();
  var particles = [];
  function pcmp(a, b){
    if (a.x + FIELD_WIDTH * a.y < b.x + FIELD_WIDTH * b.y ) return -1;
    else if (a.x + FIELD_WIDTH * a.y > b.x + FIELD_WIDTH * b.y ) return 1;
    return 0;
  };
  for ( var x = 0; x < FIELD_WIDTH; x += PARTICLE_SIZE ) {
    for ( var y = 0; y < 50; y += PARTICLE_SIZE ) {
      var r = Math.floor(256 * x / FIELD_WIDTH);
      var g = 0;
      var b = 255;
      var color = "rgb(" + r +", " + g + "," + b +")";
      particles.push( new Particle(x, y, color) );
    }
  }
  var particle = new Particle(Math.floor(FIELD_WIDTH / 2), Math.floor(FIELD_HEIGHT * 0.7), "rgb(0,0,0)");
  particle.vx = Math.floor(Math.random() * particle.speed);
  particle.vy = -Math.max(5, Math.floor(Math.random() * particle.speed));
  particles.push( particle );
  console.log("particle count", particles.length);
  var canvas = $('canvas')[0];
  var context = canvas.getContext("2d");
  canvas.addEventListener("mousemove", function(e){
    var rect = e.target.getBoundingClientRect();
    bar.x = Math.max(bar.w / 2, e.clientX - rect.left);
    bar.x = Math.min(FIELD_WIDTH - bar.w / 2, bar.x);
  }, false);

  function main() {
    for ( var i = 0; i < particles.length; ++i ) {
      particles[i].update();
    }
    // collision check
    particles.sort(pcmp);
    for ( var i = 0; i < particles.length - 1; ++i ) {
      if ( particles[i].x == particles[i+1].x && particles[i].y == particles[i+1].y ) {
        particles[i].vy = particles[i+1].vy = -(particles[i].vy + particles[i+1].vy);
        if ( particles[i].vy == 0 ) {
          particles[i+1].vy = ( Math.random() < FEVER_RATE ) ? -Math.abs(particles[i+1].vy) : Math.abs(particles[i+1].vy);
          particles[i].vy = Math.max(3, Math.floor(particles[i].speed * Math.random()));
          particles[i].vx = Math.floor(particles[i].speed * ( 2 * Math.random() - 1 ));
        } else {
          particles[i].vy = ( Math.random() < FEVER_RATE ) ? -Math.abs(particles[i].vy) : Math.abs(particles[i].vy);
          particles[i+1].vy = Math.max(3, Math.floor(particles[i+1].speed * Math.random()));
          particles[i+1].vx = Math.floor(particles[i+1].speed * ( 2 * Math.random() - 1 ));
        }
      }
    }
    var uy = Math.floor(bar.y + bar.h/2), ly = Math.floor(bar.y - bar.h/2);
    var ux = Math.floor(bar.x + bar.w/2), lx = Math.floor(bar.x - bar.w/2);
    var lb = 0, ub = particles.length -1;
    var cur = Math.floor((lb + ub) / 2);
    for ( var i = 0; i < 100; ++i ) {
      if ( particles[cur].y > ly ) {
        ub = cur;
      } else if ( particles[cur].y < ly ) {
        lb = cur;
      }
      cur = Math.floor((ub + lb) / 2);
    }
    for ( var i = cur; i < particles.length; ++i ) {
      if ( lx < particles[i].x && particles[i].x < ux && ly < particles[i].y && particles[i].y < uy ) {
        particles[i].vy = -Math.abs(particles[i].vy);
        particles[i].vx += (Math.random() < 0.5) ? -1 : 1;
      }
    }

    var margin = 50;
    context.beginPath();
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(-margin, -margin, 2*margin + FIELD_WIDTH, 2*margin + FIELD_HEIGHT);
    context.fill();
    bar.render(context);
    for ( var i = 0; i < particles.length; ++i ) {
      particles[i].render(context);
    }
    ++frame_count;
  };
  setInterval(main, 1000 / FPS);
});
