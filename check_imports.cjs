const fs = require('fs');
const path = require('path');

const exts = ['.js', '.jsx'];
let errors = [];

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file === 'node_modules') continue;
      walk(full);
    } else if (exts.includes(path.extname(file))) {
      checkFile(full);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /from\s+['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    const resolved = path.resolve(path.dirname(filePath), importPath);
    const dir = path.dirname(resolved);
    const base = path.basename(resolved);
    if (!fs.existsSync(dir)) continue;
    const realFiles = fs.readdirSync(dir);
    const found = realFiles.some(f => path.parse(f).name === base || f === base);
    const foundExact = realFiles.some(f => f === base || path.parse(f).name === base) &&
      realFiles.some(f => (f === base || path.parse(f).name === base));
    // case-sensitive exact check
    const exactMatch = realFiles.find(f => path.parse(f).name === base) || realFiles.find(f => f === base);
    const caseInsensitiveMatch = realFiles.find(f => path.parse(f).name.toLowerCase() === base.toLowerCase());
    if (!exactMatch && caseInsensitiveMatch) {
      errors.push(`${filePath}: "${importPath}" -> real file is "${caseInsensitiveMatch}"`);
    } else if (!exactMatch && !caseInsensitiveMatch) {
      errors.push(`${filePath}: "${importPath}" -> NOT FOUND at all in ${dir}`);
    }
  }
}

walk('src');
console.log(`Found ${errors.length} problems:\n`);
errors.forEach(e => console.log(e));
