const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const RAW_VAR_REGEX = /\$([a-z][a-z0-9-]*):\s*([^;]*);/gi;
const RENDERED_VAR_REGEX = /\.([^{]+){v:([^}]+)}/g;
const SCSSPath = path.resolve(__dirname, '../stylesheets/_variables.scss');
const outputTSPath = path.resolve(__dirname, '../output/exported_variables.ts');

const successLog = msg => console.log('\x1b[32m%s\x1b[0m', msg);
const failedLog = msg => console.log('\x1b[31m%s\x1b[0m', msg);

const parseVariables = content => {
  const camelCase = str => {
    const CAMEL_CASE_REGEX = /(?:-|\s)+([^-\s])/g;
    str = str.replace(CAMEL_CASE_REGEX, (_, b) => b.toUpperCase());
    return str.substr(0, 1).toLowerCase() + str.substr(1);
  };
  const variables = [];
  let match;

  while ((match = RAW_VAR_REGEX.exec(content)) !== null) {
    const [, variable, value] = match;
    variables.push([variable, value.trim()]);
  }

  const rendered = sass
    .renderSync({
      data:
        variables.map(([name, value]) => `$${name}: ${value};`).join('') +
        variables.map(([name, value]) => `.${name}{v:${value}}`).join(''),
      outputStyle: 'compressed',
    })
    .css.toString();

  const parsedVariables = {};
  let rm;

  while ((rm = RENDERED_VAR_REGEX.exec(rendered)) !== null) {
    const [, variable, value] = rm;
    parsedVariables[camelCase(variable)] = value;
  }

  return parsedVariables;
};

const getContent = path =>
  Promise.resolve(fs.readFileSync(path, 'UTF-8').toString());

const transformToJSON = obj => JSON.stringify(obj, null, 2);

const composeOutput = type => jsonObj => {
  const pinTimeFlag = () => {
    const current = dayjs();
    const timestamp = current.valueOf();
    const date = current.format('YYYY-MM-DD HH:MM:SS');

    return `// Time: ${date} timestamp: (${timestamp}) \n`;
  };

  const preWord = '// This is auto generated file, please do not modify it! \n';

  const jsFormatExport = 'module.exports = ';
  const tsFormatExport = 'export default ';

  const exportFormat = type === 'js' ? jsFormatExport : tsFormatExport;

  return `${pinTimeFlag()} ${preWord} ${exportFormat} ${jsonObj};`;
};

const composeOutputTS = composeOutput('ts');

const genFile = path => content => {
  fs.writeFileSync(path, content);
};

const genTSFile = genFile(outputTSPath);
const getJsonObj = getContent(SCSSPath)
  .then(parseVariables)
  .then(transformToJSON);

getJsonObj
  .then(composeOutputTS)
  .then(genTSFile)
  .then(successLog('gen-colors-map-from-scss-vars for ts success!'))
  .catch(e =>
    failedLog(
      `gen-colors-map-from-scss-vars for ts failed! ${JSON.stringify(e)}`
    )
  );
