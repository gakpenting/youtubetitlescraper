const puppeteer = require("puppeteer");

async function papa(url) {
  console.log("scraping " + url);
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    '--user-agent="Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"'
  ];

  const options = {
    args,
    headless: true,
    ignoreHTTPSErrors: true,
    userDataDir: "./tmp"
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url);
  // await page.setViewport({
  //     width: 1200,
  //     height: 800
  // });
  // await page.waitForNavigation({ waitUntil: 'networkidle0' }),

  const popo = await autoScroll(page);
  await browser.close();
  console.log("selesai");
  return popo;
}
async function autoScroll(page) {
  const pu = await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = window.innerHeight;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        let pons = document.querySelectorAll("div.cbox")[5];
        if (pons) {
          pons.click();
        }

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });

    let com = document.getElementsByClassName("compact-media-item-headline");
    let com2 = document.getElementsByClassName(
      "compact-media-item-metadata-content"
    );

    let ko = [];
    for (let i = 0; i < com.length; i++) {
      ko.push({ id: com2[i].textContent, text: com[i].textContent });
    }

    return ko;
  });

  return pu;
}
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = { papa };
