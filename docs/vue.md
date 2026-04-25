# Vue 面试题

## 1. 什么是虚拟 DOM？如何实现一个虚拟 DOM？说说你的思路

**答：**

**虚拟 DOM (Virtual DOM)** 是用 JavaScript 对象来描述真实 DOM 结构的轻量级表示。

**实现思路**：

```javascript
// 1. 创建虚拟节点函数
function h(tag, props, children) {
  return { tag, props, children };
}

// 2. 渲染虚拟 DOM 到真实 DOM
function render(vnode, container) {
  const el = document.createElement(vnode.tag);
  
  // 设置属性
  if (vnode.props) {
    Object.entries(vnode.props).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  
  // 处理子节点
  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children;
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => render(child, el));
  }
  
  container.appendChild(el);
  return el;
}

// 3. Diff 算法比较新旧虚拟 DOM
function diff(oldVnode, newVnode) {
  // 比较标签类型
  if (oldVnode.tag !== newVnode.tag) {
    return { type: 'REPLACE', newVnode };
  }
  
  // 比较文本
  if (typeof oldVnode.children === 'string' && 
      typeof newVnode.children === 'string' &&
      oldVnode.children !== newVnode.children) {
    return { type: 'TEXT', content: newVnode.children };
  }
  
  // 比较子节点
  const patches = [];
  const maxLen = Math.max(oldVnode.children?.length || 0, newVnode.children?.length || 0);
  for (let i = 0; i < maxLen; i++) {
    const patch = diff(oldVnode.children?.[i], newVnode.children?.[i]);
    if (patch) patches.push({ index: i, patch });
  }
  
  return patches.length > 0 ? { type: 'CHILDREN', patches } : null;
}
```

---

## 2. 说说你对 Vue 中 keep-alive 的理解

**答：**

**keep-alive** 是 Vue 的内置组件，用于缓存动态组件，避免重复渲染。

**主要属性**：

- `include`：名称匹配的组件会被缓存
- `exclude`：名称匹配的组件不会被缓存
- `max`：最多缓存多少个组件实例

**生命周期钩子**：

- `activated`：组件被激活时调用
- `deactivated`：组件被停用时调用

**使用场景**：

- 标签页切换
- 列表页和详情页的切换
- 需要保留状态的组件

```vue
<keep-alive :include="['Home', 'User']" :max="10">
  <component :is="currentComponent" />
</keep-alive>
```

---

## 3. Vue.observable 是什么？

**答：**

**Vue.observable** 让一个对象变成响应式的，可以直接用于状态管理。

```javascript
// Vue 2.x
import Vue from 'vue';
const state = Vue.observable({ count: 0 });

// Vue 3.x
import { reactive } from 'vue';
const state = reactive({ count: 0 });

// 使用
export default {
  computed: {
    count() {
      return state.count;
    }
  },
  methods: {
    increment() {
      state.count++;
    }
  }
};
```

**适用场景**：

- 简单的跨组件状态共享
- 轻量级的状态管理方案
- 不需要 Vuex 的复杂场景

---

## 4. 说说你对 slot 的理解？slot 使用场景有哪些？

**答：**

**Slot（插槽）** 让组件的内容可以自定义，实现内容分发。

**类型**：

1. **默认插槽**：无 name 属性的插槽
2. **具名插槽**：通过 name 属性命名
3. **作用域插槽**：向父组件传递数据

```vue
<!-- 子组件 -->
<template>
  <div>
    <slot>默认内容</slot>
    <slot name="header"></slot>
    <slot :user="user" name="footer"></slot>
  </div>
</template>

<!-- 父组件 -->
<my-component>
  <template #default>内容</template>
  <template #header>头部</template>
  <template #footer="{ user }">{{ user.name }}</template>
</my-component>
```

**使用场景**：

- 布局组件（头部、内容、底部）
- 列表组件自定义渲染
- 封装通用组件库

---

## 5. 说说你对 Vue 的 mixin 的理解，以及有哪些应用场景？

**答：**

**Mixin** 是 Vue 中复用组件逻辑的方式，将多个组件共用的选项抽取出来。

```javascript
// 定义 mixin
export const myMixin = {
  data() {
    return { mixinData: '来自 mixin' };
  },
  created() {
    console.log('mixin created');
  },
  methods: {
    mixinMethod() {
      return 'mixin method';
    }
  }
};

// 使用 mixin
export default {
  mixins: [myMixin],
  created() {
    console.log(this.mixinData); // '来自 mixin'
    this.mixinMethod();
  }
};
```

**合并策略**：

- 数据对象：递归合并，组件数据优先
- 生命周期钩子：全部调用，mixin 先执行
- 方法/计算属性等：组件覆盖 mixin

**使用场景**：

- 多个组件共享相同逻辑
- 封装通用功能（如 loading、分页等）
- Vue 2.x 中复用代码

**Vue 3 推荐**：使用 Composition API 的 `setup` 或 Composable 函数替代 mixin。

---

## 6. Vue 中的 $nextTick 有什么作用？

**答：**

**$nextTick** 在下次 DOM 更新循环结束后执行回调。

```javascript
// 修改数据
this.message = 'Hello';

// DOM 还未更新
console.log(this.$refs.msg.innerText); // 旧值

// 使用 $nextTick
this.$nextTick(() => {
  // DOM 已更新
  console.log(this.$refs.msg.innerText); // 'Hello'
});

// 或使用 async/await
await this.$nextTick();
```

**使用场景**：

- 修改数据后需要操作更新后的 DOM
- 获取元素新的尺寸或位置
- 确保 DOM 更新完成后再执行操作

---

## 7. Vue 组件间通信方式都有哪些？

**答：**

| 方式 | 适用场景 | 示例 |
|------|----------|------|
| **Props/$emit** | 父子组件 | `props: ['msg']` / `this.$emit('event')` |
| **$refs** | 父组件直接调用子组件方法 | `this.$refs.child.method()` |
| **$parent/$children** | 直接访问父子实例 | `this.$parent.data` |
| **Provide/Inject** | 跨层级组件 | `provide: {key: value}` / `inject: ['key']` |
| **EventBus** | 任意组件间（Vue 2） | `new Vue()` 作为中央事件总线 |
| **Vuex/Pinia** | 全局状态管理 | `store.state` / `store.commit()` |
| **$attrs/$listeners** | 隔代传参（Vue 2） | `v-bind="$attrs"` |
| **Mitt** | 事件总线（Vue 3） | `mitt.emit()` / `mitt.on()` |

---

## 8. Vue 中组件和插件有什么区别？

**答：**

| 特性 | 组件 (Component) | 插件 (Plugin) |
|------|------------------|---------------|
| 目的 | 构建 UI 界面 | 扩展 Vue 功能 |
| 注册方式 | 局部或全局注册 | `Vue.use()` 安装 |
| 功能范围 | 模板、逻辑、样式 | 添加全局方法、指令、混入等 |
| 使用方式 | `<my-component />` | 调用全局方法或功能 |

**插件示例**：

```javascript
const MyPlugin = {
  install(Vue, options) {
    // 添加全局方法
    Vue.prototype.$myMethod = () => {};
    
    // 添加全局指令
    Vue.directive('focus', {...});
    
    // 添加全局混入
    Vue.mixin({...});
  }
};

Vue.use(MyPlugin);
```

---

## 9. 为什么 Vue 中的 data 属性是一个函数而不是一个对象？

**答：**

组件会被多次实例化，如果 data 是对象，所有实例会共享同一个数据对象。

```javascript
// ❌ 错误：所有实例共享同一个 data 对象
data: {
  count: 0
}

// ✅ 正确：每个实例有自己的数据对象
data() {
  return {
    count: 0
  };
}
```

**原因**：

- 函数返回新对象，保证组件实例的数据独立性
- 避免多个组件实例之间的数据污染
- 根实例可以使用对象（只实例化一次）

---

## 10. 说说你对 Vue 生命周期的理解

**答：**

**Vue 2 生命周期**：
- 创建阶段：beforeCreate → created
- 挂载阶段：beforeMount → mounted
- 更新阶段：beforeUpdate → updated
- 销毁阶段：beforeDestroy → destroyed

**Vue 3 生命周期**：
- 创建阶段：setup()
- 挂载阶段：onBeforeMount → onMounted
- 更新阶段：onBeforeUpdate → onUpdated
- 卸载阶段：onBeforeUnmount → onUnmounted

**常用钩子**：

- `created`：数据已初始化，可访问 data、methods
- `mounted`：DOM 已挂载，可操作 DOM
- `beforeDestroy`/`onBeforeUnmount`：清理工作（定时器、事件监听等）

---

## 11. Vue 实例挂载的过程中发生了什么？

**答：**

1. **new Vue()**：初始化生命周期、事件、渲染函数
2. **beforeCreate**：初始化数据观测和事件系统之前
3. **created**：数据观测完成，可访问 data、computed、methods
4. **模板编译**：将 template 编译为 render 函数
5. **beforeMount**：开始挂载之前
6. **创建虚拟 DOM**：执行 render 函数生成 vnode
7. **创建真实 DOM**：调用 patch 方法创建 DOM 并插入
8. **mounted**：挂载完成，DOM 可操作

---

## 12. 谈谈对 Vue 中双向绑定的理解

**答：**

**双向绑定 = 数据到视图 + 视图到数据**

**实现原理**：

- **Vue 2**：使用 `Object.defineProperty()` 劫持数据属性的 getter/setter
- **Vue 3**：使用 `Proxy` 代理整个对象

**视图到数据**：

- `v-model` 是语法糖
- `@input` + `:value` 的组合
- 监听输入事件更新数据

```html
<!-- v-model 等价于 -->
<input v-model="msg">
<input :value="msg" @input="msg = $event.target.value">
```

---

## 13. Vue 模板是如何编译的

**答：**

**编译过程**：

1. **解析 (Parse)**：将模板字符串解析为 AST（抽象语法树）
2. **优化 (Optimize)**：标记静态节点，提升渲染性能
3. **代码生成 (Generate)**：将 AST 转换为 render 函数

```javascript
// 模板
<div id="app">{{ msg }}</div>

// 编译后的 render 函数
function render() {
  with(this) {
    return _c('div', { attrs: { "id": "app" } }, [_v(_s(msg))]);
  }
}
```

**运行时编译**：开发时使用完整版 Vue，包含编译器

**预编译**：生产环境使用运行时版本，构建时编译模板

---

## 14. 说说 Vue 中 CSS scoped 的原理

**答：**

**原理**：通过为组件元素添加唯一的 data 属性，CSS 选择器添加对应的属性选择器，实现样式隔离。

```vue
<style scoped>
.title { color: red; }
</style>

<!-- 编译后 -->
<div data-v-f3f3eg9 class="title"></div>

<style>
.title[data-v-f3f3eg9] { color: red; }
</style>
```

**深度选择器**：

- Vue 2：`/deep/` 或 `>>>` 或 `::v-deep`
- Vue 3：`:deep()` 或 `::v-deep()`

---

## 15. 说说你对渐进式框架的理解

**答：**

**渐进式框架**：从简单到复杂，逐步采用。

**Vue 的渐进式**：

1. **核心库**：声明式渲染、组件系统
2. **构建工具**：Vue CLI、Vite
3. **路由**：Vue Router
4. **状态管理**：Vuex / Pinia
5. **服务端渲染**：Nuxt.js
6. **移动端**：Weex、uni-app

**特点**：

- 可以作为库使用（CDN 引入）
- 可以作为框架使用（完整工具链）
- 按需引入功能，灵活选择技术栈

---

## 16. Vue 中的 v-show 和 v-if 有什么区别

**答：**

| 特性 | `v-show` | `v-if` |
|------|----------|--------|
| 渲染方式 | 始终渲染，切换 display | 条件为真时才渲染 |
| 切换开销 | 小（CSS 切换） | 大（DOM 增删） |
| 初始开销 | 大（始终渲染） | 小（按需渲染） |
| 适用场景 | 频繁切换 | 条件很少改变 |
| 与 template | 不能使用 | 可以使用 |

---

## 17. Vue 3.0 里为什么要用 Proxy API 替代 defineProperty API？

**答：**

**defineProperty 的缺陷**：

- 只能劫持已存在的属性，新增属性需要 `Vue.set`
- 无法监听数组索引和长度的变化
- 需要遍历对象属性逐个劫持

**Proxy 的优势**：

- 可以代理整个对象，拦截更多操作（get、set、has、deleteProperty 等）
- 可以监听动态新增的属性
- 可以监听数组的变化
- 性能更好（不需要递归遍历）

```javascript
// Proxy 实现响应式
const reactive = (obj) => {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key); // 依赖收集
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key); // 触发更新
      return true;
    }
  });
};
```

---

## 18. SSR 是什么？Vue 中怎么实现？

**答：**

**SSR (Server-Side Rendering，服务端渲染)**：在服务器端渲染 Vue 组件为 HTML 字符串，发送给浏览器。

**实现方式**：

1. **Nuxt.js**：基于 Vue 的 SSR 框架
2. **Vue SSR 指南**：手动搭建 SSR 应用
3. **Quasar Framework**：支持 SSR 的 Vue 框架

**优点**：

- SEO 友好
- 首屏加载快
- 更好的用户体验

**缺点**：

- 服务器压力增加
- 开发复杂度提高
- 需要考虑 hydration（注水）

---

## 19. Vue 的祖孙组件的通信方案有哪些？

**答：**

1. **Provide/Inject**：官方推荐方案

```javascript
// 祖先组件
export default {
  provide() {
    return { getMap: this.getMap };
  }
};

// 子孙组件
export default {
  inject: ['getMap']
};
```

2. **Vuex/Pinia**：全局状态管理

3. **EventBus / Mitt**：事件总线

4. **$attrs/$listeners + inheritAttrs**：逐层传递

5. **Ref 链**：通过 ref 逐级访问（不推荐）

---

## 20. 如何打破 scope 对样式隔离的限制？

**答：**

```vue
<style scoped>
/* Vue 2 - 深度选择器 */
.parent /deep/ .child { }
.parent >>> .child { }
.parent ::v-deep .child { }

/* Vue 3 - 深度选择器 */
:deep(.child) { }
::v-deep(.child) { }

/* 全局样式 */
:global(.global-class) { }
</style>
```

**注意事项**：

- 深度选择器会影响性能
- 尽量避免滥用，破坏组件封装
- 考虑使用 CSS 变量或 props 传递样式

---

## 21. Scoped Styles 为什么可以实现样式隔离？

**答：**

**原理**：

1. Vue 编译时为组件根元素添加唯一的 `data-v-xxxxxx` 属性
2. 为 CSS 选择器添加对应的属性选择器 `[data-v-xxxxxx]`
3. 组件内的样式只作用于带有相同 data 属性的元素

**编译前**：

```vue
<style scoped>
.app { color: red; }
</style>
<div class="app">App</div>
```

**编译后**：

```html
<div class="app" data-v-7ba5bd90>App</div>
<style>
.app[data-v-7ba5bd90] { color: red; }
</style>
```

---

## 22. Vue 中给对象添加新属性时，界面不刷新怎么办？

**答：**

**Vue 2**：

```javascript
// 响应式添加属性
Vue.set(this.obj, 'newProp', value);
// 或
this.$set(this.obj, 'newProp', value);

// 响应式删除属性
Vue.delete(this.obj, 'prop');
```

**Vue 3**：

```javascript
// Proxy 自动处理，直接赋值即可
this.obj.newProp = value;

// 或使用 reactive
import { reactive, set } from 'vue';
const state = reactive({ obj: {} });
state.obj.newProp = value; // 自动响应
```

**最佳实践**：

- Vue 2：在 data 中预先声明所有属性
- Vue 3：使用 Proxy，无此问题

---

## 23. Vue 3 有了解过吗？能说说跟 Vue 2 的区别吗？

**答：**

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式 | Object.defineProperty | Proxy |
| 性能 | 一般 | 提升 1.3~2 倍，Tree-shaking |
| 代码组织 | Options API | Options API + Composition API |
| TypeScript | 支持一般 | 完全重写，TS 支持更好 |
| 多根节点 | 不支持 | 支持 (Fragments) |
| Teleport | 无 | 内置组件 |
| Suspense | 无 | 内置支持 |
| 全局 API | Vue.xxx | app.xxx |
| 生命周期 | beforeDestroy | beforeUnmount |
| 自定义渲染器 | 不支持 | 支持 |
| 包体积 | ~23KB | ~10KB（运行时） |

**Composition API 优势**：

- 更好的逻辑复用
- 更好的类型推断
- 更好的代码组织（按功能而非选项）