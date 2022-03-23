"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
//import of modules
const vscode = require("vscode");
class StatusBar {
    static get statusbar() {
        if (!StatusBar._statusBarItem) {
            StatusBar._statusBarItem = vscode.window
                .createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            this.statusbar.show();
        }
        return StatusBar._statusBarItem;
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=statusBar.js.map