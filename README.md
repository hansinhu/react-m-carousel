# rmc-m-carousel
---

React Mobile Carousel Component (web and react-native)


![react](https://img.shields.io/badge/react-%3E%3D_16.0.0-green.svg)
[![node version][node-image]][node-url]
[![npm download]][download-url]

[npm-url]: http://npmjs.org/package/carousel
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-url]: https://npmjs.org/package/rmc-m-carousel

## Screenshots

<img src="https://github.com/hansinhu/react-m-carousel/blob/master/assets/img/demoimg.png?raw=true" width="288"/>

## Usage
```
npm install rmc-m-carousel
```
```
import Carousel from 'rmc-m-carousel';

<Carousel>
  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
    <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181207_banner_jpgwinter/banner.jpg" alt=""/>
  </a>
  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
    <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181210_banner_coat/banner.jpg" alt=""/>
  </a>
  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
    <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181210_banner_sleep/banner.jpg" alt=""/>
  </a>
  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
    <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181207_banner_ethnicwear/banner.jpg" alt=""/>
  </a>
</Carousel>

```

[see example](https://github.com/hansinhu/react-m-carousel/blob/master/examples/demo.tsx)


## Development

```
npm i
npm start
```

## Example

http://localhost:8000/examples/

## install

[![rmc-m-carousel]](https://npmjs.org/package/rmc-m-carousel)


## API

### Carousel props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|dots | show dots or not | Boolean | true |
|autoplay | autoplay or not | Boolean | true |
|edgeEasing | transition type | String | 'linear' |
|speed | transition speed | Number | 500 |
|interVal | carousel interVal | Number | 5000 |


## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-m-carousel is released under the MIT license.
