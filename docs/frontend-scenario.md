# 前端场景篇面试题

> 📄 来源图片：前端场景.jpeg  
> 🕐 解析时间：2025-01-13

---

## 📋 场景题目

### Q1: 如何判断用户设备？

**A:**

```javascript
// 方法 1：UserAgent 检测（传统方案）
function getDeviceType() {
  const ua = navigator.userAgent;
  
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return /iPad/i.test(ua) ? 'tablet' : 'mobile';
  }
  return 'desktop';
}

// 方法 2：媒体查询
function getDeviceByMedia() {
  if (window.matchMedia('(max-width: 768px)').matches) {
    return window.matchMedia('(max-width: 480px)').matches ? 'mobile' : 'tablet';
  }
  return 'desktop';
}

// 方法 3：现代 API（用户代理客户端提示）
if (navigator.userAgentData) {
  const deviceInfo = navigator.userAgentData.mobile ? 'mobile' : 'desktop';
  // 注意：仅 Chromium 系浏览器支持
}

// 方法 4：触摸能力检测
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

---

### Q2: 将多次提交压缩成一次提交

**A:**

```javascript
// 方法 1：防抖（debounce）- 适用于搜索框
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const submit = debounce(() => {
  // 提交逻辑
}, 500);

// 方法 2：节流（throttle）- 适用于滚动等高频事件
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 方法 3：请求队列 + 批量提交
let queue = [];
let timer = null;

function batchSubmit(data) {
  queue.push(data);
  
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (queue.length > 0) {
      fetch('/api/batch', {
        method: 'POST',
        body: JSON.stringify({ items: queue })
      });
      queue = [];
    }
  }, 1000);
}

// 方法 4：Promise 合并
let pendingRequest = null;
function mergeSubmit(data) {
  if (!pendingRequest) {
    pendingRequest = Promise.resolve()
      .then(() => {
        // 合并所有待提交数据
        return fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
      })
      .finally(() => {
        pendingRequest = null;
      });
  }
  return pendingRequest;
}
```

---

**A:** 主要通过**防抖 (debounce)**、**节流 (throttle)** 来合并高频操作，或使用**请求队列**进行**批量提交**。对于表单提交等，可以通过**Promise 合并**或**请求锁**确保同一时间只有一个提交在处理。

---

### Q3: 介绍下 navigator.sendBeacon 方法

**A:**
`navigator.sendBeacon()` 用于在页面卸载时可靠地发送 HTTP 请求，不会阻塞页面关闭。

```javascript
// 基本用法
const data = new Blob([JSON.stringify({ event: 'page_leave', time: Date.now() })], {
  type: 'application/json'
});

// 页面卸载时发送埋点
window.addEventListener('beforeunload', () => {
  navigator.sendBeacon('/api/track', data);
});

// 或使用 pagehide（更可靠）
window.addEventListener('pagehide', () => {
  navigator.sendBeacon('/api/track', data);
});
```

**特点**：
- 异步发送，不阻塞页面卸载
- 即使页面关闭，请求也会继续发送
- 支持 Blob、ArrayBuffer、FormData、URLSearchParams 等数据类型
- 有数据大小限制（通常约 64KB）
- 无法获取响应结果

**与 fetch 对比**：
```javascript
// fetch keepalive 方案（现代替代）
fetch('/api/track', {
  method: 'POST',
  body: data,
  keepalive: true  // 页面卸载后继续发送
});
```

---

### Q4: 滚动跟随导航（电梯导航）该如何实现

**A:**
```html
<!-- HTML 结构 -->
<nav class="sidebar">
  <a href="#section1" class="nav-item active">第一章</a>
  <a href="#section2" class="nav-item">第二章</a>
  <a href="#section3" class="nav-item">第三章</a>
</nav>

<main>
  <section id="section1">内容 1</section>
  <section id="section2">内容 2</section>
  <section id="section3">内容 3</section>
</main>
```

```javascript
// 方法 1：滚动监听 + Intersection Observer
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

// 点击导航滚动
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = item.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// 滚动时高亮对应导航
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.classList.toggle('active', 
          item.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-20% 0px -80% 0px' }); // 视口顶部 20% 处触发

sections.forEach(section => observer.observe(section));

// 方法 2：滚动监听 + 计算位置（兼容方案）
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100; // 偏移量
  
  sections.forEach((section, index) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => item.classList.remove('active'));
      navItems[index].classList.add('active');
    }
  });
}, { passive: true });
```

---

### Q5: 退出浏览器之前，发送积压的埋点数据请求，该如何做？

**A:**

```javascript
// 方案 1：sendBeacon（推荐）
let pendingData = [];

function track(event, data) {
  pendingData.push({ event, data, time: Date.now() });
  
  // 批量发送（正常情况）
  if (pendingData.length >= 10) {
    flushData();
  }
}

function flushData() {
  if (pendingData.length === 0) return;
  
  const blob = new Blob([JSON.stringify(pendingData)], {
    type: 'application/json'
  });
  navigator.sendBeacon('/api/track', blob);
  pendingData = [];
}

// 页面卸载时发送剩余数据
window.addEventListener('beforeunload', flushData);
window.addEventListener('pagehide', flushData);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flushData();
  }
});

// 方案 2：fetch keepalive
function flushDataFetch() {
  if (pendingData.length === 0) return;
  
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pendingData),
    keepalive: true  // 关键：页面卸载后继续发送
  });
  pendingData = [];
}

// 方案 3：离线存储 + 下次上报
function flushDataWithStorage() {
  if (pendingData.length === 0) return;
  
  const success = navigator.sendBeacon('/api/track', 
    new Blob([JSON.stringify(pendingData)])
  );
  
  if (!success) {
    // sendBeacon 失败，存储到 localStorage
    const stored = JSON.parse(localStorage.getItem('pending_track') || '[]');
    localStorage.setItem('pending_track', JSON.stringify([...stored, ...pendingData]));
  } else {
    pendingData = [];
  }
}

// 页面加载时检查是否有遗留数据
window.addEventListener('load', () => {
  const stored = localStorage.getItem('pending_track');
  if (stored) {
    pendingData = [...JSON.parse(stored), ...pendingData];
    localStorage.removeItem('pending_track');
    flushData();
  }
});
```

---

### Q6: 如何统计页面的 long task（长任务）

### Q6: 如何统计页面的 long task（长任务）

**A:**
长任务指执行时间超过 50ms 的任务，会影响页面响应性。

```javascript
// 方法 1：PerformanceObserver 监听 longtask
const longTasks = [];

if ('PerformanceObserver' in window && 
    PerformanceObserver.supportedEntryTypes.includes('longtask')) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      longTasks.push({
        startTime: entry.startTime,
        duration: entry.duration,
        name: entry.name,
        attribution: entry.attribution // 归因信息（容器、类型等）
      });
      
      console.log(`长任务：${entry.duration.toFixed(2)}ms`, entry);
    }
  });
  
  observer.observe({ entryTypes: ['longtask'] });
} else {
  console.warn('浏览器不支持 longtask 监听');
}

// 方法 2：估算长任务（兼容方案）
function estimateLongTask() {
  const threshold = 50;
  let lastTime = performance.now();
  
  const check = () => {
    const now = performance.now();
    const diff = now - lastTime;
    
    if (diff > threshold) {
      console.log(`检测到可能的长任务：${diff.toFixed(2)}ms`);
    }
    
    lastTime = now;
    requestIdleCallback(check, { timeout: 100 });
  };
  
  requestIdleCallback(check);
}

// 方法 3：上报长任务数据
function reportLongTasks() {
  if (longTasks.length === 0) return;
  
  const data = longTasks.map(task => ({
    duration: task.duration,
    startTime: task.startTime
  }));
  
  // 使用 sendBeacon 上报
  navigator.sendBeacon('/api/long-tasks', 
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
}

window.addEventListener('pagehide', reportLongTasks);
```

---

### Q7: Performance Observer 如何测量页面性能

**A:**

```javascript
// 测量核心 Web Vitals 指标
const metrics = {};

// 1. FCP (First Contentful Paint)
const fcpObserver = new PerformanceObserver((list) => {
  const entry = list.getEntries().pop();
  if (entry) {
    metrics.fcp = entry.startTime;
    console.log('FCP:', entry.startTime);
  }
});
fcpObserver.observe({ entryTypes: ['paint'] });

// 2. LCP (Largest Contentful Paint)
const lcpObserver = new PerformanceObserver((list) => {
  const entry = list.getEntries().pop();
  if (entry) {
    metrics.lcp = entry.startTime;
    console.log('LCP:', entry.startTime);
  }
});
lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

// 3. CLS (Cumulative Layout Shift)
let clsValue = 0;
const clsObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  metrics.cls = clsValue;
  console.log('CLS:', clsValue);
});
clsObserver.observe({ entryTypes: ['layout-shift'] });

// 4. FID/INP (Interaction to Next Paint)
let fidValue = null;
const fidObserver = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  if (entry) {
    fidValue = entry.processingStart - entry.startTime;
    metrics.fid = fidValue;
    console.log('FID:', fidValue);
  }
});
fidObserver.observe({ entryTypes: ['first-input'] });

// 5. 资源加载 timing
const resourceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`资源：${entry.name}`, {
      DNS: entry.domainLookupEnd - entry.domainLookupStart,
      TCP: entry.connectEnd - entry.connectStart,
      TTFB: entry.responseStart - entry.requestStart,
      下载：entry.responseEnd - entry.responseStart,
      总耗时：entry.duration
    });
  }
});
resourceObserver.observe({ entryTypes: ['resource'] });

// 页面加载完成后上报所有指标
window.addEventListener('load', () => {
  setTimeout(() => {
    // 等待 LCP 等指标完成
    reportMetrics(metrics);
  }, 1000);
});

function reportMetrics(data) {
  navigator.sendBeacon('/api/performance', 
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
}
```

---

### Q8: 移动端如何实现下拉滚动加载（顶部加载）

**A:**

```javascript
// 顶部下拉刷新加载
class PullToRefresh {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    this.options = {
      threshold: 80,      // 触发刷新的阈值
      maxPull: 120,       // 最大下拉距离
      onRefresh: options.onRefresh || (() => {})
    };
    
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    this.refreshing = false;
    
    this.init();
  }
  
  init() {
    const { container } = this;
    
    // 创建刷新指示器
    this.indicator = document.createElement('div');
    this.indicator.className = 'pull-indicator';
    this.indicator.innerHTML = '<span class="arrow">↓</span> 下拉刷新';
    container.insertBefore(this.indicator, container.firstChild);
    
    container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    container.addEventListener('touchend', this.onTouchEnd.bind(this));
  }
  
  onTouchStart(e) {
    if (this.container.scrollTop === 0 && !this.refreshing) {
      this.startY = e.touches[0].pageY;
      this.isDragging = true;
    }
  }
  
  onTouchMove(e) {
    if (!this.isDragging) return;
    
    const deltaY = e.touches[0].pageY - this.startY;
    
    if (deltaY > 0) {
      e.preventDefault(); // 阻止默认滚动
      
      // 阻尼效果
      this.currentY = Math.min(deltaY * 0.5, this.options.maxPull);
      this.indicator.style.transform = `translateY(${this.currentY}px)`;
      
      // 更新提示文字
      if (this.currentY >= this.options.threshold) {
        this.indicator.innerHTML = '<span class="arrow">↑</span> 释放刷新';
      } else {
        this.indicator.innerHTML = '<span class="arrow">↓</span> 下拉刷新';
      }
    }
  }
  
  onTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    if (this.currentY >= this.options.threshold && !this.refreshing) {
      this.refresh();
    } else {
      this.reset();
    }
  }
  
  async refresh() {
    this.refreshing = true;
    this.indicator.innerHTML = '<span class="spinner">⟳</span> 加载中...';
    
    // 动画到最大高度
    this.indicator.style.transform = `translateY(${this.options.threshold}px)`;
    
    try {
      await this.options.onRefresh();
    } finally {
      this.refreshing = false;
      this.reset();
    }
  }
  
  reset() {
    this.currentY = 0;
    this.indicator.style.transform = 'translateY(0)';
  }
  
  // 手动触发刷新（编程方式）
  triggerRefresh() {
    if (!this.refreshing) {
      this.refresh();
    }
  }
}

// 使用示例
const ptr = new PullToRefresh('.container', {
  async onRefresh() {
    // 加载新数据
    await fetchData();
    // 更新列表
    updateList();
  }
});
```

**CSS 样式**：
```css
.pull-indicator {
  text-align: center;
  height: 0;
  overflow: hidden;
  transition: transform 0.3s;
}
.pull-indicator .arrow {
  display: inline-block;
  transition: transform 0.3s;
}
.pull-indicator:has(.arrow[style*="↑"]) .arrow {
  transform: rotate(180deg);
}
```

---

### Q9: 判断页签是否为活跃状态

**A:**

```javascript
// 方法 1：visibilityState（推荐）
console.log('当前页签状态:', document.visibilityState);
// 'visible' - 页签可见
// 'hidden' - 页签隐藏
// 'prerender' - 预渲染中

// 监听页签切换
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('页签变为活跃');
    // 恢复任务：继续轮询、播放视频等
    resumeTasks();
  } else {
    console.log('页签变为非活跃');
    // 暂停任务：节省资源、停止视频等
    pauseTasks();
    // 可选：保存状态
    saveState();
  }
});

// 方法 2：focus/blur 事件（窗口焦点）
window.addEventListener('focus', () => {
  console.log('窗口获得焦点');
});

window.addEventListener('blur', () => {
  console.log('窗口失去焦点');
});

// 方法 3：pageshow/pagehide（页面显示/隐藏）
window.addEventListener('pageshow', (e) => {
  console.log('页面显示', e.persisted); // 是否来自缓存
});

window.addEventListener('pagehide', (e) => {
  console.log('页面隐藏', e.persisted);
  // 可靠的上报时机
  reportAnalytics();
});

// 综合判断函数
function isPageActive() {
  return document.visibilityState === 'visible' && document.hasFocus();
}

// 应用示例：只在活跃时轮询
let pollingTimer = null;

function startPolling() {
  if (isPageActive()) {
    doPolling();
    pollingTimer = setTimeout(startPolling, 5000);
  } else {
    // 页签隐藏时清除定时器
    pollingTimer = null;
  }
}

function doPolling() {
  fetch('/api/data').then(updateUI);
}

// 监听页签变化
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !pollingTimer) {
    startPolling();
  }
});

startPolling();
```

---

### Q10: 在网络带宽一定的情况下，切片上传感觉和整体上传消费的时间应该是差不多的这种说法正确吗？

**A:**
**不完全正确**。虽然理论上传输的数据总量相同，但实际耗时可能有差异：

**切片上传的优势**：
```javascript
// 并发 3 个切片上传
   const concurrent = 3;
   const chunks = splitFile(file, chunkSize);
   
   for (let i = 0; i < chunks.length; i += concurrent) {
     const batch = chunks.slice(i, i + concurrent);
     await Promise.all(batch.map(uploadChunk));
   }
   ```

2. **断点续传**：失败后只重传失败的切片，而非整个文件
   ```javascript
   // 检查已上传的切片
   const uploadedChunks = await getUploadedChunks(fileId);
   const remainingChunks = chunks.filter((_, i) => 
     !uploadedChunks.includes(i)
   );
   ```

3. **进度反馈**：可以精确显示上传进度
   ```javascript
   const progress = (uploadedChunks / totalChunks) * 100;
   ```

4. **错误恢复**：单个切片失败不影响其他切片

5. **服务器压力分散**：避免单个大请求占用过多资源

**切片上传的劣势**：
1. **额外开销**：每个切片都有 HTTP 头部、TCP 握手等开销
2. **合并成本**：服务器需要合并切片，增加计算量
3. **复杂度增加**：需要处理切片顺序、重复上传等问题

**时间对比公式**：
整体上传时间 = T_handshake + T_upload + T_process

切片上传时间 = T_handshake + n×(T_chunk_overhead) + T_upload + T_merge

其中：n = 切片数量，T_chunk_overhead = 每个切片的额外开销

**结论**：
- 小文件（<10MB）：整体上传更快（开销占比小）
- 大文件（>100MB）：切片上传综合优势明显（并发 + 断点续传）
- 网络不稳定：切片上传优势巨大（失败重传成本低）

---

### Q11: 大文件切片上传的时候，确定切片数量的时候，有哪些考量因素

**A:**
**1. 文件大小**
```javascript
function calculateChunkSize(fileSize) {
  if (fileSize < 10 * 1024 * 1024) return 1024 * 1024;      // <10MB: 1MB/chunk
  if (fileSize < 100 * 1024 * 1024) return 2 * 1024 * 1024; // <100MB: 2MB/chunk
  if (fileSize < 500 * 1024 * 1024) return 5 * 1024 * 1024; // <500MB: 5MB/chunk
  return 10 * 1024 * 1024; // >500MB: 10MB/chunk
}
```

**2. 网络状况**
- 网络稳定：增大切片，减少请求次数
- 网络波动：减小切片，降低失败重传成本

**3. 浏览器并发限制**
- HTTP/1.1：同域名 6-8 个并发连接
- HTTP/2：理论上无限制，但服务器有限制

**4. 服务器限制**
- 单个请求大小限制
- 并发处理能力
- 内存限制（切片需要在内存中合并）

**5. 内存占用**
```javascript
// 每个切片需要在内存中保留一份
// 并发数 × 切片大小 = 峰值内存占用
const maxMemory = concurrentLimit * chunkSize;
```

```javascript
**6. 上传进度精度**
```
- 切片越小，进度更新越频繁、越精确
- 但过小的切片会增加请求开销

```javascript
**7. 重试策略**
```javascript
// 失败重试配置
const config = {
  chunkSize: 2 * 1024 * 1024,  // 2MB
  concurrent: 3,               // 并发 3 个
  maxRetries: 3,               // 最多重试 3 次
  retryDelay: 1000             // 重试间隔 1s
};
```

```javascript
**8. 实际案例**
```javascript
// 综合配置
const uploadConfig = {
  // 动态切片大小
  getChunkSize(fileSize) {
    return Math.min(
      5 * 1024 * 1024,  // 最大 5MB
      Math.max(
        256 * 1024,     // 最小 256KB
        fileSize / 100  // 不超过 100 个切片
      )
    );
  },
  // 并发数
  concurrent: navigator.connection?.effectiveType === '4g' ? 4 : 2,
  // 超时时间
  timeout: 30000
};
```

---

### Q12: 页面关闭时执行方法，该如何做

**A:**

```javascript
// 方法 1：beforeunload 事件
window.addEventListener('beforeunload', (e) => {
  // 执行清理操作
  saveUserState();
  
  // 显示确认对话框（部分浏览器支持）
  e.preventDefault();
  e.returnValue = ''; // Chrome 需要
  return '';          // 其他浏览器
});

// 方法 2：unload 事件（不推荐，已弃用）
window.addEventListener('unload', () => {
  // 同步操作，时间非常有限
  saveDataSync();
});

// 方法 3：pagehide 事件（推荐）
window.addEventListener('pagehide', (e) => {
  // 更可靠的时机
  if (e.persisted) {
    // 页面进入 bfcache，可恢复
    console.log('页面缓存到后台');
  } else {
    // 页面真正关闭
    console.log('页面关闭');
    reportAnalytics();
  }
});

// 方法 4：visibilitychange（页面隐藏时）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // 用户切换到其他页签
    saveState();
  }
});

// 方法 5：sendBeacon（最适合数据上报）
window.addEventListener('pagehide', () => {
  const data = new Blob([JSON.stringify(getAnalyticsData())]);
  navigator.sendBeacon('/api/track', data);
});

// 方法 6：fetch keepalive
window.addEventListener('pagehide', () => {
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(state),
    keepalive: true  // 关键：页面关闭后继续发送
  });
});

// 综合方案
class PageCloseHandler {
  constructor() {
    this.data = {};
    this.init();
  }
  
  init() {
    // 收集数据
    this.collectData();
    
    // 注册监听
    window.addEventListener('pagehide', this.onPageHide.bind(this));
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }
  
  collectData() {
    // 收集需要保存的数据
    this.data = {
      time: Date.now(),
      scrollY: window.scrollY,
      formData: this.getFormData(),
      // ...
    };
  }
  
  onBeforeUnload(e) {
    // 如果需要确认对话框
    if (this.hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }
  
  onPageHide() {
    // 发送数据
    const blob = new Blob([JSON.stringify(this.data)], {
      type: 'application/json'
    });
    navigator.sendBeacon('/api/save', blob);
  }
  
  hasUnsavedChanges() {
    // 判断是否有未保存的更改
    return true;
  }
  
  getFormData() {
    // 获取表单数据
    return {};
  }
}

new PageCloseHandler();
```

---

### Q13: 如何统计用户 PV 访问的发起请求数量

**A:**

```javascript
// 方法 1：PerformanceResourceTiming API
function getRequestCount() {
  const resources = performance.getEntriesByType('resource');
  return resources.length;
}

// 方法 2：详细统计各类请求
function analyzeRequests() {
  const resources = performance.getEntriesByType('resource');
  
  const stats = {
    total: resources.length,
    byType: {},
    byInitiator: {},
    failed: 0,
    totalSize: 0
  };
  
  resources.forEach(r => {
    // 按类型统计
    const type = r.initiatorType;
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // 统计失败请求
    if (r.transferSize === 0 && r.duration > 0) {
      stats.failed++;
    }
    
    // 统计总大小
    stats.totalSize += r.transferSize || 0;
  });
  
  return stats;
}

// 方法 3：拦截 fetch 和 XMLHttpRequest
(function trackRequests() {
  let requestCount = 0;
  const requests = new Map();
  
  // 拦截 fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const id = ++requestCount;
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    
    requests.set(id, { url, start: performance.now(), type: 'fetch' });
    
    return originalFetch.apply(this, args)
      .then(res => {
        const req = requests.get(id);
        if (req) {
          req.end = performance.now();
          req.status = res.status;
          reportRequest(req);
        }
        return res;
      })
      .catch(err => {
        const req = requests.get(id);
        if (req) {
          req.end = performance.now();
          req.error = err.message;
          reportRequest(req);
        }
        throw err;
      });
  };
  
  // 拦截 XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._trackId = ++requestCount;
    this._trackUrl = url;
    this._trackStart = performance.now();
    return originalOpen.call(this, method, url, ...args);
  };
  
  XMLHttpRequest.prototype.send = function(...args) {
    const self = this;
    const id = this._trackId;
    
    this.addEventListener('loadend', function() {
      const req = {
        id,
        url: self._trackUrl,
        type: 'xhr',
        start: self._trackStart,
        end: performance.now(),
        status: self.status
      };
      reportRequest(req);
    });
    
    return originalSend.call(this, ...args);
  };
  
  // 上报请求数据
  function reportRequest(req) {
    // 可以在这里收集数据，定时上报
    // 或立即上报（注意不要影响性能）
    console.log('Request:', req);
  }
  
  // 页面卸载时上报总数
  window.addEventListener('pagehide', () => {
    navigator.sendBeacon('/api/pv-requests', JSON.stringify({
      count: requestCount,
      ...analyzeRequests()
    }));
  });
})();

// 方法 4：使用 PerformanceObserver 实时监听
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('新请求:', entry.name, {
      type: entry.initiatorType,
      duration: entry.duration,
      size: entry.transferSize
    });
  }
});

observer.observe({ entryTypes: ['resource'] });

// 获取 PV 维度的请求统计
function getPVRequestStats() {
  return {
    pv: getSessionId(),  // 当前会话 ID
    url: location.href,
    requestCount: performance.getEntriesByType('resource').length,
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
    timestamp: Date.now()
  };
}
```

---

### Q14: 长文本溢出，展开/收起如何实现

**A:**
```html
<!-- HTML 结构 -->
<div class="text-expand" data-expanded="false">
  <div class="text-content">
    这里是很长的文本内容...
  </div>
  <button class="expand-btn">展开</button>
</div>
```

```css
/* 方案 1：-webkit-line-clamp（推荐） */
.text-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;       /* 显示 3 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s;
}

.text-expand[data-expanded="true"] .text-content {
  -webkit-line-clamp: unset;   /* 展开时取消限制 */
}

.expand-btn {
  display: none;               /* 默认隐藏按钮 */
  color: #1890ff;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 0;
}

.text-expand[data-expanded="false"] .expand-btn {
  display: block;              /* 未展开时显示按钮 */
}
```

```javascript
// JavaScript 控制
function initTextExpand() {
  document.querySelectorAll('.text-expand').forEach(container => {
    const content = container.querySelector('.text-content');
    const btn = container.querySelector('.expand-btn');
    
    // 判断是否需要展开按钮
    if (content.scrollHeight <= content.clientHeight) {
      btn.style.display = 'none';
      return;
    }
    
    btn.addEventListener('click', () => {
      const isExpanded = container.dataset.expanded === 'true';
      container.dataset.expanded = String(!isExpanded);
      btn.textContent = isExpanded ? '展开' : '收起';
    });
  });
}

initTextExpand();
```

```javascript
**方案 2：max-height 过渡动画**
```css
.text-content {
  max-height: 72px;          /* 3 行 × 24px 行高 */
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.text-expand[data-expanded="true"] .text-content {
  max-height: 2000px;        /* 足够大的值 */
}
```

```javascript
**方案 3：动态计算高度**
```javascript
class TextExpander {
  constructor(el, options = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.lines = options.lines || 3;
    this.lineHeight = options.lineHeight || 24;
    
    this.init();
  }
  
  init() {
    const content = this.el.querySelector('.text-content');
    const maxHeight = this.lines * this.lineHeight;
    
    // 初始状态
    content.style.maxHeight = `${maxHeight}px`;
    content.style.overflow = 'hidden';
    content.style.position = 'relative';
    
    // 判断是否需要展开
    if (content.scrollHeight <= maxHeight) {
      return;
    }
    
    // 添加渐变遮罩
    const mask = document.createElement('div');
    mask.className = 'text-mask';
    mask.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(transparent, white);
      pointer-events: none;
    `;
    content.appendChild(mask);
    
    // 添加按钮
    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.textContent = '展开';
    btn.style.cssText = `
      display: block;
      margin: 8px auto;
      color: #1890ff;
      border: none;
      background: none;
      cursor: pointer;
    `;
    this.el.appendChild(btn);
    
    // 点击事件
    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      
      if (expanded) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        btn.textContent = '收起';
        mask.style.display = 'none';
      } else {
        content.style.maxHeight = `${maxHeight}px`;
        btn.textContent = '展开';
        mask.style.display = 'block';
      }
    });
  }
}

// 使用
new TextExpander('.text-expand', { lines: 3 });
```

---

### Q15: 如何实现鼠标拖拽

**A:**
```html
<div id="draggable" class="draggable">拖拽我</div>
```

```css
.draggable {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
}
```

```javascript
// 方法 1：基础拖拽
const el = document.getElementById('draggable');

let isDragging = false;
let startX, startY, startLeft, startTop;

el.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startLeft = el.offsetLeft;
  startTop = el.offsetTop;
  
  // 添加拖拽中样式
  el.style.cursor = 'grabbing';
  
  // 阻止默认行为（防止选中文本）
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  el.style.left = `${startLeft + dx}px`;
  el.style.top = `${startTop + dy}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  el.style.cursor = 'move';
});

// 方法 2：封装为可复用函数
function makeDraggable(element, options = {}) {
  const { 
    boundary = null,      // 边界容器
    axis = 'both',        // 'x', 'y', 'both'
    onStart,              // 开始拖拽回调
    onMove,               // 移动中回调
    onEnd                 // 结束拖拽回调
  } = options;
  
  const el = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  let dragging = false;
  let startPos = { x: 0, y: 0 };
  let initialPos = { left: 0, top: 0 };
  
  el.style.cursor = 'move';
  el.style.userSelect = 'none';
  el.style.touchAction = 'none';  // 支持触摸
  
  function getBoundary() {
    if (!boundary) return null;
    const container = typeof boundary === 'string' 
      ? document.querySelector(boundary) 
      : boundary;
    return container.getBoundingClientRect();
  }
  
  function constrainPosition(left, top) {
    const bounds = getBoundary();
    if (!bounds) return { left, top };
    
    const elRect = el.getBoundingClientRect();
    
    return {
      left: Math.max(0, Math.min(left, bounds.width - elRect.width)),
      top: Math.max(0, Math.min(top, bounds.height - elRect.height))
    };
  }
  
  function handleStart(e) {
    dragging = true;
    
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    
    startPos = { x: clientX, y: clientY };
    initialPos = {
      left: el.offsetLeft,
      top: el.offsetTop
    };
    
    onStart?.({ x: initialPos.left, y: initialPos.top });
    
    e.preventDefault();
  }
  
  function handleMove(e) {
    if (!dragging) return;
    
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    
    const dx = clientX - startPos.x;
    const dy = clientY - startPos.y;
    
    let newLeft = initialPos.left + dx;
    let newTop = initialPos.top + dy;
    
    if (axis === 'x') newTop = initialPos.top;
    if (axis === 'y') newLeft = initialPos.left;
    
    // 边界约束
    const constrained = constrainPosition(newLeft, newTop);
    
    el.style.left = `${constrained.left}px`;
    el.style.top = `${constrained.top}px`;
    
    onMove?.({ x: constrained.left, y: constrained.top });
    
    e.preventDefault();
  }
  
  function handleEnd() {
    dragging = false;
    onEnd?.({ 
      x: el.offsetLeft, 
      y: el.offsetTop 
    });
  }
  
  // 鼠标事件
  el.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  
  // 触摸事件
  el.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  
  // 返回控制方法
  return {
    destroy() {
      el.removeEventListener('mousedown', handleStart);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      el.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    }
  };
}

// 使用示例
const draggable = makeDraggable('#draggable', {
  boundary: document.body,
  axis: 'both',
  onMove: (pos) => console.log('当前位置:', pos)
});

// 方法 3：使用 Pointer Events（现代方案）
function makeDraggablePointer(el) {
  let dragging = false;
  let start = { x: 0, y: 0 };
  let initial = { left: 0, top: 0 };
  
  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    start = { x: e.clientX, y: e.clientY };
    initial = { left: el.offsetLeft, top: el.offsetTop };
    el.setPointerCapture(e.pointerId);  // 捕获指针事件
    e.preventDefault();
  });
  
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    
    el.style.left = `${initial.left + e.clientX - start.x}px`;
    el.style.top = `${initial.top + e.clientY - start.y}px`;
  });
  
  el.addEventListener('pointerup', (e) => {
    dragging = false;
    el.releasePointerCapture(e.pointerId);
  });
}
```

---

### Q16: 统计全站每一个静态资源加载耗时，该如何做

**A:**

```javascript
// 方案 1：PerformanceResourceTiming API
class ResourceMonitor {
  constructor() {
    this.resources = [];
    this.init();
  }
  
  init() {
    // 获取已有的资源
    this.collectExistingResources();
    
    // 监听新资源
    this.observeNewResources();
    
    // 页面卸载时上报
    window.addEventListener('pagehide', () => this.report());
  }
  
  collectExistingResources() {
    const entries = performance.getEntriesByType('resource');
    this.resources = entries.map(entry => this.parseResource(entry));
  }
  
  observeNewResources() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.resources.push(this.parseResource(entry));
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
  
  parseResource(entry) {
    return {
      name: entry.name,
      type: entry.initiatorType,
      // 各阶段耗时
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      ttfb: entry.responseStart - entry.requestStart,
      download: entry.responseEnd - entry.responseStart,
      // 总耗时
      duration: entry.duration,
      // 大小
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      // 协议
      protocol: entry.nextHopProtocol || 'unknown',
      // 时间戳
      startTime: entry.startTime,
      responseEnd: entry.responseEnd
    };
  }
  
  getStats() {
    const byType = {};
    const slowResources = [];
    const threshold = 1000; // 1s 阈值
    
    this.resources.forEach(r => {
      // 按类型分组
      byType[r.type] = byType[r.type] || [];
      byType[r.type].push(r);
      
      // 找出慢资源
      if (r.duration > threshold) {
        slowResources.push(r);
      }
    });
    
    return {
      total: this.resources.length,
      byType: Object.entries(byType).map(([type, items]) => ({
        type,
        count: items.length,
        avgDuration: items.reduce((s, i) => s + i.duration, 0) / items.length
      })),
      slowResources: slowResources.map(r => ({
        name: r.name,
        type: r.type,
        duration: r.duration
      }))
    };
  }
  
  report() {
    const stats = this.getStats();
    
    // 使用 sendBeacon 上报
    navigator.sendBeacon('/api/resource-stats', 
      new Blob([JSON.stringify({
        url: location.href,
        timestamp: Date.now(),
        ...stats
      })], { type: 'application/json' })
    );
  }
}

// 使用
const monitor = new ResourceMonitor();

// 方案 2：拦截资源加载
class ResourceInterceptor {
  constructor() {
    this.interceptImage();
    this.interceptLink();
  }
  
  interceptImage() {
    const originalImage = window.Image;
    
    window.Image = function() {
      const img = new originalImage();
      const start = performance.now();
      
      img.addEventListener('load', () => {
        const duration = performance.now() - start;
        console.log('图片加载:', img.src, `${duration.toFixed(2)}ms`);
      });
      
      img.addEventListener('error', () => {
        console.error('图片加载失败:', img.src);
      });
      
      return img;
    };
    
    window.Image.prototype = originalImage.prototype;
  }
  
  interceptLink() {
    // 可以类似拦截<link>、<script>等
  }
}

// 方案 3：获取详细瀑布图数据
function getResourceWaterfall() {
  return performance.getEntriesByType('resource').map(r => ({
    name: r.name.split('/').pop(),
    phases: {
      dns: r.domainLookupEnd - r.domainLookupStart,
      tcp: r.connectEnd - r.connectStart,
      ssl: r.connectEnd - r.secureConnectionStart,
      ttfb: r.responseStart - r.requestStart,
      download: r.responseEnd - r.responseStart
    },
    total: r.duration
  }));
}
```

---

### Q17: 防止前端页面重复请求

**A:**

```javascript
// 方案 1：请求锁（同一时间只允许一个请求）
class RequestLock {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async request(key, fn) {
    // 如果已有相同 key 的请求在等待，返回之前的 Promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });
    
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// 使用
const locker = new RequestLock();

// 防止重复提交
locker.request('submit-form', () => 
  fetch('/api/submit', { method: 'POST', body: formData })
);

// 方案 2:AbortController 取消之前的请求
class CancellableRequest {
  constructor() {
    this.controllers = new Map();
  }
  
  async request(key, url, options = {}) {
    // 取消之前的同名请求
    if (this.controllers.has(key)) {
      this.controllers.get(key).abort();
    }
    
    const controller = new AbortController();
    this.controllers.set(key, controller);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      return response;
    } finally {
      this.controllers.delete(key);
    }
  }
  
  cancel(key) {
    if (this.controllers.has(key)) {
      this.controllers.get(key).abort();
      this.controllers.delete(key);
    }
  }
  
  cancelAll() {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }
}

// 使用：搜索框防重复
const canceller = new CancellableRequest();

debouncedSearch = async (query) => {
  try {
    const data = await canceller.request(
      'search',
      `/api/search?q=${encodeURIComponent(query)}`
    );
    updateResults(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('请求被取消');
    }
  }
};

// 方案 3: 防抖 + 节流
function debounceRequest(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttleRequest(fn, interval) {
  let lastTime = 0;
  let timeout = null;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, interval - (now - lastTime));
    }
  };
}

// 方案 4：请求队列
{
  const queue = [];
  let processing = false;
  
  async function queueRequest(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      processQueue();
    });
  }
  
  async function processQueue() {
    if (processing || queue.length === 0) return;
    
    processing = true;
    
    while (queue.length > 0) {
      const { fn, resolve, reject } = queue.shift();
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }
    
    processing = false;
  }
}

// 方案 5：标记法（loading 状态）
const requestStatus = {
  pending: new Set(),
  
  canRequest(key) {
    return !this.pending.has(key);
  },
  
  start(key) {
    this.pending.add(key);
  },
  
  end(key) {
    this.pending.delete(key);
  }
};

async function safeRequest(key, fn) {
  if (!requestStatus.canRequest(key)) {
    console.warn('请求正在进行中:', key);
    return;
  }
  
  requestStatus.start(key);
  
  try {
    return await fn();
  } finally {
    requestStatus.end(key);
  }
}

// 使用:按钮防抖
let isSubmitting = false;

handleSubmit = async () => {
  if (isSubmitting) return;
  
  isSubmitting = true;
  btn.disabled = true;
  btn.textContent = '提交中...';
  
  try {
    await submitForm();
  } finally {
    isSubmitting = false;
    btn.disabled = false;
    btn.textContent = '提交';
  }
};
```

---

### Q18: Resize Observer 作用是什么

**A:**
`ResizeObserver` 用于监听元素尺寸的变化，比 `window.resize` 更精确、性能更好。

```javascript
// 基本用法
const el = document.querySelector('#myElement');

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    console.log('元素尺寸变化:', {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
      borderBoxSize: entry.borderBoxSize,
      contentBoxSize: entry.contentBoxSize
    });
  }
});

observer.observe(el);

// 使用场景 1：响应式图表
function initResponsiveChart() {
  const container = document.querySelector('#chart-container');
  let chart = null;
  
  const ro = new ResizeObserver(() => {
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(container, {
      // ... 图表配置
      width: container.clientWidth,
      height: container.clientHeight
    });
  });
  
  ro.observe(container);
  
  return () => ro.disconnect();
}

// 使用场景 2：图片懒加载 + 自适应
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const ro = new ResizeObserver((entries) => {
    entries.forEach(entry => {
      const img = entry.target;
      const { width } = entry.contentRect;
      
      // 根据容器宽度加载合适的图片尺寸
      if (img.dataset.src && width > 0) {
        const size = width < 480 ? 'small' : width < 1024 ? 'medium' : 'large';
        img.src = img.dataset.src.replace('{size}', size);
        img.removeAttribute('data-src');
      }
    });
  });
  
  images.forEach(img => ro.observe(img));
}

// 使用场景 3：弹性布局
function observeFlexContainer() {
  const container = document.querySelector('.flex-container');
  
  new ResizeObserver((entries) => {
    entries.forEach(entry => {
      const { width } = entry.contentRect;
      
      // 根据容器宽度调整子项布局
      if (width < 600) {
        container.style.flexDirection = 'column';
      } else {
        container.style.flexDirection = 'row';
      }
    });
  }).observe(container);
}

// 使用场景 4：检测元素是否可见
function observeVisibility() {
  const el = document.querySelector('#target');
  
  new ResizeObserver((entries) => {
    entries.forEach(entry => {
      const rect = entry.contentRect;
      const isVisible = rect.width > 0 && rect.height > 0;
      
      if (isVisible) {
        console.log('元素可见');
        // 开始动画、加载数据等
      } else {
        console.log('元素隐藏');
        // 暂停动画、释放资源等
      }
    });
  }).observe(el);
}

// 与其他 Observer 对比
// IntersectionObserver: 检测元素是否在视口中
// ResizeObserver: 检测元素尺寸变化
// MutationObserver: 检测 DOM 结构变化

// 综合使用示例
class ResponsiveComponent {
  constructor(el) {
    this.el = el;
    this.size = { width: 0, height: 0 };
    this.visible = false;
    
    this.initObservers();
  }
  
  initObservers() {
    // 监听尺寸
    this.ro = new ResizeObserver((entries) => {
      this.size = entries[0].contentRect;
      this.onResize();
    });
    
    // 监听可见性
    this.io = new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;
      this.onVisibilityChange();
    });
    
    this.ro.observe(this.el);
    this.io.observe(this.el);
  }
  
  onResize() {
    console.log(`尺寸：${this.size.width} x ${this.size.height}`);
    // 响应式处理
  }
  
  onVisibilityChange() {
    console.log(`可见性：${this.visible}`);
    if (this.visible) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }
  
  startAnimation() {}
  stopAnimation() {}
  
  destroy() {
    this.ro.disconnect();
    this.io.disconnect();
  }
}
```

---

### Q19: 要实时统计用户浏览器窗口大小，该如何做

**A:**

```javascript
// 方法 1：resize 事件（基础方案）
let resizeTimeout = null;

window.addEventListener('resize', () => {
  // 防抖处理
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    console.log('窗口尺寸:', {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    });
  }, 100);
});

// 方法 2：ResizeObserver（推荐，监听 documentElement）
const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    console.log('视口尺寸:', {
      width: entry.contentRect.width,
      height: entry.contentRect.height
    });
  }
});

ro.observe(document.documentElement);

// 方法 3：封装为 Hook（React）
function useWindowSize() {
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  React.useEffect(() => {
    const handler = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // 防抖
    let timeout;
    const debouncedHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handler, 100);
    };
    
    window.addEventListener('resize', debouncedHandler);
    return () => {
      window.removeEventListener('resize', debouncedHandler);
      clearTimeout(timeout);
    };
  }, []);
  
  return size;
}

// 使用：
// const { width, height } = useWindowSize();

// 方法 4：封装为 Vue Composable
function useWindowSize() {
  const size = ref({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  onMounted(() => {
    let timeout;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        size.value = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }, 100);
    };
    
    window.addEventListener('resize', handler);
    onUnmounted(() => {
      window.removeEventListener('resize', handler);
    });
  });
  
  return size;
}

// 方法 5：媒体查询监听
const mql = window.matchMedia('(max-width: 768px)');

mql.addEventListener('change', (e) => {
  if (e.matches) {
    console.log('切换到移动端布局');
  } else {
    console.log('切换到桌面端布局');
  }
});

// 方法 6：完整的窗口监控类
class WindowMonitor {
  constructor(options = {}) {
    this.options = {
      debounce: options.debounce || 100,
      onResize: options.onResize || (() => {})
    };
    
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      wide: 1440
    };
    
    this.init();
  }
  
  init() {
    let timeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.update();
      }, this.options.debounce);
    });
    
    // 初始获取
    this.update();
  }
  
  update() {
    const prevSize = { ...this.size };
    
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
    
    // 判断设备类型
    this.size.device = this.getDeviceType();
    
    // 触发回调
    this.options.onResize(this.size, prevSize);
  }
  
  getDeviceType() {
    const w = this.size.width;
    if (w <= this.breakpoints.mobile) return 'mobile';
    if (w <= this.breakpoints.tablet) return 'tablet';
    if (w <= this.breakpoints.desktop) return 'desktop';
    return 'wide';
  }
  
  // 获取屏幕信息
  getScreenInfo() {
    return {
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type
    };
  }
  
  // 获取视口信息
  getViewportInfo() {
    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      pageXOffset: window.pageXOffset,
      pageYOffset: window.pageYOffset
    };
  }
}

// 使用
const monitor = new WindowMonitor({
  onResize: (current, prev) => {
    console.log('窗口变化:', prev.width, '->', current.width);
  }
});
```

---

### Q20: 当项目报错，你想定位是哪个 commit 引入的错误的时，该怎么做

**A:**
使用 Git 的**二分查找**（`git bisect`）功能。

```bash
# 1. 开始二分查找
git bisect start

# 2. 标记当前版本（有 bug）
git bisect bad

# 3. 标记一个已知正常版本
git bisect good v1.0.0
# 或指定 commit hash
git bisect good abc1234

# 4. Git 会自动切换到中间 commit，让你测试
# 测试后告诉 Git 结果:
# 如果有 bug:
git bisect bad
# 如果正常:
git bisect good

# 5. 重复步骤 4，直到找到引入 bug 的 commit
# Git 会输出类似信息:
# xxxxxx is the first bad commit

# 6. 查看问题 commit 详情
git show

# 7. 结束二分查找
git bisect reset
# 回到原始分支
```

```javascript
**自动化二分查找**：
```bash
# 如果有自动化测试脚本
git bisect start
git bisect bad
git bisect good v1.0.0

# 运行测试脚本，自动判断
git bisect run ./test.sh

# test.sh 示例:
#!/bin/bash
npm test
# 返回 0 表示成功，1-127 表示失败

# 结束后查看结果
git bisect log > bisect-result.txt
git bisect reset
```

```javascript
**其他方法**：
```

```bash
# 方法 2：git log 查看历史
git log --oneline --since="2024-01-01" --until="2024-01-31"

# 方法 3：git blame 查看具体行的提交者
git blame src/file.js -L 100,120

# 方法 4：git log -p 查看改动的详细内容
git log -p -1 abc1234

# 方法 5：搜索特定的修改
git log -S "functionName" --oneline
# 查找添加或删除了特定字符串的 commit

# 方法 6：使用 git revert 撤销问题 commit
git revert abc1234
# 创建一个新的 commit 来撤销指定 commit

# 方法 7：查看两个版本差异
git diff v1.0.0 v1.1.0 --stat
```

---

### Q21: 如何移除一个指定的 commit

**A:**
**方法 1：git revert（推荐，安全）**
```bash
# 创建一个新的 commit 来撤销指定 commit
git revert <commit-hash>

# 撤销多个连续 commit
git revert HEAD~2..HEAD

# 撤销时不自动提交（可修改）
git revert -n <commit-hash>
git commit -m "撤销 xxx 提交"

# 优点：
# - 不会修改历史
# - 可追溯
# - 适合已推送到远程的 commit
```

```javascript
**方法 2：git reset（强制重置，危险）**
```bash
# 软重置：保留更改在暂存区
git reset --soft <commit-hash>

# 混合重置（默认）：保留更改在工作区
git reset --mixed <commit-hash>

# 硬重置：丢弃所有更改
git reset --hard <commit-hash>

# 回退到上一个 commit
git reset --hard HEAD~1

# ⚠️ 注意：如果已推送到远程，需要强制推送
git push origin <branch-name> --force

# 更安全的强制推送（如果远程有其他人提交会失败）
git push origin <branch-name> --force-with-lease
```

```javascript
**方法 3：git rebase -i（交互式变基，灵活）**
```bash
# 编辑最后 3 个 commit
git rebase -i HEAD~3

# 编辑器会打开，可以：
# - pick: 保留
drop: 删除
# - reword: 修改提交信息
# - edit: 暂停修改
# - squash: 合并到上一个 commit
# - fixup: 合并并丢弃提交信息

# 示例：删除某个 commit
# 修改前:
# pick abc1234 功能 A
# pick def5678 功能 B
# pick ghi9012 功能 C

# 修改后（删除功能 B）:
# pick abc1234 功能 A
# drop def5678 功能 B
# pick ghi9012 功能 C

# 保存退出后，Git 会重新组织 commit 历史

# 如果已推送到远程
git push origin <branch-name> --force-with-lease
```

```javascript
**方法对比**：
```

| 方法 | 适用场景 | 是否修改历史 | 风险 |
|------|----------|--------------|------|
| `git revert` | 已推送的公开 commit | 否（新增 commit） | 低 |
| `git reset` | 本地未推送的 commit | 是 | 中 |
| `git rebase -i` | 整理本地 commit 历史 | 是 | 中 |

```javascript
**最佳实践**：
```bash
# 1. 创建备份分支
git branch backup-branch

# 2. 使用 revert 撤销公开 commit
git revert <commit-hash>

# 3. 如果一定要修改历史（仅限本地或未同步分支）
git rebase -i HEAD~5

# 4. 恢复误操作
# 查看所有操作历史
git reflog

# 恢复到之前的状态
git reset --hard HEAD@{5}
```

---

## 💡 参考答案提示

```javascript
**Q1 判断用户设备：** `navigator.userAgent` 检测、媒体查询、现代API如 `navigator.userAgentData`

**Q3 sendBeacon：** 用于在页面卸载时可靠地发送HTTP请求，不会阻塞页面关闭，适合埋点数据上报

**Q5 退出前发送埋点：** `beforeunload`/`unload` + `sendBeacon` 或 `fetch` keepalive

**Q6 Long Task：** `PerformanceObserver` 监听 `longtask` 类型，阈值50ms以上

**Q9 页签活跃状态：** `document.visibilityState`、`visibilitychange` 事件

**Q12 页面关闭执行：** `beforeunload`、`unload`、`pagehide` 事件，或使用 `sendBeacon`

**Q14 展开收起：** `-webkit-line-clamp` + `max-height` 过渡动画，配合计算实际高度

**Q15 鼠标拖拽：** `mousedown`/`mousemove`/`mouseup` 事件，计算偏移量更新位置

**Q17 防止重复请求：** 请求锁、防抖节流、取消令牌（AbortController）、loading状态

**Q18 ResizeObserver：** 监听元素尺寸变化，比 `window.resize` 更精确，支持任意元素

**Q21 移除commit：** `git revert`（推荐，生成新commit）、`git reset --hard`（强制重置）、`git rebase -i`（交互式变基）
```
