# rmc-m-carousel
---

React Mobile Carousel Component (web and react-native)


![react](https://img.shields.io/badge/react-%3E%3D_16.0.0-green.svg)
[![node version][node-image]][node-url]
[![npm download][download-img]][download-url]

[npm-url]: http://npmjs.org/package/carousel
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-img]: https://img.shields.io/npm/dm/rmc-m-carousel.svg?style=flat-square
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

[![npm download][download-img]][download-url]

## API

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| selectedIndex |  手动设置当前显示的索引  |  number  |  0  |
| indicator | 是否显示指示器 | Boolean   | true |
| indicatorType | 指示器类型 | String ['dots', 'number']   | 'dots' |
| autoplay | 是否自动切换 | Boolean   | false |
| autoplayInterval | 自动切换的时间间隔 | Number | 3000 |
| dotStyle  | 指示点样式 | Object | 无 |
| dotActiveStyle  | 激活的指示点样式 | Object | 无 |
| dotClickSwipe  | 点击指示点切换 | Object | true |
| speed | 滑动灵敏度 |  number | 500 |
| beforeChange | 切换面板前的回调函数 | (from: number, to: number): void | 无 |
| afterChange  | 切换面板后的回调函数 | (current: number): void  | 无 |

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
