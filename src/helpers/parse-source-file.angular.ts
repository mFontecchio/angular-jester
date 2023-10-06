import * as ts from "typescript";
import * as fs from "fs";
import {ParsedPath} from "path";
import path = require("path");
import {
	AccessorInfo,
	ArgumentInfo,
	ClassInfo,
	ImportInfo,
	ModifierInfo,
	PropertyInfo,
} from "../models/index.angular";

export function parseTsFile(file: ParsedPath): ClassInfo {
	const filePath = path.join(file.dir, file.base);
	const sourceFile = ts.createSourceFile(
		"./x.ts",
		fs.readFileSync(filePath, "utf-8"),
		ts.ScriptTarget.Latest,
		true
	);

	// Setup data collections
	// const parsedData: any = {};
	const importData: ImportInfo[] = [];
	const propertyData: PropertyInfo[] = [];
	const accessorData: AccessorInfo[] = [];
	let parsedData: ClassInfo = {
		fileName: file.name,
		name: "",
		dependencies: [],
		accessors: [],
		methods: [],
		interfaces: [],
		imports: [],
		properties: [],
	};

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
				parsedData = {
					fileName: file.name,
					name: className,
					imports: importData,
					properties: propertyData,
					dependencies: [],
					accessors: [],
					methods: [],
					interfaces: [],
				};

				node.forEachChild((childNode) => {
					// Handle class property declarations
					if (ts.isPropertyDeclaration(childNode)) {
						let propModifier: ModifierInfo[] = [];
						childNode.modifiers?.forEach((modifier) => {
							propModifier.push({
								name: modifier.getText(),
								kind: modifier.kind,
							});
						});
						parsedData.properties.push({
							name: childNode.name.getText(),
							type: childNode.type?.getText(),
							defaultValue: childNode.initializer?.getText(),
							decorator: propModifier,
							isOptional: !!childNode.questionToken,
						});
					}
					// Handle get/set accessor
					if (
						ts.isGetAccessorDeclaration(childNode) ||
						ts.isSetAccessorDeclaration(childNode)
					) {
						let args: ArgumentInfo[] = [];
						const accessorName = childNode.name?.getText();
						childNode.parameters.forEach((param) => {
							args.push({
								name: param.name?.getText(),
								type: param.type?.getText(),
							});
						});
						if (accessorName) {
							parsedData.accessors.push({
								name: accessorName,
								arguments: args,
								type: childNode.type?.getText(),
							});
						}
					}
					if (ts.isConstructorDeclaration(childNode)) {
						childNode.parameters.forEach((param) => {
							parsedData.dependencies.push({
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
							parsedData.methods.push({
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
							parsedData.interfaces.push(interfaceName);
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

	function hasExportModifier(
		node:
			| ts.ClassDeclaration
			| ts.FunctionDeclaration
			| ts.VariableStatement
	) {
		return node.modifiers
			? node.modifiers.some(
					(mod) => mod.kind === ts.SyntaxKind.DefaultKeyword
			  )
			: false;
	}
}
