declare namespace ContentLayoutScssNamespace {
  export interface IContentLayoutScss {
    content: string;
  }
}

declare const ContentLayoutScssModule: ContentLayoutScssNamespace.IContentLayoutScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContentLayoutScssNamespace.IContentLayoutScss;
};

export = ContentLayoutScssModule;
