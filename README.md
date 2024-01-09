# SCSS to TS/JS Variable Converter
## Overview
This script is designed to convert SCSS variables into a TypeScript/JavaScript JSON structure. It's particularly useful for projects where SCSS variables need to be accessible in TypeScript or JavaScript files.

## Requirements
Node.js

## Usage
Place your SCSS variables file at ../stylesheets/_variables.scss.
Run the script. This will parse the SCSS variables and convert them into a TypeScript format in ../output/exported_variables.ts.
The output file will contain the timestamp and a note indicating that it is an auto-generated file.

```
yarn gen-colors-map-from-scss-vars
```

## How It Works
The script reads SCSS variables from the specified path.

## Note
The script is set up for a specific directory structure. Modify the paths in the script if your project's structure is different.
It's recommended not to manually edit the generated TypeScript file as it is auto-generated and any changes might be overwritten.

## Troubleshooting
Ensure that all dependencies are installed.
Verify that the SCSS file path is correct.
