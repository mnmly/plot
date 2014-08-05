var map = require('remap');

module.exports = Plot;

function Plot(name, min, max) {
  this.el = this._createElement();
  this.min = min || 0;
  this.max = max || 1;

  this.label = this.el.querySelector('.plot-label');
  this.label.textContent = name;

  this.canvas = this.el.querySelector('canvas');
  this.canvas.width = this.width();
  this.canvas.height = this.height();

  this.context = this.canvas.getContext('2d');

  this.pool = new Array(300);
  this.color = '#ddd';
}

Plot.prototype._width = 300;
Plot.prototype._height = 200;
Plot.prototype.padding = 10;

Plot.prototype.poolSize = function(size) {
  this.pool.length = size;
};

Plot.prototype.width = function(v) {
  if (arguments.length) {
    this._width = v;
    this.canvas.width = this._width;
  } else {
    return this._width;
  }
};

Plot.prototype.height = function(v) {
  if (arguments.length) {
    this._height = v;
    this.canvas.height = this._height;
  } else {
    return this._height;
  }
};

Plot.prototype.appendTo = function(p) {
  p.appendChild(this.el);
};

Plot.prototype.draw = function() {

  var self = this;
  var len = this.pool.length;
  var yMin = this.padding;
  var yMax = this._height - this.padding;
  var xMin = this.padding;
  var xMax = this._width - this.padding;
  var ctx = this.context;
  
  ctx.clearRect(0, 0, this._width, this._height);
  ctx.beginPath();
  ctx.lineWidth = 2.0;
  ctx.strokeStyle = this.color;
  this.pool.forEach(function(v, i) {
    var x = map(i, 0, len, xMin, xMax);
    var y = map(v, self.min, self.max, yMin, yMax);
    if(!i) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    if(i === len - 1) {
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = self.color;
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

Plot.prototype.capture = function(v) {
  this.pool.push(v);
  this.pool.shift();
};

Plot.prototype._createElement = function() {
  var el = document.createElement('div');
  var label = document.createElement('div');
  var canvas = document.createElement('canvas');
  el.className = 'plot';
  label.className = 'plot-label';
  el.appendChild(label);
  el.appendChild(canvas);
  return el;
};
