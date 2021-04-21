const curves = ['linear', 'decelerate', 'ease', 'easeIn', 'easeOut', 'easeInOut']

class Animation {
  /// 动画持续时间
  duration
  /// 运动轨迹
  curve
  /// 当前动画取到的值
  value
  /// 动画开始的值
  start
  /// 动画结束的值
  end
  /// FPS
  fps
  /// 每次动画时间
  space
  /// 动画控制器
  timer
  /// 当前运动到的时间
  moveTime
  /// 监听事件容器
  controllers = []
  /// times
  constructor(options) {
    if (typeof options !== 'object' || !options) throw Error('options must be object')
    this.duration = options.duration || 500
    this.curve = curves.includes(options.curve) ? options.curve : 'linear'
    this.start = options.start || 0
    this.end = options.end || 100
    this.value = this.start
    this.fps = options.fps || 60
    this.space = 1000 / this.fps
    if (this.start >= this.end) throw Error('start must be small to end')
  }

  /// 添加监听事件
  addListener(fn) {
    this.controllers.push(fn)
  }

  /// 移除监听事件
  removeListener(fn) {
    let index = this.controllers.indexOf(fn)
    if (index > -1) this.controllers.splice(index, 1)
  }

  /// 执行监听事件
  _executeListener(_value) {
    this.controllers.forEach((fn) => {
      if (typeof fn === 'function') fn(_value)
    })
  }

  /// 启动动画（正向执行）
  forward() {
    // 运动初始化
    this.moveTime = 0
    this.value = this.start
    clearInterval(this.timer)
    // 开始执行动画
    this.timer = setInterval(() => {
      this.moveTime += this.space
      this.value = this._getLinearValue()
      /// 是否动画结束
      if (this.moveTime >= this.duration) {
        clearInterval(this.timer)
        this.value = this.end
        _executeListener(this.end)
      }
    }, this.space)
  }

  /// 取值
  _getLinearValue() {
    let radio = this.moveTime / this.duration
    return (this.end - this.start) * radio + this.start
  }
}

export default Animation
