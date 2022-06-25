const config = {
  markdownMessage: true, /* 是否开启 MarkDown 消息 关闭则使用 HTML 消息*/
  checkHtml: true, /* 在使用 HTML 消息时 检查 HTML 是否包含不安全元素 */
  uploadImg: true, /* 是否允许发送图片 */
  uploadImgPath: '../public/uploads', /* 图片保存路径 请写绝对路径 必须在 public 目录内 请确保文件夹存在 */
  uploadImgDirName: 'uploads', /* 图片保存路径的文件名 */
  uoloadImgMaxSize: (1024*1024*1024) * 2, /* 允许上传的最大图片大小 */
  uploadImgURL: '/', /* 图片文件前的 URL，例如：http://xxx.com/ 会被自动拼接成 http://xxx.com/文件夹名/aaa/bbb.jpg */
}
module.exports = config;
