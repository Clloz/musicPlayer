### musicPlayer

### 样式
背景为模糊的图片，居中显示播放器主体。播放器主体的左侧是歌曲封面，右侧是歌曲信息和播放器的控制模块，包括进度条（包含时间），音量控制，上一首，下一首，播放暂停，显示歌曲列表几个控制按钮。播放器主体下方是一个可以关闭的歌曲列表，点击显示歌曲列表按钮会用translateY弹出，再次点击会关闭，用`transition`显示动画。

### 功能
#### 初始化页面，get请求歌曲列表（json），获得歌曲列表后，初始化页面：将歌曲名称显示为列表中第一首歌曲，同时获取歌曲时间显示到进度条旁边，进度条初始化为0，音量初始化为0.3，歌曲列表默认显示。

#### 播放暂停
用一个变量标记当前播放歌曲，点击播放暂停继续播放该歌曲，如果是第一次播放，默认播放第一首歌曲，歌曲播放完毕后自动播放下一首。

#### 上一首下一首
点击上一首下一首，通过控制歌曲标记变量来控制当前播放的歌曲，需要重置歌曲信息、进度条和时间，并且更改歌曲列表中正在播放标记。

#### 点击播放列表
可以直接在播放列表中的歌曲播放，原理和上一首下一首一样控制当前歌曲变量，用事件代理处理，同样需要初始化歌曲信息和进度条。

#### 手动控制歌曲进度
为进度条添加点击事件，通过获取鼠标的`offsetX`来获取用户点击的坐标，根据用户点击的坐标占进度条总长度的比例设置`audio`的`currentTime`从而达到让用户控制进度条的目的

#### 控制音量
原理和控制进度条大致相似，用户点击音量进度条，获取`offsetY`来获取占总高度的百分比，再设置`audio`的`volume`

#### 控制歌曲列表的动画
用一个`div`将歌曲列表的ul元素包裹，设置`div`为`overflow: hidden`, 为`div`和`ul`设置相同的高度和`transition`，当用户点击关闭列表的时候，`div`高度逐渐减小到`0`，`ul`的`tanslateY`同步进行向上，由于`div`设置了`overflow:hidden`，`ul`上移的部分将被隐藏。当用户要显示播放列表时，原理相同