<!--
 * @Author: tangdaoyong
 * @Date: 2021-01-12 13:50:51
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-12 16:44:39
 * @Description: WKNavigationDelegate
-->
# WKNavigationDelegate

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

    
//    处理网页开始加载
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("网页开始加载\(#function)")
    }

    
    // 接收到服务器跳转请求即服务重定向时之后调用
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {

    }

    
//    处理网页加载失败
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("网页加载失败\(#function)")
    }

    
//    处理网页内容开始返回
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        print("网页内容开始返回\(#function)")
    }

    
//    处理网页加载完成
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("网页加载完成\(#function)")
        // 加载完成可以获取标题
        self.navigationItem.title = webView.title
        javaScriptRun(webView)
    }

    
//    处理网页返回内容时发生的失败
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("网页返回内容时发生的错误\(#function)")
    }

    
//    身份验证时调用
    @available(iOS 8.0, *)
//    func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
//
//    }

    
//    处理网页进程终止
    @available(iOS 9.0, *)
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        print("网页进程终止\(#function)")
    }

    
    /** @abstract Invoked when the web view is establishing a network connection using a deprecated version of TLS.
     @param webView The web view initiating the connection.
     @param challenge The authentication challenge.
     @param decisionHandler The decision handler you must invoke to respond to indicate whether or not to continue with the connection establishment.
     */
//    @available(iOS 14.0, *)
//    func webView(_ webView: WKWebView, authenticationChallenge challenge: URLAuthenticationChallenge, shouldAllowDeprecatedTLS decisionHandler: @escaping (Bool) -> Void) {
//
//    }
}
```