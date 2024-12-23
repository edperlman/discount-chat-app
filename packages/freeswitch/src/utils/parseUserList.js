"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserList = parseUserList;
function parseUserList(commandResponse) {
    const { _body: text } = commandResponse;
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid response from FreeSwitch server.');
    }
    const lines = text.split('\n');
    const columnsLine = lines.shift();
    if (!columnsLine) {
        throw new Error('Invalid response from FreeSwitch server.');
    }
    const columns = columnsLine.split('|');
    const users = new Map();
    for (const line of lines) {
        const values = line.split('|');
        if (!values.length || !values[0]) {
            continue;
        }
        const user = Object.fromEntries(values.map((value, index) => {
            return [(columns.length > index && columns[index]) || `column${index}`, value];
        }));
        if (!user.userid || user.userid === '+OK') {
            continue;
        }
        const { group } = user, newUserData = __rest(user, ["group"]);
        const existingUser = users.get(user.userid);
        const groups = ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.groups) || []);
        if (group && !groups.includes(group)) {
            groups.push(group);
        }
        users.set(user.userid, Object.assign(Object.assign({}, (users.get(user.userid) || newUserData)), { groups }));
    }
    return [...users.values()].map((user) => (Object.assign(Object.assign({}, user), { groups: user.groups.join('|') })));
}
