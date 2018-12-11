/* eslint no-console:0 */

import 'rmc-picker/assets/index.css';
import 'rmc-m-carousel/assets/index.less';
import Carousel from '../src/index';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Demo extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<div style={{ margin: '10px 0' }}>
      <h2>Carousel</h2>
      <div>
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
      </div>
    </div>);
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
