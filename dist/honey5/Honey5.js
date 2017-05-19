var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Immutable from 'immutable';
import Queenbee from './honey5-ai';
var Bee = new Queenbee;
import TodoList from './TodoList';
import NavBar from './NavBar';
var TPI = 2 * Math.PI;
var INTERVAL = 30;
var R = INTERVAL / (Math.cos(TPI / 12) * 2);
var W = 19;
var H = 19;
var p2honeyXY = function (p) { return { x: p % W, y: Math.floor(p / W) }; };
var hoenyXY2mouseXY = function (x, y) {
    return { x: y % 2 == 0 ? (x + 1) * INTERVAL : (x + 1.5) * INTERVAL, y: (y + 1) * R * 3 / 2 };
};
var p2mouseXY = function (p) {
    var mouseXY = hoenyXY2mouseXY(p2honeyXY(p).x, p2honeyXY(p).y);
    return { x: mouseXY.x, y: mouseXY.y };
};
var L2 = function (x, y) { return Math.sqrt(x * x + y * y); };
var Honey5 = (function (_super) {
    __extends(Honey5, _super);
    function Honey5() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Honey5.prototype.componentWillMount = function () {
        this.gameState = "play";
        this.props.actions.red(9 + 9 * W);
    };
    Honey5.prototype.shouldComponentUpdate = function () {
        return (this.gameState == "play") ? true : false;
    };
    Honey5.prototype.addTask = function () {
        var task = ReactDOM.findDOMNode(this.refs.task).value;
        this.props.actions.addTask(task);
        ReactDOM.findDOMNode(this.refs.task).value = "";
    };
    Honey5.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(NavBar, { onToggle: function () { return _this.props.actions.open(); }, open: this.props.state.open }),
            React.createElement(TodoList, { tasks: this.props.state.tasks }),
            React.createElement("p", null,
                React.createElement("input", { type: 'text', ref: 'task' }),
                React.createElement("button", { onClick: function () { return _this.addTask(); } }, "add")),
            React.createElement("p", null,
                React.createElement("button", { onClick: function () { return _this.props.actions.undo(); } }, "UNDO")),
            React.createElement("canvas", { ref: "myCanvas" })));
    };
    Honey5.prototype.componentDidMount = function () {
        var _this = this;
        var canvas = this.refs.myCanvas;
        var ctx = canvas.getContext('2d');
        canvas.width = (W + 1) * INTERVAL;
        canvas.height = (W + 1) * INTERVAL;
        ctx.fillStyle = '#ffff33';
        var Hex = function (x, y, r) {
            ctx.beginPath();
            ctx.moveTo(x + r * Math.cos(TPI / 4), y + r * Math.sin(TPI / 4));
            Immutable.Range(1, 6).toArray().map(function (i) {
                ctx.lineTo(x + r * Math.cos(i * TPI / 6 + TPI / 4), y + r * Math.sin(i * TPI / 6 + TPI / 4));
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        var honeyCombCoordinates = Immutable.Range(0, W * H).toArray()
            .map(function (n) { return p2mouseXY(n); });
        honeyCombCoordinates
            .map(function (a) { return Hex(a.x, a.y, R); });
        canvas.onmousedown = function (e) {
            var L2 = function (x, y) { return Math.sqrt(x * x + y * y); };
            var mouse2honey = function (mouseX, mouseY) {
                var p = (honeyCombCoordinates
                    .map(function (a, idx) { return Math.floor(L2(a.x - mouseX, a.y - mouseY) * 1000) * 1000 + idx; })
                    .reduce(function (a, b) { return Math.min(a, b); })) % 1000;
                return p;
            };
            var honeyP = mouse2honey(e.offsetX, e.offsetY);
            if (_this.props.state.step % 2 == 1 && _this.props.state.cells[honeyP] == 0) {
                _this.props.actions.blue(honeyP);
            }
        };
    };
    Honey5.prototype.componentDidUpdate = function () {
        var _this = this;
        var canvas = this.refs.myCanvas;
        var ctx = canvas.getContext('2d');
        var Hex = function (x, y, r) {
            ctx.beginPath();
            ctx.moveTo(x + r * Math.cos(TPI / 4), y + r * Math.sin(TPI / 4));
            Immutable.Range(1, 6).toArray().map(function (i) {
                ctx.lineTo(x + r * Math.cos(i * TPI / 6 + TPI / 4), y + r * Math.sin(i * TPI / 6 + TPI / 4));
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        var honeyComb = Immutable.Range(0, W * H).toArray()
            .map(function (p) {
            switch (_this.props.state.cells[p]) {
                case 0:
                    ctx.fillStyle = '#ffff22';
                    break;
                case 1:
                    ctx.fillStyle = '#ff2222';
                    break;
                case -1:
                    ctx.fillStyle = '#2222ff';
                    break;
                default: ctx.fillStyle = '#ffffff';
            }
            ;
            Hex(p2mouseXY(p).x, p2mouseXY(p).y, R);
        });
        if (this.props.state.step % 2 == 0) {
            Bee.readCells(this.props.state.cells);
            var p_1 = Bee.greedy();
            var lastRecord = this.props.state.record[this.props.state.record.length - 1];
            setTimeout(function () { return _this.props.actions.red(p_1); }, 1000);
        }
        var nextXY = function (x, y, op) {
            switch (op) {
                case "upperleft": return y % 2 ? [x, y - 1] : [x - 1, y - 1];
                case "upperright": return y % 2 ? [x + 1, y - 1] : [x, y - 1];
                case "left": return y % 2 ? [x - 1, y] : [x - 1, y];
                case "right": return y % 2 ? [x + 1, y] : [x + 1, y];
                case "lowerleft": return y % 2 ? [x, y + 1] : [x - 1, y + 1];
                case "lowerright": return y % 2 ? [x + 1, y + 1] : [x, y + 1];
                default: return [x, y];
            }
        };
        var opNtimes = function (p, op, n) {
            if (n < 0)
                return 0;
            var nextX = nextXY(p2honeyXY(p).x, p2honeyXY(p).y, op)[0];
            var nextY = nextXY(p2honeyXY(p).x, p2honeyXY(p).y, op)[1];
            var nextP = nextX + nextY * W;
            if (nextX < 0 || nextX > 19 || nextY < 0 || nextY > 19)
                return 0;
            return opNtimes(nextP, op, n - 1) + _this.props.state.cells[nextP];
        };
        var p = this.props.state.record[this.props.state.record.length - 1];
        var scores = Immutable.Range(0, 4).toArray()
            .map(function (n) {
            return [opNtimes(p, "upperleft", n) + _this.props.state.cells[p] + opNtimes(p, "lowerright", 4 - n),
                opNtimes(p, "upperright", n) + _this.props.state.cells[p] + opNtimes(p, "lowerleft", 4 - n),
                opNtimes(p, "left", n) + _this.props.state.cells[p] + opNtimes(p, "right", 4 - n),];
        })
            .reduce(function (a, b) { return a.concat(b); })
            .filter(function (a) { return !(isNaN((a))); });
        var redScore = scores.reduce(function (a, b) { return Math.max(a, b); });
        var blueScore = scores.reduce(function (a, b) { return Math.min(a, b); });
        ctx.fillStyle = "#000000";
        ctx.font = "80pt Arial";
        ctx.textAlign = "center";
        var WIDTH = (W + 1) * INTERVAL;
        var HEIGHT = (H + 1) * INTERVAL;
        if (redScore == 5) {
            this.gameState = "GameOver";
            ctx.fillText("Red win!", WIDTH / 2, HEIGHT / 2);
            console.log(this.gameState);
        }
        if (blueScore == -5) {
            this.gameState = "GameOver";
            ctx.fillText("Blue win", WIDTH / 2, HEIGHT / 2);
        }
    };
    return Honey5;
}(React.Component));
export { Honey5 };
//# sourceMappingURL=Honey5.js.map