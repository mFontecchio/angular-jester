import {ClassInfo} from "../../models/index.angular";

export function getMethodMatches(file: ClassInfo, type: string) {
	return file.methods?.map((method) => {
		return `
describe('${method.name}', () => {
  it('should...', () => {
    // Arrange
    // Act
    const result = ${type}.${method.name}(${
			method.arguments
				? method.arguments.map((arg) => {
						return arg.name;
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
