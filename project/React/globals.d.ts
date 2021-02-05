/*
 * @Author: tangdaoyong
 * @Date: 2021-01-11 15:27:26
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-11 18:12:40
 * @Description: ts声明文件
 */
declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
// 全局声明
// declare module '*.scss' {
//     const classes: { readonly [key: string]: string };
//     export default classes;
// }