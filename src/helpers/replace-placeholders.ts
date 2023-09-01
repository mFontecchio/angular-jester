export function replacePlaceholders(
	template: string,
	data: {[key: string]: string}
): string {
	return template.replace(/{{(.*?)}}/g, (match, key) => data[key] || match);
}
