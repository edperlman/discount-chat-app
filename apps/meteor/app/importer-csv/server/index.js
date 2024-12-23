"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CsvImporter_1 = require("./CsvImporter");
const server_1 = require("../../importer/server");
server_1.Importers.add({
    key: 'csv',
    name: 'CSV',
    importer: CsvImporter_1.CsvImporter,
});
