import download from "download-git-repo";
import ora from "ora";
import pc from "picocolors";
import { confirm } from "@inquirer/prompts";
import { execa } from "execa";

export function downGit(cwd) {
  const spinner = ora("创建中……\r\n").start();
  download(
    "direct:https://gitee.com/aron-ogawa/v3-admin-el.git",
    cwd,
    { clone: true },
    async (err) => {
      if (err) {
        spinner.color = "red";
        spinner.text = "创建失败！";
        spinner.fail();
        return;
      } else {
        spinner.color = "green";
        spinner.text = "创建完成！";
        spinner.succeed();
      }
      const isPnpm = await confirm({ message: "是否使用 pnpm 初始化项目" });
      let isInstallPnpm = false;
      if (isPnpm) {
        try {
          await execa`pnpm -v`;
          isInstallPnpm = true;
        } catch (error) {
          isInstallPnpm = false;
          console.log(`😑${pc.red("尚未安装pnpm，请先安装pnpm")}`);
        }
      }
      if (isInstallPnpm) {
        await execa({ stdout: ["pipe", "inherit"], cwd })`pnpm install`;

        spinner.color = "green";
        spinner.text = "😄安装依赖已完成";
        spinner.succeed();
      }
      const isVscode = await confirm({
        message: `是否在vscode中打开项目`,
      });
      if (isVscode) {
        await execa({ cwd })`code .`;
      }
    }
  );
}
