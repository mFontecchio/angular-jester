/**
 * Retrieves the matches for the injected services in the given file.
 *
 * @param file - The ClassInfo object representing the file.
 * @returns An object containing the providers and services.
 */
import { ClassInfo } from "../../models/index.angular";

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
    return { providers, services };
}
