"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const faker_1 = require("@faker-js/faker");
const createToken_1 = require("../../../client/lib/utils/createToken");
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const omnichannel_contacts_list_1 = require("../page-objects/omnichannel-contacts-list");
const omnichannel_section_1 = require("../page-objects/omnichannel-section");
const test_1 = require("../utils/test");
const createContact = (generateToken = false) => ({
    id: null,
    name: `${faker_1.faker.person.firstName()} ${faker_1.faker.person.lastName()}`,
    email: faker_1.faker.internet.email().toLowerCase(),
    phone: faker_1.faker.phone.number('+############'),
    token: generateToken ? (0, createToken_1.createToken)() : null,
    customFields: {},
});
const NEW_CONTACT = createContact();
const EDIT_CONTACT = createContact();
const EXISTING_CONTACT = createContact(true);
const NEW_CUSTOM_FIELD = {
    searchable: true,
    field: 'hiddenCustomField',
    label: 'hiddenCustomField',
    defaultValue: 'test_contact_center_hidden_customField',
    scope: 'visitor',
    visibility: 'hidden',
    required: true,
    regexp: '',
};
const URL = {
    contactCenter: '/omnichannel-directory/contacts',
    newContact: '/omnichannel-directory/contacts/new',
    get editContact() {
        return `${this.contactCenter}/edit/${NEW_CONTACT.id}`;
    },
    get contactInfo() {
        return `${this.contactCenter}/details/${NEW_CONTACT.id}`;
    },
};
const ERROR = {
    nameRequired: 'Name required',
    invalidEmail: 'Invalid email address',
    emailRequired: 'Email required',
    phoneRequired: 'Phone required',
};
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('Omnichannel Contact Center', () => {
    let poContacts;
    let poOmniSection;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // Add a contact
        const { id: _ } = EXISTING_CONTACT, data = __rest(EXISTING_CONTACT, ["id"]);
        yield api.post('/omnichannel/contacts', data);
        if (constants_1.IS_EE) {
            yield api.post('/livechat/custom.field', NEW_CUSTOM_FIELD);
        }
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // Remove added contacts
        yield api.delete(`/livechat/visitor/${EXISTING_CONTACT.token}`);
        yield api.delete(`/livechat/visitor/${NEW_CONTACT.token}`);
        if (constants_1.IS_EE) {
            yield api.post('method.call/livechat:removeCustomField', { message: NEW_CUSTOM_FIELD.field });
        }
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poContacts = new omnichannel_contacts_list_1.OmnichannelContacts(page);
        poOmniSection = new omnichannel_section_1.OmnichannelSection(page);
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api
            .get('/omnichannel/contacts.search', { searchText: NEW_CONTACT.phone })
            .then((res) => res.json())
            .then((res) => {
            var _a, _b, _c, _d;
            NEW_CONTACT.token = (_b = (_a = res.contacts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.token;
            NEW_CONTACT.id = (_d = (_c = res.contacts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d._id;
        });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/');
        yield poOmniSection.btnContactCenter.click();
        yield poOmniSection.tabContacts.click();
        yield page.waitForURL(URL.contactCenter);
    }));
    (0, test_1.test)('Add new contact', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('cancel button', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.btnNewContact.click();
            yield page.waitForURL(URL.newContact);
            yield (0, test_1.expect)(poContacts.newContact.inputName).toBeVisible();
            yield poContacts.newContact.btnCancel.click();
            yield page.waitForURL(URL.contactCenter);
            yield (0, test_1.expect)(poContacts.newContact.inputName).not.toBeVisible();
        }));
        yield test_1.test.step('open contextual bar', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.btnNewContact.click();
            yield page.waitForURL(URL.newContact);
            yield (0, test_1.expect)(poContacts.newContact.inputName).toBeVisible();
        }));
        yield test_1.test.step('input name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.inputName.fill(NEW_CONTACT.name);
        }));
        yield test_1.test.step('validate email format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.btnAddEmail.click();
            yield poContacts.newContact.inputEmail.fill('invalidemail');
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.invalidEmail)).toBeVisible();
        }));
        yield test_1.test.step('input email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.inputEmail.fill(NEW_CONTACT.email);
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.invalidEmail)).not.toBeVisible();
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.emailRequired)).not.toBeVisible();
        }));
        yield test_1.test.step('input phone', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.btnAddPhone.click();
            yield poContacts.newContact.inputPhone.fill(NEW_CONTACT.phone);
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.phoneRequired)).not.toBeVisible();
        }));
        yield test_1.test.step('save new contact', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poContacts.newContact.btnSave).toBeEnabled();
            yield poContacts.newContact.btnSave.click();
            yield poContacts.inputSearch.fill(NEW_CONTACT.name);
            yield (0, test_1.expect)(poContacts.findRowByName(NEW_CONTACT.name)).toBeVisible();
        }));
    }));
    (0, test_1.test)('Edit new contact', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('search contact and open contextual bar', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.inputSearch.fill(NEW_CONTACT.name);
            const row = poContacts.findRowByName(NEW_CONTACT.name);
            yield (0, test_1.expect)(row).toBeVisible();
            yield row.click();
            yield page.waitForURL(URL.contactInfo);
        }));
        yield test_1.test.step('cancel button', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.btnEdit.click();
            yield page.waitForURL(URL.editContact);
            yield poContacts.contactInfo.btnCancel.click();
            yield page.waitForURL(URL.contactInfo);
        }));
        yield test_1.test.step('edit contact', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.btnEdit.click();
            yield page.waitForURL(URL.editContact);
        }));
        yield test_1.test.step('initial values', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poContacts.contactInfo.inputName).toHaveValue(NEW_CONTACT.name);
            yield (0, test_1.expect)(poContacts.contactInfo.inputEmail).toHaveValue(NEW_CONTACT.email);
            yield (0, test_1.expect)(poContacts.contactInfo.inputPhone).toHaveValue(NEW_CONTACT.phone);
        }));
        yield test_1.test.step('validate email format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.inputEmail.fill('invalidemail');
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.contactInfo.getErrorMessage(ERROR.invalidEmail)).toBeVisible();
        }));
        yield test_1.test.step('validate name is required', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.inputName.clear();
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.contactInfo.getErrorMessage(ERROR.nameRequired)).toBeVisible();
        }));
        yield test_1.test.step('edit name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.inputName.fill(EDIT_CONTACT.name);
        }));
        yield test_1.test.step('input phone ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.inputPhone.fill(EDIT_CONTACT.phone);
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.phoneRequired)).not.toBeVisible();
        }));
        yield test_1.test.step('input email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.newContact.inputEmail.fill(EDIT_CONTACT.email);
            yield page.keyboard.press('Tab');
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.invalidEmail)).not.toBeVisible();
            yield (0, test_1.expect)(poContacts.newContact.getErrorMessage(ERROR.emailRequired)).not.toBeVisible();
        }));
        yield test_1.test.step('save new contact ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poContacts.contactInfo.btnSave.click();
            yield poContacts.inputSearch.fill(EDIT_CONTACT.name);
            yield (0, test_1.expect)(poContacts.findRowByName(EDIT_CONTACT.name)).toBeVisible();
        }));
    }));
});
