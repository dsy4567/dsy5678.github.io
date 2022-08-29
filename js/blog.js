addEventListener("load", function () {
    document.querySelector("#文章").innerHTML = marked.parse(
        document.querySelector("#markdown").innerText.replaceAll("\\\\\\","")
    );
});
