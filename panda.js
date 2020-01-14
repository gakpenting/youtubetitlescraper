// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     // await page.setViewport({ width: 1280, height: 800 });

//     const navigationPromise = page.waitForNavigation();


//     await page.goto('https://www.youtube.com/channel/UCPHctLhwKCot3t906B8Xvpg/videos');
//     // await page.waitForSelector('h1.title');
//     await page.evaluate(_ => {
//         window.scrollBy(0, window.innerHeight);
//     });
//     await page.waitFor(2000);
//     // await page.waitForSelector('#comments');
//     await navigationPromise;
//     // Write your code here

//     // await browser.close();
// })()

async function scrape(id) {
    let panda = []
    const axios = require("axios")
    // const id = "UCt4t-jeY85JegMlZ-E5UWtA";
    // const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    panda = hasil.data.items;

    let i = 0;
    let cubi = hasil.data.nextPageToken;
    // console.log(hasil.data.pageInfo.totalResults)
    while (cubi) {
        // console.log(cubi)
        const jamba = await nextPage(cubi, id)
        cubi = jamba.nextPageToken
        panda.push.apply(panda, jamba.items)
        i++
        await sleep(10000)
        // console.log(i)

    }
    // console.log("total", hasil.data.pageInfo.totalResults)
    // console.log(panda.length)
}
async function totalVideo(id) {
    const axios = require("axios")
    // const id = "UCt4t-jeY85JegMlZ-E5UWtA";
    // const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=1&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    return hasil.data
}
async function channelDescUsername(keke) {
    // const keke = "pewdiepie"
    const axios = require("axios")
    // console.log(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date&pageToken=${pageToken}`)
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${keke}&maxResults=1&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    return hasil.data.items[0]
}
async function channelDescId(keke) {
    // const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
    const axios = require("axios")
    // console.log(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date&pageToken=${pageToken}`)
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/channels?part=snippet&id=${keke}&maxResults=1&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    return hasil.data.items[0]
}

async function satuAja() {
    const Video = require('./models/video');
    const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
    const axios = require("axios")
    // console.log(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date&pageToken=${pageToken}`)
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${keke}&maxResults=1&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    console.log(hasil.data)
}

async function nextPage(pageToken, id) {
    const axios = require("axios")
    console.log(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date&pageToken=${pageToken}`)
    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date&pageToken=${pageToken}`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    return hasil.data
}
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = { channelDescUsername, channelDescId, totalVideo }