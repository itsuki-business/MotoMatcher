const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const root = process.cwd();
const srcGlob = 'src/**/*.{js,jsx,ts,tsx}';
const files = glob.sync(srcGlob, { nodir: true });

function resolveImport(baseFile, imp) {
  if (!imp.startsWith('.')) return imp; // external
  const baseDir = path.dirname(baseFile);
  const candidate = path.join(baseDir, imp);
  const exts = ['.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  for (const e of exts) {
    const p = candidate.endsWith(e) ? candidate : candidate + e;
    if (fs.existsSync(p)) return path.relative(root, p).replace(/\\/g, '/');
  }
  // best-effort
  return path.relative(root, candidate).replace(/\\/g, '/');
}

const nodes = new Set();
const edges = [];

for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  nodes.add(rel);
  const code = fs.readFileSync(f, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy']
    });
  } catch (e) {
    console.error('Parse error', rel, e.message);
    continue;
  }

  // map of local imported name -> resolved path or module
  const imports = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const src = node.source.value;
      for (const spec of node.specifiers) {
        const local = spec.local.name;
        imports[local] = resolveImport(rel, src);
      }
    }
  });

  traverse(ast, {
    JSXOpeningElement({ node }) {
      if (node.name && node.name.type === 'JSXIdentifier') {
        const compName = node.name.name;
        const target = imports[compName];
        if (target) {
          const props = node.attributes
            .filter(a => a.type === 'JSXAttribute' && a.name && a.name.name)
            .map(a => a.name.name);
          edges.push({
            from: rel,
            to: target,
            label: props.length ? `props: ${props.join(',')}` : 'props: (none)'
          });
          nodes.add(target);
        }
      }
    },
    CallExpression({ node }) {
      if (node.callee && node.callee.type === 'Identifier') {
        const callee = node.callee.name;
        const target = imports[callee];
        if (target) {
          const args = node.arguments.map(a => {
            if (a.type === 'Identifier') return a.name;
            if (a.type === 'StringLiteral') return `"${a.value}"`;
            if (a.type === 'NumericLiteral') return `${a.value}`;
            return a.type;
          });
          edges.push({
            from: rel,
            to: target,
            label: `call ${callee}(${args.join(',')})`
          });
          nodes.add(target);
        }
      }
    }
  });
}

// produce DOT
let dot = 'digraph G {\n  rankdir=LR;\n  node [shape=box,fontname="Meiryo"];\n';
for (const n of nodes) {
  const label = path.basename(n);
  dot += `  "${n}" [label="${label}\\n${n}"];\n`;
}
for (const e of edges) {
  const lbl = e.label.replace(/"/g, '\\"');
  dot += `  "${e.from}" -> "${e.to}" [label="${lbl}"];\n`;
}
dot += '}\n';

fs.writeFileSync('flow.dot', dot, 'utf8');
console.log('Wrote flow.dot (nodes:', nodes.size, 'edges:', edges.length, ')');