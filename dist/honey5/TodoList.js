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
import Todo from './Todo';
var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TodoList.prototype.render = function () {
        var tasks = this.props.tasks
            .map(function (a) {
            return React.createElement(Todo, { id: a.id, name: a.name });
        });
        return (React.createElement("div", null, tasks));
    };
    return TodoList;
}(React.Component));
export default TodoList;
//# sourceMappingURL=TodoList.js.map