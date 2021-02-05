<!--
 * @Author: tangdaoyong
 * @Date: 2021-01-12 13:34:38
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-12 15:41:07
 * @Description: WKWebView
-->
# WKWebView使用

## 初始化
```swift
import WebKit

private var webView: WKWebView!

private func setWebView() {
        /*
         @available(iOS, introduced: 2.0, deprecated: 13.0, message: "Use the statusBarManager property of the window scene instead.")
         open var statusBarFrame: CGRect { get } // returns CGRectZero if the status bar is hidden
         */
        let windows = UIApplication.shared.connectedScenes.map({ $0 as? UIWindowScene}).compactMap({ $0 }).first?.windows
        var statusH:CGFloat = 0
//        if let keyWindow = windows?.first {
//            statusH = keyWindow.windowScene?.statusBarManager?.statusBarFrame.height ?? 0
//        }
//        UIScreen.main.applicationFrame.width
//        UIScreen.main.bounds.width
        let config = webViewConfig()
        webView = WKWebView.init(frame: CGRect.init(x: 0, y: statusH, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height - statusH), configuration: config)
        // UI代理
        webView.uiDelegate = self
        // 导航代理
        webView.navigationDelegate = self
        // 是否允许手势左滑返回上一级, 类似导航控制的左滑返回
        webView.allowsBackForwardNavigationGestures = true
        webView.mediaType = "no-header-and-footer-device"// 配合@media no-header-and-footer-device使用
        // 可返回的页面列表, 存储已打开过的网页
//        let backForwardList = webView.backForwardList
        self.view.addSubview(webView)
    }

```

## 加载

查看[iOS加载网页]()

## 获取加载进度

通过监听`WKNavigation`实例的`estimatedProgress`实现进度更新。
```swift
private lazy var progressBar:UIProgressView = {
    let progressBar = UIProgressView(frame: CGRect(x: 0, y: 0, width: self.view.frame.width, height: 30))
    progressBar.progress = 0.0
    progressBar.tintColor = UIColor.red
    return progressBar
}()

private func setProgressView() {
//        let progressBar = UIProgressView(frame: CGRect(x: 0, y: 0, width: self.view.frame.width, height: 30))
//        progressBar.progress = 0.0
//        progressBar.tintColor = UIColor.red
    webView.addSubview(progressBar)
}

private var loadWebView: WKNavigation? {
    didSet {
        addObserver()
    }
}

private func load(_ webView: WKWebView) {
//        let loadURL = URL.init(string: "http://localhost:3000")
        let loadURL = URL.init(string: "http://localhost:3000/#/home")
//        let loadURL = URL.init(string: "http://192.168.105.49:3000/#/test")
//        let loadURL = URL.init(string: "http://www.baidu.com/")
    guard let url = loadURL else {
        return
    }
    let urlRequest = URLRequest.init(url: url)
    loadWebView = webView.load(urlRequest)
}

override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "estimatedProgress" {
        print(webView.estimatedProgress)
        progressBar.alpha = 1.0
        progressBar.setProgress(Float(webView.estimatedProgress), animated: true)
            if(webView.estimatedProgress >= 1.0) {
            UIView.animate(withDuration: 0.3, delay: 0.1, options: UIView.AnimationOptions.curveEaseOut, animations: { () -> Void in
                self.progressBar.alpha = 0.0
            }, completion: { (finished:Bool) -> Void in
                self.progressBar.progress = 0
            })
        }
    }
}

deinit {
    removeObserver()
}

extension ViewController {
    
    private func addObserver() {
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: NSKeyValueObservingOptions.new, context: nil)
    }
    
    private func removeObserver() {
        webView.removeObserver(self, forKeyPath: "estimatedProgress", context: nil)
    }
}
```

## 获取标题

```swift
extension ViewController: WKNavigationDelegate {
    //    处理网页加载完成
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("网页加载完成\(#function)")
        // 加载完成可以获取标题
        self.navigationItem.title = webView.title
    }
}
```

## iOS与JS交互

`UIWebView`JS交互有如下方式：
1. 协议拦截
2. `JavaScriptCore`框架
3. `JSExport`协议

`WKWebView`JS交互有如下方式：
1. 协议拦截(`WKNavigationDelegate` 主要处理一些跳转、加载处理操作)
2. `WKUIDelegate`协议(`WKUIDelegate` 拦截`alert`、`confirm`、`prompt`三种js弹框)
3. `WKScriptMessageHandler`协议(`WKScriptMessageHandler`协议 专门用来处理监听`JavaScript`方法从而调用原生OC或Swift方法)

三方库`WebViewJavascriptBridge`对`UIWebView`与`WKWebView`做了统一处理。

### 协议拦截

```swift
extension ViewController: WKNavigationDelegate {
    
//    在发送请求之前，决定是否跳转 -> 默认允许
//    @available(iOS 8.0, *)
//    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
//
//    }

//    在发送请求之前，决定是否跳转 -> 默认允许
    @available(iOS 13.0, *)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, preferences: WKWebpagePreferences, decisionHandler: @escaping (WKNavigationActionPolicy, WKWebpagePreferences) -> Void) {
        /*
         * 使用 javaScriptEnabled 可以 disable 所有 webview 试图去加载的 js 文件
         * 新属性 allowsContentJavaScript, 使用这个属性可以禁用内联的 JS, url 方式加载的远端 js, 以及本地路径的 js 文件, 但是 native 直接执行的 js 仍然有效 在 decidePolicy 代理方法中使用 WKWebpagePreferences, 更可以对每个 web 页面进行更细致的配置, 来决定当前 web 页面是否加载 js
         */
        if let url = navigationAction.request.url {
            if let seheme = url.scheme, seheme == "jsToIOS".lowercased() {
                decisionHandler(.cancel, preferences)
                return
            }
            if url.absoluteString.hasPrefix("http://") {
//                preferences.allowsContentJavaScript = false
            }
        }
        preferences.preferredContentMode = .mobile
        decisionHandler(.allow, preferences)
    }

    
//    根据客户端受到的服务器响应头以及response相关信息来决定是否可以跳转
//    在收到响应后，决定是否跳转 -> 默认允许
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        //允许跳转
        decisionHandler(.allow)
        //不允许跳转
//        decisionHandler(.cancel)
    }
}
```

### `WKUIDelegate`协议

```swift
//    处理网页js中的提示框,若不使用该方法,则提示框无效
//    处理js里的alert
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        // 使用系统提示
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (_) -> Void in
            completionHandler()
        }))
        self.present(alert, animated: true, completion: nil)
    }

    
//    处理网页js中的确认框,若不使用该方法,则确认框无效
//    处理js里的confirm
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        // 使用系统提示
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (_) -> Void in
            completionHandler(true)
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (_) in
            completionHandler(false)
        }))
        self.present(alert, animated: true, completion: nil)
    }

    
//    处理网页js中的文本输入
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let alert = UIAlertController(title: nil, message: "", preferredStyle: .alert)
        alert.addTextField { (textField) in
            print(textField.text ?? "")
        }
        alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (_) -> Void in
            if let firstTextField = alert.textFields?.first {
                completionHandler(firstTextField.text)
            } else {
                completionHandler(nil)
            }
        }))
        self.present(alert, animated: true, completion: nil)
    }
```
### `WKScriptMessageHandler`协议

#### JS调用iOS

1. 设置`WKWebViewConfiguration`

```swift
extension ViewController {
    private func webViewConfig() ->WKWebViewConfiguration {
        let config = WKWebViewConfiguration()
        // 创建设置对象
        let preference = WKPreferences()
        //最小字体大小 当将javaScriptEnabled属性设置为NO时，可以看到明显的效果
        preference.minimumFontSize = 0
        //设置是否支持javaScript 默认是支持的
        /*
         ios14.0已废弃
         @available(iOS, introduced: 8.0, deprecated: 14.0, message: "Use WKWebPagePreferences.allowsContentJavaScript to disable content JavaScript on a per-navigation basis")
         */
//        preference.javaScriptEnabled = true
        // 在iOS上默认为NO，表示是否允许不经过用户交互由javaScript自动打开窗口
        preference.javaScriptCanOpenWindowsAutomatically = true
        config.preferences = preference
        
//        config.limitsNavigationsToAppBoundDomains = true

        // 是使用h5的视频播放器在线播放, 还是使用原生播放器全屏播放
        config.allowsInlineMediaPlayback = true
        //设置视频是否需要用户手动播放  设置为NO则会允许自动播放
        config.requiresUserActionForMediaPlayback = true
        //设置是否允许画中画技术 在特定设备上有效
        config.allowsPictureInPictureMediaPlayback = true
        //设置请求的User-Agent信息中应用程序名称 iOS9后可用
        config.applicationNameForUserAgent = "ChinaDailyForiPad"
         //自定义的WKScriptMessageHandler 是为了解决内存不释放的问题
//        let weakScriptMessageDelegate = WeakWebViewScriptMessageDelegate(self)
        //这个类主要用来做native与JavaScript的交互管理
        let wkUController = WKUserContentController()
        //注册一个js方法(注册之后可以在js调用window.webkit.messageHandlers.注册的方法名.postMessage(parameters);)
//        wkUController.add(self, name: "jsConsole")// 使用WKScriptMessageHandler
        let contentWorld = WKContentWorld.page
        /*
         WKContentWorld.defaultClient客户的默认世界。
         WKContentWorld.page当前网页内容的内容世界。
         */
        wkUController.addScriptMessageHandler(self, contentWorld: contentWorld, name: "jsConsole")// 使用WKScriptMessageHandlerWithReply
//        wkUController.addScriptMessageHandler(weakScriptMessageDelegate, contentWorld: contentWorld, name: "reload")
        wkUController.addScriptMessageHandler(self, contentWorld: contentWorld, name: "reload")
       config.userContentController = wkUController
        
//        WKUserScript：用于进行JavaScript注入
        //以下代码适配文本大小，由UIWebView换为WKWebView后，会发现字体小了很多，这应该是WKWebView与html的兼容问题，解决办法是修改原网页，要么我们手动注入JS
//        let jSString = "var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width'); document.getElementsByTagName('head')[0].appendChild(meta);"
        let jSString = "document.body.style.background = 'yellow';"
        //用于进行JavaScript注入
        let wkUScript = WKUserScript.init(source: jSString, injectionTime: .atDocumentEnd, forMainFrameOnly: true, in: contentWorld)
        config.userContentController.addUserScript(wkUScript)
        return config
    }
}
```
*注意*注册的方法使用完成之后需要
```
// 移除注入js的方法
webView.configuration.userContentController.removeScriptMessageHandler(forName: "jsConsole")
```
2. 实现协议`WKScriptMessageHandler`或`WKScriptMessageHandlerWithReply`
```swift
extension ViewController: WKScriptMessageHandler {
    
    @available(iOS 8.0, *)
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "jsConsole" {
            print(message.name, message.body)
            return
        }
        print("没有对应的方法")
    }
}

extension ViewController: WKScriptMessageHandlerWithReply {
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage, replyHandler: @escaping (Any?, String?) -> Void) {
        if message.name == "jsConsole" {
            print(message.body)
            if let body = message.body as? [String : String], body["status"] == "success" {
                replyHandler(body, nil)
            } else {
                replyHandler(nil, "Unexpected message received")
            }
            return
        }
        if message.name == "reload" {
            print(message.body)
            webView.reload()
            replyHandler("reload success", nil)
            return
        }
        print("没有对应的方法")
    }
}
```
#### iOS调用JS

1. js方法
```js

```
2. iOS调用
使用`evaluateJavaScript`执行JS代码
```swift

```
