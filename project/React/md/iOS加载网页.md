<!--
 * @Author: tangdaoyong
 * @Date: 2021-01-12 11:50:01
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-12 13:33:57
 * @Description: iOS加载网页
-->
# iOS加载网页

## 加载Web方式

`iOS`加载`Web`使用`UIWebView`和`WKWebView`
1. UIWebView
`iOS 12.0`已弃用，可以测试使用，但不能上架`APPStore`
```swift
@available(iOS, introduced: 2.0, deprecated: 12.0, message: "No longer supported; please adopt WKWebView.")
open class UIWebView : UIView, NSCoding, UIScrollViewDelegate
```
2. WKWebView
`iOS 8.0`引入
```swift
@available(iOS 8.0, *)
open class WKWebView : UIView
```

## UIWebView加载Web

现在已经不使用`UIWebView`了

## WKWebView加载Web

主要有如下三种方式：
```swift
/** @abstract Navigates to a requested URL.
     @param request The request specifying the URL to which to navigate.
     @result A new navigation for the given request.
     */
    open func load(_ request: URLRequest) -> WKNavigation?

    
    /** @abstract Navigates to the requested file URL on the filesystem.
     @param URL The file URL to which to navigate.
     @param readAccessURL The URL to allow read access to.
     @discussion If readAccessURL references a single file, only that file may be loaded by WebKit.
     If readAccessURL references a directory, files inside that file may be loaded by WebKit.
     @result A new navigation for the given file URL.
     */
    @available(iOS 9.0, *)
    open func loadFileURL(_ URL: URL, allowingReadAccessTo readAccessURL: URL) -> WKNavigation?

    
    /** @abstract Sets the webpage contents and base URL.
     @param string The string to use as the contents of the webpage.
     @param baseURL A URL that is used to resolve relative URLs within the document.
     @result A new navigation.
     */
    open func loadHTMLString(_ string: String, baseURL: URL?) -> WKNavigation?

    
    /** @abstract Sets the webpage contents and base URL.
     @param data The data to use as the contents of the webpage.
     @param MIMEType The MIME type of the data.
     @param characterEncodingName The data's character encoding name.
     @param baseURL A URL that is used to resolve relative URLs within the document.
     @result A new navigation.
     */
    @available(iOS 9.0, *)
    open func load(_ data: Data, mimeType MIMEType: String, characterEncodingName: String, baseURL: URL) -> WKNavigation?
```
1. 使用`loadHTMLString`
加载的是`html`字符串
```swift
private func loadHTMLString(_ webView: WKWebViewW) {
    let htmlString = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WKWebView load html string</title>
    </head>
    <body>
        <div id="app" style="width: 100%;height:400px;background-color: red;"></div>
    </body>
    </html>
    """
    webView.loadHTMLString(htmlString, baseURL: nil)
}
```

2. 使用`loadFileURL`
加载的是`html`文件路径
```swift
private func loadFileURL(_ webView: WKWebView) {
    guard let pathStr = Bundle.main.path(forResource: "index", ofType: "html") else {
        return
    }
    let url = URL.init(fileURLWithPath: pathStr)
    webView.loadFileURL(url, allowingReadAccessTo: url)
}
```

3. 使用`load`
加载的是网络资源
```swift
private func load(_ webView: WKWebView) {
    let loadURL = URL.init(string: "http://localhost:3000/#/home")
//  let loadURL = URL.init(string: "https://www.baidu.com/")
    guard let url = loadURL else {
        return
    }
    let urlRequest = URLRequest.init(url: url)
    loadWebView = webView.load(urlRequest)
}
```
*注意*
如果使用的是`http`协议，则需要配置`info.plist`
1. 开启`NSAllowsArbitraryLoads`
```xml
<key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
```
2. 设置 `NSExceptionDomains` 属性来访问指定域名
3. 只针对网页浏览和视频播放的行为且为`iOS 10`及以上，设置`NSAllowsArbitraryLoadsInWebContent`为`YES`。

[更多权限](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/)
```
麦克风权限：Privacy - Microphone Usage Description是否允许此App使用你的麦克风？

相机权限：Privacy - Camera Usage Description 是否允许此App使用你的相机？

相册权限：Privacy - Photo Library Usage Description 是否允许此App访问你的媒体资料库？

通讯录权限：Privacy - Contacts Usage Description 是否允许此App访问你的通讯录？

蓝牙权限：Privacy - Bluetooth Peripheral Usage Description是否许允此App使用蓝牙？

语音转文字权限：Privacy - Speech Recognition Usage Description是否允许此App使用语音识别？

日历权限：Privacy - Calendars Usage Description

定位权限：Privacy - Location When In Use Usage Description

定位权限:Privacy - Location Always Usage Description

位置权限：Privacy - Location Usage Description

媒体库权限：Privacy - Media Library Usage Description

健康分享权限：Privacy - Health Share Usage Description

健康更新权限：Privacy - Health Update Usage Description

运动使用权限：Privacy - Motion Usage Description

音乐权限：Privacy - Music Usage Description

提醒使用权限：Privacy - Reminders Usage Description

Siri使用权限：Privacy - Siri Usage Description

电视供应商使用权限：Privacy - TV Provider Usage Description

视频用户账号使用权限：Privacy - Video Subscriber Account Usage Description
```