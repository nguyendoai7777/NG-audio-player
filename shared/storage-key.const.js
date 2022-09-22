"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEY = exports.LOCAL_KEY_LIST = void 0;
exports.LOCAL_KEY_LIST = [
    'ExpandedSidebar',
    'MusicDirectories'
];
exports.STORAGE_KEY = exports.LOCAL_KEY_LIST.reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: key })), {});
//# sourceMappingURL=storage-key.const.js.map