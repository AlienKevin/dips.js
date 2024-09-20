async function testBertModel() {
    try {
        const { BertModel } = await import('dips.js');

        for (let i = 0; i < 100; i++) {
            var model = await BertModel.init();

            const inputText = "阿張先生嗰時好nice㗎";
            const result = await model.cut(inputText, 'dips_str');

            console.assert(result === "阿-張|先生 嗰-時 好 nice 㗎")
        }
        model.free();
    } catch (error) {
        console.error("Error:", error);
    }
}

testBertModel();
