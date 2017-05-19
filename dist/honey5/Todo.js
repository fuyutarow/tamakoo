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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardHeader, CardText, CardActions, Checkbox } from 'material-ui';
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Todo.prototype.render = function () {
        var styles = {
            block: {
                maxWidth: 250,
            },
            checkbox: {
                marginBottom: 16,
            },
        };
        return (React.createElement(MuiThemeProvider, null,
            React.createElement("p", null,
                React.createElement(Card, null,
                    React.createElement(CardHeader, { title: this.props.id }, "okok"),
                    React.createElement(CardText, null,
                        React.createElement("a", null, this.props.name)),
                    React.createElement(CardActions, null,
                        React.createElement(Checkbox, { label: "Simple", style: styles.checkbox }))))));
    };
    return Todo;
}(React.Component));
export default Todo;
//# sourceMappingURL=Todo.js.map