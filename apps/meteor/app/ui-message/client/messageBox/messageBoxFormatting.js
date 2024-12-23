"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattingButtons = exports.isPromptButton = void 0;
const AddLinkComposerActionModal_1 = __importDefault(require("./AddLinkComposerActionModal"));
const imperativeModal_1 = require("../../../../client/lib/imperativeModal");
const client_1 = require("../../../settings/client");
const isPromptButton = (button) => 'prompt' in button;
exports.isPromptButton = isPromptButton;
exports.formattingButtons = [
    {
        label: 'Bold',
        icon: 'bold',
        pattern: '*{{text}}*',
        command: 'b',
    },
    {
        label: 'Italic',
        icon: 'italic',
        pattern: '_{{text}}_',
        command: 'i',
    },
    {
        label: 'Strike',
        icon: 'strike',
        pattern: '~{{text}}~',
    },
    {
        label: 'Inline_code',
        icon: 'code',
        pattern: '`{{text}}`',
    },
    {
        label: 'Multi_line',
        icon: 'multiline',
        pattern: '```\n{{text}}\n``` ',
    },
    {
        label: 'Link',
        icon: 'link',
        prompt: (composerApi) => {
            const { selection } = composerApi;
            const selectedText = composerApi.substring(selection.start, selection.end);
            const onClose = () => {
                imperativeModal_1.imperativeModal.close();
                composerApi.focus();
            };
            const onConfirm = (url, text) => {
                onClose();
                composerApi.replaceText(`[${text}](${url})`, selection);
                composerApi.setCursorToEnd();
            };
            imperativeModal_1.imperativeModal.open({ component: AddLinkComposerActionModal_1.default, props: { onConfirm, selectedText, onClose } });
        },
    },
    {
        label: 'KaTeX',
        icon: 'katex',
        text: () => {
            if (!client_1.settings.get('Katex_Enabled')) {
                return;
            }
            if (client_1.settings.get('Katex_Dollar_Syntax')) {
                return '$$KaTeX$$';
            }
            if (client_1.settings.get('Katex_Parenthesis_Syntax')) {
                return '\\[KaTeX\\]';
            }
        },
        link: 'https://khan.github.io/KaTeX/function-support.html',
        condition: () => client_1.settings.get('Katex_Enabled'),
    },
];
