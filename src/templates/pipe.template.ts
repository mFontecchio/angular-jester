import { FileInfo } from "../models/index.angular";
import { getImportMatches } from "./shared/import.template";
import { getServiceMatches } from "./shared/injectedService.template";
import { getMethodMatches } from "./shared/method.template";

/**
 * Generates the spec file content for a pipe.
 *
 * @param file - The file information.
 * @returns The spec file content.
 */
export function pipeSpec(file: FileInfo) {
    try {
        const specContent = `import { ${file.class.name} } from "./${
            file.name
        }";
${getImportMatches(file.class)?.join("")}

describe('${file.class.name}', () => {
    let pipe: ${file.class.name};

    beforeEach(() => {
        pipe = new ${file.class.name}(${
            getServiceMatches(file.class).providers
        });
    })

    it('should should create an instance', () => {
        expect(pipe).toBeTruthy();
    });
    ${getMethodMatches(file.class, "pipe")?.join("")}
});`;
        return specContent;
    } catch (error) {
        console.error("Error generating pipe spec:", error);
        return "";
    }
}
