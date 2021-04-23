const curves = ['linear', 'decelerate', 'ease', 'easeIn', 'easeOut', 'easeInOut']

class Animation {
  /// 动画持续时间
  duration
  /// 运动轨迹
  curve
  /// 当前动画取到的值
  value
  /// 动画开始的值
  from
  /// 动画结束的值
  to
  /// FPS
  fps
  /// 动画控制器
  timer
  /// 当前运动到的时间
  runTime
  /// 监听事件容器
  controllers = []
  /// 动画完成执行
  completes = []
  /// 当前运动状态, init, forward-moving, reverse-moving
  _movingStatus = 'init'
  /// 当前运动方式，forward, reverse, forward-reverse, forward-infinite, forward-reverse-infinite
  _movingType = 'forward'
  /// times
  constructor(options) {
    if (typeof options !== 'object' || !options) throw Error('options must be object')
    if (typeof options.from !== 'number') throw Error('from must be a number')
    if (typeof options.to !== 'number') throw Error('to must be a number')
    this.duration = options.duration || 500
    this.curve = curves.indexOf(options.curve) > -1 ? options.curve : 'linear'
    this.from = options.from
    this.to = options.to
    this.value = this.from
    this.fps = options.fps
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

  /// 添加完成事件
  addComplete(fn) {
    this.completes.push(fn)
  }

  /// 移除监听事件
  removeComplete(fn) {
    let index = this.completes.indexOf(fn)
    if (index > -1) this.completes.splice(index, 1)
  }

  /// 执行完成事件
  _executeCompletes(_value) {
    this.completes.forEach((fn) => {
      if (typeof fn === 'function') fn(_value)
    })
  }

  /// 执行动画，接收一个默认开始的时间
  _run({ reverse = false, fromTime = 0, resolve }) {
    this._movingStatus = reverse ? 'moving-reverse' : 'moving-forward'
    this.timer?.clear()
    // 开始执行动画
    this.timer = new AnimationFrame(
      (time) => {
        this.runTime = time
        this.value = this._getRunValue(reverse)
        /// 是否动画结束
        if (this.runTime >= this.duration) {
          this.value = reverse ? this.from : this.to
          this.timer?.clear()
          this._movingStatus = 'init'
          this._executeListener(this.value)
          if (typeof resolve === 'function') resolve()
          if (this._movingType === 'forward' || this._movingType === 'reverse') {
            this._executeCompletes(this._movingType)
          } else if (this._movingType === 'forward-reverse') {
            if (reverse) this._executeCompletes(this._movingType)
          }
        } else {
          this._executeListener(this.value)
        }
      },
      this.fps,
      fromTime
    )
  }

  /// 启动动画（正向执行）
  forward(reverse = false) {
    this.runTime = 0
    this.value = this.from
    if (reverse) {
      this._movingType = 'forward-reverse'
      this._run({
        reverse: false,
        resolve: () => {
          this._run({ reverse: true })
        }
      })
    } else {
      this._movingType = 'forward'
      this._run({ reverse: false })
    }
  }

  /// 启动动画（反向执行）
  reverse() {
    this.runTime = 0
    this.value = this.to
    this._movingType = 'reverse'
    this._run({ reverse: true })
  }

  /// 阻止动画
  stop() {
    if (this._movingStatus === 'init') return
    this.timer?.clear()
  }

  /// 继续动画
  continue() {
    if (this._movingStatus === 'init') return
    /// 当前运动状态
    let reverse = this._movingStatus === 'moving-reverse'
    if (this._movingType === 'forward' || this._movingType === 'reverse') {
      /// 当前运动类型为正向或反向
      this._run({ reverse, fromTime: this.runTime })
    } else if (this._movingType === 'forward-reverse') {
      /// 当前运动类型为正向->反向
      if (reverse) {
        this._run({ reverse, fromTime: this.runTime })
      } else {
        this._run({
          reverse,
          fromTime: this.runTime,
          resolve: () => {
            this._run({ reverse: true })
          }
        })
      }
    } else if (this._movingType === 'forward-infinite') {
      /// 当前运动类型为正向->无限
      this._run({
        reverse,
        fromTime: this.runTime,
        resolve: () => {
          this.repeat(false)
        }
      })
    } else if (this._movingType === 'forward-reverse-infinite') {
      /// 当前运动类型为正向->无限->无限
      if (reverse) {
        this._run({
          reverse: true,
          fromTime: this.runTime,
          resolve: () => {
            this.repeat(true)
          }
        })
      } else {
        this._run({
          reverse: false,
          fromTime: this.runTime,
          resolve: () => {
            this._run({
              reverse: true,
              resolve: () => {
                this.repeat(true)
              }
            })
          }
        })
      }
    }
  }

  /// 开始执行动画，并不断重复
  repeat(reverse = false) {
    this.runTime = 0
    this.value = this.from
    if (reverse) {
      this._movingType = 'forward-reverse-infinite'
      this._run({
        reverse: false,
        resolve: () => {
          this._run({
            reverse: true,
            resolve: () => {
              this.repeat(reverse)
            }
          })
        }
      })
    } else {
      this._movingType = 'forward-infinite'
      this._run({
        reverse,
        resolve: () => {
          this.repeat(reverse)
        }
      })
    }
  }

  /// 取值
  _getRunValue(reverse = false) {
    let radio = this.runTime / this.duration
    switch (this.curve) {
      case 'linear':
        radio = Animation.getLinear(radio)
        break
      case 'decelerate':
        radio = Animation.getDecelerate(radio)
        break
      case 'ease':
        radio = Animation.getEase(radio)
        break
      case 'easeIn':
        radio = Animation.getEaseIn(radio)
        break
      case 'easeOut':
        radio = Animation.getEaseOut(radio)
        break
    }
    if (reverse) {
      return (this.from - this.to) * radio + this.to
    } else {
      return (this.to - this.from) * radio + this.from
    }
  }

  /// 物理运动轨迹

  /// 线性
  static getLinear(radio) {
    return radio
  }

  /// 匀减速
  static getDecelerate(radio) {
    return (2 - radio) * radio
  }

  /// 开始加速，后面减速
  static getEase(radio) {
    if (radio <= 0.5) {
      return radio - (0.5 - radio) * radio * 1.5
    } else {
      return radio + (radio - 0.5) * (1 - radio) * 1.5
    }
  }

  /// 开始慢，后面快
  static getEaseIn(radio) {
    return radio * radio
  }

  /// 开始快，后面慢
  static getEaseOut(radio) {
    return radio + (1 - radio) * radio * 1.5
  }
}

/// 时间控制器
class AnimationFrame {
  callback
  fps
  /// 每次动画间隔
  space
  /// 时间控制器
  timer
  /// 初始时间
  firstTime = null
  /// 当前运行时间
  runTime = 0
  /// 是否循环结束
  finsh = false
  /// fromTime
  fromTime = 0
  constructor(callback, fps, fromTime) {
    if (typeof callback !== 'function') throw Error('callback must be a function')
    this.callback = callback
    this.fps = fps
    this.space = 1000 / (this.fps || 60)
    if (typeof fromTime === 'number') {
      this.runTime = fromTime
      this.fromTime = fromTime
    }
    this.run()
  }

  run() {
    if (typeof this.fps !== 'number' && window.requestAnimationFrame) {
      window.requestAnimationFrame((frameTime) => {
        if (this.finsh) return
        if (this.firstTime === null) {
          this.firstTime = frameTime
        } else {
          this.runTime = this.fromTime + frameTime - this.firstTime
        }
        this.callback(this.runTime)
        this.run()
      })
    } else {
      this.timer = setInterval(() => {
        this.runTime += this.space
        this.callback(this.runTime)
      }, this.space)
    }
  }

  clear() {
    this.finsh = true
    clearInterval(this.timer)
  }
}

export default Animation
