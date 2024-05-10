import download from "download-git-repo";
import ora from "ora";

export function downGit(path) {
  const spinner = ora("创建中……\r\n").start();
  download("huxc/v3Press", path, function (err) {
    if (err) {
      spinner.color = "red";
      spinner.text = "创建失败！";
      spinner.fail();
    } else {
      spinner.color = "green";
      spinner.text = "创建完成！";
      spinner.succeed();
    }
  });
}
