document.addEventListener('pjax:complete', tonav);
document.addEventListener('DOMContentLoaded', tonav);

function tonav() {
    var nameContainer = document.querySelector("#nav #name-container");
    var menusItems = document.querySelector("#nav .menus_items");
    
    // 如果找不到元素，直接返回
    if (!nameContainer || !menusItems) return;
    
    // 使用 requestAnimationFrame 优化性能
    var position = window.scrollY;
    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var scroll = window.scrollY;

                if (scroll > position + 5) {
                    // 向下滚动
                    nameContainer.classList.add("visible");
                    menusItems.classList.remove("visible");
                } else if (scroll < position - 5) {
                    // 向上滚动
                    nameContainer.classList.remove("visible");
                    menusItems.classList.add("visible");
                }

                position = scroll;
                ticking = false;
            });

            ticking = true;
        }
    });

    // 初始化 page-name
    var pageName = document.getElementById("page-name");
    if (pageName) {
        // 获取标题并去除后缀
        var title = document.title;
        var separator = " | "; // 根据实际标题分隔符调整
        if (title.includes(separator)) {
            pageName.innerText = title.split(separator)[0];
        } else {
            pageName.innerText = title;
        }
    }
}
