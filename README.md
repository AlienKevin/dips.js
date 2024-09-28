# dips.js

Multi-criteria Cantonese segmentation with **d**ashes, **i**ntermediates, **p**ipes, and **s**paces.

Note: This package is still in beta, there might be breaking changes in the future.

See https://github.com/AlienKevin/dips for more details on the segmentation model.

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

Note when running this project in the browser, you need to make sure that your website is in a [cross-origin isolation state](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated) because our WebAssembly code makes use of [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) for sharing memory across threads.
To be in the isolation state, you need to serve your website with the following headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
As of Sep 2024, GitHub Pages does not support customizing headers so this project doesn't work with the service. You can either build your own server or use Cloudflare Pages which supports customizing headers.

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

>>> model.free()
```

Note: BertModel.init() always returns the same model instance. Only free the model when you're done with all instances.
