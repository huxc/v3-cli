import Axios from "axios";
import ora from "ora";
import dayjs from "dayjs";
import template from "art-template";
import { camelCase, replace, mapKeys } from "lodash-es";
import { outputFileSync, emptyDirSync } from "fs-extra/esm";
import { t_header, t_content } from "./apiTmp.js";

export async function renderFunc(swConfig) {
  const spinner = ora(" 文件生成中，请稍后...\r\n");
  spinner.start();
  const outputPath = swConfig?.output?.path
    ? swConfig.output.path
    : process.cwd() + "/api/auto-api";
  let res = "";
  try {
    res = await Axios.default.get(swConfig.entry);
  } catch (e) {
    spinner.color = "red";
    spinner.text = "请求失败! 请输入正确的swagger文档api地址";
    spinner.fail();
    return;
  }
  // 格式化模版所需要的数据
  const artData = renderData(res.data, swConfig);

  const artContent = swConfig.template || t_content;
  const artTmp = t_header + artContent;

  // 清空文件夹
  emptyDirSync(outputPath);
  // 创建文件
  artData.forEach((item) => {
    const apijs = template.render(artTmp, item);
    outputFileSync(`${outputPath}/${item.fileName}.js`, apijs);
  });

  // 太快了 让慢一点^_^
  setTimeout(() => {
    spinner.color = "green";
    spinner.text = `已生成！请查看${outputPath}目录下`;
    spinner.succeed();
  }, 3000);
}

//处理接口返回数据
function renderData(data, swConfig) {
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
      if (swConfig.domain) {
        rqs.domain = swConfig.domain;
      }
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
  return artData;
}
