"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionUser = void 0;
class SelectionUser {
    /**
     * Constructs a new selection user.
     *
     * @param userId the unique user identifier
     * @param username the user's username
     * @param email the user's email
     * @param isDeleted whether the user was deleted or not
     * @param isBot whether the user is a bot or not
     * @param doImport whether we are going to import this user or not
     * @param isEmailTaken whether there's an existing user with the same email
     */
    constructor(userId, username, email, isDeleted, isBot, doImport, isEmailTaken = false) {
        this.user_id = userId;
        this.username = username;
        this.email = email;
        this.is_deleted = isDeleted;
        this.is_bot = isBot;
        this.do_import = doImport;
        this.is_email_taken = isEmailTaken;
    }
}
exports.SelectionUser = SelectionUser;
