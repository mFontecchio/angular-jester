import {ClassInfo} from "../models/index.angular";
import {getAccessorMatches} from "./shared/accessor.template";
import {getImportMatches} from "./shared/import.template";
import {getServiceMatches} from "./shared/injectedService.template";
import {getMethodMatches} from "./shared/method.template";

export function serviceSpec(file: ClassInfo) {
	try {
		// Generate TestBed setup with injected services and method stubs
		const specContent = `
import { TestBed } from '@angular/core/testing';
import { ${file.name} } from './${file.fileName}';
${getImportMatches(file).join("")}

describe('${file.name}', () => {
    let service: ${file.name};
    // Create variables for services
    // Create universal mocks here

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Add any imported components/modules here 
            imports: [],
            providers: [
            // Add your injected services here
                ${getServiceMatches(file).providers}
            ],
        });
        
        service = TestBed.inject(${file.name});
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    ${getAccessorMatches(file).join("")}

    ${getMethodMatches(file, "service").join("")}
});
      `;

		return specContent;
	} catch (error) {
		console.error("Error generating service spec:", error);
		return "";
	}
}
