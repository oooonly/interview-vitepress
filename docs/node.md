# Node.js 面试题

> 📄 来源图片：node.jpeg  
> 🕐 解析时间：2025-01-13

---

## 📋 面试题目

### Q1: CommonJS和ES6中模块引入的区别？

**A:**
1. **加载方式**：CommonJS 是运行时加载，ES6 模块是编译时输出接口（静态加载）。
2. **加载效率**：ES6 模块由于是静态解析，效率更高，且支持 Tree-shaking。
3. **值的引用**：CommonJS 模块输出的是一个值的拷贝，一旦输出，模块内部的变化不会影响这个值；ES6 模块输出的是值的引用，模块内部的变化会反映在外部。
4. **加载顺序**：CommonJS 是同步加载，适用于服务端（文件在本地磁盘）；ES6 模块支持异步加载，适用于浏览器端（需要网络请求）。
5. **this 指向**：CommonJS 中 `this` 指向当前模块；ES6 模块中 `this` 为 `undefined`。

---

### Q2: 为什么Node在使用ES Module时必须加上文件扩展名？

**A:**
这是为了遵循浏览器的规范以及 Node.js 的设计决策：
1. **浏览器规范一致性**：在浏览器中，URL 必须明确且完整。ESM 最初是为浏览器设计的，要求明确的路径和扩展名以减少服务器猜测开销。
2. **减少推测开销**：不带扩展名会导致 Node.js 必须尝试查找 `.js`、`.json`、`.node` 等后缀，这涉及多次文件系统 I/O，会降低性能。
3. **明确性**：在分布式网络环境中，明确的扩展名可以避免模块解析歧义。

---

### Q3: 浏览器和 Node 中的事件循环有什么区别？

**A:**
1. **宏任务/微任务队列数**：
   - **浏览器**：通常只有一个宏任务队列（Task Queue）和一个微任务队列（Microtask Queue）。
   - **Node**：包含 6 个阶段的宏任务队列（如 timers, pending, idle, poll, check, close）。
2. **执行顺序**：
   - **浏览器**：每执行完一个宏任务，就会清空整个微任务队列。
   - **Node (Node 11 之前)**：执行完一个阶段的所有宏任务后，才执行微任务。
   - **Node (Node 11 之后)**：行为与浏览器趋于一致，每个宏任务执行完后立即执行微任务。
3. **特有 API**：Node 环境中有 `process.nextTick`（优先级高于所有微任务）和 `setImmediate`（在 check 阶段执行）。

---

### Q4: Node性能如何进行监控以及优化？

**A:**
**监控方案**：
1. **内置工具**：使用 `process.memoryUsage()` 查看内存，`process.cpuUsage()` 查看 CPU 使用情况。
2. **日志分析**：通过 PM2 监控日志，或使用 ELK 堆栈（Elasticsearch, Logstash, Kibana）。
3. **APM 工具**：使用 SkyWalking、Elastic APM、New Relic 等专业性能监控工具。
4. **Heapdump**：在内存泄露时生成快照，通过 Chrome DevTools 分析。

**优化策略**：
1. **代码层面**：避免同步 I/O 操作（使用异步版本），减少内存泄露（及时释放闭包、定时器），使用更高效的算法。
2. **并发处理**：合理利用 `Promise.all` 并发请求。
3. **多核利用**：使用 `cluster` 模块或 PM2 的 cluster 模式开启多进程。
4. **静态资源分离**：将静态资源交给 Nginx 或 CDN，减轻 Node 服务负担。

---

### Q5: 如果让你来设计一个分页功能，你会怎么设计？前后端如何交互？

**A:**
**设计思路**：
1. **前端传参**：
   - `page`：当前页码（从 1 开始）。
   - `pageSize`：每页显示的条数。
   - `keyword/filter`：可选的搜索关键词或过滤条件。
2. **后端处理**：
   - 计算偏移量：`offset = (page - 1) * pageSize`。
   - SQL 查询：`SELECT * FROM table LIMIT pageSize OFFSET offset`。
   - 获取总数：`SELECT COUNT(*) FROM table`（用于前端计算总页数）。
3. **后端返回**：
   ```json
   {
     "code": 200,
     "data": {
       "list": [...],
       "total": 100,
       "page": 1,
       "pageSize": 10
     }
   }
   ```
4. **交互流程**：前端初始化请求第一页数据 -> 后端返回数据和总条数 -> 前端渲染列表及分页器 -> 用户点击翻页 -> 重复上述流程。

---

### Q6: 如何实现文件上传？说说你的思路

**A:**
1. **前端实现**：
   - 使用 `<input type="file">` 选择文件。
   - 使用 `FormData` 对象包装文件对象。
   - 通过 Axios 或 Fetch 发送 `multipart/form-data` 格式的 POST 请求。
2. **后端实现**：
   - 使用中间件解析请求体，如 `multer`、`formidable` 或 `busboy`。
   - **存储策略**：
     - **本地存储**：将文件移动到服务器指定目录。
     - **云存储**：将文件上传到阿里云 OSS、腾讯云 COS 或 AWS S3。
3. **大文件优化**：
   - **分片上传**：前端将大文件切分成小块，并发上传。
   - **断点续传**：后端记录已上传的分片索引，中断后只需补传缺失分片。
   - **秒传**：前端计算文件 MD5，后端匹配已存在的文件则直接返回成功。

---

### Q7: 如何实现 JWT 鉴权机制？说说你的思路

**A:**
1. **JWT 结构**：由 `Header`（算法/类型）、`Payload`（用户信息/载荷）、`Signature`（签名）三部分组成，通过 `.` 连接。
2. **登录流程**：用户提交用户名密码 -> 后端校验成功 -> 生成包含用户 ID 的 JWT（使用私钥签名）-> 返回给前端。
3. **存储与发送**：前端通常将 JWT 存入 `localStorage`，后续请求在 Header 的 `Authorization: Bearer <token>` 中携带。
4. **校验流程**：后端拦截请求 -> 提取 Token -> 使用密钥校验签名是否有效、Token 是否过期 -> 校验成功则将用户信息存入 `req.user` 并放行。
5. **优点**：无状态、可扩展性强、支持跨域。

---

### Q8: 说说对中间件概念的理解，如何封装Node中间件？

**A:**
**理解**：中间件是介于请求（Request）和响应（Response）之间的一个处理环节，它本质上是一个函数，可以访问请求对象、响应对象和下一个中间件函数 `next`。

**封装方式**：
1. **普通中间件 (Express 风格)**：
   ```javascript
   function logger(req, res, next) {
     console.log(`${req.method} ${req.url}`);
     next(); // 必须调用，否则请求会挂起
   }
   ```
2. **Koa 风格 (洋葱模型)**：
   ```javascript
   const myMiddleware = async (ctx, next) => {
     console.log('进入中间件');
     await next();
     console.log('退出中间件');
   };
   ```
3. **工厂函数封装（支持配置参数）**：
   ```javascript
   const auth = (role) => (ctx, next) => {
     if (ctx.user.role !== role) ctx.throw(403);
     return next();
   };
   ```

---

### Q9: 说说 Node 文件查找的优先级以及 Require 方法的文件查找策略？

**A:**
**查找优先级**：
1. **缓存**：优先从 `require.cache` 中读取。
2. **核心模块**：如 `fs`、`http` 等，优先级最高。
3. **文件模块**：以 `/`、`./`、`../` 开头的路径。
4. **包模块**：非路径开头的模块，会递归查找当前及上级目录的 `node_modules`。

**具体策略**：
- 如果路径带扩展名，直接查找。
- 不带扩展名时，按顺序尝试：`.js` -> `.json` -> `.node`。
- 如果是文件夹，查找 `package.json` 中的 `main` 字段；若无，查找 `index.js` -> `index.json` -> `index.node`。

---

### Q10: 说说对Node.js中的事件循环机制理解？

**A:**
Node.js 的事件循环是 Libuv 库实现的异步执行机制。它包含 6 个主要阶段：
1. **timers**：执行 `setTimeout` 和 `setInterval` 的回调。
2. **pending callbacks**：执行某些��统操作的回调（如 TCP 错误）。
3. **idle, prepare**：内部使用。
4. **poll**：检索新的 I/O 事件；执行 I/O 相关回调。
5. **check**：执行 `setImmediate` 的回调。
6. **close callbacks**：执行关闭连接的回调，如 `socket.on('close', ...)`。

**特别说明**：`process.nextTick` 不属于事件循环的任何阶段，它在每个阶段完成后的切换间隙被执行，且优先级高于其他微任务。

---

### Q11: 说说Node中的EventEmitter？如何实现一个EventEmitter？

**A:**
**EventEmitter** 是 Node.js 核心模块 `events` 提供的一个类，用于实现观察者模式（发布/订阅）。

**手动实现思路**：
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, cb) {
    if (!this.events[name]) this.events[name] = [];
    this.events[name].push(cb);
  }
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach(cb => cb(...args));
    }
  }
  off(name, cb) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter(fn => fn !== cb);
    }
  }
  once(name, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.off(name, wrapper);
    };
    this.on(name, wrapper);
  }
}
```

---

### Q12: 说说对 Node 中的 Stream 的理解？应用场景？

**A:**
**理解**：Stream（流）是处理流式数据的抽象接口。它可以像水流一样，分段读取和写入数据，而不需要将整个文件一次性加载到内存中，极大地节省了内存空间。

**类型**：
1. **Readable**：可读流（如 `fs.createReadStream`）。
2. **Writable**：可写流（如 `fs.createWriteStream`）。
3. **Duplex**：双工流（可读可写，如 TCP socket）。
4. **Transform**：转换流（读写过程中修改数据，如 `zlib` 压缩）。

**应用场景**：处理大文件上传/下载、视频串流、日志实时处理、网络请求转发等。

---

### Q13: 说说对Node中的Buffer的理解？应用场景？

**A:**
**理解**：Buffer 是 Node.js 中用于处理二进制数据的类。由于 JavaScript 最初只支持字符串，Buffer 提供了一种在 V8 堆外分配固定大小内存的方法，用于存放原始二进制字节。

**应用场景**：
1. **文件 I/O**：读写文件内容。
2. **网络传输**：处理 TCP 流或网络数据包。
3. **图片/音视频处理**：对多媒体文件进行编码或像素级操作。
4. **加密/解密**：转换哈希值或密钥。

---

### Q14: 说说对Node中的fs模块的理解？有哪些常用方法

**A:**
`fs` (File System) 模块提供了一组 API 用于与文件系统进行交互。

**常用方法**：
- **读取**：`readFile` (异步), `readFileSync` (同步), `createReadStream` (流)。
- **写入**：`writeFile`, `appendFile`, `createWriteStream`。
- **目录操作**：`mkdir`, `readdir`, `rmdir`。
- **信息获取**：`stat` (获取文件大小、创建时间等)。
- **权限/链接**：`chmod`, `rename`, `unlink` (删除文件)。
- **监听**：`watchFile`, `watch`。

---

### Q15: 说说对 Node 中的 process 的理解？有哪些常用方法？

**A:**
`process` 是一个全局对象，提供了当前 Node.js 进程的相关信息和控制能力。

**常用属性/方法**：
- `process.argv`：命令行参数数组。
- `process.env`：系统环境变量对象。
- `process.cwd()`：当前工作目录。
- `process.nextTick()`：将回调放入微任务队列。
- `process.exit()`：强制退出当前进程。
- `process.on('uncaughtException', ...)`：监听未捕获异常。
- `process.memoryUsage()`：内存占用详情。

---

### Q16: Node.js 有哪些全局对象？

**A:**
1. **基础对象**：`global` (全局命名空间)、`process`、`console`。
2. **定时器**：`setTimeout`、`setInterval`、`setImmediate`、`clearTimeout` 等。
3. **模块系统相关**：`__dirname` (当前目录路径)、`__filename` (当前文件路径)、`require`、`module`、`exports`。（注意：这些在 ESM 中不可用，需要通过 `import.meta` 模拟）。
4. **数据处理**：`Buffer`、各种 `TypedArray`。
5. **URL 处理**：`URL`、`URLSearchParams`。

---

### Q17: 说说你对Node.js的理解？优缺点？应用场景？

**A:**
**理解**：Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。它采用单线程、非阻塞 I/O 和事件驱动模型。

**优点**：
1. **高性能**：V8 引擎解析 JS 速度快。
2. **高并发**：非阻塞 I/O 能轻松处理数万个并发连接。
3. **生态繁荣**：NPM 拥有全球最大的开源包仓库。
4. **全栈开发**：前后端统一语言，降低沟通成本。

**缺点**：
1. **不适合 CPU 密集型任务**：长时间计算会阻塞事件循环。
2. **可靠性挑战**：单线程下，一个未处理异常可能导致整个服务崩溃。

**应用场景**：I/O 密集型应用（聊天室、实时推送）、中台/网关服务、SSR（服务端渲染）、前端工具链（Webpack, Vite）。

---

### Q18: body-parser 这个中间件是做什么用的？

**A:**
`body-parser` 是 Express 的中间件，用于解析 HTTP 请求体（Request Body）。

**功能**：
1. **解析 JSON**：解析内容类型为 `application/json` 的请求。
2. **解析 URL-encoded**：解析 HTML 表单提交的数据（`application/x-www-form-urlencoded`）。
3. **解析文本/原始数据**：支持纯文本或 Buffer。
4. **数据填充**：将解析后的结果挂载到 `req.body` 上，方便后续中间件使用。

---

### Q19: Koa中，如果一个中间件没有调用 await next()，后续的中间件还会执行吗？

**A:**
**不会执行**。
Koa 的核心机制是 `next()` 控制权的显式传递。如果不调用 `await next()`，执行流程就会在当前中间件停止并开始向上回溯（即"洋葱模型"的返回阶段），下游的中间件和业务逻辑（路由处理等）都将被跳过。

---

### Q20: 在没有async await 的时候，koa是怎么实现的洋葱模型？

**A:**
在 `async/await` 普及之前，Koa 1.x 使用了 **Generator 函数**（生成器）配合 `co` 库来实现。
- 中间件定义为 `function* (next) { ... }`。
- 通过 `yield next` 交出执行权。
- `co` 库会自动执行 Generator 并将控制权交回，从而模拟出类似的同步编写、异步执行的洋葱模型效果。

---

### Q21: koa框架中，该怎么处理中间件的异常？

**A:**
1. **全局错误处理中间件**：在中间件链的最前端（第一个）使用 `try-catch` 包裹 `next()`。
   ```javascript
   app.use(async (ctx, next) => {
     try {
       await next();
     } catch (err) {
       ctx.status = err.status || 500;
       ctx.body = { message: err.message };
       ctx.app.emit('error', err, ctx); // 触发全局 error 事件
     }
   });
   ```
2. **监听 error 事件**：使用 `app.on('error', (err, ctx) => { ... })` 进行集中的日志记录。
3. **使用 ctx.throw**：在业务逻辑中通过 `ctx.throw(400, '参数错误')` 抛出规范的异常。

---

### Q22: Node.js 如何调试？

**A:**
1. **Console 调试**：简单粗暴的 `console.log`。
2. **Node 内置调试器**：运行 `node inspect app.js`。
3. **Chrome DevTools**：
   - 运行 `node --inspect app.js`。
   - 打开 Chrome 浏览器，输入 `chrome://inspect`，点击 "Open dedicated DevTools for Node"。
4. **VS Code 调试**：在编辑器中按 F5 启动调试配置，支持设置断点、单步执行和变量监视。
5. **NDB**：Google 推出的更强大的调试工具。

---

### Q23: 说说你对 koa 洋葱模型的理解

**A:**
**洋葱模型**（Onion Model）是指 Koa 中间件的一种执行机制。
1. **进入阶段**：请求从第一个中间件开始执行，遇到 `next()` 时进入下一个中间件。
2. **核心阶段**：依次进入，直到最后一个中间件（通常是路由或业务逻辑）。
3. **回溯阶段**：业务逻辑执行完后，控制权会按照相反的顺序（从内向外）回到每个中间件 `next()` 之后的代码。

**优势**：这种模式让中间件可以非常方便地在"请求前"和"响应后"执行逻辑，例如计算请求耗时、统一处理错误或格式化响应结果。

---

## 💡 参考答案提示

**Q1 CommonJS vs ES Module：**
- CommonJS：动态加载、运行时同步加载、值拷贝、this指向当前模块
- ES Module：静态解析、编译时加载、值引用（只读）、this指向undefined

**Q3 事件循环区别：**
- 浏览器：宏任务（setTimeout/DOM事件）+ 微任务（Promise/mutationObserver）
- Node：6个阶段（timers/pending/check等）+ process.nextTick和微任务队列

**Q7 JWT鉴权：** Header（算法类型）+ Payload（用户信息/过期时间）+ Signature（密钥签名），服务端验证签名有效性

**Q8 中间件：** 函数形式 `(req, res, next) => {}`，按顺序执行，调用next()进入下一个

**Q11 EventEmitter：** Node内置事件模块，通过`on`监听、`emit`触发、`off`移除，实现发布订阅模式

**Q12 Stream：** 流式处理数据，类型：Readable/Writable/Duplex/Transform，适合大文件处理

**Q18 body-parser：** 解析HTTP请求体，支持JSON/Raw/Text/URL-encoded格式数据

**Q19 Koa next()：** 不会执行，洋葱模型要求必须通过await next()将控制权交给下游中间件

**Q23 洋葱模型：** 请求从外层进入，依次穿过所有中间件，到达最内层后反向返回，每个中间件可以执行两次（进和出）