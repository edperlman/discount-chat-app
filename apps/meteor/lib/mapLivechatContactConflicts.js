"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLivechatContactConflicts = mapLivechatContactConflicts;
const fieldNameMap = {
    name: 'Name',
    contactManager: 'Contact_Manager',
};
function mapLivechatContactConflicts(contact, metadata = []) {
    var _a, _b, _c;
    if (!((_a = contact.conflictingFields) === null || _a === void 0 ? void 0 : _a.length)) {
        return {};
    }
    const conflicts = contact.conflictingFields.reduce((acc, current) => {
        var _a;
        const fieldName = current.field === 'manager' ? 'contactManager' : current.field.replace('customFields.', '');
        if (acc[fieldName]) {
            acc[fieldName].values.push(current.value);
        }
        else {
            acc[fieldName] = {
                name: fieldName,
                label: (current.field.startsWith('customFields.') && ((_a = metadata.find(({ name }) => name === fieldName)) === null || _a === void 0 ? void 0 : _a.label)) || fieldNameMap[fieldName],
                values: [current.value],
            };
        }
        return acc;
    }, {});
    // If there's a name conflict, add the current name to the conflict values as well
    if (((_b = conflicts.name) === null || _b === void 0 ? void 0 : _b.values.length) && contact.name) {
        conflicts.name.values.push(contact.name);
    }
    // If there's a manager conflict, add the current manager to the conflict values as well
    if (((_c = conflicts.contactManager) === null || _c === void 0 ? void 0 : _c.values.length) && contact.contactManager) {
        conflicts.contactManager.values.push(contact.contactManager);
    }
    return conflicts;
}
