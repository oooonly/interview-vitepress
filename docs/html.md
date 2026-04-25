# HTML 面试题

## 1. 什么是 DOM 和 BOM?

**答：**
- **DOM (Document Object Model)**：文档对象模型，是 HTML 和 XML 文档的编程接口。它将文档解析为一个由节点和对象组成的树结构，开发者可以使用 JavaScript 来操作文档的内容、结构和样式。
- **BOM (Browser Object Model)**：浏览器对象模型，提供了与浏览器窗口进行交互的对象。BOM 的核心是 window 对象，它包含了 location、navigator、screen、history 等子对象，用于控制浏览器的行为。

---

## 2. 简单描述从输入网址到页面显示的过程

**答：**
1. **DNS 解析**：将域名解析为 IP 地址
2. **建立 TCP 连接**：进行三次握手
3. **发送 HTTP 请求**：浏览器向服务器发送请求
4. **服务器处理请求**：服务器返回响应
5. **接收响应**：浏览器接收 HTML、CSS、JavaScript 等资源
6. **解析渲染页面**：
   - 解析 HTML 构建 DOM 树
   - 解析 CSS 构建 CSSOM 树
   - 合并 DOM 和 CSSOM 构建渲染树
   - 布局（Layout）
   - 绘制（Paint）

---

## 3. 一台设备的 DPR，是否是可变的？

**答：**
DPR (Device Pixel Ratio，设备像素比) = 物理像素 / CSS 像素。DPR 通常是固定的硬件属性，但在某些情况下可以变化：
- 浏览器缩放时，CSS 像素会改变，间接影响 DPR
- 某些设备支持显示模式切换（如标准模式 vs 高分辨率模式）
- 通过 `window.devicePixelRatio` 可以获取当前 DPR

---

## 4. 前端该如何选择图片的格式？

**答：**
| 格式 | 适用场景 |
|------|----------|
| JPEG/JPG | 色彩丰富的照片、不需要透明通道的图片 |
| PNG | 需要透明通道、图标、Logo、截图 |
| GIF | 简单动画 |
| WebP | 现代浏览器首选，压缩率高，支持有损/无损和透明 |
| SVG | 图标、Logo、简单的矢量图形 |
| AVIF | 新一代格式，压缩率更高，兼容性正在提升 |

---

## 5. 前端跨页面通信，你知道哪些方法？

**答：**
1. **LocalStorage/SessionStorage**：同域名下的页面可以通过 storage 事件监听变化
2. **BroadcastChannel**：同源页面间的广播通信
3. **SharedWorker**：多个页面共享一个 Worker 线程
4. **PostMessage**：不同窗口/iframe 间的通信
5. **Cookie**：同域名共享，但效率较低
6. **IndexedDB**：同域名共享数据
7. **WebSocket**：服务器中转的实时通信

---

## 6. 说说你对 DOM 树的理解

**答：**
DOM 树是 HTML 文档的内存中表示，特点包括：
- 树形结构，根节点是 document
- 每个 HTML 标签对应一个元素节点
- 文本内容对应文本节点
- 通过 JavaScript 可以动态操作 DOM（增删改查节点）
- DOM 操作代价较高，应避免频繁操作引起重排重绘

---

## 7. 行内元素有哪些？块级元素有哪些？空(void)元素有哪些？

**答：**
- **行内元素**：`span`, `a`, `img`, `input`, `strong`, `em`, `b`, `i`, `label`, `button` 等
- **块级元素**：`div`, `p`, `h1-h6`, `ul`, `ol`, `li`, `table`, `form`, `section`, `article` 等
- **空元素（自闭合）**：`img`, `input`, `br`, `hr`, `meta`, `link`, `area`, `base`, `col`, `embed`, `param`, `source`, `track`, `wbr`

---

## 8. HTML 和 CSS 中的图片加载与渲染规则是什么样的？

**答：**
- 浏览器遇到 ``<img>`` 标签会立即发送请求加载图片
- 图片加载是异步的，不会阻塞 HTML 解析
- 但图片加载完成后的渲染可能会触发重排
- CSS 背景图片在元素渲染时才会加载
- 可以使用 `loading="lazy"` 实现懒加载
- 使用 `decoding="async"` 避免阻塞主线程

---

## 9. title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别？

**答：**
| 标签 | 作用 | 语义 |
|------|------|------|
| `title` | 文档标题，显示在浏览器标签页 | 文档元信息 |
| `h1` | 页面主标题 | 内容结构，有语义权重 |
| `b` | 粗体显示 | 无语义，纯表现 |
| `strong` | 粗体显示 | 有语义，表示重要性 |
| `i` | 斜体显示 | 无语义，纯表现 |
| `em` | 斜体显示 | 有语义，表示强调 |

---

## 10. script 标签为什么建议放在 body 标签的底部（defer、async）

**答：**
- 浏览器解析 HTML 遇到 ``<script>`` 时会阻塞解析，等待脚本下载和执行
- 放在底部可以确保 DOM 先解析完成，避免阻塞渲染
- **defer**：脚本延迟到 DOM 解析完成后执行，按顺序执行
- **async**：脚本下载不阻塞解析，但下载完成后立即执行，不保证顺序
- 使用 `defer` 可以放在 ``<head>`` 中，也能达到类似效果

---

## 11. 说说你对 SSG 的理解

**答：**
**SSG (Static Site Generation，静态站点生成)**：
- 在构建时将页面预渲染为静态 HTML 文件
- 优点：加载速度快、SEO 友好、服务器压力小、可部署到 CDN
- 缺点：内容更新需要重新构建、不适合高度动态的内容
- 代表框架：Next.js、Nuxt.js、Gatsby、Hugo

---

## 12. 什么是 HTML5，以及和 HTML 的区别是什么？

**答：**
**HTML5** 是 HTML 的第五个版本，主要改进包括：
- 新增语义化标签（header、nav、section、article、aside、footer 等）
- 新增多媒体支持（video、audio、canvas）
- 新增表单类型和验证（email、date、range 等）
- 新增本地存储（localStorage、sessionStorage）
- 新增 Web Workers、WebSocket、Geolocation 等 API
- 不再支持过时标签（font、center、frame 等）

---

## 13. 什么是渐进增强和优雅降级？

**答：**
- **渐进增强 (Progressive Enhancement)**：从基础功能开始，为支持新特性的浏览器添加增强功能。基本功能对所有用户可用，高级功能作为增强。
- **优雅降级 (Graceful Degradation)**：先构建完整功能，然后为旧浏览器提供回退方案。确保应用在不支持某些特性的浏览器中也能正常工作。

---

## 14. Node 和 Element 是什么关系？

**答：**
- **Node** 是 DOM 树中的节点基类，包括元素节点、文本节点、注释节点、属性节点等
- **Element** 是 Node 的子类，特指 HTML 元素节点
- 所有 Element 都是 Node，但不是所有 Node 都是 Element
- 通过 `nodeType` 可以区分：元素节点为 1，文本节点为 3

---

## 15. 导致页面加载白屏时间长的原因有哪些，怎么进行优化？

**答：**
**原因**：
- JavaScript 阻塞渲染
- CSS 文件过大
- 大量同步资源请求
- 服务器响应慢
- 未优化的图片

**优化方案**：
- 代码分割和懒加载
- 使用 CDN
- 压缩资源（Gzip/Brotli）
- 资源预加载（preload/prefetch）
- 服务端渲染（SSR）
- 骨架屏提升感知性能

---

## 16. 如何控制 input 输入框的输入字数？

**答：**
```html
<!-- HTML5 原生属性 -->
`<input type="text" maxlength="100" />`

<!-- JavaScript 控制 -->
`<input type="text" oninput="if(this.value.length >` 100) this.value = this.value.slice(0, 100)" />
```

---

## 17. 渐进式 JPG 有了解过吗？

**答：**
**渐进式 JPG (Progressive JPEG)**：
- 普通 JPG 是基线式（从上到下逐行加载）
- 渐进式 JPG 先加载模糊的全图，然后逐渐清晰
- 优点：用户可以快速看到图片轮廓，感知加载更快
- 缺点：编码和解码时间稍长，文件可能稍大
- 可以通过工具（如 ImageMagick）转换

---

## 18. 假设我要上传图片，怎么在选择图片后，通过浏览器预览待上传的图片？

**答：**
```javascript
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = document.createElement('img');
    img.src = event.target.result;
    document.body.appendChild(img);
  };
  reader.readAsDataURL(file);
});
```
或使用 `URL.createObjectURL(file)` 创建临时 URL。

---

## 19. 怎么实现"点击回到顶部"的功能？

**答：**
```javascript
// 平滑滚动到顶部
window.scrollTo({ top: 0, behavior: 'smooth' });

// 或设置 scrollTop
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// 监听滚动显示/隐藏按钮
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
```

---

## 20. SPA 应用怎么进行 SEO？

**答：**
1. **SSR (服务端渲染)**：Next.js、Nuxt.js 等框架支持
2. **预渲染 (Prerendering)**：使用 prerender-spa-plugin
3. **动态渲染**：区分用户和爬虫提供不同内容
4. **使用 History API**：确保 URL 可访问
5. **完善 Meta 标签**：使用 vue-meta、react-helmet 等
6. **生成 Sitemap**：提交给搜索引擎

---

## 21. 如何实现 SEO 优化

**答：**
- 语义化 HTML 标签
- 合理的标题层级（h1-h6）
- 添加 meta description 和 keywords
- 使用语义化的 URL
- 图片添加 alt 属性
- 创建 Sitemap.xml
- 优化页面加载速度
- 移动端适配
- 使用 Schema.org 结构化数据

---

## 22. SEO 是什么？

**答：**
**SEO (Search Engine Optimization，搜索引擎优化)**：
- 通过优化网站结构、内容和外部链接，提高网站在搜索引擎自然排名中的位置
- 目标是增加网站的有机流量
- 包括技术 SEO（网站结构、速度、移动适配）、内容 SEO（关键词、质量内容）和站外 SEO（外链建设）
