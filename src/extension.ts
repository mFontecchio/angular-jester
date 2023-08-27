// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { FileHandler } from "./fileHandler";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "angular-jester.generateJestSpec",
        (event) => {
            const editor = vscode.window.activeTextEditor;
            const fileHandler = new FileHandler();

            if (editor) {
                //const filePath = editor.document.uri.fsPath;

                fileHandler.createJestSpecFile(event.fsPath);

                // vscode.window
                //     .showInputBox({
                //         prompt: "Enter a prefix for the spec file"
                //     })
                //     .then((prefix) => {
                //         if (prefix) {
                //             fileHandler.createJestSpecFile(filePath, prefix);
                //         }
                //     });
            } else {
                vscode.window.showErrorMessage("No active text editor found.");
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
