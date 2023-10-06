import {ClassInfo} from "../models/index.angular";
import {getImportMatches} from "./shared/import.template";
import {getServiceMatches} from "./shared/injectedService.template";
import {getMethodMatches} from "./shared/method.template";

export function pipeSpec(file: ClassInfo) {
	try {
		const specContent = `import { ${file.name} } from "./${file.fileName}";
${getImportMatches(file)?.join("")}

describe('${file.name}', () => {
    let pipe: ${file.name};

    beforeEach(() => {
        pipe = new ${file.name}(${getServiceMatches(file).providers});
    })

    it('should should create an instance', () => {
        expect(pipe).toBeTruthy();
    });
    ${getMethodMatches(file, "pipe")?.join("")}
});`;
		return specContent;
	} catch (error) {
		console.error("Error generating pipe spec:", error);
		return "";
	}
}
