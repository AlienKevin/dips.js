# dips.js

Multi-criteria Cantonese segmentation with **d**ashes, **i**ntermediates, **p**ipes, and **s**paces.

Note: This package is still in beta, there might be breaking changes in the future.

## Install

```sh
npm install dips.js
```

## Via CDN

```html
<script type="module">
const { BertModel } = await import('https://unpkg.com/dips.js/dist/main.js');
</script>
```

## Usage

```javascript
>>> const { BertModel } = await import('dips.js');
>>> const model = await BertModel.init();

>>> await model.cut('阿張先生嗰時好nice㗎', mode='coarse')
['阿張先生', '嗰時', '好', 'nice', '㗎']

>>> await model.cut('阿張先生嗰時好nice㗎', mode='fine')
['阿', '張', '先生', '嗰', '時', '好', 'nice', '㗎']

>>> await model.cut('阿張先生嗰時好nice㗎', mode='dips_str')
'阿-張|先生 嗰-時 好 nice 㗎'

>>> await model.cut('阿張先生嗰時好nice㗎', mode='dips')
['S', 'D', 'P', 'I', 'S', 'D', 'S', 'S', 'I', 'I', 'I', 'S']
```
