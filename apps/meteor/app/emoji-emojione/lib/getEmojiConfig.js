"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmojiConfig = void 0;
const emojione_1 = __importDefault(require("emojione"));
const mem_1 = __importDefault(require("mem"));
const emojiPicker_1 = require("./emojiPicker");
// TODO remove fix below when issue is solved: https://github.com/joypixels/emojione/issues/617
// add missing emojis not provided by JS object, but included on emoji.json
emojione_1.default.shortnames +=
    '|:tm:|:copyright:|:registered:|:digit_zero:|:digit_one:|:digit_two:|:digit_three:|:digit_four:|:digit_five:|:digit_six:|:digit_seven:|:digit_eight:|:digit_nine:|:pound_symbol:|:asterisk_symbol:';
emojione_1.default.regShortNames = new RegExp(`<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(${emojione_1.default.shortnames})`, 'gi');
emojione_1.default.emojioneList[':tm:'] = {
    uc_base: '2122',
    uc_output: '2122-fe0f',
    uc_match: '2122-fe0f',
    uc_greedy: '2122-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':copyright:'] = {
    uc_base: '00a9',
    uc_output: '00a9-f0ef',
    uc_match: '00a9-fe0f',
    uc_greedy: '00a9-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':registered:'] = {
    uc_base: '00ae',
    uc_output: '00ae-fe0f',
    uc_match: '00ae-fe0f',
    uc_greedy: '00ae-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_zero:'] = {
    uc_base: '0030',
    uc_output: '0030-fe0f',
    uc_match: '0030-fe0f',
    uc_greedy: '0030-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_one:'] = {
    uc_base: '0031',
    uc_output: '0031-fe0f',
    uc_match: '0031-fe0f',
    uc_greedy: '0031-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_two:'] = {
    uc_base: '0032',
    uc_output: '0032-fe0f',
    uc_match: '0032-fe0f',
    uc_greedy: '0032-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_three:'] = {
    uc_base: '0033',
    uc_output: '0033-fe0f',
    uc_match: '0033-fe0f',
    uc_greedy: '0033-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_four:'] = {
    uc_base: '0034',
    uc_output: '0034-fe0f',
    uc_match: '0034-fe0f',
    uc_greedy: '0034-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_five:'] = {
    uc_base: '0035',
    uc_output: '0035-fe0f',
    uc_match: '0035-fe0f',
    uc_greedy: '0035-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_six:'] = {
    uc_base: '0036',
    uc_output: '0036-fe0f',
    uc_match: '0036-fe0f',
    uc_greedy: '0036-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_seven:'] = {
    uc_base: '0037',
    uc_output: '0037-fe0f',
    uc_match: '0037-fe0f',
    uc_greedy: '0037-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_eight:'] = {
    uc_base: '0038',
    uc_output: '0038-fe0f',
    uc_match: '0038-fe0f',
    uc_greedy: '0038-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':digit_nine:'] = {
    uc_base: '0039',
    uc_output: '0039-fe0f',
    uc_match: '0039-fe0f',
    uc_greedy: '0039-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':pound_symbol:'] = {
    uc_base: '0023',
    uc_output: '0023-fe0f',
    uc_match: '0023-fe0f',
    uc_greedy: '0023-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
emojione_1.default.emojioneList[':asterisk_symbol:'] = {
    uc_base: '002a',
    uc_output: '002a-fe0f',
    uc_match: '002a-fe0f',
    uc_greedy: '002a-fe0f',
    shortnames: [],
    category: 'symbols',
    emojiPackage: 'emojione',
};
// end fix
// fix for :+1: - had to replace all function that does its conversion: https://github.com/joypixels/emojione/blob/4.5.0/lib/js/emojione.js#L249
emojione_1.default.shortnameConversionMap = (0, mem_1.default)(emojione_1.default.shortnameConversionMap, { maxAge: 1000 });
emojione_1.default.unicodeCharRegex = (0, mem_1.default)(emojione_1.default.unicodeCharRegex, { maxAge: 1000 });
const convertShortName = (0, mem_1.default)((shortname) => {
    // the fix is basically adding this .replace(/[+]/g, '\\$&')
    if (typeof shortname === 'undefined' || shortname === '' || emojione_1.default.shortnames.indexOf(shortname.replace(/[+]/g, '\\$&')) === -1) {
        // if the shortname doesnt exist just return the entire match
        return shortname;
    }
    // map shortname to parent
    if (!emojione_1.default.emojioneList[shortname]) {
        for (const emoji in emojione_1.default.emojioneList) {
            if (!emojione_1.default.emojioneList.hasOwnProperty(emoji) || emoji === '') {
                continue;
            }
            if (emojione_1.default.emojioneList[emoji].shortnames.indexOf(shortname) === -1) {
                continue;
            }
            shortname = emoji;
            break;
        }
    }
    const unicode = emojione_1.default.emojioneList[shortname].uc_output;
    const fname = emojione_1.default.emojioneList[shortname].uc_base;
    const category = fname.indexOf('-1f3f') >= 0 ? 'diversity' : emojione_1.default.emojioneList[shortname].category;
    const title = emojione_1.default.imageTitleTag ? `title="${shortname}"` : '';
    // const size = ns.spriteSize === '32' || ns.spriteSize === '64' ? ns.spriteSize : '32';
    // if the emoji path has been set, we'll use the provided path, otherwise we'll use the default path
    const ePath = emojione_1.default.defaultPathPNG !== emojione_1.default.imagePathPNG ? emojione_1.default.imagePathPNG : `${emojione_1.default.defaultPathPNG + emojione_1.default.emojiSize}/`;
    // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
    const alt = emojione_1.default.unicodeAlt ? emojione_1.default.convert(unicode.toUpperCase()) : shortname;
    if (emojione_1.default.sprites) {
        return `<span class="emojione emojione-${category} _${fname}" ${title}>${alt}</span>`;
    }
    return `<img class="emojione" alt="${alt}" ${title} src="${ePath}${fname}${emojione_1.default.fileExtension}"/>`;
}, { maxAge: 1000 });
const convertUnicode = (0, mem_1.default)((entire, _m1, m2, m3) => {
    const mappedUnicode = emojione_1.default.mapUnicodeToShort();
    if (typeof m3 === 'undefined' || m3 === '' || !(emojione_1.default.unescapeHTML(m3) in emojione_1.default.asciiList)) {
        // if the ascii doesnt exist just return the entire match
        return entire;
    }
    m3 = emojione_1.default.unescapeHTML(m3);
    const unicode = emojione_1.default.asciiList[m3];
    const shortname = mappedUnicode[unicode];
    const category = unicode.indexOf('-1f3f') >= 0 ? 'diversity' : emojione_1.default.emojioneList[shortname].category;
    const title = emojione_1.default.imageTitleTag ? `title="${emojione_1.default.escapeHTML(m3)}"` : '';
    // const size = ns.spriteSize === '32' || ns.spriteSize === '64' ? ns.spriteSize : '32';
    // if the emoji path has been set, we'll use the provided path, otherwise we'll use the default path
    const ePath = emojione_1.default.defaultPathPNG !== emojione_1.default.imagePathPNG ? emojione_1.default.imagePathPNG : `${emojione_1.default.defaultPathPNG + emojione_1.default.emojiSize}/`;
    // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
    const alt = emojione_1.default.unicodeAlt ? emojione_1.default.convert(unicode.toUpperCase()) : emojione_1.default.escapeHTML(m3);
    if (emojione_1.default.sprites) {
        return `${m2}<span class="emojione emojione-${category} _${unicode}"  ${title}>${alt}</span>`;
    }
    return `${m2}<img class="emojione" alt="${alt}" ${title} src="${ePath}${unicode}${emojione_1.default.fileExtension}"/>`;
}, { maxAge: 1000, cacheKey: JSON.stringify });
emojione_1.default.shortnameToImage = (str) => {
    // replace regular shortnames first
    str = str.replace(emojione_1.default.regShortNames, convertShortName);
    // if ascii smileys are turned on, then we'll replace them!
    if (emojione_1.default.ascii) {
        const asciiRX = emojione_1.default.riskyMatchAscii ? emojione_1.default.regAsciiRisky : emojione_1.default.regAscii;
        return str.replace(asciiRX, convertUnicode);
    }
    return str;
};
const isEmojiSupported = (str) => {
    str = str.replace(emojione_1.default.regShortNames, convertShortName);
    // if ascii smileys are turned on, then we'll replace them!
    if (emojione_1.default.ascii) {
        const asciiRX = emojione_1.default.riskyMatchAscii ? emojione_1.default.regAsciiRisky : emojione_1.default.regAscii;
        return str.replace(asciiRX, convertUnicode);
    }
    return str;
};
const getEmojiConfig = () => ({
    emojione: emojione_1.default,
    emojisByCategory: emojiPicker_1.emojisByCategory,
    emojiCategories: emojiPicker_1.emojiCategories,
    toneList: emojiPicker_1.toneList,
    render: emojione_1.default.toImage,
    renderPicker: emojione_1.default.shortnameToImage,
    sprites: true,
    isEmojiSupported,
});
exports.getEmojiConfig = getEmojiConfig;
