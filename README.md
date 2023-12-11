<p align=center><img src="logo.png" width="80"></p>

# Angular Jester

This is a rework/compilation of [angular-spec-generator](https://github.com/ThRintelen/angular-spec-generator) & [jest-test-gen](https://github.com/egm0121/jest-test-gen). The only difference is some exctra stubbing to include services and methods for each type.

Please support the originals:

-   [https://github.com/ThRintelen/angular-spec-generator](https://github.com/ThRintelen/angular-spec-generator) by [Thorsten Rintelen](https://github.com/ThRintelen) & [Bonnie Hanks](https://github.com/bonnie-gaggle).
-   [https://github.com/egm0121/jest-test-gen](https://github.com/egm0121/jest-test-gen) by [Giulio Dellorbo](https://github.com/egm0121)

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

## Known Issues

Some methods may not be found/included.

## Release Notes

### 0.0.12

Fixed templating issue for methods.

### 0.0.10

Angular 16+ updates. Few enhancements. Check out CHANGELOG.md for more info.

### 0.0.5

First publication of extension.

### 0.0.2

Initial release of Angular Jester
