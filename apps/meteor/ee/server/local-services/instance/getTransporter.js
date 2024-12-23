"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransporter = getTransporter;
function getTransporter({ transporter, port, extra } = {}) {
    if (transporter) {
        if (!transporter.match(/^(?:monolith\+)/)) {
            throw new Error('invalid transporter');
        }
        const [, ...url] = transporter.split('+');
        return url.join('');
    }
    return Object.assign({ port: port ? port.trim() : 0, udpDiscovery: false, useHostname: false }, (extra ? JSON.parse(extra) : {}));
}
