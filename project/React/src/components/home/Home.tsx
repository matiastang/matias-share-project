import React, { FC, useEffect, useState, useCallback } from 'react';
import styles from './home.scss';

interface IOSFunc {
    (arg: string): void
}

declare var window: Window & typeof globalThis & {
    webkit: any,
    iOSCallFunction: IOSFunc
};

const Home: FC = () => {

    const [text, setText] = useState('iOS调用方法改变文本');

    enum MESSAGETYPE {
        alert,
        confirm,
        prompt
    }
    
    const showMessage = useCallback((e, type: MESSAGETYPE) => {
        switch (type) {
            case MESSAGETYPE.alert:
                alert(`${e.target.innerText}`);
                break;
            case MESSAGETYPE.confirm:
                if (confirm(`${e.target.innerText}`)) {
                    e.target.innerText += 'OK';
                } else {
                    e.target.innerText += 'Cancel';
                }
                break;
            case MESSAGETYPE.prompt:
                let inputText = prompt(`${e.target.innerText}`);
                if (inputText) {
                    alert(inputText);
                }
                break;
            default:
                break;
        }
        
    }, []);

    const gotoURL = useCallback((url) => {
        window.location.href = url
    }, []);

    const messageHandler = useCallback(() => {
        let parameters = {
            'status': 'success'
        };
        window.webkit.messageHandlers.jsFunc.postMessage(parameters);
    }, []);

    const messageHandlerWithReply = useCallback(() => {
        let parameters = {
            'status': 'success'
        };
        let promise = window.webkit.messageHandlers.jsConsole.postMessage(parameters);
        promise.then((result: any) => {
            alert(result);
        }).catch((err: any) => {
            alert(err);
        });
    }, []);

    const reload = useCallback(() => {
        let parameters = {
            'status': 'success'
        };
        window.webkit.messageHandlers.reload.postMessage(parameters);
    }, []);

    useEffect(() => {
        window.iOSCallFunction = (arg: string) => {
            setText(`iOS调用方法改变文本:${arg}`);
        };
    });

    return (
        <div className={ styles.home }>
            <p>Home{ window.location.hash }</p>
            <img className={ styles.img } src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" onClick={ () => gotoURL('https://www.baidu.com') }></img>
            <p>协议拦截</p>
            <div className={ styles.itemDiv }>
                <div onClick={() => gotoURL('jsToIOS://www.baidu.com?name=tdy') }>协议拦截跳转</div>
            </div>
            <p>`WKUIDelegate`协议</p>
            <div className={ styles.itemDiv }>
                <div onClick={ (e) => showMessage(e, MESSAGETYPE.alert) }>WKUIDelegate协议拦截alert</div>
                <div onClick={ (e) => showMessage(e, MESSAGETYPE.confirm) }>WKUIDelegate协议拦截confirm</div>
                <div onClick={ (e) => showMessage(e, MESSAGETYPE.prompt) }>WKUIDelegate协议拦截prompt</div>
            </div>
            <p>`WKScriptMessageHandler`或`WKScriptMessageHandlerWithReply`协议</p>
            <div className={ styles.messageHandler }>
                <div onClick={ messageHandler }>JS调用IOS方法无返回</div>
                <div onClick={ messageHandlerWithReply }>JS调用IOS方法有返回</div>
                <div onClick={ reload }>刷新</div>
                <div>{ text }</div>
                <div id="IOSJS" style={{ margin: '20px' }}>iOS设置margin</div>
            </div>
        </div>   
    );
};

export default Home;