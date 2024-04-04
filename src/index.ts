import crypto from 'crypto-js';
import c2k from 'koa-connect';
import { Plugin, SchemaBase } from '@pjblog/blog';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { HttpMiddlewares } from '@zille/http';
import { ViteDevServer, createServer } from 'vite';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __package_filepath = resolve(__dirname, '../package.json');

const pkg = require(__package_filepath);
const { MD5 } = crypto;

@Plugin.Injectable()
export default class ViteDevServerPlugin extends Plugin {
  public readonly cwd: string = __dirname;
  public readonly code: string = MD5(pkg.name).toString();
  public readonly version: string = pkg.version;
  public readonly name: string = pkg.name;
  public readonly description: string = pkg.description;
  public readonly readme: string = 'none';
  public readonly cover: string = null;
  public readonly advanceStaticDirectory: string = null;
  public readonly previews: string[] = [];
  public readonly schema: SchemaBase = null;
  public vite: ViteDevServer;

  public async initialize() {
    const middlewares = await this.$use(HttpMiddlewares);
    this.vite = await createServer({
      server: {
        middlewareMode: true,
      }
    })
    const viteMiddlewares = c2k(this.vite.middlewares);
    middlewares.add('suffix', viteMiddlewares);
    return () => middlewares.del('suffix', viteMiddlewares);
  }
}