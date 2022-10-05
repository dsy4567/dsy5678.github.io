// @ts-check
$(() => {
    const 完成加载 = () => {if(location.pathname.includes("blog")){
        let 博客名 = new URL(location.href).searchParams.get("name");
        if (博客名) {
            fetch(`/blog/${博客名}._md`)
                .then((res) => res.text())
                .then((md) => {
                    文章.innerHTML = marked.parse(md);

                    $(
                        "#文章 h1,#主要部分 h2,#主要部分 h3,#主要部分 h4,#主要部分 h5,#主要部分 h6"
                    ).each((i, e) => {
                        e.id = e.innerText;
                        e.outerHTML = `<a href="#${e.id}">${e.outerHTML}</a>`;
                    });
                });}
        }
    };
    加载完成事件.push(完成加载);
    完成加载();
});
