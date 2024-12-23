"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamPropsWithTeamId = exports.isTeamPropsWithTeamName = void 0;
__exportStar(require("./TeamsAddMembersProps"), exports);
__exportStar(require("./TeamsConvertToChannelProps"), exports);
__exportStar(require("./TeamsDeleteProps"), exports);
__exportStar(require("./TeamsLeaveProps"), exports);
__exportStar(require("./TeamsRemoveMemberProps"), exports);
__exportStar(require("./TeamsRemoveRoomProps"), exports);
__exportStar(require("./TeamsUpdateMemberProps"), exports);
__exportStar(require("./TeamsUpdateProps"), exports);
__exportStar(require("./TeamsListChildren"), exports);
const isTeamPropsWithTeamName = (props) => 'teamName' in props;
exports.isTeamPropsWithTeamName = isTeamPropsWithTeamName;
const isTeamPropsWithTeamId = (props) => 'teamId' in props;
exports.isTeamPropsWithTeamId = isTeamPropsWithTeamId;
