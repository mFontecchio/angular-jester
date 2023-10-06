import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import ts = require("typescript");
import {parseTsFile} from "./helpers/parse-source-file.angular";
import {serviceSpec} from "./templates/service.template";
import {pipeSpec} from "./templates/pipe.template";
import {interceptorSpec} from "./templates/interceptor.template";
import {directiveSpec} from "./templates/directive.template";
import {componentSpec} from "./templates/component.template";

export class FH {
	createJestSpecFile(filePath: string) {
		try {
			const file = path.parse(filePath);
			const specFileName = `${file.dir}/${file.name}.spec${file.ext}`;
			let specFileContent = "";

			const data = parseTsFile(file);

			if (file.name.includes("component")) {
				specFileContent = componentSpec(data);
			} else if (
				file.name.includes("service") ||
				file.name.includes("guard") ||
				file.name.includes("resolver")
			) {
				specFileContent = serviceSpec(data);
			} else if (file.name.includes("directive")) {
				specFileContent = directiveSpec(data);
			} else if (file.name.includes("interceptor")) {
				specFileContent = interceptorSpec(data);
			} else if (file.name.includes("pipe")) {
				specFileContent = pipeSpec(data);
			}

			const specFilePath = specFileName;
			console.log("writefile start" + specFilePath);

			fs.writeFileSync(specFilePath, specFileContent, "utf-8");
			console.log("writefile finished");

			vscode.window.showInformationMessage(
				`Jest spec file "${path.parse(specFileName).name}" created.`
			);
		} catch (error: any) {
			console.error("Error creating Jest spec file:", error);
			vscode.window.showErrorMessage(
				`Error creating Jest spec file: ${error.message}`
			);
		}
	}
}
