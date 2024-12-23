"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRoomGroup_1 = require("./getRoomGroup");
it('should return "direct" for direct message rooms', () => {
    const result = (0, getRoomGroup_1.getRoomGroup)({ t: 'd' });
    expect(result).toBe('direct');
});
it('should return "team" for team rooms', () => {
    const result = (0, getRoomGroup_1.getRoomGroup)({ teamMain: true });
    expect(result).toBe('team');
});
it('should return "direct_multiple" for direct message room with many users', () => {
    const result = (0, getRoomGroup_1.getRoomGroup)({ uids: ['id1', 'id2', 'id3'], t: 'd' });
    expect(result).toBe('direct_multiple');
});
