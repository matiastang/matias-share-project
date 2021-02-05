<!--
 * @Author: tangdaoyong
 * @Date: 2021-01-12 13:55:58
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-12 13:58:47
 * @Description: WKUIDelegate
-->
# WKUIDelegate

```swift
extension ViewController: WKUIDelegate {
    
//    WKWebView创建初始化加载的一些配置(可以指定配置对象、导航动作对象、window特性)
    @available(iOS 8.0, *)
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
//        webViewConfig(configuration: configuration)
//        return webView
        //判断下当前请求的targetFrame是不是MainFrame，不是则要在主动加载链接
        if let isMain = navigationAction.targetFrame?.isMainFrame, !isMain {
            webView.load(navigationAction.request)
        }
        return nil
    }

    
//    处理WKWebView关闭的时间
    @available(iOS 9.0, *)
    func webViewDidClose(_ webView: WKWebView) {
        
    }

    
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

    
//    允许你的应用程序决定是否给定的元素应该显示预览
    @available(iOS, introduced: 10.0, deprecated: 13.0)
    func webView(_ webView: WKWebView, shouldPreviewElement elementInfo: WKPreviewElementInfo) -> Bool {
        return true
    }

    
//    允许你的应用程序提供一个自定义的视图控制器来显示当给定的元素被窥视。
    @available(iOS, introduced: 10.0, deprecated: 13.0)
    func webView(_ webView: WKWebView, previewingViewControllerForElement elementInfo: WKPreviewElementInfo, defaultActions previewActions: [WKPreviewActionItem]) -> UIViewController? {
        return nil
    }

    
    /** @abstract Allows your app to pop to the view controller it created.
     @param webView The web view invoking the delegate method.
     @param previewingViewController The view controller that is being popped.
     */
    @available(iOS, introduced: 10.0, deprecated: 13.0)
    func webView(_ webView: WKWebView, commitPreviewingViewController previewingViewController: UIViewController) {
        
    }

    
    // TARGET_OS_IPHONE
    
    
    /**
     * @abstract Called when a context menu interaction begins.
     *
     * @param webView The web view invoking the delegate method.
     * @param elementInfo The elementInfo for the element the user is touching.
     * @param completionHandler A completion handler to call once a it has been decided whether or not to show a context menu.
     * Pass a valid UIContextMenuConfiguration to show a context menu, or pass nil to not show a context menu.
     */
    @available(iOS 13.0, *)
    func webView(_ webView: WKWebView, contextMenuConfigurationForElement elementInfo: WKContextMenuElementInfo, completionHandler: @escaping (UIContextMenuConfiguration?) -> Void) {
        
    }

    
    
    /**
     * @abstract Called when the context menu will be presented.
     *
     * @param webView The web view invoking the delegate method.
     * @param elementInfo The elementInfo for the element the user is touching.
     */
    @available(iOS 13.0, *)
    func webView(_ webView: WKWebView, contextMenuWillPresentForElement elementInfo: WKContextMenuElementInfo) {
        
    }

    
    
    /**
     * @abstract Called when the context menu configured by the UIContextMenuConfiguration from
     * webView:contextMenuConfigurationForElement:completionHandler: is committed. That is, when
     * the user has selected the view provided in the UIContextMenuContentPreviewProvider.
     *
     * @param webView The web view invoking the delegate method.
     * @param elementInfo The elementInfo for the element the user is touching.
     * @param animator The animator to use for the commit animation.
     */
    @available(iOS 13.0, *)
    func webView(_ webView: WKWebView, contextMenuForElement elementInfo: WKContextMenuElementInfo, willCommitWithAnimator animator: UIContextMenuInteractionCommitAnimating) {
        
    }

    
    
    /**
     * @abstract Called when the context menu ends, either by being dismissed or when a menu action is taken.
     *
     * @param webView The web view invoking the delegate method.
     * @param elementInfo The elementInfo for the element the user is touching.
     */
    @available(iOS 13.0, *)
    func webView(_ webView: WKWebView, contextMenuDidEndForElement elementInfo: WKContextMenuElementInfo) {
        
    }

}
```