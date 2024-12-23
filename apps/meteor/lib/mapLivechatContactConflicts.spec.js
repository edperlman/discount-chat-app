"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mapLivechatContactConflicts_1 = require("./mapLivechatContactConflicts");
const sampleContact = {
    _id: 'any',
    name: 'Contact Name',
    createdAt: '',
    _updatedAt: '',
    channels: [],
};
describe('Map Livechat Contact Conflicts', () => {
    it('should return an empty object when the contact has no conflicts', () => {
        (0, chai_1.expect)((0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(Object.assign({}, sampleContact))).to.be.equal({});
    });
    it('should group conflicts of the same field in a single atribute', () => {
        (0, chai_1.expect)((0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(Object.assign(Object.assign({}, sampleContact), { name: '', conflictingFields: [
                {
                    field: 'name',
                    value: 'First Name',
                },
                {
                    field: 'name',
                    value: 'Second Name',
                },
            ] }))).to.be.deep.equal({
            name: {
                name: 'name',
                label: 'Name',
                values: ['First Name', 'Second Name'],
            },
        });
    });
    it('should include the current value from the contact on the list of values of the conflict', () => {
        (0, chai_1.expect)((0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(Object.assign(Object.assign({}, sampleContact), { name: 'Current Name', conflictingFields: [
                {
                    field: 'name',
                    value: 'First Name',
                },
                {
                    field: 'name',
                    value: 'Second Name',
                },
            ] }))).to.be.deep.equal({
            name: {
                name: 'name',
                label: 'Name',
                values: ['First Name', 'Second Name', 'Current Name'],
            },
        });
    });
    it('should have a separate attribute for each conflicting field', () => {
        (0, chai_1.expect)((0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(Object.assign(Object.assign({}, sampleContact), { conflictingFields: [
                {
                    field: 'name',
                    value: 'First Value',
                },
                {
                    field: 'name',
                    value: 'Second Value',
                },
                {
                    field: 'manager',
                    value: '1',
                },
                {
                    field: 'manager',
                    value: '2',
                },
            ] }))).to.be.deep.equal({
            name: {
                name: 'name',
                label: 'Name',
                values: ['First Name', 'Second Name', 'Contact Name'],
            },
            contactManager: {
                name: 'contactManager',
                label: 'Manager',
                values: ['1', '2'],
            },
        });
    });
    it('should map conflicts on custom fields too', () => {
        (0, chai_1.expect)((0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(Object.assign(Object.assign({}, sampleContact), { conflictingFields: [
                {
                    field: 'customFields.fullName',
                    value: 'Full Name 1',
                },
                {
                    field: 'customFields.fullName',
                    value: 'Full Name 2',
                },
            ] }), [{ name: 'fullName', type: 'text', label: 'Full Name' }])).to.be.deep.equal({
            fullName: {
                name: 'fullName',
                label: 'Full Name',
                values: ['Full Name 1', 'Full Name 2'],
            },
        });
    });
});
