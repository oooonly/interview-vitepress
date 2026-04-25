# 字节跳动 - 前端开发一面面试题

> 📄 来源图片：1面.jpeg  
> 🕐 解析时间：2025-01-13

---

## 🏢 岗位信息

- **公司**：ByteDance 字节跳动
- **岗位**：前端开发
- **时长**：90分钟

---

## 📋 面试题目

### Q1: CSS选择器

**A:**
CSS选择器用于选择HTML元素并应用样式，主要包括以下类型：

**基础选择器**：
- 元素选择器：`div`, `p`, `span`
- 类选择器：`.class-name`
- ID选择器：`#id-name`
- 通配符选择器：`*`

**组合选择器**：
- 后代选择器：`div p`（div内的所有p）
- 子元素选择器：`div > p`（div的直接子元素p）
- 相邻兄弟选择器：`div + p`（紧接div后的p）
- 通用兄弟选择器：`div ~ p`（div之后的所有同级p）

**属性选择器**：
- `[attr]`：有attr属性的元素
- `[attr="value"]`：attr属性等于value
- `[attr^="value"]`：attr属性以value开头
- `[attr$="value"]`：attr属性以value结尾
- `[attr*="value"]`：attr属性包含value

**伪类选择器**：
- 状态伪类：`:hover`, `:active`, `:focus`, `:visited`
- 结构伪类：`:first-child`, `:last-child`, `:nth-child(n)`, `:nth-of-type(n)`
- 表单伪类：`:checked`, `:disabled`, `:required`

**伪元素选择器**：
- `::before`, `::after`：在元素内容前后插入内容
- `::first-letter`, `::first-line`：选择首字母/首行

**优先级计算**：!important > 内联(1000) > ID(100) > 类/伪类/属性(10) > 元素/伪元素(1)

---

### Q2: flex布局

**A:**
Flex布局是一维布局模型，用于在容器中分配空间和对齐元素。

**容器属性**：
```css
.container {
  display: flex;           /* 或 inline-flex */
  flex-direction: row;     /* 主轴方向: row | row-reverse | column | column-reverse */
  flex-wrap: wrap;         /* 换行: nowrap | wrap | wrap-reverse */
  justify-content: center; /* 主轴对齐: flex-start | flex-end | center | space-between | space-around | space-evenly */
  align-items: center;     /* 交叉轴对齐: flex-start | flex-end | center | stretch | baseline */
  align-content: center;   /* 多行对齐: 同 align-items + stretch */
  gap: 10px;               /* 项目间距 */
}
```

**项目属性**：
```css
.item {
  flex-grow: 1;     /* 放大比例，默认0 */
  flex-shrink: 1;   /* 缩小比例，默认1 */
  flex-basis: auto; /* 初始大小，默认auto */
  flex: 1;          /* 简写: flex-grow flex-shrink flex-basis */
  align-self: flex-start; /* 单独设置交叉轴对齐 */
  order: 0;         /* 排列顺序，数值越小越靠前 */
}
```

**常用布局技巧**：
```css
/* 水平垂直居中 */
.center { display: flex; justify-content: center; align-items: center; }

/* 两端对齐 */
.justify { display: flex; justify-content: space-between; }

/* 均分宽度 */
.equal { display: flex; }
.equal > * { flex: 1; }

/* 固定侧边栏 + 自适应内容 */
.layout { display: flex; }
.sidebar { flex: 0 0 200px; }
.main { flex: 1; }
```

---

### Q3: this指向

**A:**
this的指向取决于函数的调用方式，遵循以下规则：

**1. 默认绑定**：
```javascript
function foo() {
  console.log(this); // 非严格模式下指向window，严格模式下undefined
}
foo();
```

**2. 隐式绑定**：
```javascript
const obj = {
  name: 'obj',
  foo: function() { console.log(this.name); }
};
obj.foo(); // 'obj' - 谁调用指向谁
```

**3. 显式绑定（call/apply/bind）**：
```javascript
function greet() { console.log(this.name); }
const obj = { name: 'Tom' };
greet.call(obj);  // 'Tom' - 立即执行
greet.apply(obj); // 'Tom' - 立即执行
greet.bind(obj)(); // 'Tom' - 返回新函数
```

**4. new绑定**：
```javascript
function Person(name) {
  this.name = name; // this指向新创建的实例
}
const p = new Person('Tom');
```

**5. 箭头函数**：
```javascript
const obj = {
  name: 'obj',
  foo: () => { console.log(this.name); } // undefined - 箭头函数没有自己的this
};
obj.foo();
```

**优先级**：new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

**特殊情况**：
- 箭头函数的this由外层作用域决定，无法被修改
- DOM事件处理函数中this指向触发事件的元素

---

### Q4: ES6了解哪些?

**A:**
ES6（ECMAScript 2015）引入了许多新特性：

**1. 变量声明**：
```javascript
let a = 1;       // 块级作用域，可重新赋值
const PI = 3.14; // 块级作用域，不可重新赋值
```

**2. 箭头函数**：
```javascript
const add = (a, b) => a + b;
const fn = x => ({ value: x }); // 返回对象需加括号
```

**3. 模板字符串**：
```javascript
const name = 'Tom';
const greeting = `Hello, ${name}!`;
```

**4. 解构赋值**：
```javascript
const [a, b] = [1, 2];           // 数组解构
const {name, age} = obj;         // 对象解构
const {a: x = 10} = {a: 5};      // 默认值 + 重命名
```

**5. 展开运算符**：
```javascript
const arr = [...arr1, ...arr2];  // 数组展开
const obj = {...obj1, ...obj2};  // 对象展开
fn(...args);                     // 函数参数展开
```

**6. Promise**：
```javascript
const p = new Promise((resolve, reject) => {
  // 异步操作
  resolve(data);
});
p.then(data => {}).catch(err => {});
```

**7. async/await**：
```javascript
async function getData() {
  const res = await fetch(url);
  return res.json();
}
```

**8. 类与继承**：
```javascript
class Person {
  constructor(name) { this.name = name; }
  sayHi() { console.log(this.name); }
}
class Student extends Person {
  constructor(name, grade) {
    super(name);
    this.grade = grade;
  }
}
```

**9. 模块化**：
```javascript
export const a = 1;
export default class App {}
import App, { a } from './module';
```

**10. 其他**：
- Map / Set / WeakMap / WeakSet
- Symbol（新的原始类型）
- Proxy / Reflect
- 默认参数：`(a = 1) => {}`
- rest参数：`(...args) => {}`
- for...of循环

---

### Q5: Promise API说一下?

**A:**
Promise是异步编程的解决方案，表示一个异步操作的最终完成或失败。

**实例方法**：
```javascript
const p = new Promise((resolve, reject) => {
  resolve('success');
});

p.then(data => {
  console.log(data);     // resolve时调用
  return data + '!';
}).then(data => {
  console.log(data);     // 支持链式调用
}).catch(err => {
  console.error(err);    // reject时调用
}).finally(() => {
  console.log('done');   // 无论成功失败都调用
});
```

**静态方法**：

1. **Promise.all()**：所有都成功才成功，一个失败就失败
```javascript
const results = await Promise.all([
  fetch('/api/1'),
  fetch('/api/2'),
  fetch('/api/3')
]);
```

2. **Promise.race()**：返回最先完成的结果（无论成功失败）
```javascript
const result = await Promise.race([
  fetch('/api'),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
]);
```

3. **Promise.allSettled()**：等待所有Promise完成，返回每个结果状态
```javascript
const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
]);
// [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: 'error'}]
```

4. **Promise.any()**：只要有一个成功就成功，全部失败才失败
```javascript
const result = await Promise.any([
  Promise.reject('error'),
  Promise.resolve('success'),
]);
// 'success'
```

5. **Promise.resolve() / Promise.reject()**：
```javascript
const p1 = Promise.resolve('value'); // 等同于 new Promise(r => r('value'))
const p2 = Promise.reject('error');
```

**手写Promise核心**：
```javascript
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.callbacks = [];
    
    const resolve = value => {
      if (this.status !== 'pending') return;
      this.status = 'fulfilled';
      this.value = value;
      this.callbacks.forEach(cb => cb.onFulfilled(value));
    };
    
    const reject = reason => {
      if (this.status !== 'pending') return;
      this.status = 'rejected';
      this.value = reason;
      this.callbacks.forEach(cb => cb.onRejected(reason));
    };
    
    executor(resolve, reject);
  }
  
  then(onFulfilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value);
    } else if (this.status === 'rejected') {
      onRejected(this.value);
    } else {
      this.callbacks.push({ onFulfilled, onRejected });
    }
  }
}
```

---

### Q6: 事件循环机制

**A:**
JavaScript是单线程语言，事件循环用于协调异步任务的执行顺序。

**宏任务（Macro Task）**：
- script（整体代码）
- setTimeout / setInterval
- setImmediate（Node.js）
- I/O操作
- UI渲染

**微任务（Micro Task）**：
- Promise.then / .catch / .finally
- MutationObserver
- process.nextTick（Node.js，优先级最高）
- queueMicrotask()

**执行流程**：
1. 执行同步代码（这是一个宏任务）
2. 执行完所有微任务
3. 浏览器渲染（如果有更新）
4. 执行下一个宏任务
5. 重复2-4

**示例**：
```javascript
console.log(1);                    // 同步 -> 1

setTimeout(() => {
  console.log(2);                  // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log(3);                  // 微任务
});

console.log(4);                    // 同步 -> 4

// 输出顺序: 1 -> 4 -> 3 -> 2
```

**复杂示例**：
```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

// 输出顺序:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

**Node.js事件循环**：
有6个阶段：timers → pending callbacks → idle/prepare → poll → check → close callbacks

---

### Q7: 解读事件循环代码题（各种setTimeout、then、await混在一起）

**A:**
关键执行原则：
1. 同步代码立即执行
2. await后面的代码相当于then回调（微任务）
3. 先执行所有微任务，再执行宏任务
4. 微任务执行过程中产生的微任务也会在本轮执行

**示例解析**：
```javascript
console.log('1');                          // 同步

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

new Promise(resolve => {
  console.log('4');                        // 同步（Promise构造函数内同步执行）
  resolve();
}).then(() => {
  console.log('5');
}).then(() => {
  console.log('6');
});

console.log('7');                          // 同步

// 执行过程:
// 1. 同步: 打印 1, 4, 7
// 2. 微任务队列: [then(5), then(6)]
// 3. 宏任务队列: [setTimeout]
// 4. 执行微任务: 打印 5, 6
// 5. 执行宏任务:
//    - 打印 2
//    - 产生新微任务（then(3)）
// 6. 执行微任务: 打印 3

// 最终输��: 1, 4, 7, 5, 6, 2, 3
```

**含await的示例**：
```javascript
async function test() {
  console.log('test start');
  await new Promise(resolve => {
    console.log('promise in test');
    resolve();
  });
  console.log('test end');
}

test();

console.log('script end');

// 输出顺序:
// test start（同步）
// promise in test（同步，await执行）
// script end（同步）
// test end（微任务，await后面的代码）
```

---

### Q8: 场景题：实现一个useRequest，要有超时机制、重试机制、错误机制同时尽可能考虑封装性

**A:**

```typescript
import { ref, Ref } from 'vue';

interface UseRequestOptions`<T>` {
  // 超时配置
  timeout?: number;
  // 重试配置
  retryCount?: number;
  retryDelay?: number;
  retryCondition?: (error: Error) => boolean;
  // 手动触发
  manual?: boolean;
  // 初始数据
  initialData?: T;
  // 生命周期钩子
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
  // 防抖节流
  debounceWait?: number;
  throttleWait?: number;
}

interface UseRequestResult`<T>` {
  data: Ref`<T | undefined>`;
  loading: Ref`<boolean>`;
  error: Ref`<Error | null>`;
  run: () => Promise`<void>`;
  cancel: () => void;
  refresh: () => Promise`<void>`;
}

function useRequest`<T>`(
  service: () => Promise`<T>`,
  options: UseRequestOptions`<T>` = {}
): UseRequestResult`<T>` {
  const {
    timeout = 0,
    retryCount = 0,
    retryDelay = 0,
    retryCondition = () => true,
    manual = false,
    initialData,
    onSuccess,
    onError,
    onFinally,
    debounceWait,
    throttleWait,
  } = options;

  const data = ref`<T | undefined>`(initialData);
  const loading = ref(false);
  const error = ref`<Error | null>`(null);

  let retryAttempts = 0;
  let timeoutId: number | null = null;
  let aborted = false;

  // 取消请求
  const cancel = () => {
    aborted = true;
    if (timeoutId) clearTimeout(timeoutId);
  };

  // 执行请求
  const run = async () => {
    if (aborted) return;
    
    loading.value = true;
    error.value = null;

    try {
      // 超时处理
      const timeoutPromise = new Promise`<never>`((_, reject) => {
        if (timeout > 0) {
          timeoutId = window.setTimeout(() => {
            reject(new Error('Request timeout'));
          }, timeout);
        }
      });

      // 发起请求
      const result = await Promise.race([
        service(),
        timeoutPromise,
      ]);

      if (timeoutId) clearTimeout(timeoutId);
      if (aborted) return;

      data.value = result;
      retryAttempts = 0;
      onSuccess?.(result);
    } catch (err: any) {
      if (aborted) return;
      
      error.value = err;

      // 重试机制
      if (retryAttempts < retryCount && retryCondition(err)) {
        retryAttempts++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        if (!aborted) {
          await run();
        }
        return;
      }

      onError?.(err);
    } finally {
      if (!aborted) {
        loading.value = false;
        onFinally?.();
      }
    }
  };

  // 防抖
  let debounceTimer: number | null = null;
  const debouncedRun = () => {
    if (debounceWait) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => run(), debounceWait);
    } else {
      run();
    }
  };

  // 节流
  let throttleTimer: number | null = null;
  let lastRun = 0;
  const throttledRun = () => {
    if (throttleWait) {
      const now = Date.now();
      if (now - lastRun >= throttleWait) {
        lastRun = now;
        run();
      } else if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          lastRun = Date.now();
          throttleTimer = null;
          run();
        }, throttleWait - (now - lastRun));
      }
    } else {
      run();
    }
  };

  // 自动执行
  if (!manual) {
    run();
  }

  return {
    data,
    loading,
    error,
    run: debounceWait ? debouncedRun : (throttleWait ? throttledRun : run),
    cancel,
    refresh: run,
  };
}

// 使用示例
const { data, loading, error, run, cancel } = useRequest(
  () => fetch('/api/data').then(r => r.json()),
  {
    timeout: 5000,
    retryCount: 3,
    retryDelay: 1000,
    onSuccess: (data) => console.log('成功', data),
    onError: (err) => console.error('失败', err),
  }
);
```

---

### Q9: 竞态问题如何解决？

**A:**
竞态问题（Race Condition）指多个异步请求的执行顺序与完成顺序不一致导致的数据问题。

**场景示例**：
```javascript
// 问题场景：搜索时快速输入，可能后发送的请求先返回
async function search(keyword) {
  const result = await fetch(`/api/search?q=${keyword}`);
  // 如果快速输入，旧的请求可能覆盖新的结果
  this.data = result;
}
```

**解决方案**：

**1. 取消旧请求（AbortController）**：
```javascript
let abortController = null;

async function search(keyword) {
  // 取消之前的请求
  if (abortController) {
    abortController.abort();
  }
  
  abortController = new AbortController();
  
  try {
    const result = await fetch(`/api/search?q=${keyword}`, {
      signal: abortController.signal
    });
    this.data = result;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('请求被取消');
    }
  }
}
```

**2. 请求标识法**：
```javascript
let requestId = 0;

async function search(keyword) {
  const currentId = ++requestId;
  
  const result = await fetch(`/api/search?q=${keyword}`);
  
  // 只处理最新的请求
  if (currentId === requestId) {
    this.data = result;
  }
}
```

**3. 取消令牌（Cancel Token）**：
```typescript
class CancelToken {
  private cancelled = false;
  
  cancel() {
    this.cancelled = true;
  }
  
  throwIfCancelled() {
    if (this.cancelled) throw new Error('Cancelled');
  }
}

async function search(keyword, token: CancelToken) {
  const result = await fetch(`/api/search?q=${keyword}`);
  token.throwIfCancelled();
  return result;
}
```

**4. 使用Promise.race超时机制**：
```javascript
async function searchWithTimeout(keyword, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  return Promise.race([
    fetch(`/api/search?q=${keyword}`),
    timeoutPromise
  ]);
}
```

**5. 封装为Hook**：
```typescript
function useLatestRequest`<T>`() {
  const latestRef = useRef<{
    requestId: number;
    abortController: AbortController | null;
  }>({
    requestId: 0,
    abortController: null
  });

  const run = useCallback(async (requestFn: () => Promise`<T>`) => {
    const currentId = ++latestRef.current.requestId;
    
    latestRef.current.abortController?.abort();
    latestRef.current.abortController = new AbortController();
    
    try {
      const result = await requestFn();
      if (currentId === latestRef.current.requestId) {
        return result;
      }
    } catch (err) {
      if (currentId === latestRef.current.requestId) {
        throw err;
      }
    }
  }, []);

  return run;
}
```

---

### Q10: 发布订阅模式

**A:**
发布订阅模式是一种消息通信模式，发布者发送消息，订阅者接收消息，两者通过事件通道解耦。

**实现**：
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  // 只订阅一次
  once(event, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }

  // 取消订阅
  off(event, callback) {
    if (!this.events[event]) return this;
    
    if (!callback) {
      // 不传callback则清空该事件所有订阅
      delete this.events[event];
    } else {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    return this;
  }

  // 发布事件
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback.apply(this, args);
      });
    }
    return this;
  }
}

// 使用示例
const emitter = new EventEmitter();

// 订阅
emitter.on('login', (user) => {
  console.log(`${user} 已登录`);
});

emitter.once('firstVisit', () => {
  console.log('首次访问');
});

// 发布
emitter.emit('login', 'Tom');  // Tom 已登录
emitter.emit('firstVisit');     // 首次访问
emitter.emit('firstVisit');     // 无输出（只执行一次）

// 取消订阅
const callback = () => console.log('msg');
emitter.on('msg', callback);
emitter.off('msg', callback);
```

**应用场景**：
1. Vue的事件总线（Vue 2）
2. Node.js的EventEmitter
3. 组件间通信
4. Redux/Vuex的状态更新通知
5. WebSocket消息分发

---

### Q11: 性能优化手段？webp说一下？

**A:**
**性能优化手段**：

**1. 网络优化**：
- 启用HTTP/2、HTTP/3
- 使用CDN加速
- 开启Gzip/Brotli压缩
- DNS预解析：``<link rel="dns-prefetch" href="//cdn.example.com">``
- 预连接：``<link rel="preconnect" href="https://api.example.com">``
- 合理设置缓存策略（强缓存、协商缓存）

**2. 资源优化**：
- 图片：使用WebP/AVIF格式、懒加载、响应式图片
- 代码：Tree Shaking、Code Splitting、压缩混淆
- 字体：font-display: swap���子集化

**3. 渲染优化**：
- 减少重排重绘
- 使用虚拟滚动处理大列表
- 骨架屏提升感知性能
- 防抖节流高频事件
- 使用requestAnimationFrame优化动画

**4. 代码优化**：
- 路由懒加载
- 第三方库按需引入
- 避免长任务（>50ms）
- Web Worker处理复杂计算

**WebP详解**：
WebP是Google推出的图片格式，相比传统格式有显著优势。

| 格式 | 压缩率 | 透明度 | 动画 | 浏览器支持 |
|------|--------|--------|------|-----------|
| JPEG | 基准 | ✗ | ✗ | 全部 |
| PNG | 基准 | ✓ | ✗ | 全部 |
| WebP有损 | 比JPEG小25-34% | ✗ | ✓ | 97%+ |
| WebP无损 | 比PNG小26% | ✓ | ✓ | 97%+ |

**使用方式**：
```html
<!-- 使用picture标签做兼容 -->
`<picture>`
  `<source srcset="image.webp" type="image/webp">`
  `<source srcset="image.jpg" type="image/jpeg">`
  `<img src="image.jpg" alt="描述">`
</picture>
```

**转换工具**：
- imagemin-webp（构建工具插件）
- sharp（Node.js库）
- 在线转换：squosh.app

---

### Q12: 数组扁平化写一下？

**A:**

```javascript
// 方法1：递归
function flatten1(arr) {
  const result = [];
  
  const flatten = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        flatten(arr[i]);
      } else {
        result.push(arr[i]);
      }
    }
  };
  
  flatten(arr);
  return result;
}

// 方法2：reduce + 递归
function flatten2(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten2(val) : val);
  }, []);
}

// 方法3：原生flat方法
const arr = [1, [2, [3, [4]]]];
arr.flat(Infinity); // [1, 2, 3, 4]

// 方法4：while循环 + some
function flatten3(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 方法5：toString + split（仅数字数组）
function flatten4(arr) {
  return arr.toString().split(',').map(Number);
}

// 方法6：使用栈
function flatten6(arr) {
  const stack = [...arr];
  const result = [];
  
  while (stack.length) {
    const item = stack.shift();
    if (Array.isArray(item)) {
      stack.unshift(...item);
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// 测试
const arr = [1, [2, [3, [4, 5]]], 6];
console.log(flatten2(arr)); // [1, 2, 3, 4, 5, 6]
```

---

### Q13: 数字每千分位用逗号隔开？

**A:**

```javascript
// 方法1：正则表达式（推荐）
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// 解释：\B匹配非单词边界，(?=(\d{3})+(?!\d))匹配后面跟着3的倍数个数字且后面不再是数字的位置

// 方法2：toLocaleString
const num = 1234567.89;
num.toLocaleString('en-US'); // '1,234,567.89'
num.toLocaleString('zh-CN'); // '1,234,567.89'

// 方法3：Intl.NumberFormat
new Intl.NumberFormat('en-US').format(num); // '1,234,567.89'

// 方法4：手动实现
function formatNumber2(num) {
  const [integer, decimal] = num.toString().split('.');
  let result = '';
  let count = 0;
  
  for (let i = integer.length - 1; i >= 0; i--) {
    count++;
    result = integer[i] + result;
    if (count % 3 === 0 && i !== 0) {
      result = ',' + result;
    }
  }
  
  return decimal ? result + '.' + decimal : result;
}

// 方法5：数组处理
function formatNumber3(num) {
  const [int, dec] = num.toString().split('.');
  const intArr = int.split('');
  const result = [];
  
  while (intArr.length > 3) {
    result.unshift(intArr.splice(-3).join(''));
  }
  result.unshift(intArr.join(''));
  
  return dec ? result.join(',') + '.' + dec : result.join(',');
}

// 测试
console.log(formatNumber(1234567.89));    // 1,234,567.89
console.log(formatNumber(123456789));     // 123,456,789
console.log(formatNumber(123));           // 123
```

---

### Q14: 最长公共前缀

**A:**

```javascript
/**
 * 编写一个函数来查找字符串数组中的最长公共前缀
 * 输入: ["flower","flow","flight"]
 * 输出: "fl"
 */

// 方法1：横向扫描
function longestCommonPrefix1(strs) {
  if (strs.length === 0) return '';
  
  let prefix = strs[0];
  
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  
  return prefix;
}

// 方法2：纵向扫描
function longestCommonPrefix2(strs) {
  if (strs.length === 0) return '';
  
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    
    for (let j = 1; j < strs.length; j++) {
      if (i === strs[j].length || strs[j][i] !== char) {
        return strs[0].slice(0, i);
      }
    }
  }
  
  return strs[0];
}

// 方法3：分治法
function longestCommonPrefix3(strs, left = 0, right = strs.length - 1) {
  if (left === right) return strs[left];
  
  const mid = Math.floor((left + right) / 2);
  const leftPrefix = longestCommonPrefix3(strs, left, mid);
  const rightPrefix = longestCommonPrefix3(strs, mid + 1, right);
  
  return commonPrefix(leftPrefix, rightPrefix);
}

function commonPrefix(s1, s2) {
  const minLen = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLen; i++) {
    if (s1[i] !== s2[i]) {
      return s1.slice(0, i);
    }
  }
  return s1.slice(0, minLen);
}

// 方法4：二分查找
function longestCommonPrefix4(strs) {
  if (strs.length === 0) return '';
  
  let minLen = Math.min(...strs.map(s => s.length));
  let low = 0, high = minLen;
  
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (isCommonPrefix(strs, mid)) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  
  return strs[0].slice(0, low);
}

function isCommonPrefix(strs, len) {
  const prefix = strs[0].slice(0, len);
  return strs.every(s => s.startsWith(prefix));
}

// 测试
console.log(longestCommonPrefix1(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefix1(["dog", "racecar", "car"]));   // ""
```

---

### Q15: 图片懒加载写一下?

**A:**

```javascript
/**
 * 图片懒加载：图片进入视口时才加载
 */

// 方法1：IntersectionObserver（现代方案）
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // 提前50px开始加载
    threshold: 0.1
  });
  
  images.forEach(img => observer.observe(img));
}

// 方法2：滚动监听（兼容方案）
function lazyLoadImagesLegacy() {
  const images = document.querySelectorAll('img[data-src]');
  
  const loadImage = (img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  };
  
  const checkVisible = () => {
    images.forEach(img => {
      if (!img.dataset.src) return;
      
      const rect = img.getBoundingClientRect();
      const isVisible = (
        rect.top < window.innerHeight + 100 &&
        rect.bottom > -100
      );
      
      if (isVisible) {
        loadImage(img);
      }
    });
  };
  
  // 节流
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkVisible();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  checkVisible(); // 初始检查
}

// 方法3：原生loading属性
// `<img src="image.jpg" loading="lazy" alt="...">`

// 方法4：React Hook封装
function useLazyLoad(ref, options = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        ...options
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref]);
  
  return isLoaded;
}

// 使用
// const imgRef = useRef();
// const isLoaded = useLazyLoad(imgRef);
// `<img ref={imgRef} src={isLoaded ? 'real.jpg' : 'placeholder.jpg'} />`

// 方法5：背景图懒加载
function lazyLoadBackground() {
  const elements = document.querySelectorAll('[data-bg]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url(${el.dataset.bg})`;
        observer.unobserve(el);
      }
    });
  });
  
  elements.forEach(el => observer.observe(el));
}
```

---

### Q16: 项目的PC应用如何做的页面适配？

**A:**
PC端页面适配主要有以下几种方案：

**1. 固定宽度居中**：
```css
.container {
  width: 1200px;
  margin: 0 auto;
}

/* 响应式处理 */
@media (max-width: 1200px) {
  .container {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
```

**2. 百分比 + 最大最小宽度**：
```css
.container {
  width: 80%;
  max-width: 1400px;
  min-width: 960px;
  margin: 0 auto;
}
```

**3. CSS Grid自适应**：
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

**4. Flex布局适配**：
```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 300px; /* 最小300px，可伸缩 */
  margin: 10px;
}
```

**5. 媒体查询断点**：
```css
/* 小屏 */
@media (max-width: 1366px) { }
/* 中屏 */
@media (min-width: 1367px) and (max-width: 1920px) { }
/* 大屏 */
@media (min-width: 1921px) { }
```

**6. Container Queries（新特性）**：
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

**7. CSS变量 + clamp()**：
```css
:root {
  --font-base: clamp(14px, 0.9vw, 18px);
  --padding-base: clamp(10px, 2vw, 30px);
}

.container {
  font-size: var(--font-base);
  padding: var(--padding-base);
}
```

**8. 大屏适配（数据可视化）**：
```javascript
// scale缩放方案
function resize() {
  const designWidth = 1920;
  const designHeight = 1080;
  const scale = Math.min(
    window.innerWidth / designWidth,
    window.innerHeight / designHeight
  );
  
  document.querySelector('#app').style.transform = `scale(${scale})`;
}

window.addEventListener('resize', resize);
resize();
```

---

### Q17: 项目问题

**A:**
（根据个人项目经验回答，以下为参考框架）

**项目背景**：
- 项目名称、类型（PC端管理后台、移动端H5、小程序等）
- 技术栈：React/Vue、状态管理、构建工具等
- 团队规模、迭代周期

**技术难点**：

1. **复杂状态管理**：
   - 问题：多层级组件通信困难
   - 解决：使用Zustand/Pinia统一管理状态，设计合理的数据流

2. **性能优化**：
   - 问题：大列表渲染卡顿
   - 解决：虚拟滚动 + 分页 + Web Worker后台计算

3. **权限系统设计**：
   - 问题：动态路由、按钮级权限
   - 解决：RBAC模型 + 路由守卫 + 自定义指令

4. **组件封装**：
   - 问题：业务组件复用性差
   - 解决：抽象通用组件库、文档化（Storybook）

**最佳实践**：
- 代码规范：ESLint + Prettier + Husky
- 类型安全：TypeScript全覆盖
- 测试：单元测试 + E2E测试
- CI/CD：自动化部署流程

---

## 💡 参考答案提示

> 注：以下答案仅供参考，建议结合实际情况深入学习

**Q1 CSS选择器：** 包括基础选择器（元素、类、ID）、组合选择器（后代、子元素、相邻兄弟、通用兄弟）、属性选择器、伪类选择器、伪元素选择器等。

**Q2 Flex布局：** flex-direction、justify-content、align-items、flex-wrap、align-content、flex-grow/shrink/basis等属性

**Q3 this指向：** 默认绑定、隐式绑定、显式绑定（call/apply/bind）、new绑定、箭头函数绑定

**Q4 ES6特性：** let/const、箭头函数、模板字符串、解构赋值、Promise、async/await、模块化、Class、Map/Set等

**Q5 Promise API：** then、catch、finally、all、race、allSettled、any、resolve、reject等

**Q6 事件循环：** 宏任务（script、setTimeout/setInterval、I/O、UI rendering）、微任务（Promise.then、MutationObserver、queueMicrotask）

**Q12 数组扁平化：** `arr.flat(Infinity)` 或递归 `reduce` 实现

**Q13 千分位：** `num.toLocaleString()` 或正则 `/\B(?=(\d{3})+(?!\d))/g`
