import path from "path";
import { fileURLToPath } from "url";
import { renderFunc } from "./render.js";

export const defaultAction = async (args = []) => {
  let [, , , filePath] = args;
  // 如果用户填入配置文件的路径则走默认文件名 /v3.config.js
  if (filePath) {
    filePath = process.cwd() + "/" + filePath;
  } else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const relativePath = path.relative(
      __dirname,
      process.cwd() + "/v3.config.js"
    );
    filePath = relativePath.replace(/\\/g, "/");
  }
  let swConfig = await import(filePath);
  renderFunc(swConfig.default);
};

export const pathFunc = () => {
  console.log("暂时不满足路径功能", process.cwd());
};
