"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildImageURL_1 = require("./buildImageURL");
const testCases = [
    [
        'https://g1.globo.com/mundo/video/misseis-atingem-ponte-de-vidro-em-kiev-11012523.ghtml',
        'https://s2.glbimg.com/fXQKM_UZjF6I_3APIbPJzJTOUvw=/1200x/smart/filters:cover():strip_icc()/s04.video.glbimg.com/x720/11012523.jpg',
        'https://s2.glbimg.com/fXQKM_UZjF6I_3APIbPJzJTOUvw=/1200x/smart/filters:cover():strip_icc()/s04.video.glbimg.com/x720/11012523.jpg',
    ],
    ['https://open.rocket.chat/channel/general', 'assets/favicon_512.png', 'https://open.rocket.chat/assets/favicon_512.png'],
    ['https://open.rocket.chat/channel/general', '/assets/favicon_512.png', 'https://open.rocket.chat/assets/favicon_512.png'],
    ['https://open.rocket.chat/channel/general/', '/assets/favicon_512.png', 'https://open.rocket.chat/assets/favicon_512.png'],
];
testCases.forEach(([linkUrl, metaImgUrl, expectedResult]) => {
    it(`should return ${expectedResult} for ${metaImgUrl}`, () => {
        const result = (0, buildImageURL_1.buildImageURL)(linkUrl, metaImgUrl);
        expect(result).toBe(JSON.stringify(expectedResult));
    });
});
