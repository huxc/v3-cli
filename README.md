##配置文件

```js
const template = null;
export default {
  entry: "http://10.100.2.197:9303/v2/api-docs",
  domain: "system2",
  template,
  output: { path: "./src/api/auto-api" },
  router: {
    path: "./src/routers/modules",
    ignore: ["**/notFound.js"],
    outPath: "./src/viewss",
  },
};
```
