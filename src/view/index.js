import pc from "picocolors";
import fg from "fast-glob";
import { relativePath } from "../utils.js";
import template from "art-template";
import { outputFileSync, pathExistsSync, ensureDirSync } from "fs-extra/esm";
import { vueTmp } from "./viewTmp.js";
import ora from "ora";

const cwd = process.cwd();

export async function createViews() {
  const spinner = ora(" 文件生成中，请稍后...\r\n").start();
  // 读取配置文件
  try {
    const filePath = relativePath(import.meta.url, "/v3.config.js");
    let swConfig = await import(filePath);
    const { router } = swConfig.default;
    // 获取所有路由对象
    const routers = fg.globSync(`${router.path}/**/**`, {
      ignore: router.ignore,
    });
    routers.forEach(async (routePath) => {
      const rltPath = relativePath(import.meta.url, routePath);
      const route = await import(rltPath);
      const { children, meta } = route.default;
      deepRoute(children, meta.title, router.outPath);
    });

    // 太快了 让慢一点^_^
    setTimeout(() => {
      spinner.color = "green";
      spinner.text = `已生成！请查看${router.outPath}目录下`;
      spinner.succeed();
    }, 3000);
  } catch (error) {
    spinner.color = "red";
    spinner.text = "生成文件失败! 请检查配置文件地址是否正确？";
    spinner.fail();
    return;
  }
}

function deepRoute(childrens, title, outPath) {
  childrens.forEach((route) => {
    route.title = `${title}-${route.meta.title}`;

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
    if (route.children) {
      deepRoute(route.children, route.title, outPath);
    }
  });
}
