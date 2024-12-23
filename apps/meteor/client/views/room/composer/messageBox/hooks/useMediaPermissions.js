"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaPermissions = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const getDeviceKind = (name) => {
    switch (name) {
        case 'camera':
            return 'videoinput';
        case 'microphone':
            return 'audioinput';
    }
};
const useMediaPermissions = (name) => {
    const [isPermissionDenied, setIsPermissionDenied] = (0, react_1.useState)(false);
    const handleMount = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (navigator.permissions) {
            try {
                const permissionStatus = yield navigator.permissions.query({ name: name });
                setIsPermissionDenied(permissionStatus.state === 'denied');
                permissionStatus.onchange = () => {
                    setIsPermissionDenied(permissionStatus.state === 'denied');
                };
                return;
            }
            catch (error) {
                console.warn(error);
            }
        }
        if (!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.enumerateDevices)) {
            setIsPermissionDenied(true);
            return;
        }
        try {
            if (!(yield navigator.mediaDevices.enumerateDevices()).some(({ kind }) => kind === getDeviceKind(name))) {
                setIsPermissionDenied(true);
            }
        }
        catch (error) {
            console.warn(error);
        }
    }));
    (0, react_1.useEffect)(() => {
        handleMount();
    }, [handleMount]);
    return [isPermissionDenied, setIsPermissionDenied];
};
exports.useMediaPermissions = useMediaPermissions;
