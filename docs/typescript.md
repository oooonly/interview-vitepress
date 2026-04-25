# TypeScript 面试题

## 1. 说说对 TypeScript 中命名空间与模块的理解？区别？

**答：**

- **命名空间 (Namespace)**：用于组织代码，避免全局命名冲突，使用 `namespace` 关键字声明，编译后会生成嵌套的对象结构
- **模块 (Module)**：基于文件的组织方式，每个文件就是一个模块，使用 `import/export` 进行导入导出，是 ES6 模块系统的实现

**区别**：

| 特性 | 命名空间 | 模块 |
|------|----------|------|
| 组织方式 | 逻辑分组 | 文件级别 |
| 导出方式 | `export` 内部 | 文件级 `export` |
| 导入方式 | `/// `<reference>`` 或 `import` | `import` |
| 使用场景 | 全局库、内部组织 | 现代应用开发 |
| 推荐度 | 不推荐（遗留方案） | 推荐 |

---

## 2. 说说你对 TypeScript 的理解？与 JavaScript 的区别？

**答：**

**TypeScript** 是 JavaScript 的超集，添加了静态类型系统。

**主要区别**：

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 类型系统 | 动态类型 | 静态类型 |
| 编译 | 运行时解释 | 编译为 JS |
| 工具支持 | 有限 | 更好的 IDE 支持、智能提示 |
| 新特性支持 | 依赖浏览器支持 | 可编译为低版本 JS |
| 学习曲线 | 低 | 需要学习类型系统 |
| 代码可读性 | 运行时才知道类型 | 声明清晰，易于维护 |

---

## 3. TypeScript 中泛型是什么？

**答：**

**泛型 (Generics)** 允许创建可重用的组件，支持多种类型。

```typescript
// 基本用法
function identity`<T>`(arg: T): T {
  return arg;
}

// 泛型约束
interface Lengthwise {
  length: number;
}
function loggingIdentity`<T extends Lengthwise>`(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 泛型接口
interface GenericResponse`<T>` {
  data: T;
  status: number;
}
```

---

## 4. TypeScript 中有哪些声明变量的方式？

**答：**

| 方式 | 说明 | 示例 |
|------|------|------|
| `let` | 块级作用域，可重新赋值 | `let x = 1;` |
| `const` | 块级作用域，不可重新赋值 | `const y = 2;` |
| `var` | 函数作用域（不推荐） | `var z = 3;` |
| 类型注解 | 显式声明类型 | `let a: number = 1;` |
| 类型推断 | 自动推断类型 | `let b = "hello"; // string` |
| 联合类型 | 多个类型之一 | `let c: string | number;` |
| 类型别名 | 自定义类型名 | `type ID = string | number;` |

---

## 5. 什么是 TypeScript 的方法重载？

**答：**

方法重载允许一个函数有多个签名，根据参数类型或数量执行不同逻辑。

```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

add(1, 2);        // 返回 number
add("a", "b");    // 返回 string
```

---

## 6. 请实现下面的 sleep 方法

**答：**

```typescript
function sleep(ms: number): Promise`<void>` {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用
async function demo() {
  console.log('开始');
  await sleep(1000);
  console.log('1秒后');
}
```

---

## 7. TypeScript 中的 is 关键字有什么用？

**答：**

`is` 是类型谓词，用于自定义类型保护函数。

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function process(value: string | number) {
  if (isString(value)) {
    // TypeScript 知道这里是 string 类型
    return value.toUpperCase();
  }
  // 这里是 number 类型
  return value.toFixed(2);
}
```

---

## 8. TypeScript 支持的访问修饰符有哪些？

**答：**

| 修饰符 | 说明 | 访问范围 |
|--------|------|----------|
| `public` | 公开（默认） | 类内部、子类、实例 |
| `private` | 私有 | 仅类内部 |
| `protected` | 受保护 | 类内部、子类 |
| `readonly` | 只读 | 只能在声明或构造函数中赋值 |

```typescript
class Animal {
  public name: string;
  private age: number;
  protected type: string;
  readonly id: number;
}
```

---

## 9. 请实现下面的 myMap 方法

**答：**

```typescript
function myMap`<T, U>`(array: T[], callback: (item: T, index: number, arr: T[]) => U): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

// 使用
const nums = [1, 2, 3];
const doubled = myMap(nums, n => n * 2); // [2, 4, 6]
```

---

## 10. 请实现下面的 treePath 方法

**答：**

```typescript
interface TreeNode {
  id: string;
  children?: TreeNode[];
}

function treePath(tree: TreeNode[], targetId: string, path: string[] = []): string[] | null {
  for (const node of tree) {
    const currentPath = [...path, node.id];
    if (node.id === targetId) {
      return currentPath;
    }
    if (node.children) {
      const result = treePath(node.children, targetId, currentPath);
      if (result) return result;
    }
  }
  return null;
}
```

---

## 11. 请实现下面的 product 方法

**答：**

```typescript
// 计算数组中所有元素的乘积
function product(nums: number[]): number {
  return nums.reduce((acc, curr) => acc * curr, 1);
}

// 或处理空数组情况
function productSafe(nums: number[]): number | undefined {
  if (nums.length === 0) return undefined;
  return nums.reduce((acc, curr) => acc * curr, 1);
}
```

---

## 12. 请实现下面的 myAll 方法（Promise.all）

**答：**

```typescript
function myAll`<T>`(promises: Promise`<T>`[]): Promise`<T[]>` {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results: T[] = new Array(promises.length);
    let completedCount = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

---

## 13. 请实现下面的 sum 方法

**答：**

```typescript
// 支持多个参数求和
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

// 或柯里化版本
function sumCurry(a: number): (b: number) => number {
  return (b: number) => a + b;
}
```

---

## 14. 请实现下面的 mergeArray 方法

**答：**

```typescript
// 合并两个数组，去重
function mergeArray`<T>`(arr1: T[], arr2: T[]): T[] {
  return [...new Set([...arr1, ...arr2])];
}

// 或根据某个 key 合并对象数组
function mergeArrayByKey`<T extends Record<string, any>`>(
  arr1: T[], 
  arr2: T[], 
  key: keyof T
): T[] {
  const map = new Map`<string, T>`();
  [...arr1, ...arr2].forEach(item => {
    map.set(String(item[key]), item);
  });
  return Array.from(map.values());
}
```

---

## 15. 实现下面的 firstSingleChar 方法

**答：**

```typescript
// 找到字符串中第一个不重复的字符
function firstSingleChar(str: string): string | null {
  const charCount = new Map`<string, number>`();
  
  // 统计字符出现次数
  for (const char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  
  // 找到第一个只出现一次的字符
  for (const char of str) {
    if (charCount.get(char) === 1) {
      return char;
    }
  }
  
  return null;
}
```

---

## 16. 实现下面的 reverseWord 方法

**答：**

```typescript
// 反转字符串中的每个单词
function reverseWord(str: string): string {
  return str
    .split(' ')
    .map(word => word.split('').reverse().join(''))
    .join(' ');
}

// 示例
reverseWord("hello world"); // "olleh dlrow"
```

---

## 17. 如何定义一个数组，它的元素可能是字符串类型，也可能是数值类型？

**答：**

```typescript
// 联合类型
let arr: (string | number)[] = [1, "hello", 2, "world"];

// 或使用类型别名
type StringOrNumber = string | number;
let arr2: StringOrNumber[] = [1, "hello"];
```

---

## 18. 请补充 objToArray 函数

**答：**

```typescript
interface ObjToArrayResult {
  key: string;
  value: any;
}

function objToArray(obj: Record`<string, any>`): ObjToArrayResult[] {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

// 示例
objToArray({ a: 1, b: 2 }); // [{ key: "a", value: 1 }, { key: "b", value: 2 }]
```

---

## 19. 使用 TS 实现一个判断传入参数是否是数组类型的方法

**答：**

```typescript
function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

// 或更精确的泛型版本
function isArrayOfType`<T>`(
  value: unknown, 
  typeCheck: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(typeCheck);
}

// 使用
function isStringArray(value: unknown): value is string[] {
  return isArrayOfType(value, (item): item is string => typeof item === 'string');
}
```

---

## 20. TypeScript 的内置数据类型有哪些？

**答：**

| 类型 | 说明 |
|------|------|
| `number` | 数字（整数和浮点数） |
| `string` | 字符串 |
| `boolean` | 布尔值 |
| `null` | 空值 |
| `undefined` | 未定义 |
| `symbol` | 唯一标识符 |
| `bigint` | 大整数 |
| `object` | 对象类型 |
| `any` | 任意类型 |
| `unknown` | 未知类型（安全的 any） |
| `never` | 永不存在的类型 |
| `void` | 无返回值 |
| `array` | 数组 |
| `tuple` | 元组 |
| `enum` | 枚举 |

---

## 21. ts 中 any 和 unknown 有什么区别？

**答：**

| 特性 | `any` | `unknown` |
|------|-------|-----------|
| 类型安全 | 不安全，可以任意操作 | 安全，操作前需要类型检查 |
| 赋值 | 可赋给任何类型 | 只能赋给 `unknown` 或 `any` |
| 属性访问 | 可直接访问任意属性 | 不能直接访问，需要类型断言或收窄 |
| 使用场景 | 遗留代码、快速原型 | 推荐使用，表示不确定类型 |

```typescript
let a: any = 1;
a.toFixed(); // 编译通过，运行可能报错

let u: unknown = 1;
// u.toFixed(); // 编译错误！
if (typeof u === 'number') {
  u.toFixed(); // 正确
}
```

---

## 22. 如何将 unknown 类型指定为一个更具体的类型？

**答：**

```typescript
let value: unknown = "hello";

// 方法1：类型守卫（Type Guards）
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // string 类型
}

// 方法2：类型断言（Type Assertion）
const str = value as string;

// 方法3：类型谓词（Type Predicate）
function isString(val: unknown): val is string {
  return typeof val === 'string';
}
if (isString(value)) {
  console.log(value.length);
}

// 方法4：switch 收窄
type Animal = { kind: 'dog'; woof: () => void } | { kind: 'cat'; meow: () => void };
function handleAnimal(animal: unknown) {
  if (typeof animal === 'object' && animal !== null && 'kind' in animal) {
    const a = animal as Animal;
    switch (a.kind) {
      case 'dog': a.woof(); break;
      case 'cat': a.meow(); break;
    }
  }
}
```
