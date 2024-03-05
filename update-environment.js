"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
const filePath = './src/environments/environment.ts';
// Array to store extracted placeholders
let placeholders = [];

/**
 * Extracts all the ${ENV_VARIABLE_TEXT} and list them in an Array.
 */
function extractPlaceholdersFromFile() {
  // Read the content of the file
  let fileContent = fs.readFileSync(filePath, 'utf8');
  // Regular expression to match `${...}` patterns
  let regex = /\${([^}]+)}/g;
  // Iterate over each match and extract the placeholder text
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    placeholders.push(match[1]);
  }
}

/**
 * Replaces all placeholders from the array with the environment variable
 * and creates anew the environment.ts file used in production prior to build.
 */
function replaceEnvVariables() {
  // Read environment template file
  let updatedTemplate = fs.readFileSync(filePath, 'utf8');
  console.log(placeholders);
  placeholders.forEach(element => {
    updatedTemplate = updatedTemplate.replace('${' + element + '}', process.env[element]);
  });

  // Write updated environment file
  fs.writeFileSync('./src/environments/environment.ts', updatedTemplate);
}

extractPlaceholdersFromFile();
replaceEnvVariables();
