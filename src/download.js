import download from "download-git-repo";
import ora from "ora";
import pc from "picocolors";
import { confirm } from "@inquirer/prompts";
import { execa } from "execa";
import { outputFileSync,mkdirsSync,ensureDirSync,ensureFileSync } from "fs-extra/esm";

export function downGit(cwd) {
  const spinner = ora("正在创建项目…\r\n").start();
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
        spinner.text = "创建项目已完成！";
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
        await execa({ cwd })`git init`;
        outputFileSync(`${cwd}/.eslintrc-auto-import.json`,`{"globals": {}}`)
        await execa({ stdout: ["pipe", "inherit"], cwd })`pnpm install`;
        const spinner2 = ora("正在初始化eslint…\r\n").start();
        try {
            await execa({ cwd })`pnpm run lint`;
        } catch (error) {
        }
        spinner2.color = "green";
        spinner2.text = "😄 项目初始化已完成";
        spinner2.succeed();
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
