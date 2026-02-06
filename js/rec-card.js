// Hexo自定义标签插件：{% link 标题, 链接, 图片链接 %}
hexo.extend.tag.register('link', function(args) {
  const title = args[0];   // 第一个参数：标题
  const url = args[1];     // 第二个参数：链接
  const img = args[2] || '默认图片链接'; // 第三个参数：图片（可选，没有则用默认图）
  
  // 渲染出的HTML要包含class="link-card"
  return `<a href="${url}" target="_blank" class="link-card">
            <img src="${img}" alt="${title}">
            <span class="link-title">${title}</span>
          </a>`;
});