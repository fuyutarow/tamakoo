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
import { AppBar, MenuItem, Drawer } from 'material-ui';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import { red500 } from 'material-ui/styles/colors';
var NavBar = (function (_super) {
    __extends(NavBar, _super);
    function NavBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavBar.prototype.render = function () {
        var _this = this;
        var iconStyles = {
            marginRight: 24,
        };
        return (React.createElement(MuiThemeProvider, null,
            React.createElement("div", null,
                React.createElement(Drawer, { docked: false, width: 200, open: this.props.open, onRequestChange: function () { return _this.props.onToggle(); } },
                    React.createElement(MenuItem, null, "React"),
                    React.createElement(MenuItem, null, "Redux"),
                    React.createElement(MenuItem, null, "React Router"),
                    React.createElement(MenuItem, null, "Material UI"),
                    React.createElement(MenuItem, null, "Electron")),
                React.createElement(AppBar, { title: "React Study", onLeftIconButtonTouchTap: function () { return _this.props.onToggle(); }, iconElementRight: React.createElement("a", { target: "_blank", href: "http://localhost:8080/dist/" },
                        React.createElement(ActionFlightTakeoff, { style: iconStyles, color: red500 })) }))));
    };
    return NavBar;
}(React.Component));
export default NavBar;
//# sourceMappingURL=NavBar.js.map