'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Bubble Matrix v0.0.4
 *
 * Displays the an bubble matrix
 *
 * This constructor expects an options object with the following structure:
 *
 * @param {object}      options:       An object with the matrix options.
 * @param {HTMLElement} options.root:  The container's DOM element.
 * @param {string}      options.selector:    The selector of the container to be use.
 * @param {number}      options.width: The width of the canvas, not the matrix.
 * @param {number}      options.height:    The height of the canvas, not the matrix.
 * @param {number}      options.maxRadius: The radius of the circles.
 * @param {function}    options.onClick:  The function to trigger when click a bubble.
 * @param {number}      options.maxColors: The numbers of colors to used.
 * @param {boolean}     options.reverseColor:  Reverse the color scale.
 * @param {object}      options.padding: Padding for the matrix.
 * @param {function}    options.tooltip: Function to show tooltip, need to have show and hide method.
 * @param {boolean}     options.hideTooltip: Hide the tooltip for the bubbles.
 * @param {object}      options.classNames: The names of the classes used for each element.
 * @param {boolean}     options.hideLeftTitle: Hide the left title.
 * @param {boolean}     options.hideRightTitle: Hide the right title.
 * @param {boolean}     options.hideTopTitle: Hide the top title.
 * @param {boolean}     options.hideBottomTitle: Hide the bottom title.
 * @param {boolean}     options.duration: The duration of the animation.
 */

var BubbleMatrix = function () {
  function BubbleMatrix(options) {
    _classCallCheck(this, BubbleMatrix);

    if (!options.root && !options.selector) {
      throw 'Missing root or id';
    }
    this.selection = options.root || d3.select(options.selector);
    this.onClick = options.onClick || false;
    this.hideLeftTitle = options.hideLeftTitle || false;
    this.hideRightTitle = options.hideRightTitle || false;
    this.hideTopTitle = options.hideTopTitle || false;
    this.hideBottomTitle = options.hideBottomTitle || false;
    this.duration = options.duration || 2000;
    // Constants
    this.HORIZONTAL_PADDING = 0.5;
    this.VERTICAL_PADDING = 0.5;
    this.MAX_RADIUS = options.maxRadius || 26;
    this.MAX_COLORS = options.maxColors || 9;
    this.PADDING = options.padding || { top: 20, right: 0, bottom: 20, left: 10 };
    this.RECT_SIZE = this.MAX_RADIUS * 2;
    this.COLOR_DOMAIN = options.reverseColor ? [1, 0] : [0, 1];
    this.CLASS = options.classNames || {
      bubbleMatrix: 'bubble-matrix',
      leftRows: 'left-rows',
      rightRows: 'right-rows',
      horizontalLines: 'horizontal-lines',
      verticalLines: 'vertical-lines',
      row: 'row',
      column: 'column',
      topColumns: 'top-columns',
      bottomColumns: 'bottom-columns',
      rects: 'rects',
      bubbles: 'bubbles',
      color: 'bubble-color-'
    };

    var clientWidth = this.selection.node().parentNode.clientWidth;
    var clientHeight = this.selection.node().parentNode.clientHeight;

    var width = parseInt(options.width, 10) || clientWidth;
    var height = parseInt(options.height, 10) || clientHeight;

    // Create the matrix canvas.
    this.container = this.selection.append('svg').attr('class', this.CLASS.bubbleMatrix).attr('width', width).attr('height', height);

    this.width = width - this.PADDING.right - this.PADDING.left;
    this.height = height - this.PADDING.bottom - this.PADDING.top;

    this.events = {};
    this.hideTooltip = options.hideTooltip || false;

    if (!this.hideTooltip) {
      this.tooltip = options.tooltip || d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function (value) {
        return 'Value: ' + value;
      });
      // Invoke the tip in the context of your visualization
      this.container.call(this.tooltip);

      this.events.mouseover = this.tooltip.show;
      this.events.mouseout = this.tooltip.hide;
    }
    if (this.onClick) {
      this.events.click = this.onClick.bind(this);
    }
  }

  _createClass(BubbleMatrix, [{
    key: 'init',
    value: function init() {
      this.columns = this.data.columns;
      this.rows = this.data.rows;
      this.scale = {};

      this.scale.y = d3.scale.ordinal().domain(d3.range(0, this.rows.length)).rangePoints([0, this.height], this.VERTICAL_PADDING);

      this.scale.color = d3.scale.quantize().domain(this.COLOR_DOMAIN).range(d3.range(1, this.MAX_COLORS + 1));

      this.scale.radius = d3.scale.sqrt().range([0, this.MAX_RADIUS]);
      return this;
    }
  }, {
    key: 'initScaleX',
    value: function initScaleX() {
      var start = 0;
      if (!this.hideLeftTitle) {
        var leftWidth = d3.select('.' + this.CLASS.leftRows).node().getBBox().width;
        start = leftWidth + this.PADDING.left;
      }
      var rightWidth = this.hideRightTitle ? 0 : d3.select('.' + this.CLASS.rightRows).node().getBBox().width;
      var end = this.width - rightWidth + this.PADDING.left;
      this.scale.x = d3.scale.ordinal().domain(d3.range(0, this.columns.length)).rangePoints([start, end], this.HORIZONTAL_PADDING);

      return this;
    }

    /**
     * Draw the bubble matrix.
     */

  }, {
    key: 'draw',
    value: function draw(data) {
      if (!data) {
        throw 'Missing data';
      }
      this.data = data;
      this.init().drawLeftRows().drawRightRows().initScaleX().drawBackground().drawTopColumns().drawBottomColumns().drawRects().drawBubbles();
    }

    /**
     * Draw horizontal and vertical lines.
     */

  }, {
    key: 'drawBackground',
    value: function drawBackground() {
      var _this2 = this;

      // horizontal lines
      this.container.append('g').attr('class', this.CLASS.horizontalLines).selectAll('line').data(this.rows).enter().append('line').attr('x1', this.scale.x(0)).attr('y1', function (_, i) {
        return _this2.scale.y(i) + _this2.PADDING.top;
      }).attr('x2', this.scale.x(0)).attr('y2', function (_, i) {
        return _this2.scale.y(i) + _this2.PADDING.top;
      }).transition().duration(this.duration / 2).attr('x2', this.scale.x(this.columns.length - 1));

      // vertical lines
      this.container.append('g').attr('class', this.CLASS.verticalLines).selectAll('line').data(this.columns).enter().append('line').attr('x1', function (_, i) {
        return _this2.scale.x(i);
      }).attr('y1', function (_, i) {
        return _this2.scale.y(0);
      }).attr('x2', function (_, i) {
        return _this2.scale.x(i);
      }).attr('y2', function (_, i) {
        return _this2.scale.y(0);
      }).transition().duration(this.duration / 2).attr('y2', function (_, i) {
        return _this2.scale.y(_this2.rows.length - 1);
      });

      return this;
    }

    /**
     * Draw the left rows of the matrix.
     */

  }, {
    key: 'drawLeftRows',
    value: function drawLeftRows() {
      var _this3 = this;

      if (this.hideLeftTitle) return this;
      this.container.append('g').attr('class', this.CLASS.leftRows).selectAll('text').data(this.rows).enter().append('text').attr('class', this.CLASS.row).attr('x', this.PADDING.left).attr('y', function (_, i) {
        return _this3.scale.y(i) + _this3.PADDING.top;
      }).attr('dy', 5).text(function (row) {
        return row.name;
      });
      return this;
    }

    /**
     * Draw the right rows of the matrix.
     */

  }, {
    key: 'drawRightRows',
    value: function drawRightRows() {
      var _this4 = this;

      if (this.hideRightTitle) return this;
      var leftWidth = this.hideLeftTitle ? 0 : d3.select('.' + this.CLASS.leftRows).node().getBBox().width;

      this.container.append('g').attr('class', this.CLASS.rightRows).selectAll('text').data(this.rows).enter().append('text').attr('class', this.CLASS.row).attr('x', function (_, i) {
        return _this4.width + _this4.PADDING.right + _this4.PADDING.left;
      }).attr('y', function (_, i) {
        return _this4.scale.y(i) + _this4.PADDING.top;
      }).attr('dy', 5).text(function (row) {
        return row.name;
      });

      return this;
    }

    /**
     * Draw the top columns of the matrix.
     */

  }, {
    key: 'drawTopColumns',
    value: function drawTopColumns() {
      var _this5 = this;

      if (this.hideTopTitle) return this;

      this.container.append('g').attr('class', this.CLASS.topColumns).selectAll('text').data(this.columns).enter().append('text').attr('class', this.CLASS.column).attr('x', function (_, i) {
        return _this5.scale.x(i);
      }).attr('y', this.PADDING.top).text(function (date) {
        return date;
      });

      return this;
    }

    /**
     * Draw the bottom columns of the matrix.
     */

  }, {
    key: 'drawBottomColumns',
    value: function drawBottomColumns() {
      var _this6 = this;

      if (this.hideBottomTitle) return this;

      this.container.append('g').attr('class', this.CLASS.bottomColumns).selectAll('text').data(this.columns).enter().append('text').attr('class', this.CLASS.column).attr('x', function (_, i) {
        return _this6.scale.x(i);
      }).attr('y', this.height + this.PADDING.bottom + this.PADDING.top).text(function (date) {
        return date;
      });

      return this;
    }

    /**
     * Draw the rects of the matrix.
     */

  }, {
    key: 'drawRects',
    value: function drawRects() {
      var _this7 = this;

      var _this = this;
      var bubbles = this.container.append('g').attr('class', this.CLASS.rects);

      var _loop = function _loop(index) {
        var row = _this7.rows[index];
        var bubble = bubbles.append('g').attr('class', _this7.CLASS.row).selectAll('rect').data(row.values).enter();

        bubble.append('rect').attr('y', function (d) {
          return _this7.scale.y(index) + _this7.PADDING.top - _this7.RECT_SIZE / 2;
        }).attr('x', function (d, i) {
          return _this7.scale.x(i) - _this7.RECT_SIZE / 2;
        }).attr('width', _this7.RECT_SIZE).attr('height', _this7.RECT_SIZE).on(_this7.events);
      };

      for (var index = 0; index < this.rows.length; index++) {
        _loop(index);
      }
      return this;
    }

    /**
     * Draw the bubble of the matrix.
     */

  }, {
    key: 'drawBubbles',
    value: function drawBubbles() {
      var _this8 = this;

      var _this = this;
      var bubbles = this.container.append('g').attr('class', this.CLASS.bubbles);

      var _loop2 = function _loop2(index) {
        var row = _this8.rows[index];
        var bubble = bubbles.append('g').attr('class', _this8.CLASS.row).selectAll('circle').data(row.values).enter();

        bubble.append('circle').attr('class', function (d) {
          return _this8.CLASS.color + _this8.scale.color(d);
        }).attr('cy', function () {
          return _this8.scale.y(index) + _this8.PADDING.top;
        }).attr('cx', function (_, i) {
          return _this8.scale.x(i);
        }).attr('r', 0).on(_this8.events).on('mouseenter', function () {
          d3.select(this).transition().attr('r', function (d) {
            return _this.scale.radius(d) * 1.2;
          });
        }).on('mouseleave', function () {
          d3.select(this).transition().attr('r', function (d) {
            return _this.scale.radius(d);
          });
        }).transition().duration(_this8.duration).attr('r', function (d) {
          return _this8.scale.radius(d);
        });
      };

      for (var index = 0; index < this.rows.length; index++) {
        _loop2(index);
      }
      return this;
    }
  }]);

  return BubbleMatrix;
}();