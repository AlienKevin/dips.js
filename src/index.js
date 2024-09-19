class BertModel {
    static async init(silent = true) {
        // TODO: silent fs.writeSync in node
        if (silent) {
            var originalConsoleError = console.error;
            console.error = function () { };
        }
        const model = new BertModel();
        model.Module = await Module();
        const modelName = 'bert.gguf';
        model.Module.FS_createDataFile("/", modelName, bertModelWeight, true, true);
        model.instance = model.Module.init(modelName);
        if (silent) {
            console.error = originalConsoleError;
        }
        return model;
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
