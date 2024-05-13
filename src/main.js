import { cac } from "cac";
import { create } from "./create.js";
import { defaultAction } from "./swagger/index.js";
import { createViews } from "./view/index.js";

const cli = cac();

cli.name = "v3-cli";
cli.version("1.0.5");
cli.help();
cli
  .command("create <project-name>", "创建一个v3-admin-el模版项目")
  .alias("ct")
  .option("-f, --force", "如果目标目录存在，则覆盖该目录")
  .action((projectName, cmd) => {
    create(projectName, cmd);
  });

cli
  .command("swagger [swagger-url]", "根据swagger-doc-api生成请求接口文件")
  .alias("swg")
  .option("-f, --force", "不需要网关名称(domain)")
  .action((swaggerUrl, cmd) => {
    defaultAction(swaggerUrl, cmd);
  });

cli
  .command("views", "根据router生成页面文件")
  .alias("sg")
  .action(() => {
    createViews();
  });

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (error) {
  console.error(error.stack);
  process.exit(1);
}
