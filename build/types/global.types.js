"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUserAndAdmins = exports.allAdmins = exports.onlyAdmin = exports.onlySuperAdmin = exports.onlyUser = void 0;
const enum_types_1 = require("./enum.types");
exports.onlyUser = [enum_types_1.Role.USER];
exports.onlySuperAdmin = [enum_types_1.Role.SUPER_ADMIN];
exports.onlyAdmin = [enum_types_1.Role.ADMIN];
exports.allAdmins = [enum_types_1.Role.SUPER_ADMIN, enum_types_1.Role.ADMIN];
exports.allUserAndAdmins = [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN, enum_types_1.Role.USER];
