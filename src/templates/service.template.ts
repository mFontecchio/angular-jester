import { FileInfo } from "../models/index.angular";
import { getAccessorMatches } from "./shared/accessor.template";
import { getImportMatches } from "./shared/import.template";
import { getServiceMatches } from "./shared/injectedService.template";
import { getMethodMatches } from "./shared/method.template";

export function serviceSpec(file: FileInfo) {
    try {
        // Generate TestBed setup with injected services and method stubs
        const specContent = `
import { TestBed } from '@angular/core/testing';
import { ${file.class.name} } from './${file.name}';
${getImportMatches(file.class).join("")}

describe('${file.class.name}', () => {
    let service: ${file.class.name};
    // Create variables for services
    // Create universal mocks here

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Add any imported components/modules here 
            imports: [],
            providers: [
            // Add your injected services here
                ${getServiceMatches(file.class).providers}
            ],
        });
        
        service = TestBed.inject(${file.class.name});
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    ${getAccessorMatches(file.class).join("")}

    ${getMethodMatches(file.class, "service").join("")}
});
      `;

        return specContent;
    } catch (error) {
        console.error("Error generating service spec:", error);
        return "";
    }
}
