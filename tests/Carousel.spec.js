import React from 'react';
import { render/*, mount*/ } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Carousel from '../src';

describe('DatePicker', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <Carousel>
        <div style={{ lineHeight: '200px' }}>1</div>
        <div style={{ lineHeight: '200px' }}>2</div>
        <div style={{ lineHeight: '200px' }}>3</div>
      </Carousel>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
