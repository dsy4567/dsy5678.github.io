// @ts-check
var 网页加载完毕 = false;
var 动态加载完毕 = true;
var 进度条第一次动 = false;
var 进度条进度 = 0;
var 进度条定时器 = null;
var 进度条超时 = null;
var 脚本信息;
var /** @type {Function[]} */ 加载完成事件 = [];

function 滚动事件() {
    if (document.documentElement.scrollTop === 0) {
        $(导航栏).css("backgroundColor", "var(--theme-color1)");
        $(导航栏).css("boxShadow", "none");
        $(回到顶部按钮).css("transform", "translateX(64px)");
    } else {
        $(导航栏).css("backgroundColor", "var(--theme-color3)");
        $(导航栏).css("boxShadow", "0 12px 16px 0 var(--theme-color3)");
        $(回到顶部按钮).css("transform", "translateX(0px)");
    }
}
function 完成加载() {
    // @ts-ignore
    $("a").each((i, /** @type {HTMLAnchorElement} */ e) => {
        if (e.host !== location.host) {
            $(e).addClass("外链");
            $(e).attr("target", "_blank");
        } else {
            if (e.href.includes("#")) {
                return;
            }
            // 事件监听器.forEach((fn) => {
            //     try {
            //         e.removeEventListener("click", fn);
            //     } catch (e) {}
            // });
            $(e).off();
            /** @param {MouseEvent} ev */
            let fn = (ev) => {
                if (动态加载完毕) {
                    动态加载完毕 = false;
                    动态加载(e);
                    ev.preventDefault();
                    return false;
                }
            };
            // 事件监听器.push(fn);
            // @ts-ignore
            e.onclick = fn;
        }
    });

    加载完成事件.forEach((f) => f());
    滚动事件();
    加载脚本();

    设置进度条进度(100);
}
/** @param {HTMLAnchorElement} el  */
function 动态加载(el) {
    try {
        // if (el.href.endsWith(".zip")) {
        //     设置进度条进度(0);
        //     设置进度条进度(100);
        //     动态加载完毕 = true;
        //     return window.open(el.href, "_self");
        // }
        设置进度条进度(0);
        fetch(el.pathname)
            .then((res) => res.text())
            .then((html) => {
                try {
                    let m = html.match(
                        /<!-- START MAIN -->.+<!-- END MAIN -->/s
                    );
                    let mt = html.match(/<title>.+<\/title>/s);
                    let 标题 = "dsy4567 的小站";
                    if (!m) {
                        return el.click();
                    }
                    if (mt) {
                        标题 = mt[0].split(/<\/?title>/)[1];
                    }

                    let _临时主要部分 = 临时主要部分,
                        _主要部分 = 主要部分;
                    _临时主要部分.innerHTML = m[0];
                    _临时主要部分.id = "主要部分";
                    _主要部分.id = "临时主要部分";
                    _主要部分.innerHTML = "";
                    document.title = 标题;
                    // 事件监听器 = [];
                    完成加载();
                    history.replaceState(null, "", el.pathname);
                    动态加载完毕 = true;
                    // 菜单按钮.onclick(0);
                    设置进度条进度(100);
                } catch (err) {
                    console.error(err);
                    el.click();
                    设置进度条进度(-1);
                }
            })
            .catch(() => {
                el.click();
                设置进度条进度(-1);
            });
    } catch (err) {
        el.click();
        设置进度条进度(-1);
    }
}
function 设置进度条进度(进度) {
    if (进度 === 100) {
        进度条.style.opacity = "1";
        进度条进度 = 0;
        进度条.style.width = "100%";
        进度条超时 = setTimeout(() => {
            进度条.style.opacity = "0";
            setTimeout(() => {
                进度条.style.width = "0%";
            }, 200);
        }, 500);
        clearInterval(进度条定时器);
        // 回到顶部();
        return;
    }
    if (进度 === -1) {
        进度条.style.opacity = "1";
        进度条进度 = 0;
        进度条.style.backgroundColor = "rgb(255, 0, 0)";
        进度条.style.width = "100%";
        进度条超时 = setTimeout(() => {
            进度条.style.opacity = "0";
            setTimeout(() => {
                进度条.style.backgroundColor = "rgb(0, 255, 255)";
                进度条.style.width = "0%";
            }, 200);
        }, 500);
        clearInterval(进度条定时器);
        return;
    }
    clearTimeout(进度条超时);
    进度条.style.width = "5%";
    进度条.style.opacity = "1";
    进度条定时器 = setInterval(() => {
        if (!(进度条进度 >= 100)) {
            进度条进度 += 5;
        }
        进度条.style.width = 进度条进度 + "%";
    }, 500);
}
function 加载脚本(json) {
    if (json) 脚本信息 = json;
    if (!脚本信息) return;
    let /** @type {string[] | undefined} */ 脚本 =
            脚本信息[location.pathname.split(/[\?\/\.\#]/g)[1]];
    if (脚本 && 脚本[0]) {
        脚本.forEach((url) => {
            if ($("script[src*='" + url + "']")[0]) return;

            let $script = document.createElement("script");
            $script.src = url;
            document.body.append($script);
        });
    }
}
function 回到顶部() {
    document.body.scrollIntoView({ behavior: "smooth" });
}
fetch("/js/scripts.json")
    .then((res) => res.json())
    .then((/** @type {Record<String, String[]>} */ json) => {
        加载脚本(json);
    });

$(() => {
    document.body.onscroll = 滚动事件;
    完成加载();
    加载界面.remove();
    网页加载完毕 = true;
});
