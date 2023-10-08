import { FileInfo } from "../models/index.angular";
import { getMethodMatches } from "./shared/method.template";

export function directiveSpec(file: FileInfo) {
    try {
        return `import { ${file.class.name} } from "./${file.name}";
import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

// create test component for use in directive testing
@Component({
    template: ''
})
class TestComponent {}

describe('${file.class.name}', () => {
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [${file.class.name}, TestComponent]
        })
        .createComponent(TestComponent);
        fixture.detectChanges(); // initial binding
    });
    it('should ...', () => {
        const directive = new ${file.class.name}();
        expect(directive).toBeTruthy();
    });
    ${getMethodMatches(file.class, "directive")?.join("")}
});`;
    } catch (error) {
        console.error("Error generating service spec:", error);
        return "";
    }
}
