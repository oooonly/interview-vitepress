# 前端面试八股文 + 回答模板

> 背就完事儿了

---

## 一、自我介绍

**模板：**
> 面试官好，我叫XXX，前端开发工程师，X年工作经验。
>
> 最近一份工作在XXX公司，主要负责XXX项目的开发，使用Vue/React + TypeScript技术栈。
>
> 之前在XXX公司做过，接触过XXX技术。
>
> 离职原因：个人发展考虑，想XXX（不要说裁员、工资低、加班多）

---

## 二、Vue 常见问题

### 1. Vue2 和 Vue3 区别

> Vue2 用 Object.defineProperty 实现响应式，Vue3 用 Proxy。
> Proxy 可以监听对象属性的新增和删除不用像 Vue2 那样Vue.set，而且数组下标变化也能监听到。
> Vue3 推出了 Composition API，把逻辑抽离出来更方便复用，代码组织更清晰。
> 另外 Vue3 体积更小，性能更好，TypeScript 支持也更完善。

### 2. Vue 响应式原理

> Vue2：基于 Object.defineProperty，对 data 中的每个属性劫持，属性变化时通知更新。
> 缺点：新增属性监听不到、数组方法无法监听（Vue2 替换了数组的7个方法）。
> Vue3：基于 Proxy，直接代理整个对象，属性新增删除都能监听到，性能也更好。

### 3. computed 和 watch 区别

> computed 是计算属性，依赖其他响应式数据变化而变化，有缓存，只有依赖变化才重新计算。适合做筛选、汇总。
> watch 是监听器，监听某个数据变化后执行异步操作或复杂逻辑，没有缓存。适合做防抖、ajax请求、页面跳转。

### 4. Vue 组件通信方式

> 1. props / $emit：父子组件通信
> 2. $refs：父调子方法
> 3. $parent / $children：父子直接通信
> 4. provide / inject：祖先给后代传值
> 5. $bus：兄弟或任意组件间通信（事件总线）
> 6. Vuex / Pinia：全局状态管理
> 7. attrs / listeners：透传

### 5. Vue 生命周期

> - beforeCreate：实例刚创建，还不能访问 data
> - created：data 和 methods 已初始化，可以发ajax
> - beforeMount：模板编译完成，虚拟DOM生成
> - mounted：真实DOM挂载完成，可以操作DOM
> - beforeUpdate：数据更新前，虚拟DOM重新渲染前
> - updated：数据更新后
> - beforeDestroy：实例销毁前，可以清理定时器、解绑事件
> - destroyed：实例销毁后

> Vue3 改成了 setup()、onMounted() 这些，beforeCreate 和 created 被 setup 替代。

---

## 三、React 常见问题

### 1. React Hooks 有哪些

> useState：状态管理
> useEffect：副作用（发请求、订阅、定时器）
> useMemo：计算属性，有缓存, 主要用于缓存引用类型对象/数组
> useCallback：缓存函数
> useRef：获取DOM、存不需要触发渲染的值
> useContext：跨组件传值
> useReducer：状态管理（比useState复杂）
> useLayoutEffect：DOM更新后同步执行（少见）

### 2. useEffect 依赖项怎么理解

> 依赖项是一个数组。为空 [] 时只在组件首次渲染后执行一次，相当于 componentDidMount。
> 有依赖项时，比如 [count]，每次 count 变化都会重新执行 effect。
> 如果不写依赖项，每次渲染都执行。
> return 返回的函数在组件卸载或下一次 effect 执行前调用，相当于 componentWillUnmount。

### 3. React 渲染优化

> 1. React.memo：组件 memo 一下，props 不变不重渲染
> 2. useMemo / useCallback：缓存值和函数，减少不必要的计算和渲染
> 3. 虚拟列表：长列表用 react-window 这种
> 4. 合理拆分组件：避免父组件状态变化导致子组件全挂
> 5. 生产模式：开发模式下 React 会多渲染一次检查问题

### 4. setState 是同步还是异步

> 正常情况下是异步的，React 会把多次 setState 合并成一次，提升性能。
> 在 setTimeout、原生事件回调里是同步的，能拿到最新值。
> Vue2 里是同步的。

---

## 四、性能优化

### 1. 前端性能优化手段

> **加载阶段：**
> - CDN 加速
> - 代码分割、懒加载（import()）
> - Tree Shaking 去掉无用代码
> - 图片压缩、webp、懒加载
> - 减少请求数（合并CSS/JS、SSR）
>
> **渲染阶段：**
> - 减少重排重绘
> - 虚拟列表
> - 合理使用 computed / useMemo
> - 节流防抖
> - 骨架屏/loading
>
> **接口层面：**
> - 分页、虚拟滚动减少单次数据量
> - 接口缓存
> - Gzip 压缩

### 2. CDN 是什么

> Content Delivery Network，内容分发网络。
> 把静态资源放到离用户最近的服务器上，用户访问时直接从最近的节点拉取，减少延迟，提升加载速度。

---

## 五、项目相关（必问）

### 1. 做过最难的需求是什么

> 选一个你能吹的，比如：
> - "学习地图的角色模型模块，后端一开始说做不了，我调研了3天，最后用前端配置化方案解决了"
> - "热线工单的实时推送，用WebSocket连轴转调试了一周"
> - "中鑫之宝那个进销存系统，光是采购和调拨的逻辑就搞了半个多月"

### 2. 遇到最大的Bug怎么解决的

> "线上有个工单列表页面白屏，我查了日志发现接口返回了null，后来定位是后端某条数据缺了字段，我加了空值判断处理了。后来我封装了一个通用空值处理组件，类似情况再也没出现过。"

### 3. 怎么跟后端接口对接的

> "一般先看后端给的接口文档，确认请求参数和返回数据结构。如果文档不全就直接找后端对齐。前端用 axios 封装一层统一的请求拦截器和响应拦截器，统一处理loading、错误提示、鉴权。接口联调阶段面对面或者用钉钉沟通，改完让后端重测。"

---

## 六、开放性问题

### 1. 优点和缺点

**优点：**
> "我动手能力比较强，遇到问题喜欢自己先钻研透。之前做一个项目时，遇到框架选型问题，我调研了3天最后选了对公司最合适的方案。另外我解决问题的能力也可以，之前线上出Bug我能快速定位。"

**缺点（要圆回来）：**
> "我性格偏内向，私下不太会来事儿，但工作上的沟通没问题，需要对接需求我会主动找产品和后端同步，私下只是话少而已。"

### 2. 为什么离职

> "离职原因主要是有更大的发展诉求吧，上家公司业务比较稳定了，我想接触更大的项目和技术挑战。"

> 千万别说：裁员、工资低、领导傻X、加班多

### 3. 你的职业规划

> "短期1-2年想深耕前端技术栈，在Vue/React基础上更精通，能独立负责复杂项目。长期3-5年想往技术专家或者前端负责人方向发展，带团队做更大规模的项目。"

### 4. 你有什么想问我的

> "想了解一下团队的前端技术栈和规模？这个岗位主要负责什么业务？是新项目还是维护老项目？团队的技术氛围怎么样，有技术分享吗？"

> 别问：工资、加班、几点下班、有没有零食

---

## 七、手写代码（常考）

### 1. 数组去重

```js
[...new Set([1,2,2,3,3,3])]
```

### 2. 防抖

```js
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
}
```

### 3. 节流

```js
function throttle(fn, delay) {
  let flag = true;
  return function(...args) {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  }
}
```

### 4. 深拷贝

```js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}
```

### 5. Promise.all

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new Error('参数必须是数组'));
    let count = 0;
    const result = [];
    promises.forEach((p, index) => {
      Promise.resolve(p).then(res => {
        result[index] = res;
        count++;
        if (count === promises.length) resolve(result);
      }, reject);
    });
  });
}
```

---

## 八、反问环节

面试官问"你有什么要问我的"，这时候你得表现积极。

**推荐问：**
> 1. "团队前端目前的技术栈是什么？"
> 2. "这个岗位主要负责什么业务？新项目还是维护？"
> 3. "团队规模多大？有技术分享吗？"
> 4. "公司有内部培训或晋升机制吗？"
> 5. "如果我有幸加入，先会负责什么工作？"

**别问：**
> - "工资多少"（一面不问，等HR问）
> - "几点下班"（显得你没事业心）
> - "有年终奖吗"（太早了）
> - "你们公司做什么的"（面试前自己查）

---

*背就完事儿了，面多了就熟练了。*