import * as ObjectAssign from 'object-assign';
import * as Immutable from 'immutable';
var W = 19;
var H = 19;
var ActionTypes = (function () {
    function ActionTypes() {
    }
    return ActionTypes;
}());
export { ActionTypes };
ActionTypes.INCREMENT = 'honey5/increment';
ActionTypes.RED = 'honey5/red';
ActionTypes.BLUE = 'honey5/blue';
ActionTypes.UNDO = 'honey5/undo';
ActionTypes.ADD_TASK = 'honey5/addTask';
ActionTypes.OPEN = 'honey5/open';
var INITIAL_STATE = {
    position: 0,
    cells: Immutable.Range(0, W * H).toArray().map(function () { return 0; }),
    step: 0,
    record: [0],
    tasks: [{ id: 0, name: "test" }],
    open: false,
};
export default function reducer(state, action) {
    if (state === void 0) { state = INITIAL_STATE; }
    switch (action.type) {
        case ActionTypes.RED:
            var redCells = state.cells
                .map(function (value, idx) {
                return (idx % W == action.position % W && Math.floor(idx / W) == Math.floor(action.position / W)) ? 1 : value;
            });
            var redRecord = state.record;
            redRecord.push(action.position);
            return ObjectAssign({}, state, { cells: redCells, step: state.step + 1, record: redRecord });
        case ActionTypes.BLUE:
            var blueCells = state.cells
                .map(function (value, idx) {
                return (idx % W == action.position % W && Math.floor(idx / W) == Math.floor(action.position / W)) ? -1 : value;
            });
            var blueRecord = state.record;
            blueRecord.push(action.position);
            return ObjectAssign({}, state, { cells: blueCells, step: state.step + 1, record: blueRecord });
        case ActionTypes.UNDO:
            if (state.step <= 0) {
                return ObjectAssign({}, state, { step: 0 });
            }
            var undoRecord = state.record;
            var lastRecord_1 = undoRecord.pop();
            var boobyRecord_1 = undoRecord.pop();
            var undoCells = state.cells
                .map(function (value, idx) {
                return (idx % W == lastRecord_1 % W && Math.floor(idx / W) == Math.floor(lastRecord_1 / W)) ? 0 : value;
            })
                .map(function (value, idx) {
                return (idx % W == boobyRecord_1 % W && Math.floor(idx / W) == Math.floor(boobyRecord_1 / W)) ? 0 : value;
            });
            return ObjectAssign({}, state, { cells: undoCells, step: state.step - 2, record: undoRecord });
        case ActionTypes.ADD_TASK:
            var newTasks = state.tasks;
            newTasks.push({ id: state.tasks.length, name: action.name });
            return ObjectAssign({}, state, { tasks: newTasks });
        case ActionTypes.OPEN:
            return ObjectAssign({}, state, { open: !state.open });
        default:
            return state;
    }
}
var ActionDispatcher = (function () {
    function ActionDispatcher(dispatch) {
        this.dispatch = dispatch;
    }
    ActionDispatcher.prototype.red = function (position) {
        this.dispatch({ type: ActionTypes.RED, position: position });
    };
    ActionDispatcher.prototype.blue = function (position) {
        this.dispatch({ type: ActionTypes.BLUE, position: position });
    };
    ActionDispatcher.prototype.undo = function () {
        this.dispatch({ type: ActionTypes.UNDO });
    };
    ActionDispatcher.prototype.addTask = function (name) {
        this.dispatch({ type: ActionTypes.ADD_TASK, name: name });
    };
    ActionDispatcher.prototype.open = function () {
        this.dispatch({ type: ActionTypes.OPEN });
    };
    return ActionDispatcher;
}());
export { ActionDispatcher };
//# sourceMappingURL=module.js.map