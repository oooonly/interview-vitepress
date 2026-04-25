# React 面试题

> 📄 来源图片：react.jpeg  
> 🕐 解析时间：2025-01-13

---

## 📋 面试题目

### Q1: Fiber 为什么是 React 性能的一个飞跃？

**A:**
**Fiber 是 React 16 引入的新协调引擎**，解决了 React 15 的同步递归渲染问题。

**React 15 的问题**：
- 采用递归遍历虚拟 DOM，同步执行
- 大型应用更新时会长时间阻塞主线程
- 动画卡顿、输入响应延迟

**Fiber 的核心改进**：

1. **可中断的异步渲染**：
   - 将渲染工作拆分成小单元（Fiber 节点）
   - 可以暂停、恢复、中断渲染
   - 让出主线程给高优先级任务（用户输入）

2. **优先级调度**：
```javascript
// 优先级从高到低
- ImmediatePriority    // 立即执行（用户输入）
- UserBlockingPriority // 用户阻塞（点击、滚动）
- NormalPriority       // 正常（数据获取）
- LowPriority          // 低优先级（分析）
- IdlePriority         // 空闲（预加载）
```

3. **增量渲染**：
   - 利用 requestIdleCallback（后改为 Scheduler）
   - 在浏览器空闲时执行低优先级任务
   - 保证动画流畅（60fps）

4. **双缓冲技术**：
   - current tree：当前显示的树
   - workInProgress tree：正在构建的树
   - 完成后一次性切换，避免中间状态闪烁

5. **更好的错误处理**：
   - 引入错误边界（Error Boundary）
   - 组件级错误隔离

**数据结构**：
```javascript
// Fiber 节点简化结构
{
  type: 'div',           // 组件类型
  key: null,             // key
  props: {},             // 属性
  
  // 链表结构（替代递归）
  child: Fiber | null,   // 第一个子节点
  sibling: Fiber | null, // 下一个兄弟节点
  return: Fiber | null,  // 父节点
  
  // 状态
  memoizedState: any,    // Hooks 链表
  effectTag: number,     // 副作用标记
  nextEffect: Fiber,     // 副作用链表
}
```

---

### Q2: setState 是同步，还是异步的？

**A:**
**答案：取决于执行上下文**。

**1. 合成事件和生命周期中（异步/批量更新）**：
```javascript
class Example extends React.Component {
  state = { count: 0 };
  
  handleClick = () => {
    console.log(this.state.count); // 0
    this.setState({ count: 1 });
    console.log(this.state.count); // 0（还是旧值）
    this.setState({ count: 2 });
    console.log(this.state.count); // 0（还是旧值）
    // React 会合并这两次 setState，只触发一次更新
  };
  
  componentDidMount() {
    // 这里也是异步批量更新
  }
}
```

**2. setTimeout、setInterval、原生事件中（同步）**：
```javascript
handleClick = () => {
  setTimeout(() => {
    console.log(this.state.count); // 0
    this.setState({ count: 1 });
    console.log(this.state.count); // 1（立即更新）
  }, 0);
};

// 原生事件
componentDidMount() {
  document.getElementById('btn').addEventListener('click', () => {
    this.setState({ count: 1 });
    console.log(this.state.count); // 1（同步）
  });
}
```

**React 18 的变化**：
- 引入自动批处理（Automatic Batching）
- 即使在 setTimeout、Promise、原生事件中也默认批量更新
- 可以使用 `flushSync` 强制同步更新：
```javascript
import { flushSync } from 'react-dom';

handleClick = () => {
  flushSync(() => {
    this.setState({ count: 1 });
  });
  console.log(this.state.count); // 1（同步更新完成）
};
```

**原理**：
- React 通过 `isBatchingUpdates` 标志位控制
- 合成事件/生命周期中设为 true，走批量更新
- setTimeout/原生事件中为 false，立即更新
- React 18 使用 Scheduler 统一调度，默认都走批量

---

### Q3: 简述下 React 的事件代理机制？

**A:**
**React 使用事件委托（Event Delegation）机制**，将所有事件绑定到根容器。

**原理**：

1. **事件绑定**：
   - React 不会在每个 DOM 元素上绑定事件
   - 所有事件统一绑定到 `document`（React 17+）或 `ReactDOM.render` 的容器
   - 减少内存占用，提高性能

2. **合成事件（SyntheticEvent）**：
```javascript
// React 封装的原生事件对象
const syntheticEvent = {
  nativeEvent,      // 原生事件对象
  type: 'click',    // 事件类型
  target,           // 事件目标
  currentTarget,    // 当前目标
  preventDefault,   // 阻止默认行为
  stopPropagation,  // 阻止冒泡
  persist,          // 持久化事件（异步使用）
};
```

3. **事件冒泡与捕获**：
```jsx
`<div onClickCapture={() =>` console.log('capture')} 
     onClick={() => console.log('bubble')}>
  `<button onClick={() =>` console.log('button')}>
    Click
  </button>
</div>
// 输出：capture → button → bubble
```

4. **事件池（React 17 已移除）**：
   - React 16 及之前，合成事件对象会被复用
   - 异步访问需要调用 `event.persist()`
   - React 17 取消了事件池机制

**优势**：
- 减少内存占用（不需要每个元素都绑定事件）
- 统一的事件处理接口（跨浏览器兼容）
- 方便事件管理和清理

**与原生事件的区别**：
```javascript
// 原生事件阻止冒泡
document.addEventListener('click', () => console.log('document'));

`<div onClick={(e) =>` {
  e.stopPropagation(); // 只阻止 React 合成事件的冒泡
  // 原生 document 的 click 事件仍会触发
}}>
  `<button>`Click</button>
</div>

// 需要同时阻止原生冒泡
e.nativeEvent.stopImmediatePropagation();
```

---

### Q4: 简述下 React 的生命周期？每个生命周期都做了什么？

**A:**
**React 16.3+ 生命周期（类组件）**：

**挂载阶段（Mounting）**：
constructor → getDerivedStateFromProps → render → componentDidMount

1. **constructor**：
   - 初始化 state
   - 绑定方法 this
```javascript
constructor(props) {
  super(props);
  this.state = { count: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

2. **static getDerivedStateFromProps(props, state)**：
   - 从 props 派生 state（少用）
   - 返回对象更新 state，返回 null 不更新
   - 每次渲染前都会调用

3. **render**：
   - 返回 JSX
   - 纯函数，不应有副作用

4. **componentDidMount**：
   - DOM 已挂载
   - 发起网络请求、订阅事件、操作 DOM

**更新阶段（Updating）**：
getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate

5. **shouldComponentUpdate(nextProps, nextState)**：
   - 性能优化，决定是否重新渲染
   - 返回 false 跳过更新
```javascript
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

6. **getSnapshotBeforeUpdate(prevProps, prevState)**：
   - DOM 更新前调用
   - 获取更新前的 DOM 信息（如滚动位置）
   - 返回值传给 componentDidUpdate

7. **componentDidUpdate(prevProps, prevState, snapshot)**：
   - DOM 更新后调用
   - 可进行 DOM 操作或网络请求（需判断条件避免死循环）

**卸载阶段（Unmounting）**：

8. **componentWillUnmount**：
   - 清理工作：取消订阅、清除定时器、取消网络请求

**错误处理（Error Handling）**：

9. **static getDerivedStateFromError(error)**：
   - 渲染阶段调用，返回新的 state

10. **componentDidCatch(error, info)**：
    - 提交错误日志

**React Hooks 生命周期对应**：
```javascript
// componentDidMount
useEffect(() => {
  // 挂载后执行
}, []);

// componentDidUpdate
useEffect(() => {
  // 更新后执行
}, [dep]);

// componentWillUnmount
useEffect(() => {
  return () => {
    // 卸载前执行
  };
}, []);
```

---

### Q5: 为什么不能在循环、条件或嵌套函数中调用 Hooks？

**A:**
**原因：React 依赖 Hooks 的调用顺序来正确管理状态**。

**原理解释**：

React 使用链表来存储组件的 Hooks 状态：
```javascript
// React 内部简化逻辑
let hookIndex = 0;
const hooks = [];

function useState(initialValue) {
  const currentIndex = hookIndex;
  hooks[currentIndex] = hooks[currentIndex] ?? initialValue;
  hookIndex++;
  
  return [
    hooks[currentIndex],
    (newValue) => { hooks[currentIndex] = newValue; }
  ];
}

// 每次渲染时，hookIndex 重置为 0
```

**问题场景**：

```javascript
// ❌ 错误：条件中使用
if (condition) {
  const [count, setCount] = useState(0); // 条件不满足时跳过
}
const [name, setName] = useState(''); // 索引错位

// 第一次渲染（condition = true）：
// hooks[0] = count, hooks[1] = name

// 第二次渲染（condition = false）：
// count 的 useState 被跳过
// name 的 useState 使用 hooks[0]（本应为 hooks[1]）
// 导致状态混乱！

// ❌ 错误：循环中使用
for (let i = 0; i < 3; i++) {
  const [item, setItem] = useState(i); // 数量可能变化
}

// ❌ 错误：嵌套函数中使用
const inner = () => {
  const [value, setValue] = useState(0); // 顺序不确定
};
```

**正确做法**：

```javascript
// ✅ 正确：始终在顶层调用
const [count, setCount] = useState(0);
const [name, setName] = useState('');

// ✅ 正确：条件逻辑放在 Hook 内部
const [count, setCount] = useState(0);
if (condition) {
  setCount(1);
}

// ✅ 正确：使用数组或对象处理动态数量
const [items, setItems] = useState([1, 2, 3]);

// ✅ 正确：循环中使用自定义 Hook
function useItems(count) {
  const [items, setItems] = useState(Array(count).fill(0));
  return [items, setItems];
}
```

**ESLint 规则**：
- 使用 `eslint-plugin-react-hooks` 的 `rules-of-hooks` 规则
- 会自动检测并警告违规用法

---

### Q6: 说说你对 useContext 的理解

**A:**
**useContext 用于订阅 React Context，实现跨组件数据共享**。

**基本用法**：

```javascript
// 1. 创建 Context
const ThemeContext = createContext('light');
const UserContext = createContext(null);

// 2. Provider 提供数据
function App() {
  return (
    `<ThemeContext.Provider value="dark">`
      `<UserContext.Provider value={{ name: 'Tom' }}>`
        `<Child />`
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 3. useContext 消费数据
function Child() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  
  return (
    `<div className={theme}>`
      Hello, {user.name}
    </div>
  );
}
```

**注意事项**：

1. **性能问题**：
```javascript
// Context 值变化会导致所有消费者重新渲染
// 避免在 Provider 中传递动态创建的对象
function App() {
  // ❌ 每次渲染都创建新对象，导致所有消费者重渲染
  return `<UserContext.Provider value={{ name: 'Tom' }}>`;
  
  // ✅ 使用 useMemo 缓存
  const value = useMemo(() => ({ name: 'Tom' }), []);
  return `<UserContext.Provider value={value}>`;
}
```

2. **拆分 Context**：
```javascript
// 拆分为多个 Context，减少不必要的重渲染
const ThemeContext = createContext();
const UserContext = createContext();
// 只有对应 Context 变化时才重渲染消费者
```

3. **默认值**：
```javascript
const ThemeContext = createContext('light');
// 没有 Provider 时使用默认值
```

**结合 useReducer 实现全局状态管理**：

```javascript
const StateContext = createContext();
const DispatchContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
}

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    `<StateContext.Provider value={state}>`
      `<DispatchContext.Provider value={dispatch}>`
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 自定义 Hook
function useAppState() {
  return useContext(StateContext);
}
function useAppDispatch() {
  return useContext(DispatchContext);
}
```

---

### Q7: 说说你对 useMemo 的理解

**A:**
**useMemo 用于缓存计算结果，避免每次渲染都重新计算**。

**基本用法**：

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

**使用场景**：

1. **缓存昂贵计算**：
```javascript
function TodoList({ items, filter }) {
  // 只有 items 或 filter 变化时才重新过滤
  const filteredItems = useMemo(() => {
    console.log('过滤计算...');
    return items.filter(item => item.includes(filter));
  }, [items, filter]);
  
  return `<ul>`{filteredItems.map(item => `<li key={item}>`{item}</li>)}</ul>;
}
```

2. **引用相等性**：
```javascript
function Parent({ items }) {
  // 缓存对象，避免传给子组件时每次都是新引用
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a - b);
  }, [items]);
  
  return `<Child items={sortedItems} />`;
}

// 子组件使用 React.memo 时，只有 props 变化才重渲染
const Child = React.memo(({ items }) => {
  return `<div>`{items.length}</div>;
});
```

3. **缓存 JSX**：
```javascript
function List({ items }) {
  // 缓存渲染结果（较少用，通常直接渲染即可）
  const renderedList = useMemo(() => {
    return items.map(item => `<Item key={item.id} item={item} />`);
  }, [items]);
  
  return `<div>`{renderedList}</div>;
}
```

**与 useCallback 的关系**：

```javascript
// useCallback 是 useMemo 的语法糖
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 等价于
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

**注意事项**：

1. **不要过度使用**：
```javascript
// ❌ 简单计算不需要 useMemo
const total = useMemo(() => a + b, [a, b]);

// ✅ 直接计算即可
const total = a + b;
```

2. **依赖数组要准确**：
```javascript
// ❌ 遗漏依赖
const filtered = useMemo(() => items.filter(fn), []); // items 变化不更新

// ✅ 正确依赖
const filtered = useMemo(() => items.filter(fn), [items]);
```

---

### Q8: 说说你对自定义 hook 的理解

**A:**
**自定义 Hook 是复用状态逻辑的方式，本质是一个以 `use` 开头的函数**。

**特点**：
- 函数名以 `use` 开头（约定，ESLint 会检查）
- 内部可以调用其他 Hooks
- 每次调用都是独立的实例

**使用场景**：

1. **封装数据获取逻辑**：
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// 使用
function UserList() {
  const { data, loading, error } = useFetch('/api/users');
  if (loading) return `<div>`Loading...</div>;
  if (error) return `<div>`Error: {error.message}</div>;
  return `<ul>`{data.map(user => `<li key={user.id}>`{user.name}</li>)}</ul>;
}
```

2. **封装表单逻辑**：
```javascript
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const reset = () => setValues(initialValues);
  
  return { values, handleChange, reset };
}

// 使用
function LoginForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    password: ''
  });
  
  return (
    `<form>`
      `<input name="username" value={values.username} onChange={handleChange} />`
      `<input name="password" type="password" value={values.password} onChange={handleChange} />`
      `<button type="button" onClick={reset}>`重置</button>
    </form>
  );
}
```

3. **封装窗口尺寸监听**：
```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

4. **封装 localStorage**：
```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

**与 Mixin/高阶组件的区别**：
- 自定义 Hook 更灵活，无嵌套地狱
- 状态逻辑独立，不会冲突
- TypeScript 支持更好

---

### Q9: 如何让 useEffect 支持 async/await？

**A:**
**useEffect 的回调函数不能直接是 async 函数**，因为 useEffect 期望返回一个清理函数或 undefined，而 async 函数返回 Promise。

**错误写法**：
```javascript
// ❌ 错误：async 函数返回 Promise
useEffect(async () => {
  const data = await fetch('/api/data');
  setData(data);
}, []);
```

**正确写法**：

1. **内部定义 async 函数**：
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    }
  };
  
  fetchData();
}, []);
```

2. **使用 IIFE（立即执行函数）**：
```javascript
useEffect(() => {
  (async () => {
    const data = await fetch('/api/data');
    setData(data);
  })();
}, []);
```

3. **封装为自定义 Hook**：
```javascript
function useAsyncEffect(effect, deps) {
  useEffect(() => {
    const cleanup = effect();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, deps);
}

// 使用
useAsyncEffect(async () => {
  const data = await fetch('/api/data');
  setData(data);
}, []);
```

**处理清理逻辑**：
```javascript
useEffect(() => {
  let ignore = false;
  
  const fetchData = async () => {
    const data = await fetch('/api/data');
    if (!ignore) {
      setData(data);
    }
  };
  
  fetchData();
  
  return () => {
    ignore = true; // 组件卸载时忽略结果
  };
}, []);
```

**使用 AbortController 取消请求**：
```javascript
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    }
  };
  
  fetchData();
  
  return () => {
    controller.abort(); // 取消请求
  };
}, []);
```

---

### Q10: 我们应该在什么场景下使用 useMemo 和 useCallback？

**A:**

**useMemo 使用场景**：

1. **昂贵的计算**：
```javascript
// 大数组排序、复杂计算
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => complexComparison(a, b));
}, [items]);
```

2. **保持引用相等性**：
```javascript
// 作为其他 Hook 的依赖
const config = useMemo(() => ({ url, method }), [url, method]);
useEffect(() => {
  fetchData(config);
}, [config]);

// 传递给 memo 组件
const itemProps = useMemo(() => ({ data, onClick }), [data, onClick]);
return `<MemoItem {...itemProps} />`;
```

3. **避免子组件不必要的渲染**：
```javascript
const items = useMemo(() => transform(rawItems), [rawItems]);
return `<ExpensiveList items={items} />`;
```

**useCallback 使用场景**：

1. **传递给 memo 组件的回调**：
```javascript
const MemoChild = React.memo(({ onClick }) => `<button onClick={onClick}>`Click</button>);

function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ 每次渲染都创建新函数，MemoChild 会重渲染
  const handleClick = () => console.log(count);
  
  // ✅ 缓存函数引用
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]);
  
  return `<MemoChild onClick={handleClick} />`;
}
```

2. **作为其他 Hook 的依赖**：
```javascript
const handleFetch = useCallback(() => {
  return fetch(url);
}, [url]);

useEffect(() => {
  handleFetch();
}, [handleFetch]);
```

3. **防抖/节流场景**：
```javascript
const handleSearch = useCallback(
  debounce((query) => {
    fetchResults(query);
  }, 300),
  []
);
```

**不需要使用的场景**：

```javascript
// ❌ 简单计算不需要
const sum = useMemo(() => a + b, [a, b]);

// ❌ 不传给子组件的函数不需要
const handleClick = useCallback(() => {}, []);

// ❌ 渲染频繁且依赖很多的情况下，缓存成本可能更高
```

**经验法则**：
- 先写简单代码，遇到性能问题再优化
- 大部分情况下不需要 useMemo/useCallback
- 使用 React DevTools Profiler 分析瓶颈

---

### Q11: 说说你对 React Hook 的闭包陷阱的理解，有哪些解决方案？

**A:**
**闭包陷阱（Stale Closure）**：Hook 中捕获的变量是创建时的值，而不是最新的值。

**问题场景**：

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 始终是 0，因为闭包捕获的是初始值
      setCount(count + 1); // 0 + 1 = 1，永远是 1
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // 空依赖，只在挂载时执行一次
  
  return `<div>`{count}</div>;
}
```

**解决方案**：

1. **添加正确的依赖**：
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // 添加依赖，每次 count 变化重新执行
```

2. **使用函数式更新**：
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // 使用最新值
  }, 1000);
  return () => clearInterval(timer);
}, []); // 无需依赖 count
```

3. **使用 useRef 保存最新值**：
```javascript
const countRef = useRef(count);
countRef.current = count; // 每次渲染更新 ref

useEffect(() => {
  const timer = setInterval(() => {
    console.log(countRef.current); // 获取最新值
    setCount(countRef.current + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

4. **��用 useReducer**：
```javascript
const [state, dispatch] = useReducer((state, action) => {
  if (action.type === 'increment') return state + 1;
  return state;
}, 0);

useEffect(() => {
  const timer = setInterval(() => {
    dispatch({ type: 'increment' }); // dispatch 是稳定的
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

5. **自定义 Hook 封装**：
```javascript
function useStableCallback(callback) {
  const ref = useRef(callback);
  ref.current = callback;
  
  return useCallback((...args) => {
    return ref.current(...args);
  }, []);
}

// 使用
const stableCallback = useStableCallback(() => {
  console.log(count); // 始终获取最新 count
});
```

**useRef 为什么能解决**：
- useRef 返回的对象在组件生命周期内保持不变
- `.current` 属性可以随时读写最新值
- 不会触发重新渲染

---

### Q12: React 18 新特性

**A:**

**1. 并发特性（Concurrent Features）**：

- **自动批处理（Automatic Batching）**：
```javascript
// React 17：只在 React 事件中批处理
// React 18：Promise、setTimeout、原生事件中也自动批处理

function handleClick() {
  setTimeout(() => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // React 18 会自动批处理，只渲染一次
  }, 0);
}

// 使用 flushSync 强制同步更新
import { flushSync } from 'react-dom';
flushSync(() => {
  setCount(c => c + 1);
}); // 立即渲染
```

- **过渡更新（Transitions）**：
```javascript
import { startTransition, useTransition } from 'react';

const [isPending, startTransition] = useTransition();

function handleChange(e) {
  // 紧急更新：立即响应输入
  setInputValue(e.target.value);
  
  // 过渡更新：可以延迟，不阻塞用户输入
  startTransition(() => {
    setSearchResults(filterLargeList(e.target.value));
  });
}

// isPending 表示过渡更新是否在进行中
```

- **延迟更新（useDeferredValue）**：
```javascript
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  // deferredQuery 延迟更新，不阻塞用户输入
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(() => {
    return filterLargeList(deferredQuery);
  }, [deferredQuery]);
  
  return `<ResultList results={results} />`;
}
```

**2. 新的 Hooks**：

- **useId**：生成唯一 ID，用于 SSR
```javascript
function Form() {
  const id = useId();
  return (
    <>
      `<label htmlFor={id}>`Name</label>
      `<input id={id} />`
    </>
  );
}
```

- **useSyncExternalStore**：订阅外部数据源
```javascript
import { useSyncExternalStore } from 'react';

const stores = useSyncExternalStore(
  (callback) => store.subscribe(callback),
  () => store.getSnapshot()
);
```

- **useInsertionEffect**：CSS-in-JS 库注入样式

**3. Suspense 改进**：

```javascript
import { Suspense } from 'react';

// 支持服务端渲染
`<Suspense fallback={<Loading />`}>
  `<Comments />`
</Suspense>

// 配合 use 使用
function Note({id}) {
  const note = use(fetchNote(id)); // 等待 Promise resolve
  return `<div>`{note.title}</div>;
}
```

**4. 新的根节点 API**：

```javascript
// React 17
import { render } from 'react-dom';
render(`<App />`, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(`<App />`);

// 卸载
root.unmount();
```

**5. Strict Mode 改进**：

- 开发模式下组件会挂载两次（检测副作用）
- 帮助发现不安全的生命周期和副作用

---

### Q13: React 中，怎么实现父组件调用子组件中的方法？

**A:**

**1. 使用 useRef + forwardRef + useImperativeHandle**：

```javascript
import { forwardRef, useRef, useImperativeHandle } from 'react';

// 子组件
const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);
  
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    increment: () => setCount(c => c + 1),
    getCount: () => count,
    reset: () => setCount(0)
  }));
  
  return `<div>`Count: {count}</div>;
});

// 父组件
function Parent() {
  const childRef = useRef(null);
  
  const handleClick = () => {
    childRef.current.increment();
    console.log(childRef.current.getCount());
  };
  
  return (
    <>
      `<Child ref={childRef} />`
      `<button onClick={handleClick}>`调用子组件方法</button>
    </>
  );
}
```

**2. 使用回调函数（Callback Props）**：

```javascript
// 子组件
function Child({ onMount }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 将方法传给父组件
    onMount({
      increment: () => setCount(c => c + 1),
      getCount: () => count
    });
  }, []);
  
  return `<div>`Count: {count}</div>;
}

// 父组件
function Parent() {
  const [childApi, setChildApi] = useState(null);
  
  return (
    <>
      `<Child onMount={setChildApi} />`
      `<button onClick={() =>` childApi?.increment()}>调用</button>
    </>
  );
}
```

**3. 使用 Context 或状态管理**：

```javascript
// 通过 Context 共享方法
const ChildApiContext = createContext();

function Parent() {
  const [childApi, setChildApi] = useState(null);
  
  return (
    `<ChildApiContext.Provider value={setChildApi}>`
      `<Child />`
      `<button onClick={() =>` childApi?.increment()}>调用</button>
    </ChildApiContext.Provider>
  );
}
```

**useImperativeHandle 详解**：
```javascript
useImperativeHandle(ref, createHandle, deps);

// 参数：
// ref: 父组件传递的 ref
// createHandle: 返回暴露给父组件的对象
// deps: 依赖数组（可选）

// 示例：只暴露必要的方法
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
  scrollIntoView: () => elementRef.current.scrollIntoView()
}), []);
```

---

### Q14: 你常用的 React Hooks 有哪些？

**A:**

**基础 Hooks**：

1. **useState**：状态管理
```javascript
const [state, setState] = useState(initialValue);
setState(prev => prev + 1); // 函数式更新
```

2. **useEffect**：副作用处理
```javascript
useEffect(() => {
  // 挂载/更新时执行
  return () => {
    // 清理函数
  };
}, [deps]);
```

3. **useContext**：订阅 Context
```javascript
const value = useContext(MyContext);
```

**性能优化 Hooks**：

4. **useMemo**：缓存计算值
```javascript
const memoizedValue = useMemo(() => compute(a, b), [a, b]);
```

5. **useCallback**：缓存函数
```javascript
const memoizedFn = useCallback(() => doSomething(a), [a]);
```

**Ref 相关 Hooks**：

6. **useRef**：持久化值/DOM 引用
```javascript
const ref = useRef(initialValue);
ref.current = newValue; // 不会触发重渲染
```

7. **useImperativeHandle**：暴露方法给父组件
```javascript
useImperativeHandle(ref, () => ({ method: () => {} }));
```

**状态管理 Hooks**：

8. **useReducer**：复杂状态逻辑
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'ACTION' });
```

**布局/效果 Hooks**：

9. **useLayoutEffect**：DOM 更新后同步执行
```javascript
useLayoutEffect(() => {
  // 在浏览器绘制前执行，读取/修改 DOM
}, [deps]);
```

10. **useInsertionEffect**：CSS-in-JS 注入（React 18）

**React 18 新 Hooks**：

11. **useId**：生成唯一 ID
```javascript
const id = useId();
```

12. **useTransition**：标记非紧急更新
```javascript
const [isPending, startTransition] = useTransition();
```

13. **useDeferredValue**：延迟更新
```javascript
const deferredValue = useDeferredValue(value);
```

**其他 Hooks**：

14. **useDebugValue**：自定义 Hook 调试标签
```javascript
useDebugValue(isOnline ? 'Online' : 'Offline');
```

15. **useSyncExternalStore**：订阅外部数据源

---

### Q15: 说说你对 useReducer 的理解

**A:**
**useReducer 是 useState 的替代方案，适合复杂状态逻辑**。

**基本用法**：

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init?);

// reducer: (state, action) => newState
// initialArg: 初始状态
// init: 惰性初始化函数（可选）
```

**示例**：

```javascript
// 定义 reducer
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'delete':
      return state.filter(todo => todo.id !== action.id);
    case 'clear_completed':
      return state.filter(todo => !todo.done);
    default:
      throw new Error('Unknown action');
  }
}

// 使用
function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  
  return (
    <>
      `<button onClick={() =>` dispatch({ type: 'add', text: 'New todo' })}>
        添加
      </button>
      `<ul>`
        {todos.map(todo => (
          `<li key={todo.id}>`
            `<span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
              onClick={() =>` dispatch({ type: 'toggle', id: todo.id })}
            >
              {todo.text}
            </span>
            `<button onClick={() =>` dispatch({ type: 'delete', id: todo.id })}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

**惰性初始化**：

```javascript
// 可以将初始状态计算逻辑放在 init 函数中
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
}
```

**与 useState 的对比**：

| 特性 | useState | useReducer |
|------|----------|------------|
| 适用场景 | 简单状态 | 复杂状态逻辑 |
| 更新方式 | 直接设置值 | dispatch action |
| 可测试性 | 一般 | 更好（纯函数） |
| 调试 | 简单 | 可追踪 action |
| 性能 | 相当 | 子组件可 dispatch 不重渲染 |

**结合 Context 实现全局状态**：

```javascript
const StateContext = createContext();
const DispatchContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    `<StateContext.Provider value={state}>`
      `<DispatchContext.Provider value={dispatch}>`
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 自定义 Hooks
function useAppState() {
  return useContext(StateContext);
}
function useAppDispatch() {
  return useContext(DispatchContext);
}
```

---

### Q16: useMemo 和 useCallback 有什么区别？

**A:**

| 特性 | useMemo | useCallback |
|------|---------|-------------|
| 返回值 | 计算结果（任意值） | 函数引用 |
| 用途 | 缓存计算结果 | 缓存函数 |
| 语法 | `useMemo(() => value, deps)` | `useCallback(fn, deps)` |
| 等价关系 | - | `useCallback(fn, deps) ≈ useMemo(() => fn, deps)` |

**useMemo 示例**：

```javascript
// 缓存计算结果
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 缓存对象
const config = useMemo(() => ({
  url: apiUrl,
  headers: { Authorization: token }
}), [apiUrl, token]);

// ��存 JSX（较少用）
const renderedList = useMemo(() => {
  return items.map(item => `<Item key={item.id} item={item} />`);
}, [items]);
```

**useCallback 示例**：

```javascript
// 缓存事件处理函数
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// 缓存传递给子组件的回调
const MemoChild = React.memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  
  // 不用 useCallback，每次渲染 MemoChild 都会重渲染
  const handleChildClick = useCallback(() => {
    console.log('clicked');
  }, []); // 无依赖，永远返回同一引用
  
  return `<MemoChild onClick={handleChildClick} />`;
}
```

**关系**：

```javascript
// useCallback 是 useMemo 的语法糖
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 等价于
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

**使用建议**：

1. **缓存值用 useMemo**：
   - 大型计算结果
   - 作为依赖的对象

2. **缓存函数用 useCallback**：
   - 传递给 memo 组件
   - 作为其他 Hook 的依赖

3. **不要过度优化**：
   - 简单计算和函数不需要缓存
   - 缓存本身也有开销

---

### Q17: 怎么在代码中判断一个 React 组件是 class component 还是 function component？

**A:**

**方法1：检查原型链**：

```javascript
function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    component.prototype &&
    component.prototype.isReactComponent
  );
}
```

**方法2：检查是否继承自 React.Component**：

```javascript
function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    component.prototype instanceof React.Component
  );
}
```

**方法3：综合判断**：

```javascript
function isReactComponent(component) {
  if (typeof component !== 'function') return false;
  
  // 类组件
  if (component.prototype && component.prototype.isReactComponent) {
    return 'class';
  }
  
  // 函数组件
  // 注意：箭头函数没有 prototype
  if (!component.prototype || !component.prototype.render) {
    return 'function';
  }
  
  return 'unknown';
}
```

**完整示例**：

```javascript
import React from 'react';

// 类组件
class ClassComponent extends React.Component {
  render() {
    return `<div>`Class Component</div>;
  }
}

// 函数组件
function FunctionComponent() {
  return `<div>`Function Component</div>;
}

// 箭头函数组件
const ArrowComponent = () => `<div>`Arrow Component</div>;

// 判断函数
function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    !!component.prototype &&
    !!component.prototype.isReactComponent
  );
}

console.log(isClassComponent(ClassComponent));    // true
console.log(isClassComponent(FunctionComponent)); // false
console.log(isClassComponent(ArrowComponent));    // false
```

**原理**：
- React 内部会给类组件的 prototype 添加 `isReactComponent` 标志
- 函数组件没有这个标志
- 箭头函数没有 prototype 或 prototype.constructor

---

### Q18: useRef/ref/forwardRef 的区别是什么？

**A:**

**1. useRef**：Hook，创建一个可变引用对象

```javascript
const ref = useRef(initialValue);

// 特点：
// - .current 属性保存值
// - 整个组件生命周期内保持不变
// - 改变 .current 不会触发重渲染

// 用途1：访问 DOM
const inputRef = useRef(null);
`<input ref={inputRef} />`
inputRef.current.focus();

// 用途2：保存任意可变值
const countRef = useRef(0);
countRef.current++; // 不触发重渲染

// 用途3：保存上一次的值
const prevValueRef = useRef();
useEffect(() => {
  prevValueRef.current = value;
}, [value]);
```

**2. ref**：属性，用于获取 DOM 或组件实例

```javascript
// 访问 DOM
`<div ref={myRef}>`Hello</div>

// 访问类组件实例
`<ClassComponent ref={componentRef} />`
componentRef.current.someMethod();

// 回调形式
`<div ref={el =>` { divEl = el; }} />

// 函数组件不能直接使用 ref（会报错）
// 需要配合 forwardRef
```

**3. forwardRef**：转发 ref 给子组件

```javascript
import { forwardRef } from 'react';

// 函数组件接收 ref
const FancyInput = forwardRef((props, ref) => {
  return `<input ref={ref} className="fancy-input" {...props} />`;
});

// 父组件使用
function Parent() {
  const inputRef = useRef(null);
  
  return (
    <>
      `<FancyInput ref={inputRef} />`
      `<button onClick={() =>` inputRef.current.focus()}>
        Focus
      </button>
    </>
  );
}
```

**三者关系**：

```
useRef          → 创建 ref 对象
    ↓
ref 属性        → 将 ref 对象绑定到元素/组件
    ↓
forwardRef      → 让函数组件能够接收 ref
```

**完整示例**：

```javascript
import { useRef, forwardRef, useImperativeHandle } from 'react';

// 子组件
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    getValue: () => inputRef.current.value
  }));
  
  return `<input ref={inputRef} />`;
});

// 父组件
function Parent() {
  const childRef = useRef(null);
  
  return (
    <>
      `<Child ref={childRef} />`
      `<button onClick={() =>` childRef.current.focus()}>
        聚焦
      </button>
    </>
  );
}
```

---

### Q19: useEffect 的第二个参数，传空数组和传依赖数组有什么区别

**A:**

**1. 空数组 `[]`**：

```javascript
useEffect(() => {
  console.log('只执行一次');
  // 相当于 componentDidMount
}, []);
```

- 只在组件挂载时执行一次
- 清理函数只在卸载时执行
- 闭包捕获的是初始值

**2. 依赖数组 `[dep1, dep2]`**：

```javascript
useEffect(() => {
  console.log('count 或 name 变化时执行');
  // 相当于 componentDidMount + componentDidUpdate
}, [count, name]);
```

- 初次挂载时执行
- 依赖项变化时再次执行
- 每次执行前先运行清理函数

**3. 不传第二个参数**：

```javascript
useEffect(() => {
  console.log('每次渲染都执行');
  // 相当于 componentDidMount + componentDidUpdate（每次渲染）
});
```

- 每次渲染后都执行
- 性能问题，慎用

**对比表格**：

| 参数 | 执行时机 | 用途 |
|------|----------|------|
| 无 | 每次渲染后 | 少用 |
| `[]` | 仅挂载时 | 初始化、事件订阅 |
| `[dep]` | 挂载 + dep 变化时 | 响应数据变化 |

**示例**：

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // ❌ 错误：空数组捕获初始 userId
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // userId 变化不会重新请求
  
  // ✅ 正确：添加 userId 依赖
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userId 变化时重新请求
  
  return `<div>`{user?.name}</div>;
}
```

**清理函数执行时机**：

```javascript
useEffect(() => {
  console.log('effect');
  return () => {
    console.log('cleanup');
  };
}, [count]);

// 执行顺序：
// 1. 挂载：effect
// 2. count 变化：cleanup → effect
// 3. count 再变化：cleanup → effect
// 4. 卸载：cleanup
```

---

### Q20: 如果在 useEffect 的第一个参数中 return 了一个函数，那么第二个参数分别传空数组...

**A:**
**return 的函数是清理函数（cleanup function）**��

**场景1：空数组 `[]`**

```javascript
useEffect(() => {
  console.log('挂载');
  return () => {
    console.log('卸载');
  };
}, []);

// 执行流程：
// 挂载时：打印 "挂载"
// 卸载时：打印 "卸载"
// 类似于 componentDidMount + componentWillUnmount
```

**场景2：有依赖 `[dep]`**

```javascript
useEffect(() => {
  console.log('effect:', count);
  return () => {
    console.log('cleanup:', count);
  };
}, [count]);

// 执行流程：
// 挂载：effect: 0
// count 变为 1：cleanup: 0 → effect: 1
// count 变为 2：cleanup: 1 → effect: 2
// 卸载：cleanup: 2
// 类似于 componentDidMount + componentDidUpdate + componentWillUnmount
```

**场景3：不传第二个参数**

```javascript
useEffect(() => {
  console.log('effect');
  return () => {
    console.log('cleanup');
  };
});

// 执行流程：
// 每次渲染：cleanup → effect
// 卸载：cleanup
```

**实际应用**：

```javascript
// 订阅事件
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// 定时器
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);

// WebSocket
useEffect(() => {
  const ws = new WebSocket('ws://example.com');
  ws.onmessage = (e) => setMessage(e.data);
  
  return () => {
    ws.close();
  };
}, []);

// 请求取消
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData);
  
  return () => {
    controller.abort();
  };
}, [url]);
```

---

### Q21: 实现 useUpdate 方法，调用时强制组件重新渲染

**A:**

**方法1：使用 useState**

```javascript
function useUpdate() {
  const [, setState] = useState({});
  return () => setState({});
}

// 使用
function App() {
  const update = useUpdate();
  
  return (
    <>
      `<div>`{Date.now()}</div>
      `<button onClick={update}>`更新时间</button>
    </>
  );
}
```

**方法2：使用 useReducer**

```javascript
function useUpdate() {
  const [, dispatch] = useReducer((v) => v + 1, 0);
  return () => dispatch({});
}

// 或更简洁
function useUpdate() {
  return useReducer((v) => v + 1, 0)[1];
}
```

**方法3：完整实现（支持立即更新）**

```javascript
import { useState, useCallback } from 'react';

function useUpdate() {
  const [, setTick] = useState(0);
  
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  
  return update;
}

// 使用
function Counter() {
  const [count, setCount] = useState(0);
  const update = useUpdate();
  
  // 即使 count 没变化，调用 update 也会重渲染
  return (
    `<div>`
      `<p>`Count: {count}</p>
      `<p>`Random: {Math.random()}</p>
      `<button onClick={() =>` setCount(c => c + 1)}>增加</button>
      `<button onClick={update}>`强制更新</button>
    </div>
  );
}
```

**方法4：类组件风格的 forceUpdate**

```javascript
// 模拟 class 组件的 this.forceUpdate()
function useForceUpdate() {
  const [, setTick] = useState(0);
  
  return useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
}

// 使用
const forceUpdate = useForceUpdate();
forceUpdate(); // 强制重渲染
```

**原理**：
- useState 的 setter 每次传入新值都会触发重渲染
- 传入一个空对象 `{}` 或自增数字，每次都是新值
- useReducer 的 dispatch 同理

---

## 💡 参考答案提示

**Q1 Fiber：** 可中断的异步渲染、优先级调度、���量���新、更好的用户体验（不会阻塞主线程）

**Q2 setState：** 合成事件中异步（批量更新），setTimeout/DOM事件中同步，React18中自动批处理

**Q3 事件代理：** React使用事件委托，所有事件绑定到document/root，使用合成事件（SyntheticEvent）统一封装

**Q4 生命周期：** 
- 挂载：constructor → getDerivedStateFromProps → render → componentDidMount
- 更新：getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
- 卸载：componentWillUnmount

**Q5 Hooks规则：** Hooks依赖调用顺序，循环/条件会导致顺序错乱。必须顶层调用。

**Q9 useEffect async：** 内部定义async函数并调用，不能直接给useEffect传async函数
```javascript
useEffect(() => {
  const fetchData = async () => { ... };
  fetchData();
}, []);
```

**Q12 React 18：** Concurrent模式、自动批处理、Suspense改进、新的Hooks（useId/useTransition/useDeferredValue）、Strict Mode双重调用

**Q16 useMemo vs useCallback：** useMemo缓存计算结果，useCallback缓存函数引用。useCallback(fn, deps) ≈ useMemo(() => fn, deps)

**Q18 Ref区别：**
- useRef：Hook，返回可变ref对象
- ref：属性，用于获取DOM或组件实例
- forwardRef：转发ref到子组件

**Q21 useUpdate：** 使用useState的setter或useReducer强制更新
```javascript
const useUpdate = () => {
  const [, setState] = useState({});
  return () => setState({});
};
```
