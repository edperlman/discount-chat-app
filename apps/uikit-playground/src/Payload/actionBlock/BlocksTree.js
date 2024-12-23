"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callout_1 = require("../callout");
const action_1 = require("./action");
const context_1 = require("./context");
const divider_1 = require("./divider");
const image_1 = require("./image");
const input_1 = require("./input");
const preview_1 = require("./preview");
const section_1 = require("./section");
const tabNavigation_1 = require("../tabNavigation");
const toggleSwitch_1 = require("../action/toggleSwitch");
const timePicker_1 = require("../action/timePicker");
const radioButton_1 = require("../action/radioButton");
const checkbox_1 = require("../action/checkbox");
const BlocksTree = [
    {
        label: 'actions',
        branches: [
            {
                label: 'button',
                branches: [
                    {
                        label: 'default',
                        payload: action_1.actionWithButtonDefault,
                    },
                    {
                        label: 'primary',
                        payload: action_1.actionWithButtonPrimary,
                    },
                    {
                        label: 'secondary',
                        payload: action_1.actionWithButtonSecondary,
                    },
                    {
                        label: 'danger',
                        payload: action_1.actionWithButtonDanger,
                    },
                    {
                        label: 'warning',
                        payload: action_1.actionWithButtonWarning,
                    },
                    {
                        label: 'success',
                        payload: action_1.actionWithButtonSuccess,
                    },
                    {
                        label: 'secondary with variant',
                        payload: action_1.actionWithButtonSecondaryWithVariant,
                    },
                    {
                        label: 'as Link',
                        payload: action_1.actionWithButtonAsLink,
                    },
                ],
            },
            {
                label: 'static select',
                branches: [
                    {
                        label: 'Single',
                        payload: action_1.actionWithSingleStaticSelect,
                    },
                    {
                        label: 'Multi',
                        payload: action_1.actionWithMultiStaticSelect,
                    },
                ],
            },
            {
                label: 'menu',
                payload: action_1.actionWithMenu,
            },
            {
                label: 'date Picker',
                payload: action_1.actionWithDatePicker,
            },
            {
                label: 'time Picker',
                payload: timePicker_1.actionWithTimePicker,
            },
            {
                label: 'linear scale',
                payload: action_1.actionWithLinearScale,
            },
            {
                label: 'toggle switch',
                payload: toggleSwitch_1.actionWithToggleSwitch,
            },
            {
                label: 'radio buttons',
                payload: radioButton_1.actionWithRadioButton,
            },
            {
                label: 'checkbox',
                payload: checkbox_1.actionWithCheckbox,
            },
        ],
    },
    {
        label: 'section',
        branches: [
            {
                label: 'text',
                branches: [
                    {
                        label: 'plain text',
                        payload: section_1.sectionWithPlainText,
                    },
                    {
                        label: 'mrkdwn',
                        payload: section_1.sectionWithMrkdwn,
                    },
                    {
                        label: 'text fields',
                        payload: section_1.sectionWithTextFields,
                    },
                ],
            },
            {
                label: 'button',
                branches: [
                    {
                        label: 'default',
                        payload: section_1.sectionWithButtonDefault,
                    },
                    {
                        label: 'primary',
                        payload: section_1.sectionWithButtonPrimary,
                    },
                    {
                        label: 'danger',
                        payload: section_1.sectionWithButtonDanger,
                    },
                    {
                        label: 'warning',
                        payload: section_1.sectionWithButtonWarning,
                    },
                    {
                        label: 'success',
                        payload: section_1.sectionWithButtonSuccess,
                    },
                    {
                        label: 'secondary with variant',
                        payload: section_1.sectionWithButtonSecondaryWithVariant,
                    },
                    {
                        label: 'as Link',
                        payload: section_1.sectionWithButtonAsLink,
                    },
                ],
            },
            {
                label: 'image',
                payload: section_1.sectionWithImage,
            },
            {
                label: 'menu',
                payload: section_1.sectionWithMenu,
            },
            {
                label: 'date Picker',
                payload: section_1.sectionWithdatePicker,
            },
        ],
    },
    {
        label: 'preview',
        branches: [
            {
                label: 'plain',
                payload: preview_1.previewPlain,
            },
            {
                label: 'image',
                payload: preview_1.previewWithImage,
            },
            {
                label: 'URL',
                payload: preview_1.previewWithUrl,
            },
            {
                label: 'image and URL',
                payload: preview_1.previewWithImageAndUrl,
            },
        ],
    },
    {
        label: 'input',
        branches: [
            {
                label: 'textfeild',
                branches: [
                    {
                        label: 'single line',
                        payload: input_1.inputWithSingleLineInput,
                    },
                    {
                        label: 'multi line',
                        payload: input_1.inputWithMultiLineInput,
                    },
                ],
            },
            {
                label: 'static select',
                branches: [
                    {
                        label: 'single',
                        payload: input_1.inputWithSingleStaticSelect,
                    },
                    {
                        label: 'multi',
                        payload: input_1.inputWithMultiStaticSelect,
                    },
                ],
            },
            {
                label: 'date Picker',
                payload: input_1.inputWithDatePicker,
            },
            {
                label: 'linear scale',
                payload: input_1.inputWithLinearSelect,
            },
        ],
    },
    {
        label: 'image',
        branches: [
            {
                label: 'with title',
                payload: image_1.imageWithTitle,
            },
            {
                label: 'without title',
                payload: image_1.imageWithoutTitle,
            },
        ],
    },
    {
        label: 'Context',
        branches: [
            {
                label: 'Plain Text',
                payload: context_1.contextWithPlainText,
            },
            {
                label: 'Mrkdwn',
                payload: context_1.contextWithMrkdwn,
            },
            {
                label: 'Image',
                payload: context_1.contextWithImage,
            },
            {
                label: 'All Elements',
                payload: context_1.contextWithAllElements,
            },
        ],
    },
    {
        label: 'Conditional',
        branches: [],
    },
    {
        label: 'divider',
        branches: [
            {
                label: 'Plain',
                payload: divider_1.divider,
            },
        ],
    },
    {
        label: 'callout',
        branches: [
            {
                label: 'Plain',
                payload: callout_1.callout,
            },
            {
                label: 'With Action',
                payload: callout_1.calloutWithAction,
            },
        ],
    },
    {
        label: 'TabNavigation',
        branches: [
            {
                label: 'Plain',
                payload: tabNavigation_1.plain,
            },
            {
                label: 'Disabled',
                payload: tabNavigation_1.disabled,
            },
            {
                label: 'Selected',
                payload: tabNavigation_1.selected,
            },
        ],
    },
];
exports.default = BlocksTree;
