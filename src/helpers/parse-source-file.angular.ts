import * as ts from "typescript";
import * as fs from "fs";
import {ParsedPath} from "path";
import path = require("path");
import {ArgumentInfo, ClassInfo, ImportInfo} from "../models/index.angular";

export function parseTsFile(file: ParsedPath): Record<string, ClassInfo> {
	const filePath = path.join(file.dir, file.base);
	const sourceFile = ts.createSourceFile(
		"./x.ts",
		fs.readFileSync(filePath, "utf-8"),
		ts.ScriptTarget.Latest,
		true
	);

	const parsedData: Record<string, ClassInfo> = {};
	const importData: ImportInfo[] = [];

	function visit(node: ts.Node) {
		if (ts.isImportDeclaration(node)) {
			// Handle import declarations
			let namedImports: string[] = [];
			node.importClause?.namedBindings?.forEachChild((namedImport) => {
				namedImports.push(namedImport.getText());
			});

			importData.push({
				path: (node.moduleSpecifier as ts.StringLiteral).text,
				names: namedImports,
				importText: node.getFullText(),
			});
		} else if (ts.isClassDeclaration(node)) {
			// Handle class declarations
			const className = node.name?.getText();
			if (className) {
				parsedData[className] = {
					name: className,
					imports: importData,
					dependencies: [],
					methods: [],
					interfaces: [],
				};

				node.forEachChild((childNode) => {
					if (ts.isConstructorDeclaration(childNode)) {
						childNode.parameters.forEach((param) => {
							parsedData[className].dependencies.push({
								name: param.name?.getText(),
								type: param.type?.getText(),
							});
						});
					}
					if (ts.isMethodDeclaration(childNode)) {
						// Handle method declarations
						const methodName = childNode.name?.getText();
						// Handle arguments
						let args: ArgumentInfo[] = [];

						childNode.parameters.forEach((param) => {
							args.push({
								name: param.name?.getText(),
								type: param.type?.getText(),
							});
						});

						if (methodName) {
							parsedData[className].methods.push({
								name: methodName,
								arguments: args,
								isStatic: hasStaticModifier(childNode),
								isAsync: hasAsyncModifier(childNode),
							});
						}
					} else if (ts.isHeritageClause(childNode)) {
						// Handle implemented interfaces
						childNode.types.forEach((interfaceNode) => {
							const interfaceName = interfaceNode.getText();
							parsedData[className].interfaces.push(
								interfaceName
							);
						});
					}
				});
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return parsedData;

	function hasAsyncModifier(
		node:
			| ts.ClassDeclaration
			| ts.FunctionDeclaration
			| ts.FunctionExpression
			| ts.MethodDeclaration
	) {
		return node.modifiers
			? node.modifiers.some(
					(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword
			  )
			: false;
	}

	function hasStaticModifier(
		node:
			| ts.ClassDeclaration
			| ts.FunctionDeclaration
			| ts.FunctionExpression
			| ts.MethodDeclaration
	) {
		return node.modifiers
			? node.modifiers.some(
					(mod) => mod.kind === ts.SyntaxKind.StaticKeyword
			  )
			: false;
	}

	function hasExportModifier() {}
}
