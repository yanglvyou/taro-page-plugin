/**
 * 生成组件
 */
const fs = require('fs');
const path = require('path');

const componentJSX = ({ name, cssName, cssExtStr, version }) =>
  `
  ${
    version == 3
      ? `import React, { useState, useEffect } from 'react';`
      : `import React from 'react'`
  }
${
  version == 3
    ? `import { useDispatch, useSelector } from 'react-redux';`
    : `import { useSelector, useDispatch } from '@tarojs/redux';`
}
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { View, Input, Image, Text } from '@tarojs/components';
import classnames from 'classnames';
import { GlobalStoreState } from '@/models/index';
import { GlobalEnvStateStruct } from '@/models/globalEnv';
import { UserStateStruct } from '@/models/user';
import { CompanyStateStruct } from '@/models/company';


import './${cssName}.${cssExtStr}';

export interface ${name}Props  {
  className?: string
  children?:React.ReactNode
  style?:string | React.CSSProperties| undefined
}

const ${name} =(props:${name}Props)=>{
  const dispatch = useDispatch();

  const {
    globalEnv: GLOBAL,
    user: USERINFO,
    company: COMPANY,
  }: {
    globalEnv: GlobalEnvStateStruct;
    user: UserStateStruct;
    company: CompanyStateStruct;
  } = useSelector(({ globalEnv, user, company }) => {
    return { globalEnv, user, company };
  }) as GlobalStoreState;


  const {} = props;


  return (
    <View className='${cssName.toLowerCase()}' >
        ${name}-content
    </View>
  )
}

export default ${name};
`;

function writeFileErrorHandler(err) {
  if (err) throw err;
}

const style = (name) =>
  `.${name}{

}
`;

function ComponentGenerator({ component, cssExtStr, appPath, chalk, version }) {
  let pageName, componentName;

  const componentInfos = component.split('/');

  if (!componentInfos.length) {
    throw '组件参数必须是 【组件名称】或者 【页面文件夹/组件名称】';
  }

  if (componentInfos.length === 1) {
    componentName = componentInfos[0];
  }

  if (componentInfos.length === 2) {
    pageName = componentInfos[0];
    componentName = componentInfos[1];
    //检测页面是否存在
    const pageDir = path.join(appPath, 'src', 'pages', pageName);
    if (!fs.existsSync(pageDir)) {
      return console.log(
        chalk.red.bold(`页面目录【${pageDir}】不存在，无法创建页面组件！`),
      );
    }
  }
  // 页面组件
  if (pageName) {
    // 拼接路径
    const componentDir = path.join(
      appPath,
      'src',
      'pages',
      pageName,
      'components',
    );
    // 同步创建目录，recursive 设置为 true 支持递归创建。
    fs.mkdirSync(componentDir, { recursive: true });

    // 创建组件
    fs.writeFile(
      path.join(componentDir, `${componentName}.tsx`),
      componentJSX({
        name: componentName,
        cssName: componentName,
        cssExtStr,
        version,
      }),
      writeFileErrorHandler,
    );

    console.log(
      chalk.green.bold(
        '组件创建成功 🎉🎉🎉🎉🎉=>' +
          path.join(componentDir, `${componentName}.tsx`),
      ),
    );
    // index.${cssExt}

    fs.writeFile(
      path.join(componentDir, `${componentName}.${cssExtStr.toLowerCase()}`),
      style(componentName.toLowerCase()),
      writeFileErrorHandler,
    );

    console.log(
      chalk.green.bold(
        '样式创建成功 🎉🎉🎉🎉🎉=>' +
          path.join(
            componentDir,
            `${componentName}.${cssExtStr.toLowerCase()}`,
          ),
      ),
    );
  } else {
    // 项目组件
    const componentDir = path.join(appPath, 'src', 'components', componentName);
    fs.mkdirSync(componentDir, { recursive: true });

    fs.writeFile(
      path.join(componentDir, `${componentName}.tsx`),
      componentJSX({
        name: componentName,
        cssName: componentName,
        cssExtStr,
        version,
      }),
      writeFileErrorHandler,
    );

    console.log(
      chalk.green.bold(
        '组件创建成功 🎉🎉🎉🎉🎉=>' +
          path.join(componentDir, `${componentName}.tsx`),
      ),
    );
    // index.${cssExt}

    fs.writeFile(
      path.join(componentDir, `${componentName}.${cssExtStr.toLowerCase()}`),
      style(componentName.toLowerCase()),
      writeFileErrorHandler,
    );

    console.log(
      chalk.green.bold(
        '样式创建成功 🎉🎉🎉🎉🎉=>' +
          path.join(
            componentDir,
            `${componentName}.${cssExtStr.toLowerCase()}`,
          ),
      ),
    );
  }
}

export default ComponentGenerator;
