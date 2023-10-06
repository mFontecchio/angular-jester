import {ClassInfo} from "../models/index.angular";
import {getImportMatches} from "./shared/import.template";
import {getServiceMatches} from "./shared/injectedService.template";
import {getMethodMatches} from "./shared/method.template";

export function componentSpec(file: ClassInfo) {
	try {
		return `import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
        import { ComponentFixture, TestBed } from "@angular/core/testing";
        import { ${file.name} } from "./${file.fileName}";
        ${getImportMatches(file).join("")}

        describe("${file.name}", () => {
        let component: ${file.name};
        let fixture: ComponentFixture<${file.name}>;
        //let myService: MyService;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
            declarations: [${file.name}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [${getServiceMatches(file).providers}],
            imports: []
            }).compileComponents();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(${file.name});
            component = fixture.componentInstance;
            fixture.detectChanges();

            //myService = TestBed.inject(MyService);
        });

        ${getMethodMatches(file, "component").join("")}
        })`;
	} catch (error) {
		console.error("Error generating component spec:", error);
		return "";
	}
}
