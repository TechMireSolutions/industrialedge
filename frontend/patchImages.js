const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function findJsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findJsxFiles(filePath, fileList);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findJsxFiles(dir);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Skip if it's the utility itself or already imports it
  if (file.includes('getImageUrl.js') || file.includes('App.jsx') || file.includes('main.jsx')) continue;
  
  let needsImport = false;
  
  // Replace <img src={something} ... /> with <img src={getImageUrl(something)} ... />
  // We look for src={ ... } inside an <img tag
  
  const regex = /<img[^>]*\bsrc=\{([^}]+)\}/g;
  content = content.replace(regex, (match, srcValue) => {
    // If it's already wrapped, skip
    if (srcValue.includes('getImageUrl(')) return match;
    
    // We only want to wrap if it's a variable or expression, not a static string
    needsImport = true;
    return match.replace(srcValue, \getImageUrl(\)\);
  });
  
  // Also replace simple string srcs if they might be dynamic, but usually they are static like src="/img/foo.png". 
  // Let's stick to expression srcs.
  
  if (needsImport && !content.includes('getImageUrl')) {
    // Add import statement at the top after React imports
    const depth = file.split('src')[1].split(/\\|\//).length - 2;
    const relativePath = depth > 0 ? '../'.repeat(depth) + 'utils/getImageUrl' : './utils/getImageUrl';
    
    content = \import { getImageUrl } from '\'\n\ + content;
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Modified', file);
  }
}

console.log('Total files modified:', modifiedCount);
