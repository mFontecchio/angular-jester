import {ClassInfo} from "../models/index.angular";
import {getMethodMatches} from "./shared/method.template";

export function directiveSpec(file: ClassInfo) {
	try {
		return `import { ${file.name} } from "./${file.fileName}";
import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

// create test component for use in directive testing
@Component({
    template: ''
})
class TestComponent {}

describe('${file.name}', () => {
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [${file.name}, TestComponent]
        })
        .createComponent(TestComponent);
        fixture.detectChanges(); // initial binding
    });
    it('should ...', () => {
        const directive = new ${file.name}();
        expect(directive).toBeTruthy();
    });
    ${getMethodMatches(file, "directive")?.join("")}
});`;
	} catch (error) {
		console.error("Error generating service spec:", error);
		return "";
	}
}
