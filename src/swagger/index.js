import pc from "picocolors";
import { renderFunc } from "./render.js";
import { relativePath } from "../utils.js";
import { input } from "@inquirer/prompts";

// 读取配置文件
export const defaultAction = async (swaggerUrl, cmd) => {
  // swaggerUrl地址存在就不去读取配置文件
  if (swaggerUrl) {
    const swConfig = { entry: swaggerUrl };
    if (!cmd.force) {
      const answer = await input({ message: "请输入网关名称(domain的配置项)" });
      swConfig.domain = answer;
    }
    renderFunc(swConfig);
  } else {
    try {
      const filePath = relativePath(import.meta.url, "/v3.config.js");
      let swConfig = await import(filePath);
      renderFunc(swConfig.default);
    } catch (error) {
      console.error(pc.red("😩 未找到配置文件：v3.config.js\r\n"));
    }
  }
};
