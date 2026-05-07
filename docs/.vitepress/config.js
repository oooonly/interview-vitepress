import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/quiz/",
  title: "前端面试宝典",
  description: "2025年前端面试题汇总",
  sitemap: {
    hostname: "https://oooonly.github.io/quiz/",
  },
  markdown: {
    config: (md) => {
      // 禁用 HTML 标签解析
      md.set({ html: false });
      // 禁用 Vue 插值语法 {{ }}
      // md.core.ruler.disable('interpolate')
    },
  },
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "Vue",
        items: [
          { text: "Vue基础", link: "/vue-basic" },
          { text: "Vue面试题", link: "/vue" },
          { text: "Vue 2025", link: "/vue-2025" },
        ],
      },
      {
        text: "React",
        items: [
          { text: "React基础", link: "/react-basic" },
          { text: "React面试题", link: "/react" },
          { text: "React 2024", link: "/react-2024" },
          { text: "React 2025", link: "/react-2025" },
        ],
      },
      {
        text: "Node.js",
        items: [
          { text: "Node基础", link: "/node-basic" },
          { text: "Node面试题", link: "/node" },
          { text: "Node 2025", link: "/node-2025" },
        ],
      },
      { text: "HTML", link: "/html" },
      { text: "TypeScript", link: "/typescript" },
      { text: "前端场景", link: "/frontend-scenario" },
      { text: "工程化", link: "/frontend-engineering" },
      { text: "Uni-app", link: "/uniapp" },
      {
        text: "面试记录",
        items: [
          { text: "字节一面", link: "/interview-1" },
          { text: "字节二面", link: "/interview-2" },
        ],
      },
      {
        text: "项目经验",
        items: [
          { text: "项目难点", link: "/project-difficulty" },
          { text: "项目细节", link: "/project-details" },
        ],
      },
    ],
    sidebar: {
      "/": [
        {
          text: "基础面试题",
          items: [
            { text: "Vue基础", link: "/vue-basic" },
            { text: "React基础", link: "/react-basic" },
            { text: "Node基础", link: "/node-basic" },
            { text: "HTML", link: "/html" },
            { text: "TypeScript", link: "/typescript" },
          ],
        },
        {
          text: "前端场景",
          items: [
            { text: "前端场景题", link: "/frontend-scenario" },
            { text: "场景题2025", link: "/scenario-2025" },
            { text: "前端工程化", link: "/frontend-engineering" },
          ],
        },
        {
          text: "Vue",
          items: [
            { text: "Vue面试题", link: "/vue" },
            { text: "Vue 2025", link: "/vue-2025" },
          ],
        },
        {
          text: "React",
          items: [
            { text: "React面试题", link: "/react" },
            { text: "React 2024", link: "/react-2024" },
            { text: "React 2025", link: "/react-2025" },
          ],
        },
        {
          text: "Node.js",
          items: [
            { text: "Node面试题", link: "/node" },
            { text: "Node 2025", link: "/node-2025" },
          ],
        },
        {
          text: "移动端",
          items: [{ text: "Uni-app", link: "/uniapp" }],
        },
        {
          text: "面试记录",
          items: [
            { text: "字节一面", link: "/interview-1" },
            { text: "字节二面", link: "/interview-2" },
          ],
        },
        {
          text: "项目经验",
          items: [
            { text: "项目难点", link: "/project-difficulty" },
            { text: "项目细节", link: "/project-details" },
          ],
        },
        {
          text: "速记版",
          items: [{ text: "八股文速记", link: "/quick-notes" }],
        },
      ],
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 前端面试宝典",
    },
  },
});
