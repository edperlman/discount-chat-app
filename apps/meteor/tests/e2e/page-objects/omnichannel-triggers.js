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
exports.OmnichannelTriggers = void 0;
const fragments_1 = require("./fragments");
class OmnichannelTriggers {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    headingButtonNew(name) {
        return this.page.locator(`role=main >> role=button[name="${name}"]`).first();
    }
    get inputName() {
        return this.page.locator('input[name="name"]');
    }
    get inputDescription() {
        return this.page.locator('input[name="description"]');
    }
    get btnSave() {
        return this.page.locator('button >> text="Save"');
    }
    firstRowInTriggerTable(triggersName1) {
        return this.page.locator(`text="${triggersName1}"`);
    }
    get toastMessage() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success >> nth=0');
    }
    get btnCloseToastMessage() {
        return this.toastMessage.locator('role=button');
    }
    get btnDeletefirstRowInTable() {
        return this.page.locator('table tr:first-child td:last-child button');
    }
    get btnModalRemove() {
        return this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger');
    }
    get removeToastMessage() {
        return this.page.locator('text=Trigger removed');
    }
    get conditionLabel() {
        return this.page.locator('label >> text="Condition"');
    }
    get inputConditionValue() {
        return this.page.locator('input[name="conditions.0.value"]');
    }
    get actionLabel() {
        return this.page.locator('label >> text="Action"');
    }
    get senderLabel() {
        return this.page.locator('label >> text="Sender"');
    }
    get inputAgentName() {
        return this.page.locator('input[name="actions.0.params.name"]');
    }
    get inputTriggerMessage() {
        return this.page.locator('textarea[name="actions.0.params.msg"]');
    }
    selectCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.conditionLabel.click();
            yield this.page.locator(`li.rcx-option[data-key="${condition}"]`).click();
        });
    }
    selectSender(sender) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.senderLabel.click();
            yield this.page.locator(`li.rcx-option[data-key="${sender}"]`).click();
        });
    }
    createTrigger(triggersName, triggerMessage, condition, conditionValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.headingButtonNew('Create trigger').click();
            yield this.fillTriggerForm({
                name: triggersName,
                description: 'Creating a fresh trigger',
                condition,
                conditionValue,
                triggerMessage,
            });
            yield this.btnSave.click();
        });
    }
    updateTrigger(newName, triggerMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fillTriggerForm({
                name: `edited-${newName}`,
                description: 'Updating the existing trigger',
                condition: 'chat-opened-by-visitor',
                sender: 'custom',
                agentName: 'Rocket.cat',
                triggerMessage,
            });
            yield this.btnSave.click();
        });
    }
    fillTriggerForm(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.name && (yield this.inputName.fill(data.name));
            data.description && (yield this.inputDescription.fill(data.description));
            data.condition && (yield this.selectCondition(data.condition));
            if (data.conditionValue) {
                yield this.inputConditionValue.fill(data.conditionValue.toString());
            }
            data.sender && (yield this.selectSender(data.sender));
            if (data.sender === 'custom' && !data.agentName) {
                throw new Error('A custom agent is required for this action');
            }
            else {
                data.agentName && (yield this.inputAgentName.fill(data.agentName));
            }
            data.triggerMessage && (yield this.inputTriggerMessage.fill(data.triggerMessage));
        });
    }
}
exports.OmnichannelTriggers = OmnichannelTriggers;
