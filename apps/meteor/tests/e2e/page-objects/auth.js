"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
class Registration {
    constructor(page) {
        this.page = page;
    }
    get btnSendInstructions() {
        return this.page.locator('role=button[name="Send instructions"]');
    }
    get btnReset() {
        return this.page.locator('role=button[name="Reset"]');
    }
    get btnLogin() {
        return this.page.locator('role=button[name="Login"]');
    }
    get btnLoginWithSaml() {
        return this.page.locator('role=button[name="SAML test login button"]');
    }
    get btnLoginWithGoogle() {
        return this.page.locator('role=button[name="Sign in with Google"]');
    }
    get btnLoginWithCustomOAuth() {
        return this.page.locator('role=button[name="Sign in with Test"]');
    }
    get goToRegister() {
        return this.page.locator('role=link[name="Create an account"]');
    }
    get backToLogin() {
        return this.page.locator('role=link[name="Back to Login"]');
    }
    get btnRegister() {
        return this.page.locator('role=button[name="Join your team"]');
    }
    get btnRegisterConfirmUsername() {
        return this.page.locator('role=button[name="Use this username"]');
    }
    get btnForgotPassword() {
        return this.page.locator('role=link[name="Forgot your password?"]');
    }
    get username() {
        return this.page.locator('role=textbox[name=/username/i]');
    }
    get inputName() {
        return this.page.locator('[name=name]');
    }
    get inputEmail() {
        return this.page.locator('role=textbox[name=/Email/]');
    }
    get inputPassword() {
        return this.page.locator('[name=password]');
    }
    get inputReason() {
        return this.page.locator('role=textbox[name=/Reason/]');
    }
    get inputPasswordConfirm() {
        return this.page.locator('[name=passwordConfirmation]');
    }
    get forgotPasswordEmailCallout() {
        return this.page.locator('role=status');
    }
    get registrationDisabledCallout() {
        return this.page.locator('role=status >> text=/New user registration is currently disabled/');
    }
}
exports.Registration = Registration;
