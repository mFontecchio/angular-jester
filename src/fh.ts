import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {ParsedPath} from "path";
import {findAllMethods, getUsedMethods} from "./helpers";
import ts = require("typescript");
import {parseTsFile} from "./helpers/parse-source-file.angular";

export class FH {
	createJestSpecFile(filePath: string) {
		try {
			console.log("filehandler");
			const file = path.parse(filePath);
			const specFileName = `${file.dir}/${file.name}.spec${file.ext}`;
			let specFileContent = "";

			if (file.name.includes("component")) {
				specFileContent = this.componentSpec(
					file,
					this.getClassName(file)
				);
			} else if (
				file.name.includes("service") ||
				file.name.includes("guard") ||
				file.name.includes("resolver")
			) {
				// specFileContent = this.serviceSpec(file);
				return console.log(parseTsFile(file));
			} else if (file.name.includes("directive")) {
				specFileContent = this.directiveSpec(
					file,
					this.getClassName(file)
				);
			} else if (file.name.includes("interceptor")) {
				specFileContent = this.interceptorSpec(
					file,
					this.getClassName(file)
				);
			} else if (file.name.includes("pipe")) {
				specFileContent = this.pipeSpec(file, this.getClassName(file));
			}

			const specFilePath = specFileName;
			console.log("writefile start" + specFilePath);

			fs.writeFileSync(specFilePath, specFileContent, "utf-8");
			console.log("writefile finished");

			vscode.window.showInformationMessage(
				`Jest spec file "${path.parse(specFileName).name}" created.`
			);
		} catch (error: any) {
			console.error("Error creating Jest spec file:", error);
			vscode.window.showErrorMessage(
				`Error creating Jest spec file: ${error.message}`
			);
		}
	}

	private pipeSpec(file: ParsedPath, className: string): string {
		return `import { ${className} } from "./${file.name}";

        describe('${className}', () => {
        let pipe: ${className};

        beforeEach(() => {
            pipe = new ${className}();
        })

        it('should ...', () => {
            expect(pipe).toBeTruthy();
        });
        });
        `;
	}

	private interceptorSpec(file: ParsedPath, className: string): string {
		return `import { TestBed } from '@angular/core/testing';
        import { ${className} } from "./${file.name}";

        describe('${className}', () => {
        beforeEach(() => TestBed.configureTestingModule({
            providers: [
            ${className}
            ]
        }));

        it('should ...', () => {
            const interceptor: ${className} = TestBed.inject(${className});
            expect(interceptor).toBeTruthy();
        });
        });
        `;
	}

	private directiveSpec(file: ParsedPath, className: string): string {
		return `import { ${className} } from "./${file.name}";

        describe('${className}', () => {
        it('should ...', () => {
            const directive = new ${className}();
            expect(directive).toBeTruthy();
        });
        });
        `;
	}

	private componentSpec(file: ParsedPath, className: string): string {
		const methodMatches = this.getMethodMatches(file);
		return `import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
        import { ComponentFixture, TestBed } from "@angular/core/testing";
        import { ${className} } from "./${file.name}";

        describe("${className}", () => {
        let component: ${className};
        let fixture: ComponentFixture<${className}>;
        let myService: MyService;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
            declarations: [${className}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: MyService, useValue: {} }],
            imports: []
            }).compileComponents();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(${className});
            component = fixture.componentInstance;
            fixture.detectChanges();

            myService = TestBed.inject(MyService);
        });

        ${methodMatches.join("")}
        })`;
	}

	private serviceSpec(file: ParsedPath) {
		try {
			console.log("servicespec");
			const className = this.getClassName(file);
			const methodMatches = this.getMethodMatches(file);
			const serviceMatches = this.getServiceMatches(file);

			// Generate TestBed setup with injected services and method stubs
			const specContent = `
import { TestBed } from '@angular/core/testing';
import { ${className} } from './${file.name}';

describe('${className}', () => {
    let service: ${className};
    // Create variables for services
    // Create universal mocks here

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            // Add your injected services here
                ${serviceMatches.providers}
            ],
        });
        
        service = TestBed.inject(${className});
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    ${methodMatches.join("")}
});
      `;

			return specContent;
		} catch (error) {
			console.error("Error generating service spec:", error);
			return "";
		}
	}

	// Helper Methods

	private getFileContent(file: ParsedPath): string {
		const filePath = path.join(file.dir, file.base);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		return fileContent;
	}

	private getClassName(file: ParsedPath) {
		const fileContent = this.getFileContent(file);
		// Extract class name (assuming it's a single class per file)
		const classNameMatch = fileContent.match(/class\s+(\w+)/);
		const className = classNameMatch ? classNameMatch[1] : "";
		return className;
	}

	private getMethodMatches(file: ParsedPath) {
		const fileContent = this.getFileContent(file);
		// Find all methods in the file
		const methodMatches =
			fileContent.match(/\s+(\w+)(<.*?>\(|\()[^)]*\)(:.*\s|\s*){/g) || [];
		return methodMatches.map((methodMatch) => {
			const methodName = methodMatch.match(/(\w+)\s*\(/)?.[1] || "";
			return `
        describe('${methodName}', () => {
          it('should...', () => {
            // Arrange
            // Act
            const result = service.${methodName}();
            // Assert
            // Add your assertions here
          });
        });
      `;
		});
	}

	private getServiceMatches(file: ParsedPath) {
		const fileContent = this.getFileContent(file);
		// Find all services in the constructor
		const serviceMatches =
			fileContent.match(/private\s+\w+\s*:\s*([A-Z]\w+)\s*/g) || [];
		const providers = serviceMatches
			.map((serviceMatch) => {
				const serviceName =
					serviceMatch.match(/\w+\s*:\s*([A-Z]\w+)\s*/)?.[1] || "";
				return serviceName === "HttpClient" ? "" : `${serviceName},`;
			})
			.join("");
		const services = serviceMatches
			.map((serviceMatch) => {
				const serviceName =
					serviceMatch.match(/\w+\s*:\s*([A-Z]\w+)\s*/)?.[1] || "";
				return serviceName;
			})
			.join(", ");
		return {providers, services};
	}
}
