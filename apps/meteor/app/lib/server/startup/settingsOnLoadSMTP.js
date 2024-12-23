"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
server_1.settings.watchMultiple(['SMTP_Host', 'SMTP_Port', 'SMTP_Username', 'SMTP_Password', 'SMTP_Protocol', 'SMTP_Pool', 'SMTP_IgnoreTLS'], () => {
    system_1.SystemLogger.info('Updating process.env.MAIL_URL');
    if (!server_1.settings.get('SMTP_Host')) {
        delete process.env.MAIL_URL;
        return;
    }
    process.env.MAIL_URL = `${server_1.settings.get('SMTP_Protocol')}://`;
    if (server_1.settings.get('SMTP_Username') && server_1.settings.get('SMTP_Password')) {
        process.env.MAIL_URL += `${encodeURIComponent(server_1.settings.get('SMTP_Username'))}:${encodeURIComponent(server_1.settings.get('SMTP_Password'))}@`;
    }
    process.env.MAIL_URL += encodeURIComponent(server_1.settings.get('SMTP_Host'));
    if (server_1.settings.get('SMTP_Port')) {
        process.env.MAIL_URL += `:${parseInt(server_1.settings.get('SMTP_Port'))}`;
    }
    process.env.MAIL_URL += `?pool=${server_1.settings.get('SMTP_Pool')}`;
    if (server_1.settings.get('SMTP_Protocol') === 'smtp' && server_1.settings.get('SMTP_IgnoreTLS')) {
        process.env.MAIL_URL += '&secure=false&ignoreTLS=true';
    }
});
