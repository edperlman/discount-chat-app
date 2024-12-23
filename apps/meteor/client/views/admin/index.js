"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterAdminSidebarItem = exports.registerAdminSidebarItem = exports.registerAdminRoute = void 0;
var routes_1 = require("./routes");
Object.defineProperty(exports, "registerAdminRoute", { enumerable: true, get: function () { return routes_1.registerAdminRoute; } });
var sidebarItems_1 = require("./sidebarItems");
Object.defineProperty(exports, "registerAdminSidebarItem", { enumerable: true, get: function () { return sidebarItems_1.registerAdminSidebarItem; } });
Object.defineProperty(exports, "unregisterAdminSidebarItem", { enumerable: true, get: function () { return sidebarItems_1.unregisterSidebarItem; } });
