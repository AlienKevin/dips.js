import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and encode the GGUF model file
const ggufPath = path.join(__dirname, 'models', 'electra-small-6-layers-q4_0.gguf');
const ggufBuffer = fs.readFileSync(ggufPath);
const ggufBase64 = ggufBuffer.toString('base64');

// Read libbert.js and index.js
const libbertPath = path.join(__dirname, 'src', 'libbert.js');
const indexPath = path.join(__dirname, 'src', 'index.js');
const libbertContent = fs.readFileSync(libbertPath, 'utf-8');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Combine the files
const combinedContent = `
// Decoded GGUF model
const bertModelWeight = Buffer.from("${ggufBase64}", 'base64');

// libbert.js content
${libbertContent}

// index.js content with bertModelWeight
${indexContent}
`;

// Write the combined content to dist/main.js
const outputPath = path.join(__dirname, 'dist', 'main.js');
fs.writeFileSync(outputPath, combinedContent);

console.log('Combined file created successfully at:', outputPath);
