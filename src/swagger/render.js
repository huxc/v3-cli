import Axios from "axios";
import ora from "ora";
import dayjs from "dayjs";
import template from "art-template";
import { camelCase, replace, mapKeys } from "lodash-es";
import { outputFileSync, emptyDirSync } from "fs-extra/esm";

export async function renderFunc(swConfig) {
  const spinner = ora(" 文件生成中，请稍后...\r\n");
  spinner.start();
  const outputPath = swConfig?.output?.path
    ? swConfig.output.path
    : process.cwd() + "/auto-api";
  let res = "";
  try {
    res = await Axios.default.get(swConfig.entry);
  } catch (e) {
    spinner.succeed();
    consoleError("Request failed", "entry must be the correct swagger-doc-api");
    return;
  }
  const data = res.data;

  const info = {
    fileDescription: data.info.description,
    title: data.info.title,
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    host: data.host,
    basePath: data.basePath,
    description: "",
    version: data.info.version,
  };

  const artData = []; //渲染模版的数据

  const tags = data?.tags.reduce((prev, cur) => {
    prev[cur.name] = replace(camelCase(cur.description), "Controller", "");
    return prev;
  }, {});

  const paths = {};
  mapKeys(data.paths, (path, pathKey) => {
    mapKeys(path, (rqsType, typeKey) => {
      //获取tags 用于分组
      const key = tags[rqsType.tags[0]];
      if (!paths[key]) {
        paths[key] = [];
      }
      const rpcPath = pathKey.replace(/\//g, "_");
      const fuName = camelCase(`${typeKey}${rpcPath}`);
      const rqs = {
        url: pathKey,
        type: typeKey,
        fuName,
        description: rqsType.tags[0],
        parameters: rqsType.parameters || [],
      };

      paths[key].push(rqs);
    });
  });

  mapKeys(paths, (value, key) => {
    const file = {
      ...info,
      funs: value,
      fileName: key,
      description: value[0].description,
    };
    artData.push(file);
  });
  const cwd = process.cwd();
  emptyDirSync(outputPath);
  artData.forEach((item) => {
    const apijs = template(`${cwd}/src/template/api.art`, item);
    outputFileSync(`${outputPath}/${item.fileName}.js`, apijs);
  });
  // 太快了 想让慢一点
  setTimeout(() => {
    spinner.color = "green";
    spinner.text = `已生成！请查看${outputPath}目录下`;
    spinner.succeed();
  }, 3000);
}
