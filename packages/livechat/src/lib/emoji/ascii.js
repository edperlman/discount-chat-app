"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asciiRegexp = void 0;
const ascii = {
    '*\\0/*': '🙆',
    '*\\O/*': '🙆',
    '-___-': '😑',
    ":'-)": '😂',
    "':-)": '😅',
    "':-D": '😅',
    '>:-)': '😆',
    "':-(": '😓',
    '>:-(': '😠',
    ":'-(": '😢',
    'O:-)': '😇',
    '0:-3': '😇',
    '0:-)': '😇',
    '0;^)': '😇',
    'O;-)': '😇',
    '0;-)': '😇',
    'O:-3': '😇',
    '-__-': '😑',
    ':-Þ': '😛',
    '</3': '💔',
    ":')": '😂',
    ':-D': '😃',
    "':)": '😅',
    "'=)": '😅',
    "':D": '😅',
    "'=D": '😅',
    '>:)': '😆',
    '>;)': '😆',
    '>=)': '😆',
    ';-)': '😉',
    '*-)': '😉',
    ';-]': '😉',
    ';^)': '😉',
    "':(": '😓',
    "'=(": '😓',
    ':-*': '😘',
    ':^*': '😘',
    '>:P': '😜',
    'X-P': '😜',
    '>:[': '😞',
    ':-(': '😞',
    ':-[': '😞',
    '>:(': '😠',
    ":'(": '😢',
    ';-(': '😢',
    '>.<': '😣',
    '#-)': '😵',
    '%-)': '😵',
    'X-)': '😵',
    '\\0/': '🙆',
    '\\O/': '🙆',
    '0:3': '😇',
    '0:)': '😇',
    'O:)': '😇',
    'O=)': '😇',
    'O:3': '😇',
    'B-)': '😎',
    '8-)': '😎',
    'B-D': '😎',
    '8-D': '😎',
    '-_-': '😑',
    '>:\\': '😕',
    '>:/': '😕',
    ':-/': '😕',
    ':-.': '😕',
    ':-P': '😛',
    ':Þ': '😛',
    ':-b': '😛',
    ':-O': '😮',
    'O_O': '😮',
    '>:O': '😮',
    ':-X': '😶',
    ':-#': '😶',
    ':-)': '🙂',
    '(y)': '👍',
    '<3': '❤',
    '=D': '😃',
    ';)': '😉',
    '*)': '😉',
    ';]': '😉',
    ';D': '😉',
    ':*': '😘',
    '=*': '😘',
    ':(': '😞',
    ':[': '😞',
    '=(': '😞',
    ':@': '😠',
    ';(': '😢',
    'D:': '😨',
    ':$': '😳',
    '=$': '😳',
    '#)': '😵',
    '%)': '😵',
    'X)': '😵',
    'B)': '😎',
    '8)': '😎',
    ':/': '😕',
    ':\\': '😕',
    '=/': '😕',
    '=\\': '😕',
    ':L': '😕',
    '=L': '😕',
    ':P': '😛',
    '=P': '😛',
    ':b': '😛',
    ':O': '😮',
    ':X': '😶',
    ':#': '😶',
    '=X': '😶',
    '=#': '😶',
    ':)': '🙂',
    '=]': '🙂',
    '=)': '🙂',
    ':]': '🙂',
    ':D': '😄',
};
exports.asciiRegexp = "(\\*\\\\0\\/\\*|\\*\\\\O\\/\\*|\\-___\\-|\\:'\\-\\)|'\\:\\-\\)|'\\:\\-D|\\>\\:\\-\\)|>\\:\\-\\)|'\\:\\-\\(|\\>\\:\\-\\(|>\\:\\-\\(|\\:'\\-\\(|O\\:\\-\\)|0\\:\\-3|0\\:\\-\\)|0;\\^\\)|O;\\-\\)|0;\\-\\)|O\\:\\-3|\\-__\\-|\\:\\-Þ|\\:\\-Þ|\\<\\/3|<\\/3|\\:'\\)|\\:\\-D|'\\:\\)|'\\=\\)|'\\:D|'\\=D|\\>\\:\\)|>\\:\\)|\\>;\\)|>;\\)|\\>\\=\\)|>\\=\\)|;\\-\\)|\\*\\-\\)|;\\-\\]|;\\^\\)|'\\:\\(|'\\=\\(|\\:\\-\\*|\\:\\^\\*|\\>\\:P|>\\:P|X\\-P|\\>\\:\\[|>\\:\\[|\\:\\-\\(|\\:\\-\\[|\\>\\:\\(|>\\:\\(|\\:'\\(|;\\-\\(|\\>\\.\\<|>\\.<|#\\-\\)|%\\-\\)|X\\-\\)|\\\\0\\/|\\\\O\\/|0\\:3|0\\:\\)|O\\:\\)|O\\=\\)|O\\:3|B\\-\\)|8\\-\\)|B\\-D|8\\-D|\\-_\\-|\\>\\:\\\\|>\\:\\\\|\\>\\:\\/|>\\:\\/|\\:\\-\\/|\\:\\-\\.|\\:\\-P|\\:Þ|\\:Þ|\\:\\-b|\\:\\-O|O_O|\\>\\:O|>\\:O|\\:\\-X|\\:\\-#|\\:\\-\\)|\\(y\\)|\\<3|<3|\\=D|;\\)|\\*\\)|;\\]|;D|\\:\\*|\\=\\*|\\:\\(|\\:\\[|\\=\\(|\\:@|;\\(|D\\:|\\:\\$|\\=\\$|#\\)|%\\)|X\\)|B\\)|8\\)|\\:\\/|\\:\\\\|\\=\\/|\\=\\\\|\\:L|\\=L|\\:P|\\=P|\\:b|\\:O|\\:X|\\:#|\\=X|\\=#|\\:\\)|\\=\\]|\\=\\)|\\:\\]|\\:D)";
exports.default = ascii;
