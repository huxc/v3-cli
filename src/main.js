import { cac } from "cac";
import { create } from "./create.js";
import { defaultAction } from "./swagger/index.js";
import { createPage } from "./view/index.js";
import { createViews } from "./view/fmt.js";

const cli = cac();

cli.name = "v3-cli";
cli.version("1.0.8");
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
  .action(() => {
    createViews();
  });

  cli
  .command("page", "")
  .action(() => {
    createPage();
  });

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (error) {
  console.error(error.stack);
  process.exit(1);
}

