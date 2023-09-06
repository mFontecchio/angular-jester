export interface ImportInfo {
	path: string;
	names: string[];
	importText: string;
}

export interface ClassInfo {
	name: string;
	dependencies: DependencyInfo[];
	methods: MethodInfo[];
	interfaces: string[];
	imports: ImportInfo[];
	properties: PropertyInfo[];
	lifecycleHooks?: LifecycleHookInfo[];
}

export interface ConstructorInfo {
	injectedDependencies: DependencyInfo[];
}

export interface DependencyInfo {
	name: string;
	type?: string;
}

export interface MethodInfo {
	name: string;
	arguments: ArgumentInfo[];
	isStatic: boolean;
	isAsync: boolean;
}

export interface ArgumentInfo {
	name: string;
	type?: string;
}

export interface PropertyInfo {
	name: string;
	type?: string;
	defaultValue?: any;
	decorator?: ModifierInfo[];
	isOptional: boolean;
}

export interface ModifierInfo {
	name: string;
	kind: number;
}

export interface FunctionInfo {
	name: string;
	isAsync: boolean;
}

//ngOnInit, ngOnChange, ngDestroy, etc...
export interface LifecycleHookInfo {
	name: string;
	properties?: PropertyInfo[];
	methods?: MethodInfo[];
}
