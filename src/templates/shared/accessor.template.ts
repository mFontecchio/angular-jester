/**
 * Returns an array of test case descriptions for each accessor in the given file.
 * @param file - The ClassInfo object representing the file.
 * @returns An array of test case descriptions.
 */
import { ClassInfo } from "../../models/index.angular";

export function getAccessorMatches(file: ClassInfo) {
    return file.accessors?.map((accessor) => {
        return `describe('${accessor.name}', () => {
  it('should...', () => {
    // Arrange
    // Act
    const result = service.${accessor.name}(${
            accessor.arguments ? accessor.arguments : ""
        });
    // Assert
    // Add your assertions here
  });
});`;
    });
}
