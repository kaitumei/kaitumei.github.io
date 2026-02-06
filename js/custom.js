/* ===========================================
   Toast 通知
   =========================================== */
function showToast(message, duration = 2000) {
    // 检测当前主题
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || 
                      document.body.classList.contains('DarkMode');
    
    // 创建通知容器
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    // 简单的去重：如果最后一个 toast 内容相同且还在显示，就不重复添加
    const lastToast = container.lastElementChild;
    if (lastToast && lastToast.textContent.includes(message)) {
        return;
    }

    // 创建通知元素
    const toast = document.createElement('div');
    toast.innerHTML = `
        <span style="margin-right: 8px;">😊</span>
        <span>${message}</span>
    `;
    
    // 根据主题设置样式
    const lightStyles = {
        background: '#f0f9ff',
        border: '1px solid #bfdbfe',
        color: '#1e293b',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    };
    
    const darkStyles = {
        background: '#1e293b',
        border: '1px solid #475569',
        color: '#e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    };
    
    const currentStyles = isDarkMode ? darkStyles : lightStyles;
    
    toast.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 12px 16px;
        background: ${currentStyles.background};
        border: ${currentStyles.border};
        color: ${currentStyles.color};
        border-radius: 8px;
        box-shadow: ${currentStyles.boxShadow};
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        max-width: 320px;
        word-break: break-word;
        font-size: 14px;
        line-height: 1.4;
        cursor: pointer;
    `;

    container.appendChild(toast);

    // 进入动画
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    // 自动消失
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);

    // 点击关闭
    toast.addEventListener('click', () => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
}

/* ===========================================
   随机文章跳转
   =========================================== */
function toRandomPost() {
    showToast('正在寻找随机文章...', 1000);
    fetch('/search.xml')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const entries = data.querySelectorAll('entry');
            if (entries.length > 0) {
                const randomIndex = Math.floor(Math.random() * entries.length);
                const url = entries[randomIndex].querySelector('url').textContent;
                window.location.href = url;
            } else {
                showToast('暂时没有文章可以随机哦~');
            }
        })
        .catch(err => {
            console.error('Error fetching search.xml:', err);
            // Fallback to content.json
            fetch('/content.json')
                .then(res => res.json())
                .then(data => {
                     if (Array.isArray(data) && data.length > 0) {
                         const randomPost = data[Math.floor(Math.random() * data.length)];
                         window.location.href = randomPost.path || randomPost.url;
                     } else {
                         showToast('随机文章功能暂时不可用~');
                     }
                })
                .catch(e => {
                     console.error('Error fetching content.json:', e);
                     showToast('获取文章列表失败，请稍后再试~');
                });
        });
}

/* ===========================================
   404 页面增强 (动态注入按钮)
   =========================================== */
function init404Page() {
    // 1. 检测 404 页面 (通过 body-wrap 的类名判断，比 URL 更准确)
    const bodyWrap = document.getElementById('body-wrap');
    const is404 = bodyWrap && bodyWrap.classList.contains('type-404');
    
    // 为了兼容旧逻辑，如果是 404 页面，手动加上 is-404 类到 body (虽然 CSS 现在主要用 .type-404)
    if (is404) {
        document.body.classList.add('is-404');
    } else if (!location.pathname.includes('404')) {
        // 双重检查，如果 URL 不包含 404 且没有 type-404 类，则认为不是 404
        document.body.classList.remove('is-404');
        return;
    }

    // 2. 获取关键元素
    const errorInfo = document.querySelector('.error-info');
    // 防止重复注入
    if (errorInfo && !document.querySelector('.error_actions')) {
        console.log('Detected 404 page, injecting buttons...');

        // 1. 解除高度限制
        const errorContent = document.querySelector('.error-content');
        if (errorContent) {
            errorContent.style.height = 'auto';
            errorContent.style.minHeight = '360px';
        }

        // 2. 创建按钮容器
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'error_actions';
        actionsDiv.style.cssText = 'margin-top: 40px; display: flex; gap: 20px; justify-content: center; width: 100%;';
        
        // 定义按钮样式
        const btnStyle = `
            padding: 10px 30px;
            border-radius: 30px;
            background: var(--btn-bg, #49b1f5);
            color: var(--btn-color, #fff);
            text-decoration: none;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 1px;
        `;

        // 回到主页按钮
        const homeBtn = document.createElement('a');
        homeBtn.href = '/';
        homeBtn.className = 'error_button';
        homeBtn.style.cssText = btnStyle;
        homeBtn.innerHTML = '<i class="fas fa-home" style="margin-right: 6px;"></i><span>回到主页</span>';

        // 随便逛逛按钮
        const randomBtn = document.createElement('a');
        randomBtn.href = 'javascript:void(0);';
        randomBtn.className = 'error_button';
        randomBtn.style.cssText = btnStyle;
        randomBtn.onclick = function(e) {
            e.preventDefault();
            toRandomPost();
        };
        randomBtn.innerHTML = '<i class="fas fa-dice" style="margin-right: 6px;"></i><span>随便逛逛</span>';

        // 添加 hover 效果
        [homeBtn, randomBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.filter = 'brightness(1.1)';
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.filter = 'brightness(1)';
                btn.style.transform = 'translateY(0)';
            });
        });

        // 插入到页面
        actionsDiv.appendChild(homeBtn);
        actionsDiv.appendChild(randomBtn);
        errorInfo.appendChild(actionsDiv);
        
        // 3. 加载随机文章推荐
        load404RandomPosts();
    }
}

/* ===========================================
   404 页面随机文章推荐
   =========================================== */
function load404RandomPosts() {
    // 尝试获取 404 页面的主内容容器 #page
    let container = document.getElementById('page');
    // 如果没有 #page，则尝试 .error-content 的父级，或者回退到 body-wrap
    if (!container) {
         const errorContent = document.querySelector('.error-content');
         if (errorContent) container = errorContent.parentElement;
    }
    if (!container) {
        container = document.querySelector('.type-404'); // 回退
    }

    // 如果不是404页面或已经加载过，则跳过
    if (!container || document.getElementById('recent-posts-404')) return;

    // 创建容器
    const postsContainer = document.createElement('div');
    postsContainer.id = 'recent-posts-404';
    // 增加 margin: 60px auto 0 以水平居中并增加顶部间距
    postsContainer.style.cssText = 'width: 100%; max-width: 900px; margin: 60px auto 0; opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out;';
    
    // 标题
    const title = document.createElement('div');
    title.innerHTML = '<i class="fas fa-random" style="margin-right:8px"></i> 随便看看';
    title.style.cssText = 'text-align: center; margin-bottom: 20px; font-size: 1.4em; font-weight: bold; color: var(--font-color);';
    postsContainer.appendChild(title);

    // 列表容器
    const listContainer = document.createElement('div');
    listContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;';
    postsContainer.appendChild(listContainer);
    
    // 插入到容器末尾 (在 .error-content 之后)
    container.appendChild(postsContainer);
    
    // 简单的加载动画
    requestAnimationFrame(() => {
        postsContainer.style.opacity = '1';
        postsContainer.style.transform = 'translateY(0)';
    });

    // 获取数据
    fetch('/random_posts.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            
            // 随机选取 3 篇文章
            const shuffled = data.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            
            selected.forEach(entry => {
                // 默认封面
                let imgUrl = entry.cover || 'https://b5dbf24.webp.li/icons/nini.png'; 
                
                const item = document.createElement('div');
                item.className = 'post-item-404';
                item.style.cssText = `
                    width: calc(33.33% - 14px);
                    min-width: 260px;
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    padding: 12px;
                    box-sizing: border-box;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: 1px solid rgba(255,255,255,0.4);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                `;
                
                // 深色模式适配（简单判断）
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    item.style.background = 'rgba(50, 50, 50, 0.5)';
                    item.style.border = '1px solid rgba(255,255,255,0.1)';
                }

                item.innerHTML = `
                    <div class="thumbnail" style="width: 100%; height: 140px; overflow: hidden; border-radius: 8px; margin-bottom: 12px;">
                        <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;" onload="this.style.opacity=1" onerror="this.src='https://unpkg.zhimg.com/hexo-theme-butterfly/source/img/404.jpg'">
                    </div>
                    <div class="info">
                        <a href="${entry.path}" style="color: var(--font-color); text-decoration: none; font-weight: bold; font-size: 1.1em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">${entry.title}</a>
                    </div>
                `;

                // Hover 效果
                item.onmouseenter = () => {
                    item.style.transform = 'translateY(-5px)';
                    item.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    item.querySelector('img').style.transform = 'scale(1.1)';
                };
                item.onmouseleave = () => {
                    item.style.transform = 'translateY(0)';
                    item.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                    item.querySelector('img').style.transform = 'scale(1)';
                };
                item.onclick = (e) => {
                    if(e.target.tagName !== 'A') window.location.href = entry.path;
                };

                listContainer.appendChild(item);
            });
        })
        .catch(err => {
            console.error('Error loading 404 posts:', err);
            postsContainer.style.display = 'none';
        });
}

// 尝试在多个时机初始化 404 页面
init404Page();
document.addEventListener('DOMContentLoaded', init404Page);
document.addEventListener('pjax:complete', init404Page);

/* ===========================================
   全局功能增强
   =========================================== */
document.addEventListener('DOMContentLoaded', function() {
    // 覆盖主题默认的通知 (如果有)
    // 注意：btf 对象可能在 main.js 中定义，需要确保加载顺序或延时
    const overrideBtf = () => {
        if (typeof btf !== 'undefined' && btf.snackbarShow) {
            btf.snackbarShow = function(text) {
                showToast(text);
            };
        }
    };
    
    overrideBtf();
    // 监听 pjax 完成也重新覆盖一次（以防万一）
    document.addEventListener('pjax:complete', overrideBtf);
});

// 监听复制事件
document.addEventListener('copy', function(e) {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        showToast('复制成功！转载请注明出处哦~');
    }
});
