import { IPluginContext } from '@tarojs/service';

import ComponentGenerator from './template/component';
import PageGenerator from './template/page';

const CSS_MAP = {
  css: 'css',
  scss: 'scss',
  less: 'less',
};

export default (ctx: IPluginContext, pluginOpts) => {
  // version 表示 Taro 版本号
  const { css = 'scss', version = 3 } = pluginOpts;

  ctx.registerCommand({
    // 命令名
    name: 'template',
    // 执行 taro template --help 时输出的 options 信息
    optionsMap: {
      '--component': '组件名称(大写)',
      '--page': '页面路径',
      '--subpackages': '分包页面路径',
    },
    // 执行 taro template --help 时输出的使用例子的信息
    synopsisList: [
      'taro template --component Button             (生成=>/components/Button/Button.tsx)',
      'taro template --component 页面名称/Banner     (生成=>/pages/页面名称/components/Banner.tsx)',
      'taro template --page index                   (生成=>pages/index/index.tsx)',
      'taro template --page mime/balance            (生成=>pages/mime/balance.tsx)',
      'taro template --subpackages index            (生成=>subpackages/index/index.tsx)',
      'taro template --subpackages mime/balance     (生成=>subpackages/mime/balance.tsx)',
    ],
    async fn() {
      const { chalk, resolveScriptPath } = ctx.helper;
      let { component, page, subpackages } = ctx.runOpts.options;

      const { appPath, sourcePath } = ctx.paths;

      if (!CSS_MAP[css]) {
        console.log(chalk.red(`不支持该${css}样式类型！！`));
        return;
      }

      const cssExtStr = css;

      if (
        typeof component !== 'string' &&
        typeof page !== 'string' &&
        typeof subpackages !== 'string'
      ) {
        return console.log(chalk.red('请输入需要创建的组件/页面名称！！'));
      }
      // 创建组件
      if (typeof component === 'string') {
        // @ts-ignore
        ComponentGenerator({ component, cssExtStr, appPath, chalk, version });
      }

      // 创建页面
      if (typeof page === 'string' || typeof subpackages === 'string') {
        try {
          PageGenerator({
            page,
            cssExtStr,
            appPath,
            chalk,
            version,
            subpackages,
          });
        } catch (error) {
          console.log(chalk.red(error));
        }
      }
    },
  });
};
