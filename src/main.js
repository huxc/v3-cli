import { cac } from "cac";
import { create } from "./create.js";
import { defaultAction } from "./swagger/index.js";

const cli = cac();

cli.name = "v3";
cli.version("1.0.0");
cli.help();
cli
  .command("create <project-name>", "创建一个v3项目")
  .alias("c")
  .option("-f, --force", "如果目标目录存在，则覆盖该目录")
  .action((projectName, cmd) => {
    create(projectName, cmd);
  });

cli
  .command("swagger", "根据swagger生成api")
  .alias("swg")
  .action(() => {
    defaultAction();
  });

cli.parse();
