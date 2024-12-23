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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('email-inboxes', () => {
    let poAdminEmailInboxes;
    let poUtils;
    const email = faker_1.faker.internet.email();
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAdminEmailInboxes = new page_objects_1.AdminEmailInboxes(page);
        poUtils = new page_objects_1.Utils(page);
        yield page.goto('/admin/email-inboxes');
    }));
    (0, test_1.test)('expect create an email inbox', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poAdminEmailInboxes.btnNewEmailInbox.click();
        const name = faker_1.faker.person.firstName();
        yield poAdminEmailInboxes.inputName.type(name);
        yield poAdminEmailInboxes.inputEmail.type(email);
        // SMTP
        yield poAdminEmailInboxes.inputSmtpServer.type(faker_1.faker.internet.domainName());
        yield poAdminEmailInboxes.inputSmtpUsername.type(faker_1.faker.internet.userName());
        yield poAdminEmailInboxes.inputSmtpPassword.type(faker_1.faker.internet.password());
        yield poAdminEmailInboxes.inputSmtpSecure.click();
        // IMAP
        yield poAdminEmailInboxes.inputImapServer.type(faker_1.faker.internet.domainName());
        yield poAdminEmailInboxes.inputImapUsername.type(faker_1.faker.internet.userName());
        yield poAdminEmailInboxes.inputImapPassword.type(faker_1.faker.internet.password());
        yield poAdminEmailInboxes.inputImapSecure.click();
        yield poAdminEmailInboxes.btnSave.click();
        yield (0, test_1.expect)(poAdminEmailInboxes.itemRow(name)).toBeVisible();
    }));
    (0, test_1.test)('expect delete an email inbox', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poAdminEmailInboxes.itemRow(email).click();
        yield poAdminEmailInboxes.btnDelete.click();
        yield poUtils.btnModalConfirmDelete.click();
        yield (0, test_1.expect)(poUtils.toastBarSuccess).toBeVisible();
    }));
});
