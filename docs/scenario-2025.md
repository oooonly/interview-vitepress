## 2024 年前端最新场景题面试攻略

## 1. 前端如何实现截图？

前端实现截图需要使用 HTML5 的 Canvas 和相关 API，具体步骤如下：

1. 首先在页面中创建一个 Canvas 元素，并设置其宽高和样式。
2. 使用 Canvas API 在 Canvas 上绘制需要截图的内容，比如页面的某个区域、某个元素、图片等。
3. 调用 Canvas API 中的 toDataURL() 方法将 Canvas 转化为 base64 编码的图片数据。
4. 将 base64 编码的图片数据传递给后端进行处理或者直接在前端进行显示。

以下是一个简单的例子，实现了对整个页面的截图：

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('btn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

btn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(document.body, 0, 0);
    const dataURL = canvas.toDataURL();
    console.log('截图数据：', dataURL);
});
```

这个例子中，在页面中创建了一个 canvas 元素，并设置其宽高和样式，将其放在页面最上方。在点击"截图"按钮时，通过 toDataURL() 方法将整个页面的截图转换为 base64 编码的图片数据，并打印到控制台上。

---

## 2. 当 QPS 达到峰值时，该如何处理？

当 QPS 达到峰值时，可以从以下几个方面来进行优化：

1. **数据库优化**：优化 SQL 语句、使用索引、避免全表扫描、分表分库等。
2. **缓存优化**：使用 Redis、Memcached 等缓存技术。
3. **代码优化**：减少不必要的代码执行、避免循环嵌套、避免不必要的递归调用。
4. **负载均衡**：将请求分发到多个服务器上。
5. **异步处理**：将计算量大、耗时长的操作异步处理。
6. **CDN 加速**：使用 CDN 技术将静态资源缓存到 CDN 节点上。
7. **硬件升级**：升级服务器硬件、增加带宽。

---

## 3. JS 超过 Number 最大值的数怎么处理？

在 JavaScript 中，超过 Number.MAX_VALUE 的数值被认为是 Infinity（正无穷大）。如果要处理超过 Number.MAX_VALUE 的数值，可以使用第三方的 JavaScript 库，如 big.js 或 bignumber.js。

例如，使用 big.js 库可以将两个超过 Number.MAX_VALUE 的数相加：

```javascript
const Big = require('big.js');

const x = new Big('9007199254740993');
const y = new Big('100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');

const result = x.plus(y);
console.log(result.toString());
```

这里创建了两个 big.js 对象 x 和 y，分别存储超过 Number.MAX_VALUE 的数值。通过 plus 方法将它们相加，得到了正确的结果。

### 如果不依赖外部库，咋处理？

JavaScript 中，数值超过了 Number 最大值时，可以使用 BigInt 类型来处理，它可以表示任意精度的整数。

使用 BigInt 类型时，需要在数值后面添加一个 n 后缀来表示 BigInt 类型。例如：

```javascript
const bigInt1 = 9007199254740993n;
const bigInt2 = 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n;

const result = bigInt1 + bigInt2;
console.log(result);
```

注意：BigInt 类型是 ECMAScript 2020 新增的特性，因此在某些浏览器中可能不被支持。

---

## 4. 使用同一个链接，如何实现 PC 打开是 web 应用、手机打开是一个 H5 应用？

可以通过根据请求来源（User-Agent）来判断访问设备的类型，然后在服务器端进行适配。例如，可以在服务器端使用 Node.js 的 Express 框架，在路由中对不同的 User-Agent 进行判断，返回不同的页面或数据。

具体实现步骤：

1. 根据 User-Agent 判断访问设备的类型，可以使用第三方库如 ua-parser-js 进行解析。
2. 如果是移动设备，返回一个 H5 页面或接口数据。
3. 如果是 PC 设备，返回一个 web 应用页面或接口数据。

---

## 5. 如何保证用户的使用体验？

主要从以下几个方面思考问题：

1. 性能方向的思考
2. 用户线上问题反馈、线上 on call 的思考
3. 用户使用体验的思考、交互体验使用方向
4. 提升用户能效方向思考

---

## 6. 如何解决页面请求接口大规模并发问题？

可以从以下几个方面来考虑：

1. **后端优化**：采用缓存技术、对数据进行预处理、减少数据库操作。使用集群技术、反向代理、负载均衡等。
2. **做 BFF 聚合**：把所有首屏需要依赖的接口利用服务中间层聚合为一个接口。
3. **CDN 加速**：使用 CDN 缓存技术减少服务器请求压力。
4. **使用 WebSocket**：建立持久的连接，避免反复连接请求。
5. **使用 HTTP2 及其以上版本**：使用多路复用。
6. **使用浏览器缓存技术**：强缓存、协商缓存、离线缓存、Service Worker 缓存等。
7. **聚合一定量的静态资源**：提取公用代码、对图片进行雪碧图处理。
8. **采用微前端工程架构**：只下载当前访问页面的静态资源。
9. **使用服务端渲染技术**：从服务端把页面首屏直接渲染好返回。

---

## 7. 设计一套全站请求耗时统计工具

### 首先我们要知道有哪些方式可以统计前端请求耗时？

从代码层面上统计全站所有请求的耗时方式主要有以下几种：

1. **Performance API**：浏览器提供的测量网页性能的 API。
2. **XMLHttpRequest 的 load 事件**：在请求完成时记录耗时。
3. **fetch 的 Performance API**：类似 XMLHttpRequest。
4. **自定义封装的请求函数**：在请求开始和结束时记录时间。

### 设计一套前端全站请求耗时统计工具

可以遵循以下步骤：

1. 实现一个性能监控模块，记录每个请求的开始时间和结束时间。
2. 在应用入口处引入该模块。
3. 在每个请求的响应拦截器中记录结束时间。
4. 将每个请求的耗时信息发送到服务端。
5. 在服务端实现数据存储和展示。

以下是一个简单的实现示例：

```javascript
// performance.js
const performance = {
    timings: {},
    config: {
        reportUrl: '/report',
    },
    init() {
        // 监听所有请求的开始时间
        window.addEventListener('fetchStart', (event) => {
            this.timings[event.detail.id] = {
                startTime: Date.now(),
            };
        });
        // 监听所有请求的结束时间，并计算请求耗时
        window.addEventListener('fetchEnd', (event) => {
            const id = event.detail.id;
            if (this.timings[id]) {
                const timing = this.timings[id];
                timing.endTime = Date.now();
                timing.duration = timing.endTime - timing.startTime;
                // 将耗时信息发送到服务端
                const reportData = {
                    url: event.detail.url,
                    method: event.detail.method,
                    duration: timing.duration,
                };
                this.report(reportData);
            }
        });
    },
    report(data) {
        // 将耗时信息发送到服务端
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.config.reportUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    },
};

export default performance;
```

在应用入口处引入该模块：

```javascript
// main.js
import performance from './performance';
performance.init();
```

在每个请求的响应拦截器中触发 fetchEnd 事件：

```javascript
// fetch.js
import EventBus from './EventBus';

const fetch = (url, options) => {
    const id = Math.random().toString(36).slice(2);
    const fetchStartEvent = new CustomEvent('fetchStart', {
        detail: {
            id,
            url,
            method: options.method || 'GET',
        },
    });
    EventBus.dispatchEvent(fetchStartEvent);
    
    return window.fetch(url, options)
        .then((response) => {
            const fetchEndEvent = new CustomEvent('fetchEnd', {
                detail: {
                    id,
                    url,
                    method: options.method || 'GET',
                },
            });
            EventBus.dispatchEvent(fetchEndEvent);
            return response;
        });
};

export default fetch;
```

---

## 8. 大文件上传了解多少？

### 大文件分片上传

如果太大的文件，比如一个视频 1g 2g 那么大，直接上传可能会出现超时的情况，也会超过服务端允许上传文件的大小限制。所以解决这个问题我们可以将文件进行分片上传，每次只上传很小的一部分比如 2M。

Blob 它表示原始数据，也就是二进制数据，同时提供了对数据截取的方法 slice，而 File 继承了 Blob 的功能，所以可以直接使用此方法对数据进行分段。

过程如下：

- 把大文件进行分段，比如 2M，发送到服务器携带一个标志（时间戳），用于标识一个完整的文件
- 服务端保存各段文件
- 浏览器端所有分片上传完成，发送给服务端一个合并文件的请求
- 服务端根据文件标识、类型、各分片顺序进行文件合并

客户端 JS 代码实现如下：

```javascript
function submitUpload() {
    var chunkSize = 2 * 1024 * 1024; // 分片大小 2M
    var file = document.getElementById('f1').files[0];
    var chunks = [], token = (+new Date());
    var name = file.name;
    var chunkCount = 0;
    var sendChunkCount = 0;
    
    // 拆分文件
    if (file.size > chunkSize) {
        var start = 0, end = 0;
        while (true) {
            end += chunkSize;
            var blob = file.slice(start, end);
            start += chunkSize;
            if (!blob.size) {
                break;
            }
            chunks.push(blob);
        }
    } else {
        chunks.push(file.slice(0));
    }
    
    chunkCount = chunks.length;
    
    // 上传分片
    for (var i = 0; i < chunkCount; i++) {
        var fd = new FormData();
        fd.append('token', token);
        fd.append('f1', chunks[i]);
        fd.append('index', i);
        xhrSend(fd, function() {
            sendChunkCount++;
            if (sendChunkCount === chunkCount) {
                console.log('上传完成，发送合并请求');
                var formD = new FormData();
                formD.append('type', 'merge');
                formD.append('token', token);
                formD.append('chunkCount', chunkCount);
                formD.append('filename', name);
                xhrSend(formD);
            }
        });
    }
    
    function xhrSend(fd, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8100/', true);
        xhr.onreadystatechange = function() {
            console.log('state change', xhr.readyState);
            if (xhr.readyState == 4) {
                console.log(xhr.responseText);
            }
            cb && cb();
        };
        xhr.send(fd);
    }
}

// 绑定提交事件
document.getElementById('btn-submit').addEventListener('click', submitUpload);
```

服务端 node 实现代码如下：

```javascript
// 服务端二次处理文件，修改名称
app.use((ctx) => {
    var body = ctx.request.body;
    var files = ctx.request.files ? ctx.request.files.f1 : [];
    var result = [];
    var fileToken = ctx.request.body.token;
    var fileIndex = ctx.request.body.index;
    
    if (files && !Array.isArray(files)) {
        files = [files];
    }
    
    files && files.forEach(item => {
        var path = item.path;
        var fname = item.name;
        var nextPath = path.slice(0, path.lastIndexOf('/') + 1) + fileIndex + '-' + fileToken;
        
        if (item.size > 0 && path) {
            var extArr = fname.split('.');
            var ext = extArr[extArr.length - 1];
        }
        
        fs.renameSync(path, nextPath);
        result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1));
    });
    
    if (body.type === 'merge') {
        var filename = body.filename;
        var chunkCount = body.chunkCount;
        var folder = path.resolve(__dirname, '../static/uploads') + '/';
        var writeStream = fs.createWriteStream(folder + filename);
        var cindex = 0;
        
        function fnMergeFile() {
            var fname = folder + cindex + '-' + fileToken;
            var readStream = fs.createReadStream(fname);
            readStream.pipe(writeStream, { end: false });
            readStream.on("end", function() {
                fs.unlink(fname, function(err) {
                    if (err) {
                        throw err;
                    }
                });
            });
            if (cindex + 1 < chunkCount) {
                cindex++;
                fnMergeFile();
            }
        }
        
        fnMergeFile();
        ctx.body = 'merge ok 200';
    }
});
```

### 大文件上传断点续传

在上面实现了文件分片上传和最终的合并，现在要做的就是检测这些分片，不再重新上传即可。可以使用 spark-md5 来生成文件 hash，区分此文件是否已上传。

将上传成功的分段信息保存到本地，重新上传时进行 hash 对比，如果相同则跳过。

**方案一：保存在本地**

可以使用 indexDB/localStorage 等地方，推荐使用 localForage 这个库：

```javascript
npm install localforage
```

```javascript
// 获得本地缓存的数据
function getUploadedFromStorage() {
    return JSON.parse(localforage.getItem(saveChunkKey) || "{}");
}

// 写入缓存
function setUploadedToStorage(index) {
    var obj = getUploadedFromStorage();
    obj[index] = true;
    localforage.setItem(saveChunkKey, JSON.stringify(obj));
}

// 分段对比
var uploadedInfo = getUploadedFromStorage();
for (var i = 0; i < chunkCount; i++) {
    console.log('index', i, uploadedInfo[i] ? '已上传过' : '未上传');
    if (uploadedInfo[i]) {
        sendChunkCount = i + 1;
        continue;
    }
    // 如果未上传，则上传
}
```

**方案二：服务端保存分片坐标信息**

服务端添加一个接口，基于上面进行改进，服务端保存部分片段，客户端上传前需要从服务端获取已上传的分片信息，对比每个分片的 hash 值，跳过已上传的部分，只传未上传的分片。

---

## 9. H5 如何解决移动端适配问题？

### 1. 使用 viewport 标签

通过设置 viewport 标签的 meta 属性，来控制页面的缩放比例和宽度：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

其中 width=device-width 表示设置 viewport 的宽度为设备宽度，initial-scale=1.0 表示初始缩放比例为 1。

### 2. 使用 CSS3 的媒体查询

```css
@media screen and (max-width: 640px) {
    /* 样式 */
}
```

### 3. 使用 rem 单位

```css
html {
    font-size: 16px;
}
@media screen and (max-width: 640px) {
    html {
        font-size: 14px;
    }
}
div {
    width: 10rem;
}
```

### 4. 使用 flexible 布局方案

使用 lib-flexible 库：

```bash
npm install lib-flexible
```

```javascript
// index.js
import 'lib-flexible/flexible.js'
```

---

## 10. 站点一键换肤的实现方式有哪些？

### 网站一键换肤实现方式有以下几种

1. **使用 CSS 变量**：通过定义变量来控制颜色、字体等。
2. **使用 class 切换**：在 HTML 的根元素上添加不同的 class 名称。
3. **使用 JavaScript 切换**：动态修改页面的样式。
4. **使用 Less/Sass 等 CSS 预处理器**：通过变量、函数等实现主题切换。

### 以 Less 为例，详细讲述一下具体操作流程

通过 Less 实现网页换肤可以使用 CSS 变量和 Less 变量：

```css
/* base.less */
@primary-color: #007bff;
.btn {
    background-color: @primary-color;
}
```

```javascript
// 使用 JavaScript 动态修改 Less 变量
less.modifyVars({
    '@primary-color': '#343a40'
});
```

---

## 11. 如何实现网页加载进度条？

### 监听静态资源加载情况

可以通过 window.performance 对象来监听页面资源加载进度：

```javascript
const resources = window.performance.getEntriesByType('resource');
const totalResources = resources.length;
let loadedResources = 0;

resources.forEach((resource) => {
    if (resource.initiatorType != 'xmlhttprequest') {
        resource.onload = () => {
            loadedResources++;
            const progress = Math.round((loadedResources / totalResources) * 100);
            updateProgress(progress);
        };
    }
});

function updateProgress(progress) {
    console.log('加载进度：', progress + '%');
}
```

### 实现进度条

#### 1. 使用原生进度条

```html
<progress id="progressBar" value="0" max="100"></progress>
```

```javascript
const progressBar = document.getElementById('progressBar');
window.addEventListener('load', () => {
    progressBar.value = 100;
});
document.addEventListener('readystatechange', () => {
    const progress = Math.floor((document.readyState / 4) * 100);
    progressBar.value = progress;
});
```

#### 2. 使用第三方库（nprogress）

```bash
npm install nprogress
```

```javascript
// 初始化 nprogress
NProgress.configure({ showSpinner: false });

// 监听页面加载事件
window.addEventListener('load', () => {
    NProgress.done();
});

// 监听资源加载事件
document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
        NProgress.start();
    } else if (document.readyState === 'complete') {
        NProgress.done();
    }
});
```

---

## 12. 常见图片懒加载方式有哪些？

图片懒加载可以延迟图片的加载，只有当图片即将进入视口范围时才进行加载。

### 1. Intersection Observer API

```javascript
let observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            observer.unobserve(lazyImage);
        }
    });
});

const lazyImages = [...document.querySelectorAll(".lazy")];
lazyImages.forEach(function(image) {
    observer.observe(image);
});
```

### 2. 自定义监听器

```javascript
function lazyLoad() {
    const images = document.querySelectorAll(".lazy");
    const scrollTop = window.pageYOffset;
    
    images.forEach((img) => {
        if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
        }
    });
}

let lazyLoadThrottleTimeout;
document.addEventListener("scroll", function() {
    if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
    }
    lazyLoadThrottleTimeout = setTimeout(lazyLoad, 20);
});
```

---

## 13. cookie 构成部分有哪些？

一个 cookie 通常由以下几个部分组成：

1. **名称**：cookie 的名称（键）
2. **值**：cookie 的值
3. **失效时间**：cookie 失效的时间
4. **作用路径**：cookie 的作用路径
5. **作用域**：cookie 绑定的域名

例如，以下是一个设置 cookie 的例子：

```javascript
Set-Cookie: user=john; expires=Sat, 01 Jan 2022 00:00:00 GMT; path=/; domain=example.com
```

---

## 14. 扫码登录实现方式？

扫码登录的实现原理核心是基于一个中转站，该中转站通常由应用提供商提供，用于维护手机和 PC 之间的会话状态。

整个扫码登录的流程如下：

1. 用户在 PC 端访问应用，选择扫码登录。应用生成随机认证码，通过二维码显示在 PC 端页面上。
2. 用户打开手机上的应用，扫描 PC 端的二维码。
3. 手机上的应用向中转站发送请求，包含随机认证码和手机端的会话 ID。
4. 中转站验证认证码和会话 ID，成功后将用户身份信息发送给应用，创建会话状态。
5. 应用���回���过认证的响应给中转站，并携带令牌。
6. 中转站将响应返回给手机端，此时手机和 PC 之间的认证流程完成。
7. 用户在 PC 端进行操作时，应用通过令牌向手机端的应用发起请求验证。

---

## 15. DNS 协议了解多少？

### DNS 基本概念

DNS（Domain Name System，域名系统）是因特网上用于将主机名转换为 IP 地址的协议。它是一个分布式数据库系统，通过将主机名映射到 IP 地址来实现主机名解析。

### 如何加快 DNS 的解析？

1. **使用高速 DNS 服务器**：如 Google 的公共 DNS（8.8.8.8）或 OpenDNS。
2. **缓存 DNS 记录**：在本地计算机上缓存 DNS 记录可以大大加快应用程序的响应。
3. **减少 DNS 查找**：尽可能使用较少的域名。
4. **使用 CDN**：CDN 通常都有专用的 DNS 服务器。
5. **使用 DNS 缓存工具**：如 DNS Jumper、Namebench。

---

## 16. 函数式编程了解多少？

### 函数式编程的核心概念

1. **纯函数**：函数的输出只取决于输入，没有任何副作用。
2. **不可变性**：数据通常是不可变的，不允许在内部进行修改。
3. **函数组合**：函数可以组合成复杂的函数。
4. **高阶函数**：可以接收其他函数作为参数，也可以返回函数的函数。
5. **惰性计算**：指在必要的时候才计算函数。

### 函数式编程的优势

1. 易于理解和维护
2. 更少的 bug
3. 更好的可测试性
4. 更少的重构
5. 避免并发问题
6. 代码复用

---

## 17. 前端水印了解多少？

### 明水印和暗水印的区别

1. **明水印**：通过在文本或图像上覆盖另一层图像或文字来实现的。
2. **暗水印**：在文本或图像中隐藏相关信息的一种技术。

### 添加明水印手段有哪些？

1. **重复的 div 元素覆盖实现**：覆盖 position:fixed 的 div，设置较低透明度，pointer-events:none。
2. **canvas 输出背景图**：将水印通过 toDataURL 方法输出为图片。
3. **SVG 实现背景图**：与 canvas 类似。
4. **图片加水印**。

### CSS 添加水印的方式，如何防止用户删除？

1. 调用外部 CSS 文件
2. 设置样式为 !important
3. 添加自定义类名
4. 将水印样式应用到多个元素上
5. 使用 JavaScript 动态生成 CSS 样式
6. 混淆 CSS 代码
7. 采用图片水印的方式
8. 使用 SVG 图形

### 暗水印是如何把水印信息隐藏起来的？

暗水印的基本原理是在原始数据中嵌入信息。一般步骤：
1. 水印信息处理：将信息转化为二进制数据
2. 源数据处理：遍历源数据进行调整
3. 嵌入水印：将水印插入到源数据中
4. 提取水印：使用特定解密算法提取

---

## 18. 什么是领域模型？

### 什么是领域模型

领域模型是软件开发中用于描述领域（业务）概念和规则的一种建模技术。

以下是领域模型中常见的一些元素：

1. **实体（Entity）**：具有唯一标识的对象。
2. **值对象（Value Object）**：没有唯一标识的对象。
3. **关联关系（Association）**：描述不同实体之间的关系。
4. **聚合（Aggregation）**：表示包含关系。
5. **领域事件（Domain Event）**：领域中发生的具体事件。
6. **聚合根（Aggregate Root）**：聚合中的根实体。
7. **领域服务（Domain Service）**：封装了领域逻辑的服务。

### 前端系统应该如何划分领域模型？

1. **模块划分**：将前端系统按照模块进行划分。
2. **页面划分**：将前端系统按照页面进行划分。
3. **组件划分**：将前端系统按照组件进行划分。
4. **功能划分**：将前端系统按照功能进行划分。

---

## 19. 一直在 window 上面挂东西是否有什么风险？

在前端开发中，将内容或应用��序��行在浏览器的全局 window 对象上可能会带来一些潜在的风险：

1. **命名冲突**：window 对象包含许多内置属性和方法。
2. **安全漏洞**：在全局 window 对象上挂载的代码可以访问和修改全局数据。
3. **代码维护性**：过多依赖全局 window 对象可能导致代码维护困难。

建议采用以下最佳实践：

1. 使用模块化开发
2. 使用严格模式（"use strict"）
3. 显式访问全局对象
4. 谨慎处理第三方代码

---

## 20. 深度 SEO 优化的方式有哪些，从技术层面来说？

1. **网站结构优化**：使用合适的 HTML 标签和语义化内容结构。
2. **网站速度优化**：压缩和合并 CSS 和 JavaScript、优化图像、使用 CDN。
3. **页面渲染优化**：使用服务端渲染（SSR）或预渲染技术。
4. **URL 优化**：使用短、描述性的 URL。
5. **链接优化**：内部链接和外部链接。
6. **Schema 标记**：使用结构化数据标记。
7. **XML 网站地图**：提供网站的结构和页面信息。
8. **Robots.txt 文件**：指示搜索引擎爬取规则。
9. **HTTPS 加密**：确保数据安全。
10. **移动友好性**：确保响应式设计。

---

## 21. 小程序为什么会有两个线程？

小程序有两个线程是为了实现高效运行和良好的用户体验：

1. **渲染线程（UI 线程）**：负责界面渲染和响应用户交互。
2. **逻辑线程（JS 线程）**：负责逻辑运算和数据处理。

将界面渲染和逻辑运算分离的好处：
- **响应速度**：并行执行提高响应速度
- **防止阻塞**：避免长时间计算导致界面卡顿
- **资源隔离**：渲染线程和逻辑线程独立运行

---

## 22. web 应用中如何对静态资源加载失败的场景做降级处理？

1. **使用多个 CDN 链接**：

```javascript
<script src="https://cdn1.example.com/script.js"></script>
<script src="https://cdn2.example.com/script.js" onerror="this.onerror=null;this.src='https://cdn3.example.com/script.js'"></script>
```

2. **使用备用资源路径**：

```javascript
var script = document.createElement('script');
script.src = 'https://cdn.example.com/script.js';
script.onerror = function() {
    script.src = 'https://backup.example.com/script.js';
};
document.head.appendChild(script);
```

3. **使用动态加载和错误处理**：

```javascript
function loadScript(src, backupSrc) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = function() {
            if (backupSrc) {
                script.src = backupSrc;
            } else {
                reject(new Error('Failed to load script: ' + src));
            }
        };
        document.head.appendChild(script);
    });
}

// 使用示例
loadScript('https://cdn.example.com/script.js', 'https://backup.example.com/script.js')
    .then(function() {
        console.log('资源加载成功');
    })
    .catch(function(error) {
        console.error(error);
    });
```

---

## 23. html 中前缀为 data- 开头的元素属性是什么？

HTML 中前缀为 data- 开头的元素属性被称为**自定义数据属性（Custom Data Attributes）**或者**数据属性（Data Attributes）**。

例如：

```html
<div id="myDiv" data-color="red" data-size="large"></div>
```

在 JavaScript 中获取数据属性：

```javascript
const myDiv = document.getElementById('myDiv');
const color = myDiv.getAttribute('data-color'); // "red"
const dataset = myDiv.dataset; // { color: "red", size: "large" }
const colorValue = dataset.color; // "red"
```

---

## 24. 移动端如何实现上拉加载，下拉刷新？

移动端实现���拉���载和下拉刷新通常使用以下方式：

1. **使用第三方库**：如 iScroll、BetterScroll、Ant Design Mobile 等。
2. **自定义实现**：使用原生的触摸事件（touchstart、touchmove、touchend）和滚动事件。

### 示例代码

```javascript
// 获取相关元素
var content = document.getElementById('content');
var loading = document.getElementById('loading');
var refresh = document.getElementById('refresh');
var isRefreshing = false;
var isLoading = false;

// 监听触摸事件
var startY = 0;
var moveY = 0;

content.addEventListener('touchstart', function(event) {
    startY = event.touches[0].pageY;
});

content.addEventListener('touchmove', function(event) {
    moveY = event.touches[0].pageY;
    // 下拉刷新
    if (moveY - startY > 100 && !isRefreshing) {
        refresh.innerHTML = '释放刷新';
    }
});

content.addEventListener('touchend', function(event) {
    // 下拉刷新
    if (moveY - startY > 100 && !isRefreshing) {
        refresh.innerHTML = '刷新中...';
        simulateRefresh();
    }
    // 上拉加载
    var scrollTop = content.scrollTop;
    var scrollHeight = content.scrollHeight;
    var offsetHeight = content.offsetHeight;
    if (scrollTop + offsetHeight >= scrollHeight && !isLoading) {
        loading.style.display = 'block';
        simulateLoad();
    }
    // 重置状态
    startY = 0;
    moveY = 0;
});

// 模拟刷新
function simulateRefresh() {
    isRefreshing = true;
    setTimeout(function() {
        refresh.innerHTML = '刷新成功';
        isRefreshing = false;
    }, 2000);
}

// 模拟加载
function simulateLoad() {
    isLoading = true;
    setTimeout(function() {
        loading.style.display = 'none';
        isLoading = false;
    }, 2000);
}
```

---

## 25. 如何判断 dom 元素是否在可视区域？

### 1. getBoundingClientRect() 方法

```javascript
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Example usage
const element = document.getElementById('my-element');
if (isInViewport(element)) {
    console.log('Element is in viewport');
} else {
    console.log('Element is not in viewport');
}
```

### 2. IntersectionObserver API

```javascript
function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Element is in viewport');
        } else {
            console.log('Element is not in viewport');
        }
    });
}

const observer = new IntersectionObserver(callback);
const element = document.getElementById('my-element');
observer.observe(element);
```

---

## 26. 前端如何用 canvas 来做电影院选票功能？

电影院选票功能可以通过 Canvas 来实现：

```javascript
// 获取画布和按钮元素
var canvas = document.getElementById('canvas');
var btnPay = document.getElementById('btnPay');

// 获取画布上下文和座位数组
var ctx = canvas.getContext('2d');
var seats = [];

// 绘制座位
function drawSeat(x, y, state) {
    switch (state) {
        case 0:
            ctx.fillStyle = '#ccc'; // 可选座位
            break;
        case 1:
            ctx.fillStyle = '#f00'; // 已售座位
            break;
        case 2:
            ctx.fillStyle = '#0f0'; // 已选座位
            break;
        default:
            ctx.fillStyle = '#000'; // 其他座位
            break;
    }
    ctx.fillRect(x, y, 30, 30);
}

// 初始化座位数组
function initSeat() {
    for (var i = 0; i < 10; i++) {
        seats[i] = [];
        for (var j = 0; j < 10; j++) {
            seats[i][j] = 0;
            drawSeat(i * 40, j * 40, 0);
        }
    }
}

// 统计已选座位数量和位置
function countSelectedSeats() {
    var selectedSeats = [];
    var count = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (seats[i][j] == 2) {
                selectedSeats.push([i, j]);
                count++;
            }
        }
    }
    return [count, selectedSeats];
}

// 更新座位状态和颜色
function updateSeat(x, y) {
    if (seats[x][y] == 0) {
        seats[x][y] = 2;
    } else if (seats[x][y] == 2) {
        seats[x][y] = 0;
    }
    drawSeat(x * 40, y * 40, seats[x][y]);
}

// 检查座位状态是否可选
function checkSeat(x, y) {
    if (seats[x][y] == 1) {
        alert('该座位已售出，请选择其他座位！');
        return false;
    } else if (seats[x][y] == 2) {
        alert('该座位已被选中，请选择其他座位！');
        return false;
    }
    return true;
}

// 点击事件处理函数
function handleClick(e) {
    var x = parseInt((e.clientX - canvas.offsetLeft - 50) / 40);
    var y = parseInt((e.clientY - canvas.offsetTop - 50) / 40);
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
        if (checkSeat(x, y)) {
            updateSeat(x, y);
            var count = countSelectedSeats()[0];
            if (count > 0) {
                btnPay.innerHTML = '确认并支付（已选 ' + count + ' 座位）';
            } else {
                btnPay.innerHTML = '确认并支付';
            }
        }
    }
}

// 确认并支付按钮点击事件处理函数
function handlePay() {
    var selectedSeats = countSelectedSeats()[1];
    if (selectedSeats.length == 0) {
        alert('请选择座位！');
        return;
    }
    if (confirm('您已选中以下座位：' + selectedSeats.join('、') + '，确认支付吗？')) {
        alert('支付成功！请前往指定影院取票！');
        initSeat();
        btnPay.innerHTML = '确认并支付';
    }
}

// 初始化座位
initSeat();
// 绑定点击事件和确认并支付按钮点击事件
canvas.addEventListener('click', handleClick);
btnPay.addEventListener('click', handlePay);
```

---

## 27. 如何通过设置失效时间清除本地存储的数据？

```javascript
// 存储数据
function setLocalStorageData(key, data, expiration) {
    var item = {
        data: data,
        expiration: expiration
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// 读取数据
function getLocalStorageData(key) {
    var item = localStorage.getItem(key);
    if (item) {
        item = JSON.parse(item);
        if (item.expiration && new Date().getTime() > item.expiration) {
            // 数据已过期，清除数据
            localStorage.removeItem(key);
            return null;
        }
        return item.data;
    }
    return null;
}

// 示例用法
var data = {name: 'John', age: 30};
var expiration = new Date().getTime() + 3600 * 1000; // 设置失效时间为当前时间后的1小时
setLocalStorageData('user', data, expiration);

var storedData = getLocalStorageData('user');
console.log(storedData);
```

---

## 28. 如果不使用脚手架，如果用 webpack 构建一个自己的 react 应用？

### 利用 webpack 初始化基本应用构建

1. 安装所需的依赖：

```bash
npm install less less-loader antd
```

2. 在 Webpack 配置文件中添加对 Less 的支持：

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    }
};
```

3. 在入口文件中引入 Ant Design 的样式文件：

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

4. 在 App.js 中使用 Ant Design 的 Button 组件：

```javascript
// App.js
import React from 'react';
import { Button } from 'antd';

function App() {
    return (
        <div>
            <h1>Hello, React!</h1>
            <Button type="primary">Click me</Button>
        </div>
    );
}

export default App;
```

### 使用 less 应该如何配置，同时支持 css module 和非 css module？

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                exclude: /\.module\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.module\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    }
};
```

### 如何引入 and 组件并且支持按需加载？

1. 安装 antd 和 babel 插件：

```bash
npm install antd babel-plugin-import --save
```

2. 在 .babelrc 文件中配置 babel 插件：

```json
{
    "plugins": [
        ["import", {
            "libraryName": "antd",
            "style": "css"
        }]
    ]
}
```

---

## 29. 用 nodejs 实现一个命令行工具，统计输入目录下面指定代码的行数？

```javascript
const fs = require('fs');
const path = require('path');

function countLinesInDirectory(dirPath, fileExtension) {
    let totalLines = 0;
    
    function countLinesInFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        totalLines += lines.length;
    }
    
    function processDirectory(directoryPath) {
        const files = fs.readdirSync(directoryPath);
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile() && path.extname(file) === fileExtension) {
                countLinesInFile(filePath);
            } else if (stats.isDirectory()) {
                processDirectory(filePath);
            }
        });
    }
    
    processDirectory(dirPath);
    return totalLines;
}

// 命令行参数，第一个参数是目录路径，第二个参数是文件扩展名
const [_, ___, dirPath, fileExtension] = process.argv;

const linesCount = countLinesInDirectory(dirPath, fileExtension);
console.log('Total lines of ' + fileExtension + ' files in ' + dirPath + ': ' + linesCount);
```

使用方式：

```bash
node line-counter.js /path/to/directory .js
```

---

## 30. package.json 里面 sideEffects 属性的作用是啥？

### sideEffects 作用

sideEffects 是 package.json 文件中的一个字段，它用于指定一个模块是否具有副作用。

- **true**：表示模块具有副作用，即模块加载时会执行一些操作。
- **false**：表示模块没有副作用，即模块加载时不会执行任何操作。
- **数组**：可以将模块的具体文件路径或文件匹配模式列在数组中。

### sideEffects 是如何辅助 webpack 进行优化的？

sideEffects 字段可以帮助 Webpack 进行摇树优化（Tree Shaking），从而减小最终打包文件的大小。当 Webpack 打包时，它会通过静态分析来确定哪些导入的模块实际上被使用了，然后只保留这些被使用的代码。

---

## 31. script 标签上���那���属性，分别作用是啥？

### 常用属性

1. **src**：指定要引入的外部 JavaScript 文件的 URL。
2. **async**：可选属性，用于指示浏览器异步加载脚本。
3. **defer**：可选属性，用于指示浏览器延迟执行脚本，直到文档解析完成。
4. **type**：指定脚本语言的 MIME 类型。
5. **charset**：指定外部脚本文件的字符编码。
6. **integrity**：用于指定外部脚本文件的 Subresource Integrity（SRI）。

### 不常用属性

1. **crossorigin**：用于那些没有通过标准 CORS 检查的脚本。
2. **fetchpriority**：提供获取外部脚本时使用的相对优先级。
3. **nomodule**：标明这个脚本不应该在支持 ES 模块的浏览器中执行。
4. **nonce**：在 script-src Content-Security-Policy 中允许脚本的一个一次性加密随机数。
5. **referrerpolicy**：表示在获取脚本或脚本获取资源时要发送哪个 referrer。

---

## 32. 为什么 SPA 应用都会提供一个 hash 路由，好处是什么？

SPA（单页应用）通常会使用 hash 路由的方式来实现页面的导航和路由功能。

以下是使用 hash 路由的 SPA 的一些好处：

1. **兼容性**：Hash 路由对浏览器的兼容性非常好。
2. **简单实现**：实现 hash 路由非常简单。
3. **防止页面刷新**：Hash 路由只改变 URL 的片段标识符，不会引起整个页面的重新加载。
4. **前进后退支持**：可以方便地支持浏览器的前进和后退操作。
5. **无需服务端配置**：不需要对服务端进行特殊的配置。

---

## 33. [React] 如何进行路由变化监听？

在 React 中，可以使用 React Router 库来进行路由变化的监听：

```javascript
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function MyComponent(props) {
    useEffect(() => {
        const handleRouteChange = (location, action) => {
            console.log('路由发生了变化', location, action);
        };
        
        // 在组件挂载后，添加路由变化的监听器
        const unlisten = props.history.listen(handleRouteChange);
        
        // 在组件卸载前，移除监听器
        return () => {
            unlisten();
        };
    }, [props.history]);
    
    return (
        <div>组件内容</div>
    );
}

// 使用 withRouter 高阶组件将路由信息传递给组件
export default withRouter(MyComponent);
```

---

## 34. 单点登录是是什么，具体流程是什么？

SSO 一般都需要一个独立的认证中心（passport），子系统的登录均得通过 passport。

### 具体流程是：

1. 用户访问系统 1 的受保护资源，系统 1 发现用户未登录，跳转至 sso 认证中心，并将自己的地址作为参数。
2. sso 认证中心发现用户未登录，将用户引导至登录页面。
3. 用户输入用户名密码提交登录申请。
4. sso 认证中心校验用户信息，创建用户与 sso 认证中心之间的会话（全局会话），同时创建授权令牌。
5. sso 认证中心带着令牌跳转会最初的请求地址（系统 1）。
6. 系统 1 拿到令牌，去 sso 认证中心校验令牌是否有效。
7. sso 认证中心校验令牌，返回有效，注册系统 1。
8. 系统 1 使用该令牌创建与用户的会话（局部会话），返回受保护资源。
9. 用户访问系统 2 的受保护资源。
10. 系统 2 发现用户未登录，跳转至 sso 认证中心，并将自己的地址作为参数。
11. sso 认证中心发现用户已登录，跳转回系统 2 的地址，并附上令牌。
12. 系统 2 拿到令牌，去 sso 认证中心校验令牌是否有效。
13. sso 认证中心校验令牌，返回有效，注册系统 2。
14. 系统 2 使用该令牌创建与用户的局部会话，返回受保护资源。

---

## 35. web 网页如何禁���别���移除水印？

可以通过监听 DOM 的变化来检测是否有人删除水印，使用 MutationObserver API：

```javascript
// 目标节点
const targetNode = document.body;

// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        // 检查是否有子节点被删除
        if (mutation.removedNodes.length > 0) {
            // 在此处判断是否有水印被删除
            // 如果水印被删除，则重新插入水印的 DOM 元素到目标节点
            targetNode.appendChild(watermarkElement);
        }
    }
});

// 配置 MutationObserver
const config = { childList: true, subtree: true };

// 开始观察目标节点
observer.observe(targetNode, config);
```

---

## 36. 用户访问页面白屏了，原因是啥，如何排查？

用户访问页面白屏可能由多种原因引起：

1. **网络问题**：用户的网络连接可能存在问题。
2. **服务端问题**：服务器未正确响应用户请求。
3. **前端代码问题**：页面的前端代码可能存在错误或异常。
4. **浏览器兼容性问题**：不同浏览器对于某些代码的支持可能不一致。
5. **第三方资源加载问题**：页面依赖于某些第三方资源无法加载。
6. **缓存问题**：浏览器可能在缓存中保存了旧版本的页面或资源。
7. **其他可能原因**：安全策略（如 CSP、CORS 等）限制、跨域问题、DNS 解析问题等。

---

## 37. [代码实现] JS 中如何实现大对象深度对比？

```javascript
function deepEqual(obj1, obj2) {
    // 检查类型是否相同
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    
    // 检查是否是对象或数组
    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
        // 检查对象或数组长度是否相同
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        for (let key in obj1) {
            // 递归比较每个属性的值
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }
    
    // 比较基本类型的值
    return obj1 === obj2;
}

// 使用示例：
const obj1 = {
    name: 'John',
    age: 30,
    address: {
        street: '123 Main St',
        city: 'New York'
    }
};

const obj2 = {
    name: 'John',
    age: 30,
    address: {
        street: '123 Main St',
        city: 'New York'
    }
};

console.log(deepEqual(obj1, obj2)); // true
console.log(deepEqual(obj1, obj3)); // false
```

---

## 38. 如何理解数据驱动视图，有哪些核心要素？

数据驱动视图是指将数据作为主要驱动力，通过对数据的处理和分析，动态地更新和呈现视图。

数据驱动视图的核心要素包括：

1. **数据源**：来自数据库、API 接口、文件等不同的来源。
2. **数据处理**：对数据进行清洗、过滤、转换、计算等操作。
3. **视图模板**：定义了视图的结构和样式。
4. **视图更新机制**：根据数据的变化自动更新视图。
5. **用户交互**：用户可以通过界面操作改变数据。

---

## 39. vue-cli 都做了哪些事儿，有哪些功能？

Vue CLI 是一个基于 Vue.js 的命令行工具，用于快速搭建、开发和构建 Vue.js 项目。

1. **项目脚手架**：快速生成新的 Vue.js 项目的基础结构。
2. **开发服务器**：提供开发服务器，支持热模块替换（HMR）。
3. **集成构建工具**：集成了 Webpack。
4. **插件系统**：通过安装插件来扩展项目的功能。
5. **测试集成**：集成了测试工具。
6. **项目部署**：方便地将项目部署到不同的环境。

---

## 40. JS 执行 100 万个任务，如何保证浏览器不卡顿？

### Web Workers

要确保浏览器在执行 100 万个任务时不会卡顿，可以使用 Web Workers：

```javascript
// 主线程代码
const worker = new Worker('worker.js');
worker.postMessage({ start: 0, end: 1000000 });
worker.onmessage = function(event) {
    const result = event.data;
    console.log('任务完成: ', result);
};

// worker.js
onmessage = function(event) {
    const start = event.data.start;
    const end = event.data.end;
    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum += i;
    }
    postMessage(sum);
};
```

### requestAnimationFrame 来实现任务分割

```javascript
// 假设有一个包含大量元素的数组
const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1);

// 每个小块的大小
let chunkSize = 1000;
let index = 0;

function processArrayWithRAF() {
    function processChunkWithRAF() {
        const chunk = bigArray.slice(index, index + chunkSize);
        const result = chunk.map(num => num * num);
        console.log('处理完成: ', result);
        index += chunkSize;
        
        if (index < bigArray.length) {
            requestAnimationFrame(processChunkWithRAF);
        }
    }
    
    requestAnimationFrame(processChunkWithRAF);
}

processArrayWithRAF();
```

### 动态调整 chunkSize

```javascript
const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1);
let chunkSize = 1000;
let index = 0;

function processArrayWithDynamicChunkSize() {
    function processChunkWithRAF() {
        let startTime = performance.now();
        
        for (let i = 0; i < chunkSize; i++) {
            if (index < bigArray.length) {
                const result = bigArray[index] * bigArray[index];
                index++;
            }
        }
        
        let endTime = performance.now();
        let timeTaken = endTime - startTime;
        
        // 根据处理时间动态调整 chunkSize
        if (timeTaken > 16) {
            chunkSize = Math.floor(chunkSize * 0.9);
        } else if (timeTaken < 8) {
            chunkSize = Math.floor(chunkSize * 1.1);
        }
        
        if (index < bigArray.length) {
            requestAnimationFrame(processChunkWithRAF);
        }
    }
    
    requestAnimationFrame(processChunkWithRAF);
}

processArrayWithDynamicChunkSize();
```

---

## 41. JS 放在 head 里和放在 body 里有什么区别？

1. **加载顺序**：放在 head 里会在页面加载之前执行，body 里会在页面加载后执行。
2. **页面渲染**：JS 影响页面布局或样式，放在 head 里可能会导致页面渲染延迟。
3. **代码依赖**：JS 代码依赖其他元素，放在 body 里可以确保这些元素已经加载。
4. **全局变量和函数**：放在 head 里的 JS 代码中的全局变量和函数在整个页面生命周期内都可用。

---

## 42. Eslint 代码检查的过程是啥？

ESLint 是一个插件化的静态代码分析工具，代码检查的过程通常如下：

1. **配置**：在 .eslintrc 配置文件中定义规则。
2. **解析**：使用解析器（如 espree）将代码转换成抽象语法树（AST）。
3. **遍历**：遍历 AST，检查是否有规则适用于该节点。
4. **报告**：生成一份报告，详细说明找到的问题。
5. **修复**：对于某些类型的问题，提供自动修复功能。
6. **集成**：可以集成到 IDE 或构建工具中。

---

## 43. 虚拟滚动加载原理是什么，用 JS 代码简单实现一个虚拟滚动加载？

### 原理

虚拟滚动的核心原理是仅渲染用户可视范围内的列表项，以此减少 DOM 操作的数量和提高性能。

实现虚拟滚动，我们需要：
1. 监听滚动事件，了解当前滚动位置。
2. 根据滚动位置计算当前应该渲染哪些列表项目。
3. ��渲��那些项目，并用占位符占据其它项目应有的位置。
4. 当用户滚动时，重新计算并渲染新的项目。

### 基础版本实现

```javascript
class VirtualScroll {
    constructor(container, itemHeight, totalItems, renderCallback) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.totalItems = totalItems;
        this.renderCallback = renderCallback;
        this.viewportHeight = container.clientHeight;
        this.bufferSize = Math.ceil(this.viewportHeight / itemHeight) * 3;
        this.renderedItems = [];
        this.startIndex = 0;
        this.endIndex = this.bufferSize;
        
        container.addEventListener("scroll", () => this.onScroll());
        this.update();
    }
    
    onScroll() {
        const scrollTop = this.container.scrollTop;
        const newStartIndex = Math.floor(scrollTop / this.itemHeight) - this.bufferSize / 2;
        const newEndIndex = newStartIndex + this.bufferSize;
        
        if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
            this.startIndex = Math.max(0, newStartIndex);
            this.endIndex = Math.min(this.totalItems, newEndIndex);
        }
    }
    
    update() {
        this.container.innerHTML = "";
        
        // 计算并设置容器的总高度
        const totalHeight = this.totalItems * this.itemHeight;
        this.container.style.height = totalHeight + "px";
        
        // 渲染视口内的项
        const fragment = document.createDocumentFragment();
        for (let i = this.startIndex; i < this.endIndex; i++) {
            const item = this.renderCallback(i);
            item.style.top = (i * this.itemHeight) + "px";
            item.style.position = "absolute";
            fragment.appendChild(item);
        }
        this.container.appendChild(fragment);
    }
}
```

### 进阶版本：使用 IntersectionObserver

```javascript
class VirtualScroll {
    constructor(container, itemHeight, totalItems, renderItem) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.totalItems = totalItems;
        this.renderItem = renderItem;
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
            root: this.container,
            threshold: 1.0,
        });
        this.items = new Map();
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.totalItems; i++) {
            const placeholder = this.createPlaceholder(i);
            this.container.appendChild(placeholder);
            this.observer.observe(placeholder);
        }
    }
    
    createPlaceholder(index) {
        const placeholder = document.createElement("div");
        placeholder.style.height = this.itemHeight + "px";
        placeholder.style.width = "100%";
        placeholder.dataset.index = index;
        return placeholder;
    }
    
    onIntersection(entries) {
        entries.forEach((entry) => {
            const index = entry.target.dataset.index;
            if (entry.isIntersecting) {
                const rendered = this.renderItem(index);
                this.container.replaceChild(rendered, entry.target);
                this.items.set(index, rendered);
            } else if (this.items.has(index)) {
                const placeholder = this.createPlaceholder(index);
                this.container.replaceChild(placeholder, this.items.get(index));
                this.observer.observe(placeholder);
                this.items.delete(index);
            }
        });
    }
}
```

---

## 44. [React] react-router 和原生路由区别？

### React Router 和浏览器原生 history API 的区别

| 特性 | ReactRouter | 原生History API |
|------|------------|----------------|
| 抽象级别 | 高层次抽象，提供了组件和hook | 底层API，直接操作历史记录栈 |
| 便利性 | 声明式和编程式导航 | 手动处理URL和组件映射 |
| 功能 | 懒加载、嵌套路由、重定向等 | 基本的历史记录管理 |
| 集成 | 与React生命周期和状态管理紧密集成 | 需要手动整合到React中 |
| 服务器渲染 | 支持同构应用程序 | 主要用于客户端 |

---

## 45. html 的行内元素和块级元素的区别？

### 块级元素 (Block) vs 行内元素 (Inline)

| 特性 | 块级元素 | 行内元素 |
|------|----------|----------|
| 布局 | 开始于新的一行 | 在同一行内水平排列 |
| 宽度 | 默认填满父容器宽度 | 宽度由内容决定 |
| 高度 | 可以设置高度 | 高度通常由内容决定 |
| margin | 可以设置上下左右的外边距 | 只能设置左右外边距 |
| padding | 可以设置上下左右的内边距 | 只能设置左右内边距 |
| 内容 | 可以包含其他块级或行内元素 | 通常包含文本或数据 |
| 堆叠方式 | 垂直堆叠 | 水平排列 |

---

## 46. 介绍一下 requestIdleCallback API？

requestIdleCallback 是一个 Web API，它允许开发者请求浏览器在主线程空闲时执行一些低优先级的后台任务。

```javascript
requestIdleCallback(myNonCriticalFunction, { timeout: 5000 });

function myNonCriticalFunction(deadline) {
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && someCondition()) {
        // 执行工作直到时间用完或下次更新不是必要的
    }
    
    // 如果还有未完成的工作，可以请求下一次空闲周期
    if (someCondition()) {
        requestIdleCallback(myNonCriticalFunction);
    }
}
```

---

## 47. documentFragment API 是什么，有哪些使用场景？

DocumentFragment 是 Web API 中的一部分，它是 DOM 的一个非常轻量级的节点，代表一组 DOM 节点的集合。

### 使用场景

- 批量操作：一次性添加多个节点到 DOM 树中。
- 离屏操作：创建复杂的 DOM 结构而不触发页面重排和重绘。
- 内容填充：在填充 DOM 元素内容之前完成所有节点的添加和排序。

### 示例代码

```javascript
var fragment = document.createDocumentFragment();

var div = document.createElement("div");
var p = document.createElement("p");

fragment.appendChild(div);
fragment.appendChild(p);

var body = document.getElementById("body");
body.appendChild(fragment);
```

---

## 48. git pull 和 git fetch 有啥区别？

### git fetch

- git fetch 下载远程仓库最新的内容到本地仓库，但不自动合并。
- 运行后，需要手动执行合并操作（使用 git merge）。

### git pull

- git pull 实际上是 git fetch + git merge。
- 会自动拉取远程仓库的新变更，并尝试合并到当前所在的本地分支中。

---

## 49. 前端如何做页面主题色切换？

### 使用 CSS 自定义属性

```css
:root {
    --primary-color: #5b88bd;
    --text-color: #000;
}

[data-theme="dark"] {
    --primary-color: #1e2a34;
    --text-color: #ccc;
}
```

```javascript
function toggleTheme() {
    const root = document.documentElement;
    if (root.dataset.theme === "dark") {
        root.dataset.theme = "light";
    } else {
        root.dataset.theme = "dark";
    }
}
```

### 使用 CSS 类切换

```css
.light-theme {
    --primary-color: #5b88bd;
    --text-color: #000;
}

.dark-theme {
    --primary-color: #1e2a34;
    --text-color: #ccc;
}
```

```javascript
function toggleTheme() {
    const bodyClass = document.body.classList;
    if (bodyClass.contains("dark-theme")) {
        bodyClass.replace("dark-theme", "light-theme");
    } else {
        bodyClass.replace("light-theme", "dark-theme");
    }
}
```

### 使用 LocalStorage 记录用户主题偏好

```javascript
function saveThemePreference() {
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

function applyThemePreference() {
    const preferredTheme = localStorage.getItem("theme");
    if (preferredTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}
```

### 使用媒体查询自动应用暗黑模式

```css
@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #1e2a34;
        --text-color: #ccc;
    }
}
```

---

## 50. 前端视角 - 如何保证系统稳定性？

1. 静态资源多备份
2. 首屏请求缓存
3. 请求异常报警
4. 页面崩溃报警
5. E2E 定时全量跑用例

---

## 51. 如何统计长任务时间、长任务执行次数？

```javascript
let observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log("Long Task detected");
        console.log("Task Start Time: " + entry.startTime + ", Duration: " + entry.duration);
    }
});

observer.observe({ entryTypes: ["longtask"] });

// 统计数据的变量
let longTaskCount = 0;
let totalLongTaskTime = 0;

observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        longTaskCount++;
        totalLongTaskTime += entry.duration;
    });
});

observer.observe({ entryTypes: ["longtask"] });
```

---

## 52. V8 里面的 JIT 是什么？

JIT 是"Just-In-Time"（即时编译）的缩写，它是一种提高代码执行性能的技术。

V8 引擎中 JIT 编译器的工作原理：

1. **解释执行**：V8 首先通过解释器 Ignition 执行 JavaScript 代码。
2. **即时编译**：当代码被多次执行时，JIT 编译器 TurboFan 会介入，将热点代码编译成机器语言。
3. **优化与去优化**：JIT 编译器会对热点代码进行优化，如果假设不成立，需要去掉优化重新编译。

---

## 53. 用 JS 写一个 cookies 解析函数，输出结果为一个对象？

```javascript
function parseCookies() {
    var cookiesObj = {};
    var cookies = document.cookie.split(";");
    
    cookies.forEach(function(cookie) {
        var cleanCookie = cookie.trim();
        var separatorIndex = cleanCookie.indexOf("=");
        
        if (separatorIndex === -1) return;
        
        var key = cleanCookie.substring(0, separatorIndex);
        var value = cleanCookie.substring(separatorIndex + 1);
        
        key = decodeURIComponent(key);
        value = decodeURIComponent(value);
        
        cookiesObj[key] = value;
    });
    
    return cookiesObj;
}

var cookies = parseCookies();
console.log(cookies);
```

---

## 54. vue 中 Scoped Styles 是如何实现样式隔离的，原理是啥？

### Scoped Styles 的工作原理

1. 当为 `<style>` 标签添加 `scoped` 属性时，Vue 的加载器会处理组件文件。
2. vue-loader 使用 PostCSS 来处理 scoped 的 CSS，为组件模板内的每个元素添加一个独特的属性（如 data-v-f3f3eg9）。
3. 所有的 CSS 规则都会被更新，以仅匹配带有相应属性选择器的元素。

### 示例

假设组件中写的是：

```css
.btn {
    background-color: blue;
}
```

编译后会转换成：

```css
.btn[data-v-f3f3eg9] {
    background-color: blue;
}
```

---

## 55. 样式隔离方式有哪些？

1. **CSS 模块（CSS Modules）**：在构建时将 CSS 类名局部作用域化。
2. **Shadow DOM**：Web 组件规范的一部分，允许将一段不受外界影响的 DOM 附加到元素上。
3. **CSS-in-JS 库**：使用 JavaScript 编写 CSS，如 styled-components、Emotion 等。
4. **使用 BEM（Block Element Modifier）命名约定**：严格的命名规则来保持样式的模块化。
5. **CSS Scoped**：在 Vue 中为 style 标签添加 scoped 属性。
6. **使用 iframe**：提供非常强的样式和脚本隔离。
7. **Web 组件**：利用自定义元素和 Shadow DOM。
8. **封装的 CSS 架构**：使用更具体的类选择器。
9. **PostCSS 插件**：自动添加前缀、变量等。

---

## 56. 在 JS 中，如何解决递归导致栈溢出问题？

### 转化为循环

```javascript
// 递归
function factorial(n) {
    if (n === 1) return 1;
    return n * factorial(n - 1);
}

// 循环
function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

### 用 Trampoline 函数

```javascript
function trampoline(fn) {
    return function(...args) {
        let result = fn.apply(this, args);
        while (typeof result === "function") {
            result = result();
        }
        return result;
    };
}
```

### 使用生成器和 Promises

```javascript
function recursiveAsyncFunction(i) {
    if (i < 0) return Promise.resolve();
    console.log("Recursion ", i);
    return new Promise((resolve) => {
        setImmediate(() => {
            resolve(recursiveAsyncFunction(i - 1));
        });
    });
}
```

---

## 57. 站点如何防止爬虫？

1. 修改 robots.txt
2. 使用 CAPTCHA
3. 检查用户代理字符串
4. 分析流量行为
5. 使用 Web 应用防火墙 (WAF)
6. 服务端渲染和动态 Token
7. 添加额外的 HTTP 头
8. IP 黑名单
9. 限制访问速度
10. API 限流
11. 使用 HTTPS
12. 更改网站结构和内容

---

## 58. ts 项目中，如何使用 node_modules 里面定义的全局类型包到自己项目 src 下面使用？

在 TypeScript 项目中导入 node_modules 中定义的全局包：

1. **安装包**：`npm install <package-name>`
2. **类型声明**：确保该全局包具有类型声明，可能需要 `npm install @types/<package-name>`
3. **导入包**：在 TypeScript 文件中使用 import 语句导入全局包
4. **tsconfig.json 配置**：确保配置正确

---

## 59. 不同标签页或窗口间的【主动推送消息机制】的方式有哪些？（不借助服务端）

### BroadcastChannel API

```javascript
// 创建一个广播频道
const channel = new BroadcastChannel("my-channel-name");

// 发送消息
channel.postMessage("Hello from a tab!");

// 监听消息
channel.addEventListener("message", function(event) {
    console.log("Message received: ", event.data);
});
```

### Service Workers

```javascript
// sw.js
self.addEventListener("message", (event) => {
    if (event.data === "New message from another tab") {
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                windowClients.forEach((client) => {
                    client.postMessage("New message for " + client.id);
                });
            });
    }
});
```

### SharedWorker

```javascript
var myWorker = new SharedWorker("worker.js");
myWorker.port.start();
myWorker.port.postMessage({ command: "start", data: [1, 2, 3] });
myWorker.port.onmessage = function(event) {
    console.log("Result from worker:", event.data);
};
```

### 使用 localStorage 的变更监听

```javascript
window.addEventListener("storage", function(event) {
    if (event.storageArea === localStorage && event.key === "someKey") {
        console.log(event.newValue);
    }
});
```

---

## 60. [React] 在 react 项目开发过程中，是否可以不用 react-router，使用浏览器原生 history 路由来组织页面路由？

```javascript
class App extends React.Component {
    componentDidMount() {
        window.onpopstate = this.handlePopState;
        this.route();
    }
    
    handlePopState = () => {
        this.route();
    };
    
    route() {
        const path = window.location.pathname;
        switch (path) {
            case "/page1":
                // 渲染 Page1 组件
                break;
            case "/page2":
                // 渲染 Page2 组件
                break;
            default:
                // 渲染默认组件或404页面
                break;
        }
    }
    
    navigate = (path) => {
        window.history.pushState(null, "", path);
        this.route();
    };
    
    render() {
        return (
            <div>
                <button onClick={() => this.navigate("/page1")}>Go to Page 1</button>
                <button onClick={() => this.navigate("/page2")}>Go to Page 2</button>
            </div>
        );
    }
}
```

---

## 61. 在表单校验场景中，如何实现页面视口滚动到报错的位置？

```javascript
function handleValidation() {
    var valid = true;
    ["name", "age"].forEach((key) => {
        if (!validateInput(key)) {
            console.error("Validation failed for: " + key);
            valid = false;
            
            var element = document.getElementById(key);
            element.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    });
    return valid;
}

document.getElementById("myForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleValidation();
});
```

---

## 62. 如何一次性渲染十万条数据还能保证页面不卡顿？

### requestAnimationFrame + fragment（时间分片）

```javascript
const total = 100000;
let ul = document.getElementById("container");
let once = 20;

function loop(curTotal) {
    if (curTotal <= 0) return;
    let pageCount = Math.min(curTotal, once);
    
    window.requestAnimationFrame(() => {
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < pageCount; i++) {
            let li = document.createElement("li");
            li.innerHTML = Math.floor(Math.random() * total);
            fragment.appendChild(li);
        }
        ul.appendChild(fragment);
        loop(curTotal - pageCount);
    });
}

loop(total);
```

---

## 63. [webpack] 打包时 hash 码是如何生成的？

Webpack 在打包过程中生成 hash 码主要用于缓存和版本管理。主要有三种类型：

1. **hash**：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改。
2. **chunkhash**：与 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值。
3. **contenthash**：根据文件内容来定义 hash，内容不变，则 contenthash 不变。

生成方式：
- hash 和 chunkhash 主要是通过某种 hash 算法（默认 MD5）来对文件名或者 chunk 数据进行编码。
- contenthash 是通过构建时的 webpack 插件来处理。

---

## 64. 如何从 0 到 1 搭建前端基建？

### 什么是基建？

- 业务复用
- 提升研发效率
- 规范研发流程
- 团队技术提升
- 团队的技术影响力
- 开源建设

### 前端基建有哪些？

- 前端规范（Standard）
- 前端文档（Document）
- 前端项目模板管理（Templates）
- 前端脚手架（CLI）
- 前端组件库（UI Design）
- 前端响应式设计 or 自适应设计
- 前端工具库（类 Hooks /Utils）
- 前端工具自动化（Tools）
- 接口数据聚合（BFF）
- 前端 SSR 推进
- 前端自动化构建部署（CI/CD）
- 全链路前端监控/数据埋点系统
- 前端可视化平台
- 前端性能优化
- 前端低代码平台搭建

---

## 65. 你在开发过程中，使用过哪些 TS 的特性或者能力？

1. **Utility Types（工具类型）**：
   - Partial<T>
   - Required<T>
   - Readonly<T>
   - Record<K, T>
   - Pick<T, K>
   - Omit<T, K>
   - Exclude<T, U>
   - Extract<T, U>
   - NonNullable<T>
   - ReturnType<T>
   - Parameters<T>

2. **条件判定类型**：Conditional Types、Distribute Conditional Types

3. **Mapped Types（映射类型）**

4. **Template Literal Types（模板文字类型）**

5. **类型推断关键字**：
   - keyof
   - instanceof
   - in
   - type guards
   - as

---

## 66. JS 的加载会阻塞浏览器渲染吗？

JavaScript 的加载、解析和执行默认情况下会阻塞浏览器的渲染过程。

### 优化方法

1. **异步脚本（async）**：
   ```html
   <script async src="script.js"></script>
   ```

2. **延迟脚本（defer）**：
   ```html
   <script defer src="script.js"></script>
   ```

3. **动态脚本加载**：
   ```javascript
   var script = document.createElement("script");
   script.src = "script.js";
   document.body.appendChild(script);
   ```

4. **移动脚本位置**：将脚本放在 HTML 的底部。

---

## 67. 浏览器对队头阻塞有什么优化？

现代浏览器和协议已经实施了多种优化措施：

1. **HTTP/2**：多路复用，允许在同一 TCP 连接上同时传输多个请求。
2. **服务器推送**：HTTP/2 允许服务器主动发送多个响应。
3. **域名分散（Domain Sharking）**：通过创建多个子域，开启更多 TCP 连接。
4. **连接重用（Connection Reuse）**：持久连接，减少 TCP 握手开销。
5. **资源优化**：减少资源大小，压缩、优化图片。
6. **优先级设置**：HTTP/2 允许设置资源的加载优先级。
7. **预加载**：使用 `<link rel="preload">` 标签预加载关键资源。
8. **HTTP/3 和 QUIC 协议**：基于 UDP 之上的新传输层协议。

---

## 68. Webpack 项目中通过 script 标签引入资源，在项目中如何处理？

### 在 HTML 文件中直接引入

```html
<script src="https://cdn.example.com/library.js"></script>
```

### 使用 Webpack 管理

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    externals: {
        libraryName: "LibraryGlobalVariable",
    },
    plugins: [new HtmlWebpackPlugin({
        template: "src/index.html",
        scriptLoading: "blocking",
    })],
};
```

然后在 index.html 模板文件中引入资源：

```html
<script src="https://cdn.example.com/library.js"></script>
```

---

## 69. 应用上线后，怎么通知用户刷新当前页面？

### 静态资源版本管理

版本直接给到 html 模板，其他 link 打包的资源以哈希 code 作为文件名称后缀。

### 主动推送给客户端

1. **WebSockets**：服务器实时向客户端发送消息。
2. **Service Workers**：检测资源更新，推送通知。
3. **轮询**：客户端定时发送 HTTP 请求查询版本信息。

---

## 70. ESLint 代码检查的过程是啥？

ESLint 是一个插件化的静态代码分析工具：

1. **配置**：在 .eslintrc 配置文件中定义规则。
2. **解析**：使用解析器将代码转换成 AST。
3. **遍历**：遍历 AST，检查规则。
4. **报告**：生成一份报告。
5. **修复**：提供自动修复功能。
6. **集成**：集成到 IDE 或构建工具中。

---

## 71. HTTP 是一个无状态的协议，那么 Web 应用要怎么保持用户的登录态呢？

### 客户端存储（cookie）

cookie 存储在客户端，每次浏览器的请求会自动带上 cookie 里的凭证。

### 服务端存储（session）

凭证存储到服务端，服务端维护一个 key-value 表。

### Token

JSON Web Token（JWT）是以 JSON 格式存储信息的 Token：

```javascript
const jwt = require('jsonwebtoken');

let token = jwt.sign({
    name: username
}, config.secret, {
    expiresIn: '24h'
});

res.cookie('token', token);
```

---

## 72. 如何检测网页空闲状态（一定时间内无操作）？

```javascript
const onIdleDetection = (callback, timeout = 15, immediate = false) => {
    let pageTimer;
    let beginTime = 0;
    
    const onClearTimer = () => {
        pageTimer && clearTimeout(pageTimer);
        pageTimer = undefined;
    };
    
    const onStartTimer = () => {
        const currentTime = Date.now();
        if (pageTimer && currentTime - beginTime < 100) {
            return;
        }
        onClearTimer();
        beginTime = currentTime;
        pageTimer = setTimeout(() => {
            callback();
        }, timeout * 1000);
    };
    
    const onPageVisibility = () => {
        onClearTimer();
        if (document.visibilityState === "visible") {
            const currentTime = Date.now();
            if (currentTime - beginTime >= timeout * 1000) {
                callback();
            } else {
                pageTimer = setTimeout(() => {
                    callback();
                }, timeout * 1000 - (currentTime - beginTime));
            }
        }
    };
    
    const startDetection = () => {
        onStartTimer();
        document.addEventListener("mousedown", onStartTimer);
        document.addEventListener("mousemove", onStartTimer);
        document.addEventListener("visibilitychange", onPageVisibility);
    };
    
    const stopDetection = () => {
        onClearTimer();
        document.removeEventListener("mousedown", onStartTimer);
        document.removeEventListener("mousemove", onStartTimer);
        document.removeEventListener("visibilitychange", onPageVisibility);
    };
    
    const restartDetection = () => {
        onClearTimer();
        onStartTimer();
    };
    
    if (immediate) {
        startDetection();
    }
    
    return {
        startDetection,
        stopDetection,
        restartDetection,
    };
};
```

---

## 73. 为什么 Vite 速度比 Webpack 快？

### 1. 开发模式的差异

- **Webpack**：先打包再启动开发服务器。
- **Vite**：直接启动，然后再按需编译依赖文件。

### 2. 对 ES Modules 的支持

Vite 充分利用了现代浏览���支��� ES Modules 的特性，将开发环境下的模块文件直接作为浏览器要执行的文件。

### 3. 底层语言的差异

- Webpack 基于 Node.js（毫秒级别）
- Vite 基于 esbuild（Go 语言，纳秒级别）

### 4. 热更新的处理

在 Vite 中，当某个模块内容改变时，只需要让浏览器重新请求该模块即可。

---

## 74. 列表分页，快速翻页下的竞态问题？

### 问题描述

前端分页请求时，翻页很快，请求还没有来得及回来的时候就发起了下一次请求。

### 解决方案

使用请求标记或唯一标识符来确保请求和结果之间的对应关系：

```javascript
let requestId = 0;

function sendRequest(page) {
    requestId++;
    fetch("/api?requestId=" + requestId + "&page=" + page)
        .then(response => response.json())
        .then(data => {
            handleResponseData(requestId, data);
        });
}

function handleResponseData(requestId, data) {
    if (requestId === currentRequestId) {
        // 在这里处理数据并更新页面
    }
}
```

---

## 75. JS 执行 100 万个任务，如何保证浏览器不卡顿？

（与第 40 题相同，此处省略）

---

## 76. git 仓库迁移应该怎么操作？

### 方法一：使用 git clone 和 git push

```bash
git clone --mirror <仓库A URL>
cd <仓库A目录>
git remote set-url --push origin <仓库B URL>
git push --mirror
```

### 方法二：使用 git bundle

```bash
git bundle create repoA.bundle --all
git clone repoA.bundle <仓库B目录>
```

---

## 77. 如何禁止别人调试自己的前端页面代码？

### 无限 debugger

```javascript
(() => {
    function ban() {
        setInterval(() => {
            setInterval(() => {
                Function('debugger')();
            }, 50);
        })(() => {
            try {
                ban();
            } catch (err) {}
        })();
    }
})();
```

### 终极增强版

```javascript
(() => {
    function block() {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            document.body.innerHTML = "检测到非法调试,请关闭后刷新重试!";
        }
        setInterval(() => {
            (function() {
                return false;
            }
                ['constructor']('debugger')
                ['call']();
        }, 50);
    }
    try {
        block();
    } catch (err) {}
})();
```

---

## 78. web 系统里面，如何对图片进行优化？

### 1. 选择合适的图片格式

- **JPG**：有损压缩，适用于照片
- **PNG**：无损压缩，适用于图标、透明图片
- **WebP**：有损+无损压缩，支持透明度，文件更小

### 2. 图片压缩

使用 webpack 的 image-webpack-loader 进行压缩。

### 3. 雪碧图

使用 webpack-spritesmith 插件自动处理雪碧图。

### 4. 图标类型资源推荐使用 iconfont

### 5. 使用 base64 格式

适用于小图标（小于 10KB），变更率较低的资源。

### 6. 使用 CDN 加载图片

### 7. 图片懒加载

- Intersection Observer API
- 自定义监听器

### 8. 图片预加载

```javascript
function preloadImage(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}
```