async function testBertModel() {
    try {
        const { BertModel } = await import('dips.js');
        const model = await BertModel.init();

        const inputText = "阿張先生嗰時好nice㗎";
        const result = await model.cut(inputText);

        console.log("Input:", inputText);
        console.log("Segmented output:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

testBertModel();
