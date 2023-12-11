import * as vscode from "vscode";

class ConfigService {
    private _config: vscode.WorkspaceConfiguration;
    private _useDescribeBlocks?: boolean;

    constructor() {
        this._config = vscode.workspace.getConfiguration("angular-jester");
        this._useDescribeBlocks = this._config.get("useDescribeBlocks");

        vscode.workspace.onDidChangeConfiguration((event) => {
            if (
                event.affectsConfiguration("angular-jester.useDescribeBlocks")
            ) {
                this._useDescribeBlocks = this._config.get("useDescribeBlocks");
            }
        });
    }

    get useDescribeBlocks() {
        return this._useDescribeBlocks;
    }
}

export const configService = new ConfigService();
