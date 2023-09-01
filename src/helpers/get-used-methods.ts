import ts = require("typescript");
import {ParsedClass} from "../models";

export function getUsedMethods(sourceCode: string, variable: string) {
	const result: string[] = [];
	const regex = new RegExp(`${variable}\\\.([a-zA-Z0-9]+)[\\\(<)]`, "g");
	let matches: RegExpExecArray | null;

	while ((matches = regex.exec(sourceCode))) {
		if (result.indexOf(matches[1]) === -1) {
			result.push(decodeURIComponent(matches[1]));
		}
	}
	return result;
}

export function findAllMethods(file: ts.Node) {
	switch (file.kind) {
		case ts.SyntaxKind.ClassDeclaration:
			const node = file as ts.ClassDeclaration;
			const klass: ParsedClass = {
				name: node.name && (node.name.escapedText as any),
				methods: [],
				isDefaultExport: false,
			};
			ts.forEachChild(node, (child) => {
				if (child.kind === ts.SyntaxKind.MethodDeclaration) {
					const methodChild = child as ts.MethodDeclaration;
					const methodName = methodChild.name
						? (methodChild.name as ts.Identifier).escapedText
						: "";
					klass.methods.push({
						methodName,
						params: methodChild.parameters.map(
							(param) => (param.name as ts.Identifier).escapedText
						),
						isAsync: hasAsyncModifier(methodChild),
						isStatic: hasStaticModifier(methodChild),
					});
				}
			});
			return klass;
			break;
		default:
			ts.forEachChild(file, findAllMethods);
	}
}

function hasDefaultModifier(
	node:
		| ts.ClassDeclaration
		| ts.FunctionDeclaration
		| ts.FunctionExpression
		| ts.VariableStatement
) {
	return node.modifiers
		? node.modifiers.some(
				(mode) => mode.kind === ts.SyntaxKind.DefaultKeyword
		  )
		: false;
}

function hasAsyncModifier(
	node:
		| ts.ClassDeclaration
		| ts.FunctionDeclaration
		| ts.FunctionExpression
		| ts.MethodDeclaration
) {
	return node.modifiers
		? node.modifiers.some((mod) => mod.kind === ts.SyntaxKind.AsyncKeyword)
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
		? node.modifiers.some((mod) => mod.kind === ts.SyntaxKind.StaticKeyword)
		: false;
}
