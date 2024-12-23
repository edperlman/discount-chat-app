"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const helpers_1 = require("../../../../app/emoji/client/helpers");
const lib_1 = require("../../../../app/emoji/client/lib");
(0, mocha_1.describe)('Emoji Client Helpers', () => {
    (0, mocha_1.beforeEach)(() => {
        lib_1.emoji.packages.base.emojisByCategory.recent = [];
    });
    (0, mocha_1.describe)('updateRecent', () => {
        (0, mocha_1.it)('should update recent emojis with the provided emojis', () => {
            const recentEmojis = ['emoji1', 'emoji2'];
            (0, helpers_1.updateRecent)(recentEmojis);
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.contain('emoji1');
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.contain('emoji2');
        });
    });
    (0, mocha_1.describe)('removeFromRecent', () => {
        (0, mocha_1.it)('should remove a specific emoji from recent emojis', () => {
            lib_1.emoji.packages.base.emojisByCategory.recent = ['emoji1', 'emoji2', 'emoji3'];
            (0, helpers_1.removeFromRecent)('emoji2', lib_1.emoji.packages.base.emojisByCategory.recent);
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.not.include('emoji2');
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.deep.equal(['emoji1', 'emoji3']);
        });
        (0, mocha_1.it)('should do nothing if the emoji is not in the recent list', () => {
            lib_1.emoji.packages.base.emojisByCategory.recent = ['emoji1', 'emoji2'];
            (0, helpers_1.removeFromRecent)('emoji3', lib_1.emoji.packages.base.emojisByCategory.recent);
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.deep.equal(['emoji1', 'emoji2']);
        });
    });
    (0, mocha_1.describe)('replaceEmojiInRecent', () => {
        (0, mocha_1.it)('should replace an existing emoji with a new one in recent emojis', () => {
            lib_1.emoji.packages.base.emojisByCategory.recent = ['emoji1', 'emoji2', 'emoji3'];
            (0, helpers_1.replaceEmojiInRecent)({ oldEmoji: 'emoji2', newEmoji: 'emoji4' });
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.not.include('emoji2');
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.include('emoji4');
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.deep.equal(['emoji1', 'emoji4', 'emoji3']);
        });
        (0, mocha_1.it)('should do nothing if the emoji to replace is not in the recent list', () => {
            lib_1.emoji.packages.base.emojisByCategory.recent = ['emoji1', 'emoji2'];
            (0, helpers_1.replaceEmojiInRecent)({ oldEmoji: 'emoji3', newEmoji: 'emoji4' });
            (0, chai_1.expect)(lib_1.emoji.packages.base.emojisByCategory.recent).to.deep.equal(['emoji1', 'emoji2']);
        });
    });
});
