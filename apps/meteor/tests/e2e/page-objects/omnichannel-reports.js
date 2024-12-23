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
exports.OmnichannelReports = void 0;
class OmnichannelReportsSection {
    constructor(page, sectionId) {
        this.page = page;
        this.section = page.locator(`[data-qa=${sectionId}]`);
    }
    get element() {
        return this.section;
    }
    get inputPeriodSelector() {
        return this.section.locator('button', { has: this.page.locator('select[name="periodSelector"]') });
    }
    get txtTitle() {
        return this.section.locator('');
    }
    get txtDescription() {
        return this.section.locator('');
    }
    get chart() {
        return this.section.locator('');
    }
    get txtStateTitle() {
        return this.section.locator('.rcx-states__title');
    }
    get txtStateSubtitle() {
        return this.section.locator('.rcx-states__subtitle');
    }
    get btnRetry() {
        return this.section.locator('role=button[name="Retry"]');
    }
    get txtSummary() {
        return this.section.locator('[data-qa="report-summary"]');
    }
    get loadingSkeleton() {
        return this.section.locator('.rcx-skeleton');
    }
    findRowByName(name) {
        return this.section.locator('tr', { has: this.page.locator(`td >> text="${name}"`) });
    }
    chartItem(label, value) {
        return this.section.locator(`rect[aria-label="${label}"] + text >> text=${value}`);
    }
    legendItem(text) {
        return this.section.locator(`text='${text}'`);
    }
    selectPeriod(period) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputPeriodSelector.click();
            yield this.page.locator(`li.rcx-option[data-key="${period}"]`).click();
        });
    }
}
class OmnichannelReports {
    constructor(page) {
        this.statusSection = new OmnichannelReportsSection(page, 'conversations-by-status');
        this.channelsSection = new OmnichannelReportsSection(page, 'conversations-by-channel');
        this.departmentsSection = new OmnichannelReportsSection(page, 'conversations-by-department');
        this.tagsSection = new OmnichannelReportsSection(page, 'conversations-by-tags');
        this.agentsSection = new OmnichannelReportsSection(page, 'conversations-by-agent');
    }
}
exports.OmnichannelReports = OmnichannelReports;
