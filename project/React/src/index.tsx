import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routers/Root';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

ReactDOM.render(
    <ConfigProvider locale={ zh_CN }>
        <Root />
    </ConfigProvider>,
    document.getElementById('app')
);