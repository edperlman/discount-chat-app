"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExampleData = useExampleData;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
function useExampleData({ additionalFields, url, }) {
    const imageUrl = (0, ui_contexts_1.useAbsoluteUrl)()('/images/integration-attachment-example.png');
    return (0, react_1.useMemo)(() => {
        const exampleData = Object.assign(Object.assign({}, additionalFields), { text: 'Example message', attachments: [
                {
                    title: 'Rocket.Chat',
                    title_link: 'https://rocket.chat',
                    text: 'Rocket.Chat, the best open source chat',
                    image_url: imageUrl,
                    color: '#764FA5',
                },
            ] });
        return [exampleData, `curl -X POST -H 'Content-Type: application/json' --data '${JSON.stringify(exampleData)}' ${url}`];
    }, [additionalFields, url, imageUrl]);
}
