import {ClassInfo} from "../../models/index.angular";

export function getServiceMatches(file: ClassInfo) {
	const providers = file.dependencies
		?.map((service) => {
			return service.type === "HttpClient" ? "" : `${service.type},`;
		})
		.join("");
	const services = file.dependencies
		?.map((service) => {
			return service.name;
		})
		.join(", ");
	return {providers, services};
}
