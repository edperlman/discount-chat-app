"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModal = void 0;
const server_1 = require("../../../../app/settings/server");
const i18n_1 = require("../../../lib/i18n");
const createModal = ({ type = 'modal.open', id, appId, npsId, triggerId, score, user }) => {
    const language = user.language || server_1.settings.get('Language') || 'en';
    return {
        type,
        triggerId,
        appId,
        view: {
            appId,
            type: 'modal',
            id,
            title: {
                type: 'plain_text',
                text: i18n_1.i18n.t('We_appreciate_your_feedback', { lng: language }),
                emoji: false,
            },
            submit: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: i18n_1.i18n.t('Send', { lng: language }),
                    emoji: false,
                },
                actionId: 'send-vote',
            },
            close: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: i18n_1.i18n.t('Cancel', { lng: language }),
                    emoji: false,
                },
                actionId: 'cancel',
            },
            blocks: [
                {
                    blockId: npsId,
                    type: 'actions',
                    elements: [
                        {
                            type: 'linear_scale',
                            initialValue: score,
                            actionId: 'nps-score',
                            preLabel: { type: 'plain_text', text: i18n_1.i18n.t('Not_likely', { lng: language }) },
                            postLabel: {
                                type: 'plain_text',
                                text: i18n_1.i18n.t('Extremely_likely', { lng: language }),
                            },
                        },
                    ],
                    label: {
                        type: 'plain_text',
                        text: i18n_1.i18n.t('Score', { lng: language }),
                        emoji: false,
                    },
                },
                {
                    blockId: npsId,
                    type: 'input',
                    element: {
                        type: 'plain_text_input',
                        multiline: true,
                        actionId: 'comment',
                    },
                    label: {
                        type: 'plain_text',
                        text: i18n_1.i18n.t('Why_did_you_chose__score__', { score, lng: language }),
                        emoji: false,
                    },
                },
            ],
        },
    };
};
exports.createModal = createModal;
