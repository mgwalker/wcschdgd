const template = await fetch(
  "https://www.foxsports.com/soccer/fifa-world-cup/schedule",
)
  .then((r) => r.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html
      .replace("<head>", "<head-content>")
      .replace("</head>", "</head-content>");
    return template;
  });

// Pull out all the styles; we need those
const styleNodes = [];
template.content.querySelector("head-content").childNodes.forEach((item) => {
  switch (item.tagName) {
    case "LINK":
      if (item.getAttribute("rel") !== "stylesheet") {
        break;
      }
      const url = new URL(
        item.getAttribute("href"),
        "https://www.foxsports.com/",
      );
      item.setAttribute("href", url.toString());
      styleNodes.push(item);
      item.remove();
      break;

    case "STYLE":
      styleNodes.push(item);
      item.remove();
      break;
  }
});
template.content.querySelectorAll("script").forEach((node) => {
  node.remove();
});

template.content.querySelector("head-content").remove();

document.body.appendChild(template.content.cloneNode(true));

document.head.append(...styleNodes);

// Remove the betting odds because I DO NOT CARE.
console.log("remove the stupid odds");
document.querySelectorAll("th.cell-odds,td.cell-odds").forEach((cell) => {
  cell.remove();
});

// Remove other junk
[
  ".takeover-header",
  ".takeover-bg",
  ".fscom-nav-menu.def",
  ".subnav-container-wrapper",
  ".pre-content",
  ".right-rail-content",
  ".fscom-footer",
].forEach((selector) => {
  document.querySelectorAll(selector).forEach((node) => {
    node.remove();
  });
});

const wrapper = document.querySelector(".scores-header-wrapper");
wrapper.style.top = 0;
wrapper.style.marginBottom = 0;
wrapper.remove();

document.querySelector(".scores-scorechips-container").style.marginTop = 0;

// const top = `${wrapper.getBoundingClientRect().height}px`;
const top = 0;
document.querySelectorAll(".table-title").forEach((node) => {
  node.style.top = top;
});
