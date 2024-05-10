import pc from "picocolors";
import { pathExistsSync, removeSync } from "fs-extra/esm";
import { join } from "path";
import { confirm } from "@inquirer/prompts";
import { downGit } from "./download.js";

export async function create(projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd();
  // 拼接得到项目目录
  const targetDirectory = join(cwd, projectName);
  // 判断目录是否存在
  if (pathExistsSync(targetDirectory)) {
    // 判断是否使用 --force 参数
    if (options.force) {
      // 删除重名目录
      removeSync(targetDirectory);
      console.log(pc.green("存在同名目录，以强制删除！\r\n"));
      downGit(targetDirectory);
    } else {
      const allowEmail = await confirm({
        message: "存在同名文件，是否删除",
      });
      if (allowEmail) {
        removeSync(targetDirectory);
        downGit(targetDirectory);
      } else {
        console.log("以退出！");
        return;
      }
    }
  } else {
    downGit(targetDirectory);
  }
}
