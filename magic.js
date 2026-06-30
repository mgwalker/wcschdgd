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

const top = 0;
document.querySelectorAll(".table-title").forEach((node) => {
  node.style.top = top;
});

document
  .querySelectorAll(".cell-text.broadcast span.table-result")
  .forEach((node) => {
    const [, hourStr, minuteStr, ampm] =
      node.textContent.match(/(\d{1,2}):(\d{2})([AP]M)/) ?? [];
    if (hourStr && ampm) {
      const utcHour =
        (hourStr == "12" && ampm == "AM" ? 0 : +hourStr) +
        (ampm === "PM" ? 12 : 0);

      const time = new Date();
      time.setUTCHours(utcHour);

      const hour =
        time.getHours() > 12 ? time.getHours() - 12 : time.getHours();

      node.textContent = `${hour}:${minuteStr}${time.getHours() > 11 ? "PM" : "AM"}`;
    }
  });
