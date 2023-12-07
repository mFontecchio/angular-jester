import { ClassInfo } from "../../models/index.angular";

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
            return `
describe('${method.name}', () => {
  it('should...', () => {
    // Arrange
    // Act
    const result = ${type}.${method.name}(${
                method.arguments
                    ? method.arguments.map((arg) => {
                          return `${arg.name}: ${arg.type}}`;
                      })
                    : ""
            });
    // Assert
    // Add your assertions here
  });
});
      `;
        });
}
