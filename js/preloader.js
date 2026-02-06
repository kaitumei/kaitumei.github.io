// source/js/preloader.js
var preloader = {
  endLoading: () => {
    // 增加DOM判断，避免报错
    const loadingBox = document.getElementById('loading-box');
    if (!loadingBox) return;
    
    document.body.style.overflow = 'auto';  // 页面加载完成，恢复滚动条
    loadingBox.classList.add("loaded");  // 添加 loaded 类，触发隐藏动画
  },
  initLoading: () => {
    // 增加DOM判断，避免报错
    const loadingBox = document.getElementById('loading-box');
    if (!loadingBox) return;
    
    document.body.style.overflow = '';  // 加载中，隐藏滚动条
    loadingBox.classList.remove("loaded");  // 移除 loaded 类，显示加载框
  }
};

// 页面完全加载完成（所有资源：图片、JS、CSS 等）自动隐藏加载框
window.addEventListener('load', () => { preloader.endLoading(); });

// 点击加载框手动隐藏（方便用户着急时跳过加载）
document.getElementById('loading-box')?.addEventListener('click', () => { preloader.endLoading(); });