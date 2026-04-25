# 字节跳动 - 前端开发二面面试题

> 📄 来源图片：2面.jpeg
> 🕐 解析时间：2025-01-13

---

## 🏢 岗位信息

- **公司**：ByteDance 字节跳动
- **岗位**：前端开发
- **时长**：60分钟

---

## 📋 面试题目

### Q1: 性能指标说一下？

**A:**
Web性能指标（Core Web Vitals及其他）：

1. **FCP (First Contentful Paint)** - 首次内容绘制：浏览器首次渲染任何内容的时间（建议≤1.8s）

2. **LCP (Largest Contentful Paint)** - 最大内容绘制：视口中最大内容元素渲染时间（建议≤2.5s）

3. **FID (First Input Delay)** - 首次输入延迟：用户首次交互到浏览器响应的时间（建议≤100ms）
   - 已逐渐被INP取代

4. **INP (Interaction to Next Paint)** - 交互到下一次绘制：衡量页面交互响应能力（建议≤200ms）

5. **CLS (Cumulative Layout Shift)** - 累积布局偏移：衡量页面视觉稳定性（建议≤0.1）

6. **TTFB (Time to First Byte)** - 首字节时间：请求到首字节返回的时间（建议≤600ms）

7. **TBT (Total Blocking Time)** - 总阻塞时间：FCP到TTI之间主线程被阻塞的时间

8. **TTI (Time to Interactive)** - 可交互时间：页面完全可交互的时间

9. **FMP (First Meaningful Paint)** - 首次有意义绘制：主要内容可见的时间（已逐渐被LCP取代）

10. **SI (Speed Index)** - 速度指数：页面内容填充速度

11. **TBT (Total Blocking Time)** - 总阻塞时间

测量工具：Lighthouse、Chrome DevTools Performance、Web Vitals扩展、PageSpeed Insights

---

### Q2: 性能优化说一下？做了哪些性能优化？最后的结果怎么样？

**A:**
**网络优化**：

- 启用Gzip/Brotli压缩，减少传输体积60-80%
- 资源部署到CDN，缩短请求距离
- HTTP/2多路复用，减少连接开销
- 合理设置缓存策略（Cache-Control、ETag）
- DNS预解析（dns-prefetch）和预连接（preconnect）

**资源优化**：

- 图片使用WebP/AVIF格式，配合响应式图片（srcset）
- 代码分割（Code Splitting），路由懒加载
- Tree Shaking移除无用代码
- 第三方库按需引入（lodash-es）
- 字体使用font-display: swap

**渲染优化**：

- 骨架屏提升感知性能
- 虚拟滚动处理大数据列表（10万+数据）
- Intersection Observer实现图片/组件懒加载
- requestIdleCallback处理非关键任务
- 防抖节流优化高频事件

**构建优化**：

- 使用Vite替代Webpack，构建速度提升10倍
- 启用esbuild压缩，比Terser快20倍
- 模块联邦实现微前端

**结果示例**：LCP从4.2s降到1.8s，CLS从0.25降到0.05，转化率提升15%

---

### Q3: 现在回头看，还有没有其他的性能优化方式？

**A:**
**可以进一步优化的方向**：

1. **边缘渲染/边缘计算**：
   - Cloudflare Workers/Vercel Edge
   - 在CDN节点进行SSR，减少传输延迟

2. **Service Worker缓存策略**：
   - Cache First策略缓存静态资源
   - Background Sync离线同步
   - Push Notification预加载

3. **资源优先级调度**：
   - Critical CSS内联
   - Preload关键资源
   - Priority Hints (fetchpriority)

4. **新一代图片格式**：
   - AVIF比WebP再节省30%
   - JPEG XL更好的压缩率

5. **Partial Hydration**：
   - Astro、Fresh等框架的岛屿架构
   - 仅对交互组件进行 hydration

6. **Streaming SSR**：
   - React 18 Streaming SSR
   - 渐进式流式传输HTML

7. **WebAssembly**：
   - 图像处理、编解码放到WASM
   - 接近原生的性能

8. **HTTP/3**：
   - 基于QUIC协议，减少握手延迟
   - 更好的弱网表现

9. **推测性预渲染**：
   - 根据用户行为预测下一页并预渲染
   - Prefetching + Prefetching

---

### Q4: 看你使用了npm包在多个项目间共享代码，为什么要这么做？优势在哪？劣势在哪？

**A:**
**为什么要做**：

- 多项目使用相同的工具函数、组件、配置
- 避免代码重复，统一代码规范
- 减少维护成本，一处修改多处生效

**优势**：

1. **代码复用**：公共逻辑抽离，减少重复开发
2. **版本管理**：通过语义化版本控制（semver）管理更新
3. **解耦**：业务代码与公共代码分离
4. **独立测试**：npm包可以独立测试，保证质量
5. **权限控制**：可通过私有npm registry控制访问权限
6. **构建优化**：公共代码单独打包，利用浏览器缓存

**劣势**：

1. **版本同步成本**：更新包后需要各项目升级
2. **兼容性处理**：需要支持多个项目的不同需求
3. **发布流程复杂**：需要CI/CD自动化发布
4. **调试困难**：跨包调试不如单仓库方便
5. **Breaking Change管理**：需要维护迁移文档
6. **依赖管理**：各项目依赖版本可能冲突

**替代方案对比**：

- Monorepo（Turborepo/Nx）：更适合紧密关联的项目
- Git Submodule：版本控制复杂
- 直接复制：维护成本高

---

### Q5: 现在回头看还有没有其他的方式？

**A:**
**其他共享代码的方式**：

1. **Monorepo架构**：
   - 使用Turborepo、Nx、Rush
   - 代码在同一个仓库，但分发为多个包
   - 便于跨包重构和调试
   - 原子提交（多包同时修改）

2. **Bit（bit.dev）**：
   - 组件级共享，独立版本控制
   - 可视化组件库
   - 支持跨框架（React、Vue、Angular）

3. **Git Subtree/Submodule**：
   - 子仓库嵌入主仓库
   - 适合紧密耦合的共享代码

4. **微前端共享依赖**：
   - Module Federation共享库
   - 运行时共享，减少重复加载

5. **IDE代码片段**：
   - 模板代码快速生成
   - 适合脚手架类代码

6. **CLI工具**：
   - 封装为CLI，如`create-app`
   - 包含最佳实践的配置和模板

**推荐选择**：

- 大型团队/多项目：Monorepo + npm包
- 组件库：Bit或Storybook
- 配置类代码：ESLint/Prettier共享配置包

---

### Q6: 页面适配手段？

**A:**
**移动端适配**：

1. **Viewport设置**：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

2. **Rem适配方案**：
```javascript
// 以iPhone6/7/8的375px为基准，1rem=37.5px
const baseSize = 37.5;
function setRem() {
  const scale = document.documentElement.clientWidth / 375;
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
}
```

3. **Viewport单位**：
```css
.container {
  width: 100vw;
  padding: 0 4vw;
  font-size: 4vw;
}
```

4. **CSS媒体查询**：
```css
@media (max-width: 375px) { /* 小屏 */ }
@media (min-width: 376px) and (max-width: 414px) { /* 中屏 */ }
@media (min-width: 415px) { /* 大屏 */ }
```

**PC端适配**：

1. **固定宽度居中**：
```css
.container {
  width: 1200px;
  margin: 0 auto;
}
@media (max-width: 1200px) {
  .container { width: 100%; padding: 0 20px; }
}
```

2. **百分比+最大最小宽度**：
```css
.container {
  width: 80%;
  max-width: 1400px;
  min-width: 960px;
}
```

3. **CSS Grid/Flex自适应**：
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

4. **Container Queries**（现代方案）：
```css
.card-container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card { display: flex; }
}
```

**大屏适配**（数据可视化）：

- 设计稿1920*1080
- 使用transform scale等比例缩放
- 或rem/vw混合方案

---

### Q7: 前端监控机制说一下？Sentry的原理简单讲一下？

**A:**
**前端监控体系**：

1. **错误监控**：
   - JS错误：window.onerror、unhandledrejection
   - 资源加载错误：addEventListener('error')
   - Promise错误：unhandledrejection
   - 接口错误：拦截fetch/xhr

2. **性能监控**：
   - Navigation Timing API
   - Resource Timing API
   - Paint Timing API (FCP、LCP)
   - Layout Shift API (CLS)

3. **行为监控**：
   - PV/UV统计
   - 点击热力图
   - 用户行为路径
   - 录屏回放（rrweb）

4. **业务监控**：
   - 接口成功率
   - 业务转化率
   - 核心功能可用性

**Sentry原理**：

1. **SDK集成**：
   - 通过CDN或npm引入Sentry SDK
   - 初始化时配置DSN（数据源名称）

2. **错误捕获**：
   - 重写window.onerror捕获JS错误
   - 重写window.onunhandledrejection捕获Promise错误
   - 通过Proxy拦截fetch/xhr捕获接口错误

3. **上下文收集**：
   - 自动收集：浏览器信息、用户IP、页面URL、堆栈跟踪
   - 手动添加：用户信息、面包屑（操作路径）、标签

4. **数据处理**：
   - Source Map映射还原压缩代码
   - 错误归类聚合（相同错误合并）
   - 智能告警（邮件、Slack、钉钉）

5. **上报机制**：
   - 使用sendBeacon或fetch上报
   - 支持离线存储、断网重传
   - 采样率控制避免流量过大

---

### Q8: React Fiber架构?

**A:**
**Fiber是React 16引入的新协调引擎**：

**解决的问题**：

- React 15采用递归遍历，同步渲染，大型应用会阻塞主线程
- 动画卡顿、输入响应延迟

**Fiber核心思想**：

1. **增量渲染**：将渲染工作拆分成小单元
2. **可中断恢复**：根据优先级调度，高优先级任务（用户输入）可中断低优先级任务（列表渲染）
3. **时间切片**：利用requestIdleCallback（后改为Scheduler包）在浏览器空闲时执行

**Fiber数据结构**：
```javascript
// 简化版Fiber节点
{
  type: 'div',           // 组件类型
  key: null,             // key
  props: { children: [] },
  stateNode: domNode,    // 对应的真实DOM

  // 链表结构，构建Fiber树
  child: fiber | null,   // 第一个子节点
  sibling: fiber | null, // 下一个兄弟节点
  return: fiber | null,  // 父节点

  // 更新相关
  effectTag: 'PLACEMENT' | 'UPDATE' | 'DELETION',
  nextEffect: fiber,     // 副作用链表

  // 优先级调度
  expirationTime: number,
  mode: number           // 模式（同步/异步）
}
```

**双缓冲技术**：

- current tree：当前显示的树
- workInProgress tree：正在构建的树
- 渲染完成后，直接切换指针，避免DOM操作中间状态

**优先级调度**：

- Synchronous（同步，最高）
- UserBlocking（用户交互，250ms超时）
- Normal（普通，5s超时）
- Low（低优先级，10s超时）
- Idle（空闲，无超时）

**核心API**：

- ReactDOM.createRoot().render()（并发模式）
- useTransition()、useDeferredValue()（控制更新优先级）

---

### Q9: 垃圾回收机制?

**A:**
**JavaScript垃圾回收（GC）**：

1. **标记清除（Mark-and-Sweep）- 主流**：
   - 标记阶段：从根对象（全局对象、调用栈变量）开始遍历，标记所有可达对象
   - 清除阶段：清除未被标记的对象，回收内存
   - 优点：可以解决循环引用问题

2. **引用计数（已弃用）**：
   - 记录对象被引用的次数
   - 引用为0时回收
   - 缺点：无法解决循环引用（内存泄漏）

3. **V8分代回收**��
   - **新生代（Young Generation）**：存放临时对象，使用Scavenge算法
     - From空间：使用中的对象
     - To空间：空闲
     - 标记存活对象后复制到To空间，交换From/To
     - 经过两次GC仍存活的对象晋升到老生代

   - **老生代（Old Generation）**：存放长期存活对象，使用标记-整理
     - 标记-清除后会产生内存碎片
     - 标记-整理将存活对象向一端移动

4. **增量标记（Incremental Marking）**：
   - 将标记过程拆分为小步骤，避免长时间停顿
   - 使用三色标记法（白-未访问、灰-处理中、黑-已处理）

5. **写屏障（Write Barrier）**：
   - 标记期间记录对象引用变化
   - 保证增量标记的正确性

**内存泄漏场景**：

- 全局变量
- 闭包（未释放的引用）
- DOM引用（已移除DOM但JS仍引用）
- 事件监听器未移除
- 定时器未清除

**优化**：

- 手动解除引用（obj = null）
- 使用WeakMap/WeakSet（键是弱引用）

---

### Q10: Map和WeakMap?

**A:**
**Map vs WeakMap对比**：

| 特性 | Map | WeakMap |
|------|-----|---------|
| 键类型 | 任意值 | 只能是对象 |
| 迭代 | 可迭代（for...of、keys/values/entries） | 不可迭代 |
| size属性 | 有 | 无 |
| 垃圾回收 | 强引用，阻止GC | 弱引用，不阻止GC |
| 性能 | 一般 | 更好的GC性能 |

**Map特点**：
```javascript
const map = new Map();
map.set('key', 'value');
map.set({}, 'object key');
map.set(123, 'number key');

// 迭代
for (const [key, value] of map) {
  console.log(key, value);
}
```

**WeakMap特点**：
```javascript
let obj = { name: 'test' };
const weakMap = new WeakMap();
weakMap.set(obj, 'private data');

// 当obj不再被引用时
obj = null;
// weakMap中的条目会被自动GC回收，避免内存泄漏
```

**WeakMap应用场景**：

1. **私有属性实现**：
```javascript
const privateData = new WeakMap();

class MyClass {
  constructor() {
    privateData.set(this, { secret: 'value' });
  }
  getSecret() {
    return privateData.get(this).secret;
  }
}
// 实例被销毁后，privateData中的数据自动释放
```

2. **DOM节点缓存**：
```javascript
const cache = new WeakMap();

function getData(element) {
  if (!cache.has(element)) {
    cache.set(element, computeExpensiveData(element));
  }
  return cache.get(element);
}
// DOM被移除后，缓存自动清理
```

---

### Q11: 原型链?

**A:**
**原型链是JavaScript实现继承的机制**：

```javascript
// 构造函数
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  return 'Hello, ' + this.name;
};

// 实例
const p = new Person('Tom');

// 原型链关系
p.__proto__ === Person.prototype;
Person.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;

// 完整链条
p -> Person.prototype -> Object.prototype -> null
```

**原型链查找**：

1. 访问p.name → 在p自身找到
2. 访问p.sayHello → p自身没有 → 沿__proto__到Person.prototype找到
3. 访问p.toString → p没有 → Person.prototype没有 → Object.prototype找到

**继承实现**：
```javascript
// ES5寄生组合继承
function Student(name, grade) {
  Person.call(this, name); // 借用构造函数
  this.grade = grade;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

// ES6 class语法糖
class Student extends Person {
  constructor(name, grade) {
    super(name);
    this.grade = grade;
  }
}
```

**instanceof原理**：
```javascript
// A instanceof B 检测B.prototype是否在A的原型链上
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

---

### Q12: 项目问题

**A:**
（根据个人项目经验回答，以下为参考框架）

**项目难点示例**：

1. **复杂状态管理**：
   - 多层级组件通信
   - 使用Zustand替代Redux，减少样板代码

2. **性能瓶颈**：
   - 大数据表格渲染卡顿
   - 解决方案：虚拟滚动 + 分页 + Web Workers计算

3. **兼容性处理**：
   - 低版本浏览器不支持新API
   - Polyfill + 优雅降级

4. **架构设计**：
   - 从单体应用到微前端迁移
   - 模块联邦实现运行时集成

---

### Q13: WebGPU讲一下？和WebGL的区别？

**A:**
**WebGPU**：

- 下一代Web图形API，由W3C标准化
- 基于现代GPU API（Vulkan、Metal、Direct3D 12）
- 2023年正式发布，Chrome 113+支持

**WebGPU vs WebGL**：

| 特性 | WebGL | WebGPU |
|------|-------|--------|
| API设计 | 基于OpenGL ES 2.0/3.0 | 现代GPU原生API |
| 性能 | 一般 | 更接近原生性能 |
| 多线程 | 不支持 | 支持Worker（多线程提交） |
| 计算着色器 | 不支持 | 支持（GPGPU通用计算） |
| 内存管理 | 自动 | 显式控制（更高效） |
| 资源绑定 | 全局状态机 | 基于Bind Group，更灵活 |
| 错误处理 | 同步，可能崩溃 | 异步，更健壮 |

**WebGPU优势**：

1. **计算着色器**：可用于AI推理（TensorFlow.js）、物理模拟、图像处理
2. **多线程**：可以在Web Worker中创建和提交命令
3. **更好的资源管理**：显式控制GPU内存，减少驱动开销

**应用场景**：

- 3D渲染（游戏、可视化）
- 机器学习推理
- 视频编解码
- 科学计算

---

### Q14: WebGPU的computer shader是做什么的？

**A:**
**Compute Shader（计算着色器）**：

- 不用于图形渲染，而是用于通用并行计算（GPGPU）
- 在GPU上执行大规模并行计算任务

**工作原理**：
```wgsl
// WGSL (WebGPU Shading Language)
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  output[index] = inputA[index] + inputB[index];
}
```

**应用场景**：

1. **矩阵运算**：
   - 神经网络前向传播
   - 图像卷积处理

2. **粒子系统**：
   - 大量粒子物理模拟
   - 比CPU快100倍以上

3. **图像处理**：
   - 滤镜、模糊、边缘检测
   - 视频编码预处理

4. **加密/哈希**：
   - 并行计算哈希值
   - GPU加速密码破解（合法用途）

**优势**：

- 利用GPU数千个并行核心
- 显存带宽比CPU高10倍以上
- 适合数据并行任务

**示例**：矩阵乘法
```javascript
// CPU: O(n³)复杂度，单线程
// GPU: 使用Compute Shader，并行计算每个输出元素
// 加速比：对于大矩阵可达100倍以上
```

---

### Q15: WebGPU画一个三角形

**A:**
**WebGPU绘制三角形代码**：

```javascript
async function init() {
  // 获取GPU适配器
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  // 获取canvas上下文
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format,
    alphaMode: 'opaque'
  });

  // 顶点数据
  const vertices = new Float32Array([
    // x, y, r, g, b
     0.0,  0.5,  1.0, 0.0, 0.0,  // 顶点1 - 红
    -0.5, -0.5,  0.0, 1.0, 0.0,  // 顶点2 - 绿
     0.5, -0.5,  0.0, 0.0, 1.0,  // 顶点3 - 蓝
  ]);

  // 创建GPU缓冲区
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  // Shader代码
  const shaderCode = `
    @vertex
    fn vs_main(@location(0) position: vec2<f32>,
               @location(1) color: vec3<f32>) -> @builtin(position) vec4<f32> {
      return vec4<f32>(position, 0.0, 1.0);
    }

    @fragment
    fn fs_main() -> @location(0) vec4<f32> {
      return vec4<f32>(1.0, 0.0, 0.0, 1.0); // 红色
    }
  `;

  // 创建渲染管线
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: shaderCode }),
      entryPoint: 'vs_main',
      buffers: [{
        arrayStride: 20, // 5 floats * 4 bytes
        attributes: [
          { format: 'float32x2', offset: 0, shaderLocation: 0 },
          { format: 'float32x3', offset: 8, shaderLocation: 1 },
        ],
      }],
    },
    fragment: {
      module: device.createShaderModule({ code: shaderCode }),
      entryPoint: 'fs_main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  // 渲染循环
  function frame() {
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(3); // 绘制3个顶点
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

init();
```

---

### Q16: Electron和Tauri说一下？

**A:**
**Electron vs Tauri对比**：

| 特性 | Electron | Tauri |
|------|----------|-------|
| 核心技术 | Chromium + Node.js | WebView2 (Win)/WKWebView (Mac)/WebKit (Linux) |
| 包大小 | 150MB+（含Chromium） | 3-5MB（仅前端代码+Rust运行时） |
| 内存占用 | 高（Chromium重量级） | 低（共享系统WebView） |
| 启动速度 | 慢 | 快 |
| 后端语言 | JavaScript/Node.js | Rust |
| 安全性 | 一般（Node.js权限大） | 更好（默认权限小） |
| 生态系统 | 丰富成熟 | 新兴发展中 |
| 热更新 | 成熟方案 | 支持但较新 |
| 跨平台 | Windows/Mac/Linux | Windows/Mac/Linux/iOS/Android |

**Electron架构**：

- **主进程（Main）**：Node.js环境，负责系统API调用、窗口管理
- **渲染进程（Renderer）**：Chromium环境，负责UI
- **IPC通信**：ipcMain/ipcRenderer进行进程间通信

**Tauri架构**：

- **Core（Rust）**：后端逻辑、系统API
- **WebView**：前端页面（React/Vue等）
- **Command**：前端调用Rust函数的机制

**选择建议**：

- 追求极致体积/性能：Tauri
- 快速开发/生态依赖：Electron

---

### Q17: 用Tauri做了什么项目？

**A:**
（根据个人项目回答，以下为示例）

**示例：Markdown编辑器**

**功能**：

- 实时预览（Markdown → HTML）
- 文件系统操作（打开/保存.md文件）
- 系统托盘快捷操作
- 自动保存草稿

**技术栈**：

- 前端：React + Vite + @uiw/react-md-editor
- 后端：Tauri（Rust）
- 打包：单文件5MB，启动速度2秒

**遇到的挑战**：

1. **文件权限**：使用Tauri的fs API需要配置tauri.conf.json权限
2. **原生菜单**：使用tauri::Menu构建原生菜单栏
3. **自动更新**：集成tauri-updater实现OTA更新

**代码示例**：
```rust
// Rust端：文件操作
#[tauri::command]
async fn save_file(path: String, content: String) -> Result<(), String> {
  std::fs::write(path, content).map_err(|e| e.to_string())
}
```

```javascript
// 前端调用
import { invoke } from '@tauri-apps/api/tauri';
await invoke('save_file', { path: '/doc.md', content: '# Hello' });
```

---

### Q18: 项目中你都做了哪些工作？

**A:**
（根据个人项目回答，以下为参考框架）

**职责范围**：

1. **技术选型**：
   - 前端框架：React 18 + TypeScript
   - 状态管理：Zustand（轻量级）
   - 构建工具：Vite

2. **架构设计**：
   - 组件库封装（20+通用组件）
   - 模块化目录结构（feature-based）
   - API层封装（Axios拦截器统一处理）

3. **核心功能开发**：
   - 权限管理系统（RBAC）
   - 表单引擎（动态表单渲染）
   - 数据可视化（ECharts封装）

4. **性能优化**：
   - 路由懒加载，首屏加载时间从5s降到1.5s
   - 虚拟滚动处理10万级数据表格

5. **工程化建设**：
   - ESLint + Prettier + Husky代码规范
   - CI/CD自动化部署（GitHub Actions）
   - 单元测试（Vitest，覆盖率80%）

6. **团队协作**：
   - Code Review机制
   - 技术分享（每月2次）
   - 文档建设（Storybook组件文档）

---

### Q19: 算法题：逆序对，时间复杂度？能不能优化？

**A:**
**逆序对**：数组中前面的数大于后面的数的一对元素。

**方法1：暴力O(n²)**
```javascript
function countInversions(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }
  return count;
}
```

**方法2：归并排序O(nlogn)**
```javascript
function countInversions(arr) {
  let count = 0;

  function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  }

  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
        count += left.length - i; // 关键：left[i..end]都大于right[j]
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  mergeSort(arr);
  return count;
}
```

**方法3：树状数组（Fenwick Tree）O(nlogn)**
```javascript
function countInversionsBIT(arr) {
  // 离散化处理
  const sorted = [...arr].sort((a, b) => a - b);
  const map = new Map();
  sorted.forEach((v, i) => map.set(v, i + 1)); // 1-indexed

  const n = arr.length;
  const bit = new Array(n + 1).fill(0);

  // 树状数组操作
  const update = (i, val) => {
    while (i <= n) {
      bit[i] += val;
      i += i & -i;
    }
  };

  const query = (i) => {
    let sum = 0;
    while (i > 0) {
      sum += bit[i];
      i -= i & -i;
    }
    return sum;
  };

  let count = 0;
  // 从右向左遍历，统计已遍历中比当前小的元素个数
  for (let i = n - 1; i >= 0; i--) {
    const rank = map.get(arr[i]);
    count += query(rank - 1); // 已遍历中比当前小的个数
    update(rank, 1);
  }

  return count;
}
```

**优化总结**：

- 暴力O(n²) → 归并排序O(nlogn)（最好理解）
- 归并排序O(nlogn) → 树状数组O(nlogn)（常数更小，空间O(n)）
- 数据范围小时可用计数排序优化到O(n)

---

## 💡 参考答案提示

**Q1 性能指标：** FCP（首次内容绘制）、LCP（最大内容绘制）、FID（首次输入延迟）、CLS（累积布局偏移）、TTFB（首字节时间）等

**Q8 React Fiber：** React 16引入的新协调算法，将渲染工作拆分成小单元，可中断和恢复，实现时间切片和优先级调度

**Q9 垃圾回收：** 标记清除（Mark-and-Sweep）、引用计数、分代回收（新生代/老生代）等

**Q10 Map vs WeakMap：** Map键可以是任意类型，WeakMap键必须是对象；WeakMap键是弱引用，可被垃圾回收

**Q19 逆序对：** 暴力O(n²)，归并排序O(nlogn)，树状数组O(nlogn)