import { FileInfo } from "../models/index.angular";
import { getImportMatches } from "./shared/import.template";

export function interceptorSpec(file: FileInfo) {
    try {
        const specContent = `import { TestBed } from '@angular/core/testing';
import { ${file.class.name} } from "./${file.name}";
${getImportMatches(file.class)?.join("")}

describe('${file.class.name}', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            ${file.class.name}
        ]
    }));

    it('should ...', () => {
        const interceptor: ${file.class.name} = TestBed.inject(${
            file.class.name
        });
        expect(interceptor).toBeTruthy();
    });
});`;
        return specContent;
    } catch (error) {
        console.error("Error generating pipe spec:", error);
        return "";
    }
}
