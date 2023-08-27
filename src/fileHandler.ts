import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ParsedPath } from "path";

export class FileHandler {
    createJestSpecFile(filePath: string) {
        const file = path.parse(filePath);
        const specFileName = `${file.dir}/${file.name}.spec${file.ext}`;
        let specFileContent = "";

        if (file.name.includes("component")) {
            specFileContent = this.componentSpec(file, this.getClassName(file));
        } else if (
            file.name.includes("service") ||
            file.name.includes("guard") ||
            file.name.includes("resolver")
        ) {
            specFileContent = this.serviceSpec(file);
        } else if (file.name.includes("directive")) {
            specFileContent = this.directiveSpec(file, this.getClassName(file));
        } else if (file.name.includes("interceptor")) {
            specFileContent = this.interceptorSpec(
                file,
                this.getClassName(file)
            );
        } else if (file.name.includes("pipe")) {
            specFileContent = this.pipeSpec(file, this.getClassName(file));
        }

        const specFilePath = filePath.replace(".ts", `-${specFileName}`);

        fs.writeFileSync(specFilePath, specFileContent, "utf-8");

        vscode.window.showInformationMessage(
            `Jest spec file "${specFileName}" created.`
        );
    }

    private getClassName(file: path.ParsedPath) {
        const filePath = path.join(file.dir, file.base);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        // Extract class name (assuming it's a single class per file)
        const classNameMatch = fileContent.match(/class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : "";
        return className;
    }

    private getServices() {}

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

    private serviceSpec(file: ParsedPath) {
        const filePath = path.join(file.dir, file.base);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Extract class name (assuming it's a single class per file)
        const classNameMatch = fileContent.match(/class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : "";

        // Find all methods in the file
        const methodMatches = fileContent.match(/(\w+)\s*\([^)]*\)\s*{/g) || [];

        // Find all services in the constructor
        const serviceMatches =
            fileContent.match(/.*?constructor\((.*?)\s*\)/g) || [];
        // Generate TestBed setup with injected services and method stubs
        const specContent = `
    import { TestBed } from '@angular/core/testing';
    import { ${className} } from './${file.name}';
    
    describe('${className}', () => {
      let service: ${className};
    
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            // Add your injected services here
            ${serviceMatches
                .map((serviceMatch) => {
                    const serviceName =
                        serviceMatch.match(/.*?\:(.*?)(\,|$)/)?.[1] || "";
                    return `${serviceName}`;
                })
                .join("")}
          ],
        });
        service = TestBed.inject(${className});
      });
    
      ${methodMatches
          .map((methodMatch) => {
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
          })
          .join("")}
    
    });
    `;
        return specContent;
    }

    private componentSpec(file: ParsedPath, className: string): string {
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

        describe('method1', () => {
            it('should ...', () => {
            expect(component).toBeTruthy();
            });
        });
        })`;
    }
}
