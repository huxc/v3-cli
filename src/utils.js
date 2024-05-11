import path from "path";
import { fileURLToPath } from "url";

// 绝对路径转相对路径
export function relativePath(fromPath, toPath) {
  try {
    const __toPath = path.join(process.cwd(), toPath);
    const __dirname = path.dirname(fileURLToPath(fromPath));
    const rltPath = path.relative(__dirname, __toPath);
    const relativePath = rltPath.replace(/\\/g, "/");
    return relativePath;
  } catch (error) {
    console.error(error);
  }
}
