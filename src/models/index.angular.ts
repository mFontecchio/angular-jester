import * as ts from "typescript";

export interface AngularImport {
	// The name of the imported module or component
	name: string;

	// The import path
	importPath: string;
}

export interface AngularModel {
	// The name of the model class or interface
	name: string;

	// The properties of the model
	properties: AngularProperty[];
}

export interface AngularProperty {
	// The name of the property
	name: string;

	// The type of the property
	type: string;
}

export interface AngularService {
	// The name of the service class
	name: string;

	// The methods defined in the service
	methods: AngularMethod[];
}

export interface AngularMethod {
	// The name of the method
	name: string;

	// Indicates if the method is asynchronous (async/await)
	isAsync: boolean;

	// Indicates if the method is static
	isStatic: boolean;

	// The parameters of the method
	parameters: AngularParameter[];

	// The return type of the method
	returnType: string;
}

export interface AngularParameter {
	// The name of the parameter
	name: string;

	// The type of the parameter
	type: string;
}

export interface AngularComponent {
	// The name of the component class
	name: string;

	// The properties (inputs) of the component
	properties: AngularProperty[];

	// The methods defined in the component
	methods: AngularMethod[];

	// The lifecycle hooks implemented by the component
	lifecycleHooks: string[];

	// The imported modules or components
	imports: AngularImport[];

	// The services injected into the component
	injectedServices: string[];
}

export interface AngularModule {
	// The name of the Angular module
	name: string;

	// The components declared in the module
	components: AngularComponent[];

	// The services provided by the module
	providedServices: string[];

	// The imported modules or components
	imports: AngularImport[];
}

export interface AngularConstructor {
	// The name of the constructor
	name: string;

	// The parameters of the constructor
	parameters: AngularParameter[];
}
