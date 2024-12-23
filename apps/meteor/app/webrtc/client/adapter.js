"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
// FIXME: probably outdated
window.RTCPeerConnection = (_b = (_a = window.RTCPeerConnection) !== null && _a !== void 0 ? _a : window.mozRTCPeerConnection) !== null && _b !== void 0 ? _b : window.webkitRTCPeerConnection;
window.RTCSessionDescription = (_d = (_c = window.RTCSessionDescription) !== null && _c !== void 0 ? _c : window.mozRTCSessionDescription) !== null && _d !== void 0 ? _d : window.webkitRTCSessionDescription;
window.RTCIceCandidate = (_f = (_e = window.RTCIceCandidate) !== null && _e !== void 0 ? _e : window.mozRTCIceCandidate) !== null && _f !== void 0 ? _f : window.webkitRTCIceCandidate;
window.RTCSessionDescription = (_h = (_g = window.RTCSessionDescription) !== null && _g !== void 0 ? _g : window.mozRTCSessionDescription) !== null && _h !== void 0 ? _h : window.webkitRTCSessionDescription;
window.AudioContext = (_k = (_j = window.AudioContext) !== null && _j !== void 0 ? _j : window.mozAudioContext) !== null && _k !== void 0 ? _k : window.webkitAudioContext;
navigator.getUserMedia = (_m = (_l = navigator.getUserMedia) !== null && _l !== void 0 ? _l : navigator.mozGetUserMedia) !== null && _m !== void 0 ? _m : navigator.webkitGetUserMedia;
