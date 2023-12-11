import { ClassInfo, MethodInfo } from "../../models/index.angular";
import { configService } from "../../services/config.service";

/**
 * Retrieves an array of method matches from the given file based on the specified type.
 * @param file - The ClassInfo object representing the file.
 * @param type - The type to filter the methods by.
 * @returns An array of method match descriptions.
 */
export function getMethodMatches(file: ClassInfo, type: string) {
    return file.methods
        ?.filter((method) => !method.isPrivate)
        ?.map((method) => {
            const testMethodTemplate = buildTestMethodTemplate(type, method);
            return configService.useDescribeBlocks
                ? wrapInDescribeBlock(method.name, testMethodTemplate)
                : testMethodTemplate;
        });
}

function buildTestMethodTemplate(type: string, method: MethodInfo) {
    const shouldString = !configService.useDescribeBlocks
        ? `${method.name} should...`
        : `should...`;
    const testMethodTemplate = `it('${shouldString}', () => {
        // Arrange
        // Act
        const result = ${type}.${method.name}(${
        method.arguments
            ? method.arguments.map((arg) => {
                  return `${arg.name}: ${arg.type}`;
              })
            : ""
    });
        // Assert
        // Add your assertions here
    });`;
    return configService.useDescribeBlocks
        ? `  ${testMethodTemplate.replace(/\n/g, "\n  ")}\n`
        : `${testMethodTemplate}\n\n    `;
}

function wrapInDescribeBlock(methodName: string, testMethodTemplate: string) {
    return `
    describe('${methodName}', () => {
    ${testMethodTemplate}
    });
    `;
}
