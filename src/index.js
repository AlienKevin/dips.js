import fs from 'fs';
import path from 'path';
import Module from './libbert.js';

class BertModel {
    constructor() {
        this.instance = null;
        this.moduleLoaded = false;
    }

    async init(modelPath) {
        this.Module = await Module();

        return new Promise((resolve, reject) => {
            fs.readFile(modelPath, (err, data) => {
                if (err) {
                    reject(`Failed to load model file: ${err}`);
                    return;
                }

                const modelFileName = path.basename(modelPath);
                console.log('Loading model:', modelFileName);
                this.Module.FS_createDataFile("/", modelFileName, data, true, true);
                this.instance = this.Module.init(modelFileName);
                console.log('Model loaded successfully');
                resolve();
            });
        });
    }

    async cut(text, mode = 'fine') {
        if (typeof text !== 'string') {
            throw new TypeError('Input text must be a string');
        }

        const logits = this.Module.run(this.instance, text);
        const N_TAGS = 4;
        const predictions = [];

        for (let i = N_TAGS; i < logits.length - N_TAGS; i += N_TAGS) {
            let maxValue = -Infinity;
            let maxIndex = -1;
            for (let j = 0; j < N_TAGS; j++) {
                if (logits[i + j] > maxValue) {
                    maxValue = logits[i + j];
                    maxIndex = j;
                }
            }
            predictions.push(maxIndex);
        }

        const dipsResult = text.split('').map((char, index) =>
            `${['-', '', '|', ' '][predictions[index]]}${char}`
        ).join('').trimStart();

        console.log(dipsResult);

        switch (mode) {
            case 'fine':
                return dipsResult.split(/[-| ]/);
            case 'coarse':
                return dipsResult.replace(/-/g, '').replace(/\|/g, '').split(' ');
            case 'dips':
                return predictions.map(pred => 'DIPS'[pred]);
            case 'dips_str':
                return dipsResult;
            default:
                throw new Error(`Invalid mode: ${mode}`);
        }
    }
}

export { BertModel };
