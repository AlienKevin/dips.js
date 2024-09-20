class BertModel {
    static module = Module();
    static modelInitialized = false;

    static async init() {
        const model = new BertModel();
        if (!BertModel.modelInitialized) {
            const modelName = 'bert.gguf';
            (await BertModel.module).FS_createDataFile("/", modelName, bertModelWeight, true, true);
            const success = (await BertModel.module).init(modelName);
            if (!success) {
                throw new Error('Failed to initialize model');
            }
            BertModel.modelInitialized = true;
        }
        return model;
    }

    async free() {
        (await BertModel.module).free();
    }

    async cut(text, mode = 'fine') {
        if (typeof text !== 'string') {
            throw new TypeError('Input text must be a string');
        }

        const logits = (await BertModel.module).run(text);
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
