"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getInstanceList_1 = require("../../../app/api/server/helpers/getInstanceList");
const sdk_1 = require("../sdk");
getInstanceList_1.getInstanceList.patch(() => sdk_1.Instance.getInstances());
