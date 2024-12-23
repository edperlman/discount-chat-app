"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleFileInput = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useSingleFileInput = (onSetFile, fileType = 'image/*', fileField = 'image') => {
    const ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('style', 'display: none');
        document.body.appendChild(fileInput);
        ref.current = fileInput;
        return () => {
            ref.current = undefined;
            fileInput.remove();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        const fileInput = ref.current;
        if (!fileInput) {
            return;
        }
        fileInput.setAttribute('accept', fileType);
    }, [fileType]);
    (0, react_1.useEffect)(() => {
        const fileInput = ref.current;
        if (!fileInput) {
            return;
        }
        const handleFiles = () => {
            var _a;
            if (!((_a = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            const formData = new FormData();
            formData.append(fileField, fileInput.files[0]);
            onSetFile(fileInput.files[0], formData);
        };
        fileInput.addEventListener('change', handleFiles, false);
        return () => {
            fileInput.removeEventListener('change', handleFiles, false);
        };
    }, [fileField, fileType, onSetFile]);
    const onClick = (0, fuselage_hooks_1.useMutableCallback)(() => { var _a; return (_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.click(); });
    const reset = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (ref.current) {
            ref.current.value = '';
        }
    });
    return [onClick, reset];
};
exports.useSingleFileInput = useSingleFileInput;
