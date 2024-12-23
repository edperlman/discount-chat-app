"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBox = void 0;
class MessageBoxActions {
    constructor() {
        this.actions = new Map();
    }
    add(group, label, config) {
        var _a, _b;
        if (!group && !label && !config) {
            return;
        }
        if (!this.actions.has(group)) {
            this.actions.set(group, []);
        }
        const actionExists = (_a = this.actions.get(group)) === null || _a === void 0 ? void 0 : _a.find((action) => action.label === label);
        if (actionExists) {
            return;
        }
        (_b = this.actions.get(group)) === null || _b === void 0 ? void 0 : _b.push(Object.assign(Object.assign({}, config), { label }));
    }
    remove(group, expression) {
        var _a;
        if (!group || !this.actions.get(group)) {
            return false;
        }
        this.actions.set(group, ((_a = this.actions.get(group)) === null || _a === void 0 ? void 0 : _a.filter((action) => !expression.test(action.id))) || []);
        return this.actions.get(group);
    }
    get(group) {
        var _a;
        if (!group) {
            return [...this.actions.entries()].reduce((ret, [group, actions]) => {
                const filteredActions = actions.filter((action) => !action.condition || action.condition());
                if (filteredActions.length) {
                    ret[group] = filteredActions;
                }
                return ret;
            }, {});
        }
        return (_a = this.actions.get(group)) === null || _a === void 0 ? void 0 : _a.filter((action) => !action.condition || action.condition());
    }
    getById(id) {
        return Object.values(this.actions)
            .flat()
            .filter((action) => action.id === id);
    }
}
exports.messageBox = {
    actions: new MessageBoxActions(),
};
