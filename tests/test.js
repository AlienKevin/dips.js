import path from 'path';
import { fileURLToPath } from 'url';

async function testBertModel() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const modelPath = path.join(__dirname, '../models/electra-small-6-layers-q4_0.gguf');

        const { BertModel } = await import('../src/index.js');
        const model = new BertModel();
        await model.init(modelPath);

        const inputText = "阿張先生嗰時好nice㗎";
        const result = await model.cut(inputText);

        console.log("Input:", inputText);
        console.log("Segmented output:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

testBertModel();
