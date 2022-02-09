/**
 * 生成页面
 */
const fs = require('fs');
const path = require('path');

// 渲染的页面
const pageJSX = ({ name, cssName, cssExtStr, version }) =>
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

const pageStyle = name =>
  `.${name}{

}
`;

const config = () => `import { PageConfig } from '@tarojs/taro'

const config :PageConfig=  {
  navigationBarTitleText: 'weChat'
}

export default config
`;

function writeFileErrorHandler(err) {
  if (err) throw err;
}

function pageGenerator({
  page,
  cssExtStr,
  appPath,
  chalk,
  version,
  mode,
  subpackages,
}) {
  //判断页面情况
  let pagePath = page ? page : subpackages;

  const pages = pagePath.split('/');
  if (pages.length !== 1 && pages.length !== 2 && pages.length !== 3) {
    throw '页面参数必须是  index或者 index/index';
  }

  let pageGroup = '';
  let pageName = '';
  if (pages.length === 1) {
    pageGroup = pages[0];
    pageName = pages[0];
  }
  if (pages.length === 2) {
    pageGroup = pages[0];
    pageName = pages[1];
  }
  if (pages.length === 3) {
    pageGroup = `${pages[0]}/${pages[1]}`;
    pageName = pages[2];
  }


  const targetDir = path.join(appPath, 'src', page ? 'pages' : 'subpackages');
  const pageDir = path.join(targetDir, pageGroup);

  //创建目录
  fs.mkdirSync(pageDir, { recursive: true });

  // index.tsx
  fs.writeFile(
    path.join(pageDir, `${pageName}.tsx`),
    pageJSX({ name: pageName, cssName: pageName, cssExtStr, version }),
    writeFileErrorHandler,
  );
  console.log(
    chalk.green.bold(
      '组件创建成功 🎉🎉🎉🎉🎉=>' + path.join(pageDir, `${pageName}.tsx`),
    ),
  );

  // index.${cssExt}

  fs.writeFile(
    path.join(pageDir, `${pageName}.${cssExtStr.toLowerCase()}`),
    pageStyle(pageName.toLowerCase()),
    writeFileErrorHandler,
  );

  console.log(
    chalk.green.bold(
      '样式创建成功 🎉🎉🎉🎉🎉=>' +
        path.join(pageDir, `${pageName}.${cssExtStr.toLowerCase()}`),
    ),
  );

  if (version === 3) {
    // 页面config
    fs.writeFile(
      path.join(pageDir, `${pageName}.config.ts`),
      config(),
      writeFileErrorHandler,
    );
    console.log(
      chalk.green.bold(
        '创建成功=>' + path.join(pageDir, `${pageName}.config.ts`),
      ),
    );
  }

  //返回页面名称
  if (page) {
    return `pages/${pageGroup}/${pageName}`;
  }
  return `subpackages/${pageGroup}/${pageName}`;
}

export default pageGenerator;
