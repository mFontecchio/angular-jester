import {FileInfo} from "../models/index.angular";
import {getImportMatches} from "./shared/import.template";
import {getServiceMatches} from "./shared/injectedService.template";
import {getMethodMatches} from "./shared/method.template";

/**
 * Generates the component spec code for a given file.
 *
 * @param file - The file information.
 * @returns The generated component spec code.
 */
export function componentSpec(file: FileInfo) {
	try {
		return `
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ${file.class.name} } from "./${file.name}";
${getImportMatches(file.class).join("")}

describe("${file.class.name}", () => {
    let component: ${file.class.name};
    let fixture: ComponentFixture<${file.class.name}>;
    //let myService: MyService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [${file.class.name}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [${getServiceMatches(file.class).providers}],
            imports: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(${file.class.name});
        component = fixture.componentInstance;
        fixture.detectChanges();

        //myService = TestBed.inject(MyService);
    });

    ${getMethodMatches(file.class, "component").join("")}
})
        `;
	} catch (error) {
		console.error("Error generating component spec:", error);
		return "";
	}
}
