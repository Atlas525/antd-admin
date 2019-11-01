const prompt = require('prompt');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const echo = content => {
  process.stdout.write(`${content}\n`);
};

const template = `import React from 'react'

const Index = () => (
  <div>This is Index</div>
)

export default Index`;

function compileFolder({ name }) {
  const root = path.join(__dirname, '..', 'src/pages', name);
  if (fs.existsSync(root)) {
    throw new Error(`包${name}已经存在！`);
  }
  echo(`${chalk.yellow('创建文件')}${chalk.blue(name)}`);
  fs.mkdirSync(root);

  echo(`${chalk.yellow('创建components')}`);
  fs.mkdirSync(path.join(root, 'components'));
  echo(`${chalk.yellow('创建models')}`);
  fs.mkdirSync(path.join(root, 'models'));
  echo(`${chalk.yellow('创建services')}`);
  fs.mkdirSync(path.join(root, 'services'));
  echo(`${chalk.yellow('创建index.js')}`);
  fs.writeFileSync(path.join(root, 'index.js'), template);
  echo(`${chalk.green('创建完成')}`);
}

prompt.start();
prompt.get(
  {
    properties: {
      name: {
        pattern: /^([a-z]\w+)$/,
        description: '包的名称',
        message: '名字小写字母开头，只支持字母、数字、下划线',
        required: true,
      },
    },
  },
  (err, result) => {
    if (!err) {
      compileFolder(result);
    }
  }
);
