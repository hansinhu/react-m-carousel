import React, { Component } from 'react'
import classNames from 'classnames'

/**
 * @author <xinghanhu@clubfactory.com>
 * @param
 * indicator, autoplay, edgeEasing, speed, autoplayInterval
 */

type CarouselPropsType = {
  children: any,
  selectedIndex: number,
  autoplay?: boolean,
  autoplayInterval?: number,
  edgeEasing?: string,
  speed: number,
  indicator?: boolean,
  indicatorType?: string,
  dotClickSwipe?: boolean,
  dotStyle?: object,
  dotActiveStyle?: object,
  beforeChange?: (from: number, to: number) => {},
  afterChange?: (current: number) => {},
  className?: string,
}

class Carousel extends Component<CarouselPropsType, any> {
  static defaultProps = {
    selectedIndex: 0,
    indicator: true,
    indicatorType: 'dots',
    autoplay: false,
    edgeEasing: 'linear',
    speed: 200, // 速度
    autoplayInterval: 5000, // 切换周期
  }
  constructor (props: CarouselPropsType) {
    super(props)
    this.state = {
      frameWidth: 0, // 轮播区域的宽度
      activeIndex: props.selectedIndex, // 当前激活项
      listStyle: { // ul的样式
        height: 'auto',
        width: '0px',
      },
      itemStyles: [], // li的样式
      moveLeft: 0, // touchMove的距离
    }
  }

  dragging: boolean = false

  touchObject: {
    [index: string]: any;
  } = {}
  autoTimer: any = null
  resizeTimer = null
  stopPlay = false // 暂停自动轮播
  clickDisabled = false // 是否阻止点击事件
  nodeNum = 0
  childNum = 0 // banner的数量
  $carouselList = React.createRef<HTMLDivElement>()
  $carousel = React.createRef<HTMLDivElement>()

  componentDidMount () {
    let { children, autoplay } = this.props
    const childrenList = React.Children.toArray(children)
    if (childrenList.length > 1) {
      this.initCarousel()
      autoplay && this.startAutoplay()
      window.addEventListener('resize', this.onResize)
    }
  }

  componentWillReceiveProps (nextProps: CarouselPropsType) {
    const { autoplay } = nextProps
    if (autoplay !== this.props.autoplay) {
      !autoplay && this.unpauseAutoplay()
    }
  }

  componentDidUpdate (preProps: CarouselPropsType) {
    // this.$carouselList 需要再componentDidUpdate后获取
    const { children, autoplay, selectedIndex } = this.props
    const childrenList = React.Children.toArray(children)
    if (preProps.children !== children && childrenList.length > 1) {
      this.initCarousel()
      autoplay && this.startAutoplay()
      window.addEventListener('resize', this.onResize)
    }
    if (preProps.selectedIndex !== selectedIndex) {
      this.changePositon(selectedIndex)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  getTransitionStyle (ms: number, x: number) {
    return {
      transition: `transform ${this.props.edgeEasing} ${ms / 1000}s`,
      'WebkitTransition': `transform ${this.props.edgeEasing} ${ms / 1000}s`,
      transform: `translate3d(-${x}px, 0px, 0px)`,
      'WebkitTransform': `translate3d(-${x}px, 0px, 0px)`,
    }
  }

  // 初始化数据
  initCarousel = () => {
    if (!this.$carouselList.current) return

    const { children } = this.props
    const frame: any = this.$carousel.current
    this.childNum = children.length
    this.nodeNum = children.length + 2
    // 轮播宽度
    let frameWidth = frame.clientWidth
    let width = frameWidth * this.nodeNum + 'px'
    // li 的样式
    let itemStyles = []
    for (let i = 0; i < this.nodeNum; i++) {
      itemStyles.push({
        width: frameWidth + 'px',
      })
    }
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
      this.unpauseAutoplay()
    }, 1000)
  }

  objType = (obj: any) => {
    return Object.prototype.toString.call(obj).slice(8, -1)
  }

  // 移动端touch相关操作
  getTouchEvents = () => {
    return {
      onTouchStart: (e: any) => {
        this.touchObject = Object.assign(this.touchObject, {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY,
        });
        this.handleMouseOver();
      },
      onTouchMove: (e: any) => {
        e.preventDefault();
        const length = Math.round(Math.abs(e.touches[0].pageX - this.touchObject.startX))
        const height = Math.round(Math.abs(e.touches[0].pageY - this.touchObject.startY)) || 1
        // 移动距离 %
        let process = length / this.state.frameWidth * 100
        if (process >= 1) this.clickDisabled = true;

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
        // 角度小于45才触发
        if (length / height > 1) {
          this.handleSwiping(moveLeft)
        }
      },
      onTouchEnd: () => {
        this.handleSwipe()
        this.handleMouseOut()
      },
      onTouchCancel: () => {
        this.handleSwipe()
      },
    };
  }

  // web Mouse相关操作
  getMouseEvents = () => {
    return {
      onMouseOver: () => this.handleMouseOver(),

      onMouseOut: () => this.handleMouseOut(),

      onMouseDown: (e: any) => {
        if (e.preventDefault) {
          e.preventDefault();
        }

        this.touchObject = Object.assign(this.touchObject, {
          startX: e.clientX,
          startY: e.clientY,
        });

        this.dragging = true
      },
      onMouseMove: (e: any) => {
        if (!this.dragging) {
          return;
        }

        const length = Math.round(Math.abs(e.clientX - this.touchObject.startX))
        const height = Math.round(Math.abs(e.clientY - this.touchObject.startY)) || 1

        // prevents disabling click just because mouse moves a fraction of a pixel
        // 移动距离 %
        let process = length / this.state.frameWidth * 100
        if (process >= 1) this.clickDisabled = true;

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
        // 角度小于45才触发
        if (length / height > 1) {
          this.handleSwiping(moveLeft)
        }
      },
      onMouseUp: () => {
        if (!this.dragging) {
          return;
        }

        this.handleSwipe()
      },
      onMouseLeave: () => {
        if (!this.dragging) {
          return;
        }

        this.handleSwipe()
      },
    };
  }

  // Capture swipe阻止冒泡与默认事件
  handleClick = (event: any) => {
    if (this.clickDisabled === true) {
      event.preventDefault();
      event.stopPropagation();

      if (event.nativeEvent) {
        event.nativeEvent.stopPropagation();
      }
    }
  }

  handleMouseOut = () => {
    this.unpauseAutoplay()
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
  handleSwiping = (left: number) => {
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
    // 移动距离大于10% 否则还原
    let process = Math.abs(left) / this.state.frameWidth * 100
    if (process > 10 && left > 0) { // 上一项
      this.changePositon(activeIndex === 0 ? this.childNum - 1 : --activeIndex, 'pre')
    } else if (process > 10 && left < 0) { // 下一项
      const toPosition = activeIndex === this.childNum - 1 ? 0 : ++activeIndex
      this.changePositon(toPosition)
    } else {
      this.changePositon(activeIndex)
    }
    setTimeout(() => {
      this.clickDisabled = false;
    }, 0);
    this.touchObject = {};
    this.dragging = false
  }

  // 自动播放
  startAutoplay = () => {
    if (this.autoTimer) clearInterval(this.autoTimer)
    this.autoTimer = setInterval(() => {
      if (this.stopPlay) return
      const toPosition = this.state.activeIndex >= this.childNum - 1 ? 0 : this.state.activeIndex + 1
      this.changePositon(toPosition)
    }, this.props.autoplayInterval)
  }

  // 点击dot
  dotClick = (index: number) => {
    this.stopAutoplay()
    this.changePositon(index)
    this.unpauseAutoplay()
  }

  // 滚动过渡效果
  changePositon = (nextIndex: number, step?: string) => {
    const { activeIndex } = this.state
    let { speed, beforeChange, afterChange } = this.props
    if (nextIndex > this.childNum - 1 || nextIndex < 0) {
      return
    }
    beforeChange && beforeChange(activeIndex, nextIndex)
    // infinite效果 最后一项单独处理
    if (nextIndex === 0 && activeIndex === this.childNum - 1 && step !== 'pre') {
      let x = (activeIndex + 2) * this.state.frameWidth
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, x))
      this.setState({ // 在整体向左移动
        listStyle,
        activeIndex: nextIndex,
      }, () => { // 最后复原
        let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(0, this.state.frameWidth))
        setTimeout(() => {
          this.setState({
            listStyle,
          })
          afterChange && afterChange(nextIndex)
        }, speed)
      })
    } else if (nextIndex === this.childNum - 1 && step === 'pre') {
      // 第一项继续向前滑动
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, 0))
      this.setState({ // 在整体向左移动
        listStyle,
        activeIndex: nextIndex,
      }, () => { // 回到末尾
        let x = (nextIndex + 1) * this.state.frameWidth
        let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(0, x))
        setTimeout(() => {
          this.setState({
            listStyle,
          })
          afterChange && afterChange(nextIndex)
        }, speed)
      })
    } else {
      let x = (nextIndex + 1) * this.state.frameWidth
      let listStyle = Object.assign({}, this.state.listStyle, this.getTransitionStyle(speed, x))
      this.setState({
        listStyle,
        activeIndex: nextIndex,
      })
      setTimeout(() => {
        afterChange && afterChange(nextIndex)
      }, speed)
    }
  }

  // 轮播图渲染
  renderChildren = (childrenList: Array<React.ReactChild>) => {
    let { children } = this.props
    if (childrenList.length === 0) {
      return null
    }
    // 一个children返回Object'
    if (childrenList.length === 1) {
      return (
        <div className={'rmc_carousel_list'}>
          <div className={`rmc_carousel_item rmc_carousel_single_item`}>{children}</div>
        </div>
      )
    }
    // 多个返回Array
    let { listStyle, itemStyles } = this.state
    const touchEvents = this.getTouchEvents()
    const mouseEvents = this.getMouseEvents()
    let len = childrenList.length
    let childrenConcatList = [children[len - 1], ...childrenList, children[0]]
    return <div
      ref={this.$carouselList}
      style={ listStyle }
      {...touchEvents}
      {...mouseEvents}
      onClickCapture={this.handleClick}
      className={'rmc_carousel_list'}
    >
      {
        childrenConcatList.map((child, i) => {
          return <div style={ itemStyles[i] } className={'rmc_carousel_item'} key={i + '-carousel'}>{child}</div>
        })
      }
    </div>
  }

  // 指示器渲染
  rederDot = (childrenList: Array<React.ReactChild>) => {
    let { dotClickSwipe = true, indicatorType, dotStyle = {}, dotActiveStyle = {} } = this.props
    if (childrenList.length <= 1) {
      return null
    }
    return (
      <div className={`rmc_carousel_dot rmc_carousel_dot_${indicatorType}`}>
        {
          indicatorType === 'number'
            ? <div className='rmc_carousel-indicator-number'>
              <span>{`${this.state.activeIndex + 1}/${childrenList.length}`}</span>
            </div>
            : childrenList.map((_dot: any, i: number) => {
                let dotClassName = `rmc_carousel_dot_point ${i === this.state.activeIndex ? 'cfm_dot_point_active' : ''}`
                const activeStyle = i === this.state.activeIndex ? dotActiveStyle : {}
                return <span
                  onClick={() => dotClickSwipe && this.dotClick(i)}
                  className={ dotClassName }
                  style={{
                    ...dotStyle,
                    ...activeStyle,
                  }}
                  key={i}
                ></span>
              })
        }
      </div>
    )
  }

  render () {
    const { indicator, children, className } = this.props
    const childrenList = React.Children.toArray(children)
    const cls = ['rmc_carousel', className].filter(item => !!item).join('')
    return (
      <div
        ref={ this.$carousel }
        className={cls}>
        { this.renderChildren(childrenList) }
        { indicator ? this.rederDot(childrenList) : null }
      </div>)
  }
}
export default Carousel
