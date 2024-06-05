import ora from "ora";
import fg from "fast-glob";
import { relativePath } from "../utils.js";
import { readFileSync } from "fs";
import template from "art-template";
import { outputFileSync, pathExistsSync, ensureDirSync } from "fs-extra/esm";
import { vueTmp } from "./viewTmp.js";

export async function createViews() {
    const spinner = ora(" 读取配置文件...\r\n").start();
  const filePath = relativePath(import.meta.url, "/v3.config.js");
  let swConfig = await import(filePath);
  const { router } = swConfig.default;
  // 获取所有路由对象
  const routers = fg.globSync(`${router.path}/**/**`, {
    ignore: router.ignore,
  });
  
  spinner.text = `正在生成文件...`;
  for (let i = 0; i < routers.length; i++) {
    const routes = fmtRouter(routers[i]);
    createPage(routes, router.outPath);
  }
  setTimeout(() => {
    spinner.color = "green";
    spinner.text = `已生成！请查看${router.outPath}目录下`;
    spinner.succeed();
  }, 3000);
}
function createPage(routes, outPath) {
  for (let i = 1; i < routes.length; i++) {
    const route = routes[i];
    const path = outPath
      ? `${outPath}/${route.path}`
      : `${cwd}/views/${route.path}`;

    const vue = `${path}/index.vue`;
    const components = `${path}/components`;
    const hooks = `${path}/hooks`;

    if (!pathExistsSync(vue)) {
      const tmpStr = template.render(vueTmp, route);
      outputFileSync(vue, tmpStr);
    }
    if (!pathExistsSync(components)) {
      ensureDirSync(components);
    }
    if (!pathExistsSync(hooks)) {
      ensureDirSync(hooks);
    }
  }
}

function fmtRouter(routeStr) {
  const data = readFileSync(routeStr, "utf-8");
  const path_regex = /"path":\s*"([^"]+)",?/g;
  const name_regex = /"name":\s*"([^"]+)",?/g;
  const title_regex = /"title":\s*"([^"]+)",?/g;
  const paths = [];
  const names = [];
  const titles = [];

  let match;
  while ((match = path_regex.exec(data))) {
    paths.push(match[1].trim());
  }
  while ((match = name_regex.exec(data))) {
    names.push(match[1].trim());
  }
  while ((match = title_regex.exec(data))) {
    titles.push(match[1].trim());
  }
  return paths.map((v, i) => ({
    path: v,
    name: names[i] || '',
    title: titles[i] || '',
  }));
}
