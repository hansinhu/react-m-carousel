import React, { Component } from 'react'
import PropTypes from 'prop-types'

import 'rmc-m-carousel/assets/index.less'

/**
 * @props speed, interVal
 * @author <xinghanhu@clubfactory.com>
 * @example
 * <CarouselBanner>
 *  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
 *     <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181207_banner_jpgwinter/banner.jpg" alt=""/>
 *  </a>
 *  <a target="_blank" rel="nofollow me noopener noreferrer" href="https://www.baidu.com">
 *    <img src="//d3kpm7yklociqe.cloudfront.net/ext/theme/20181210_banner_coat/banner.jpg" alt=""/>
 *  </a>
 * </CarouselBanner>
 */

class Carousel extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    autoplay: PropTypes.bool,
  }
  constructor () {
    super(...arguments);

    this.touchObject = {}
    this.autoTimer = null
    this.resizeTimer = null
    this.stopPlay = false // 暂停自动轮播
    this.clickDisabled = false // 是否阻止点击事件
    this.nodeNum = 0
    this.childNum = 0 // banner的数量
    this.state = {
      frameWidth: 0, // 轮播区域的宽度
      activeIndex: 0, // 当前激活项
      listStyle: { // ul的样式
        height: 'auto',
        width: '0px',
      },
      itemStyles: [], // li的样式
      moveLeft: 0, // touchMove的距离
      dragging: false,
    }
    this.$carouselList = React.createRef()
    this.$carousel = React.createRef()
  }
  static defaultProps = {
    dots: true,
    autoplay: true,
    edgeEasing: 'linear',
    speed: 500, // 速度
    interVal: 5000, // 切换周期
  }

  componentDidMount () {
    let { children } = this.props
    console.log(children)
    if (this.objType(children) === 'Array') {
      this.initCarousel()
      window.addEventListener('resize', this.onResize)
      this.startAutoplay()
    }
  }

  getTransitionStyle (ms, x) {
    return {
      transition: `transform ${this.props.edgeEasing} ${ms / 1000}s`,
      'WebkitTransition': `transform ${this.props.edgeEasing} ${ms / 1000}s`,
      transform: `translate3d(-${x}px, 0px, 0px)`,
      'WebkitTransform': `translate3d(-${x}px, 0px, 0px)`,
    }
  }

  // 初始化数据
  initCarousel = () => {
    let childNodes = this.$carouselList.current.childNodes || []
    this.nodeNum = childNodes.length
    this.childNum = this.nodeNum > 2 ? this.nodeNum - 2 : 0
    // 轮播宽度
    let frameWidth = this.$carousel.current.clientWidth
    let width = frameWidth * this.nodeNum + 'px'
    // li 的样式
    let itemStyles = []
    childNodes.forEach((el, i) => {
      itemStyles.push({
        width: frameWidth + 'px',
      })
    })
    let x = (this.state.activeIndex + 1) * frameWidth
    let listStyle = Object.assign({}, this.state.listStyle, { width }, this.getTransitionStyle(0, x))
    this.setState({
      frameWidth,
      listStyle,
      itemStyles,
    })
  }

  // window宽度改变，重新计算banner宽度
  onResize = () => {
    this.stopAutoplay()
    this.initCarousel()
    setTimeout(() => {
      if (this.props.autoplay) {
        this.unpauseAutoplay()
      }
    }, 1000)
  }

  objType = (obj) => {
    return Object.prototype.toString.call(obj).slice(8, -1)
  }

  // 移动端touch相关操作
  getTouchEvents = () => {
    return {
      onTouchStart: e => {
        this.touchObject = {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY,
        };
        this.handleMouseOver();
      },
      onTouchMove: e => {
        e.preventDefault();
        const length = Math.round(
          Math.sqrt(
            Math.pow(e.touches[0].pageX - this.touchObject.startX, 2)
          )
        )

        if (length >= 10) this.clickDisabled = true;

        this.touchObject = {
          startX: this.touchObject.startX,
          startY: this.touchObject.startY,
          endX: e.touches[0].pageX,
          endY: e.touches[0].pageY,
          length,
        };
        let moveLeft = this.touchObject.endX - this.touchObject.startX
        this.setState({
          moveLeft,
        })
        this.handleSwiping(moveLeft)
      },
      onTouchEnd: e => {
        this.handleSwipe(e);
        this.handleMouseOut();
      },
      onTouchCancel: e => {
        this.handleSwipe(e);
      },
    };
  }

  // web Mouse相关操作
  getMouseEvents = () => {
    return {
      onMouseOver: () => this.handleMouseOver(),

      onMouseOut: () => this.handleMouseOut(),

      onMouseDown: e => {
        if (e.preventDefault) {
          e.preventDefault();
        }

        this.touchObject = {
          startX: e.clientX,
          startY: e.clientY,
        };

        this.setState({
          dragging: true,
        });
      },
      onMouseMove: e => {
        if (!this.state.dragging) {
          return;
        }

        const length = Math.round(
          Math.sqrt(Math.pow(e.clientX - this.touchObject.startX, 2))
        )

        // prevents disabling click just because mouse moves a fraction of a pixel
        if (length >= 10) this.clickDisabled = true;

        this.touchObject = {
          startX: this.touchObject.startX,
          startY: this.touchObject.startY,
          endX: e.clientX,
          endY: e.clientY,
          length,
        };

        let moveLeft = this.touchObject.endX - this.touchObject.startX
        this.setState({
          moveLeft,
        })
        this.handleSwiping(moveLeft)
      },
      onMouseUp: e => {
        if (!this.state.dragging) {
          return;
        }

        this.handleSwipe(e);
      },
      onMouseLeave: e => {
        if (!this.state.dragging) {
          return;
        }

        this.handleSwipe(e);
      },
    };
  }

  // 阻止鼠标的默认事件
  handleClick = (event) => {
    if (this.clickDisabled === true) {
      if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      if (event.nativeEvent) {
        event.nativeEvent.stopPropagation();
      }
    }
  }

  handleMouseOut = () => {
    if (this.props.autoplay) {
      this.unpauseAutoplay()
    }
  }

  handleMouseOver = () => {
    this.stopAutoplay()
  }

  stopAutoplay = () => {
    this.stopPlay = true
    if (this.autoTimer) {
      clearInterval(this.autoTimer)
    }
  }

  unpauseAutoplay = () => {
    if (this.props.autoplay && this.stopPlay) {
      this.startAutoplay()
      this.stopPlay = false
    }
  }
  // 拖动时移动效果
  handleSwiping = (left) => {
    let activeIndex = this.state.activeIndex
    // 第一项和最后一线暂时不可拖动, 待完善
    let x = (activeIndex + 1) * this.state.frameWidth - left
    let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(0, x))
    this.setState({
      listStyle,
    })
  }
  // 拖动后移动效果
  handleSwipe = () => {
    let left = this.state.moveLeft
    let activeIndex = this.state.activeIndex
    // 移动距离大于10 否则还原
    if (Math.abs(left) > 10 && left > 0) { // 上一项
      this.changePositon(activeIndex === 0 ? this.childNum - 1 : --activeIndex, 'pre')
    } else if (Math.abs(left) > 10 && left < 0) { // 下一项
      this.changePositon(activeIndex === this.childNum - 1 ? 0 : ++activeIndex)
    } else {
      this.changePositon(activeIndex)
    }
    setTimeout(() => {
      this.clickDisabled = false;
    }, 0);
    this.touchObject = {};
    this.setState({
      dragging: false,
    });
  }

  // 自动播放
  startAutoplay = () => {
    if (this.autoTimer) clearInterval(this.autoTimer)
    this.autoTimer = setInterval(() => {
      if (this.stopPlay) return
      this.changePositon()
    }, this.props.interVal)
  }

  // 点击dot
  dotClick = (index) => {
    this.stopAutoplay()
    this.changePositon(index)
    this.unpauseAutoplay()
  }

  // 滚动过渡效果
  changePositon = (nexIndex, step) => {
    let { activeIndex } = this.state
    let { speed } = this.props
    let index
    if (nexIndex !== undefined) {
      index = nexIndex
    } else {
      index = activeIndex >= this.childNum - 1 ? 0 : ++activeIndex
    }
    // infinite效果 最后一项单独处理
    if (index === 0 && activeIndex === this.childNum - 1 && step !== 'pre') {
      let x = (activeIndex + 2) * this.state.frameWidth
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, x))
      this.setState({ // 在整体向左移动
        listStyle,
        activeIndex: index,
      }, () => { // 最后复原
        let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(0, this.state.frameWidth))
        setTimeout(() => {
          this.setState({
            listStyle,
          })
        }, speed)
      })
    } else if (nexIndex === this.childNum - 1 && step === 'pre') {
      // 第一项继续向前滑动
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, 0))
      this.setState({ // 在整体向左移动
        listStyle,
        activeIndex: index,
      }, () => { // 回到末尾
        let x = (index + 1) * this.state.frameWidth
        let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(0, x))
        setTimeout(() => {
          this.setState({
            listStyle,
          })
        }, speed)
      })
    } else {
      let x = (index + 1) * this.state.frameWidth
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, x))
      this.setState({
        listStyle,
        activeIndex: index,
      })
    }
  }

  // 轮播图渲染
  renderChildren = () => {
    let { listStyle, itemStyles } = this.state
    let { children = [] } = this.props
    const touchEvents = this.getTouchEvents()
    const mouseEvents = this.getMouseEvents()
    if (!children) {
      return null
    }
    // 一个children返回Object'
    if (this.objType(children) === 'Object') {
      return (
        <ul className={'rmc_carousel_list'}>
          <li className={`rmc_carousel_item rmc_carousel_single_item`}>{children}</li>
        </ul>
      )
    }
    // 多个返回Array
    let len = children.length
    let copyFist = React.cloneElement(children[0])
    let copyLast = React.cloneElement(children[len - 1])
    // console.log(item0, item1)
    let childrenList = [copyLast].concat(children).concat(copyFist)
    return (
      <ul
        ref={this.$carouselList}
        style={ listStyle }
        {...touchEvents}
        {...mouseEvents}
        onClickCapture={this.handleClick}
        className={'rmc_carousel_list'}>{
          childrenList.map((child, i) => {
            return <li style={ itemStyles[i] } className={'rmc_carousel_item'} key={i + '-carousel'}>{child}</li>
          })
        }</ul>
    )
  }

  // 指示器渲染
  rederDot = () => {
    let { children = [] } = this.props
    if (this.objType(children) === 'Object' || !children) {
      return null
    }
    return (
      <div className={'rmc_carousel_dot'}>
        {
          children.map((page, i) => {
            let dotClassName = `${'rmc_carousel_dot_point'} ${i === this.state.activeIndex ? 'rmc_dot_point_active' : ''}`
            return <div onClick={() => this.dotClick(i)} className={ dotClassName } key={i}><span></span></div>
          })
        }
      </div>
    )
  }

  render () {
    let { dots } = this.props
    return (
      <div
        ref={ this.$carousel }
        className={'rmc_carousel'}>
        { this.renderChildren() }
        { dots ? this.rederDot() : null }
      </div>)
  }
}
export default Carousel
