"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ACTION = exports.MUSIC_ACTION = exports.TITLE_BAR_ACTION = exports.SIDEBAR_ACTION = void 0;
exports.SIDEBAR_ACTION = {
    ProcessToView: {
        EXPAND_SIDEBAR_STATE: 'EXPAND_SIDEBAR_STATE'
    },
    ViewToProcess: {
        TOGGLE_EXPAND_SIDEBAR: 'TOGGLE_EXPAND_SIDEBAR'
    }
};
exports.TITLE_BAR_ACTION = {
    CLOSE_FROM_CUSTOM_TITLE_BAR: 'CLOSE_FROM_CUSTOM_TITLE_BAR',
    HIDE_FROM_CUSTOM_TITLE_BAR: 'HIDE_FROM_CUSTOM_TITLE_BAR',
    TOGGLE_SIZE_FROM_CUSTOM_TITLE_BAR: 'TOGGLE_SIZE_FROM_CUSTOM_TITLE_BAR'
};
exports.MUSIC_ACTION = {
    ProcessToView: {
        MUSIC_FOLDER_SELECT: 'MUSIC_FOLDER_SELECT',
        FIRE_DIR_LIST: 'FIRE_DIR_LIST',
        ADD_DIR: 'ADD_DIR',
    },
    ViewToProcess: {
        SELECT_DIR: 'SELECT_DIR',
        ADD_DIR: 'ADD_DIR',
        REMOVE_DIR: 'REMOVE_DIR'
    }
};
exports.APP_ACTION = {
    ProcessToView: {
        PASS_DATA_TO_VIEW: 'PASS_DATA_TO_VIEW'
    },
    ViewToProcess: {
        APP_INIT: 'APP_INIT'
    }
};
//# sourceMappingURL=communication.actions.const.js.map