'use strict';

var React = require('react');
// qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.
var QRCodeImpl = require('qr.js/lib/QRCode');
var ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');

function getBackingStorePixelRatio(ctx) {
  return ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
}

var getDOMNode;
// Super naive semver detection but it's good enough. We support 0.12, 0.13
// which both have getDOMNode on the ref. 0.14 and 15 make the DOM node the ref.
var version = React.version.split(/[.-]/);
if (version[0] === '0' && version[1] === '13' || version[1] === '12') {
  getDOMNode = function getDOMNode(ref) {
    return ref.getDOMNode();
  };
} else {
  getDOMNode = function getDOMNode(ref) {
    return ref;
  };
}

var QRCode = React.createClass({
  displayName: 'QRCode',

  propTypes: {
    value: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    level: React.PropTypes.oneOf(['L', 'M', 'Q', 'H']),
    bgColor: React.PropTypes.string,
    fgColor: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: 128,
      level: 'L',
      bgColor: '#FFFFFF',
      fgColor: '#000000'
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    var _this = this;

    return Object.keys(QRCode.propTypes).some(function (k) {
      return _this.props[k] !== nextProps[k];
    });
  },

  componentDidMount: function componentDidMount() {
    this.update();
  },

  componentDidUpdate: function componentDidUpdate() {
    this.update();
  },

  update: function update() {
    var _props = this.props;
    var value = _props.value;
    var size = _props.size;
    var level = _props.level;
    var bgColor = _props.bgColor;
    var fgColor = _props.fgColor;

    // We'll use type===-1 to force QRCode to automatically pick the best type

    var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(value);
    qrcode.make();

    var canvas = getDOMNode(this.refs.canvas);

    var ctx = canvas.getContext('2d');
    var cells = qrcode.modules;
    var tileW = size / cells.length;
    var tileH = size / cells.length;
    var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
    canvas.height = canvas.width = size * scale;
    ctx.scale(scale, scale);

    cells.forEach(function (row, rdx) {
      row.forEach(function (cell, cdx) {
        ctx.fillStyle = cell ? fgColor : bgColor;
        var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
        var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
        ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
      });
    });
  },

  render: function render() {
    return React.createElement('svg', {
      style: { height: this.props.size, width: this.props.size },
      height: this.props.size,
      width: this.props.size,
      ref: 'canvas'
    });
  }
});

module.exports = QRCode;