import {ClassInfo} from "../models/index.angular";
import {getImportMatches} from "./shared/import.template";
import {getMethodMatches} from "./shared/method.template";

export function interceptorSpec(file: ClassInfo) {
	try {
		const specContent = `import { TestBed } from '@angular/core/testing';
import { ${file.name} } from "./${file.fileName}";
${getImportMatches(file)?.join("")}

describe('${file.name}', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            ${file.name}
        ]
    }));

    it('should ...', () => {
        const interceptor: ${file.name} = TestBed.inject(${file.name});
        expect(interceptor).toBeTruthy();
    });
});`;
		return specContent;
	} catch (error) {
		console.error("Error generating pipe spec:", error);
		return "";
	}
}
