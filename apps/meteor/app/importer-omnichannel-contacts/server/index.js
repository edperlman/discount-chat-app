"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const license_1 = require("@rocket.chat/license");
const ContactImporter_1 = require("./ContactImporter");
const server_1 = require("../../importer/server");
license_1.License.onValidFeature('contact-id-verification', () => {
    server_1.Importers.add({
        key: 'omnichannel_contact',
        name: 'omnichannel_contacts_importer',
        importer: ContactImporter_1.ContactImporter,
    });
});
