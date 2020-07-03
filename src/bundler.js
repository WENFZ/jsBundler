const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {transformFromAst} = require('@babel/core');

let id = 0;
function getID() {
  return '' + (id++);
}

function analyzeModule(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parser.parse(content, {sourceType: 'module'});
  const deps = [];
  const moduleID = getID();
  const visitor = {
    ImportDeclaration: node => {
      deps.push(node.node.source.value);
    },
  };
  traverse(ast, visitor);
  const {code} = transformFromAst(ast, null, {presets: [`@babel/preset-env`]})
  return {code, filename, deps, moduleID};
}

function buildGraph(entry) {
  const modules = [];
  const queue = [analyzeModule(entry)];
  while (queue.length !== 0){
    const module = queue.shift();
    module.children = {};
    modules.push(module);
    module.deps.forEach(dep =>{
      const dirname = path.dirname(module.filename);
      const filename = path.join(dirname, dep);
      const child = analyzeModule(filename);
      module.children[dep] = child.moduleID;
      queue.push(child);
    });
  }
  return modules;
}

function buildBundle(graph) {
  let modules = ``;
  graph.forEach(node => {
    modules += `
            '${node.moduleID}':[function (require,module,exports) {
                ${node.code}
            },${JSON.stringify(node.children)}],
          `;
  });
  const bundle = `(function(modules) {
          // here variable modules is a global repository for modules
          function globalRequire(id) {
            const [fn, subDep] = modules[id];
            function localRequire(name) {
              return globalRequire(subDep[name]);
            }
            const module = { exports : {} };
            fn(localRequire, module, module.exports);
            return module.exports;
          }
          globalRequire('0');
        })({${modules}})`;
  return bundle;
}
module.exports = {buildGraph, buildBundle};
