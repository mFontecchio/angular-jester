// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {FH} from "./file-handler";

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context The VS Code extension context
 */
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"angular-jester.generateJestSpec",
		(event) => {
			const editor = vscode.window.activeTextEditor;
			const fileHandler = new FH();

			if (editor) {
				const {fsPath} = event;
				fileHandler.createJestSpecFile(fsPath);
			} else {
				vscode.window.showErrorMessage("No active text editor found.");
			}
		}
	);

	context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {}
