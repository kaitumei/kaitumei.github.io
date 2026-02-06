/**
 * 自定义加载动画
 * 配置参数通过 window.loaderConfig 传递
 */

(function() {
  'use strict';

  // 获取加载动画配置
  function getLoaderConfig() {
    return window.loaderConfig || {};
  }

  // 初始化加载器
  function initLoader() {
    const config = getLoaderConfig();
    
    // 如果禁用加载器则直接返回
    if (config.enable === false) {
      return;
    }

    const container = document.createElement('div');
    container.className = 'custom-loader-container';
    
    // 检查是否为深色模式
    if (config.darkMode || (document.documentElement.getAttribute('data-theme') === 'dark')) {
      container.classList.add('dark');
    }

    // 创建加载内容
    const content = document.createElement('div');
    content.className = 'loader-content';

    // 添加加载图片
    if (config.imageUrl) {
      const img = document.createElement('img');
      img.className = 'loader-image ' + (config.animationType || 'spin');
      img.src = config.imageUrl;
      img.alt = 'Loading';
      content.appendChild(img);
    } else {
      // 默认加载动画（纯CSS）
      const defaultLoader = document.createElement('div');
      defaultLoader.className = 'loader-image ' + (config.animationType || 'spin');
      defaultLoader.innerHTML = '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="none" stroke="#49b1f5" stroke-width="3"/></svg>';
      content.appendChild(defaultLoader);
    }

    // 添加加载文字
    if (config.text) {
      const text = document.createElement('div');
      text.className = 'loader-text';
      text.textContent = config.text;
      content.appendChild(text);
    }

    // 添加进度条
    if (config.showProgress !== false) {
      const progress = document.createElement('div');
      progress.className = 'loader-progress';
      const progressBar = document.createElement('div');
      progressBar.className = 'loader-progress-bar';
      progress.appendChild(progressBar);
      content.appendChild(progress);
    }

    container.appendChild(content);
    document.body.insertBefore(container, document.body.firstChild);

    // 监听页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        hideLoader(container, config.duration || 500);
      });
    } else {
      // 页面已加载完成
      hideLoader(container, config.duration || 500);
    }

    // 监听 pjax 或其他动态加载事件
    if (window.Pjax) {
      document.addEventListener('pjax:beforeSend', function() {
        showLoader(container, config);
      });
      document.addEventListener('pjax:complete', function() {
        hideLoader(container, config.duration || 500);
      });
    }
  }

  // 显示加载器
  function showLoader(container, config) {
    if (container.classList.contains('fade-out')) {
      container.classList.remove('fade-out');
    }
    
    // 检查暗色模式
    if (config && config.darkMode) {
      container.classList.add('dark');
    } else if (document.documentElement.getAttribute('data-theme') === 'dark') {
      container.classList.add('dark');
    } else {
      container.classList.remove('dark');
    }
  }

  // 隐藏加载器
  function hideLoader(container, duration) {
    setTimeout(function() {
      container.classList.add('fade-out');
    }, duration);
  }

  // 在 DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
