# angular-jester README

This is a fork of [angular-spec-generator](https://github.com/ThRintelen/angular-spec-generator). The only difference is some exctra stubbing to include services and methods for each type.

Please support the original [https://github.com/ThRintelen/angular-spec-generator](https://github.com/ThRintelen/angular-spec-generator) by [Thorsten Rintelen](https://github.com/ThRintelen) & [Bonnie Hanks](https://github.com/bonnie-gaggle).

## Features

Select an Angular \*.ts file and use right click to generate the spec file.

Generate spec (jest / jasmine) files for Angular elements:

-   component
-   service
-   guard
-   resolver
-   directive
-   pipe
-   interceptor

![](/src/images/extension.gif)

## Requirements

The extension works for files in an Angular project. The files should be named like this

-   .component.ts
-   .service.ts
-   .guard.ts
-   .resolver.ts
-   .directive.ts
-   .pipe.ts
-   .interceptor.ts

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

-   `myExtension.enable`: Enable/disable this extension.
-   `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Some methods may not be found/included.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.2

Initial release of Angular Jester
