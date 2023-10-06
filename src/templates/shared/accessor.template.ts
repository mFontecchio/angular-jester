import {ClassInfo} from "../../models/index.angular";

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
