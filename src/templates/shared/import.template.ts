import {ClassInfo} from "../../models/index.angular";

export function getImportMatches(file: ClassInfo) {
	const filteredImports = file.imports.filter((item) =>
		file.dependencies.find((dep) => item.importText.includes(dep.type!))
	);
	return filteredImports?.map((imports) => {
		return imports.importText ===
			"import { HttpClient } from '@angular/common/http';"
			? "import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'"
			: imports.importText;
	});
}
