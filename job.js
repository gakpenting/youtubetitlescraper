if (process.env.POPO === "de") {
  require("dotenv").config({ path: __dirname + "/.envexample" });
} else {
  require("dotenv").config();
}
const argv = require("yargs").argv;
const channelId = argv.channelId;
const publishedAfter = argv.publishedAfter;
const publishedBefore = argv.publishedBefore;
const { totalVideo } = require("./panda");
const axios = require("axios");
const Video = require("./models/video");
const CountString = require("./models/countString");

async function youtubeSearch(val) {
  // return { "hai": "sa " }
  try {
    const hasil = await axios.get(
      `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        val
      )}&type=channel&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM`,
      {
        headers: {
          referer:
            "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
          "x-origin": "https://explorer.apis.google.com"
        }
      }
    );
    console.log(hasil.data.items[0].snippet.channelId);
    // const hasils = await totalVideo(hasil.data.items[0].snippet.channelId)
    // console.log(hasils.items[0])
    // return hasil.data
  } catch (e) {
    console.log(e.message);
  }
}
async function scrapePerDate(source, id, publishedBefore, publishedAfter) {
  let panda = [];
  const axios = require("axios");
  // const id = "UCt4t-jeY85JegMlZ-E5UWtA";
  // const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
  let waktu = "";
  if (publishedAfter.trim() === "" && publishedBefore.trim() === "") {
    waktu = `&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}`;
  }
  const url = `https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}${waktu}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`;
  const hasil = await axios.get(url, {
    headers: {
      referer:
        "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
      "x-origin": "https://explorer.apis.google.com"
    }
  });
  panda = hasil.data.items;

  let i = 0;
  let cubi = hasil.data.nextPageToken;
  // console.log(hasil.data.pageInfo.totalResults)
  while (cubi) {
    console.log(cubi);
    const jamba = await nextPage(url, cubi);
    cubi = jamba.nextPageToken;
    panda.push.apply(panda, jamba.items);
    i++;
    await sleep(10000);
    console.log(i);
  }
  console.log("done scraping");
  for (let i = 0; i < panda.length; i++) {
    const cek = await Video.where({ video_id: panda[i].id.videoId }).count();
    if (cek === 0) {
      await Video.forge({
        video_id: panda[i].id.videoId,
        title: panda[i].snippet.title,
        date: panda[i].snippet.publishedAt.slice(0, 19).replace("T", " "),
        channel_id: panda[i].snippet.channelId,
        published_at: panda[i].snippet.publishedAt,
        page_token: ""
      }).save();
    }
  }
  console.log("done saving");
  await countWords(source, id);
  console.log("done countwords");
  return "done";

  // console.log("total", hasil.data.pageInfo.totalResults)
  // console.log(panda.length)
}
async function scrape(source, id) {
  let panda = [];
  const axios = require("axios");
  // const id = "UCt4t-jeY85JegMlZ-E5UWtA";
  // const keke = "UC1rKahkIlho-9uA8IxUFYkQ"
  const url = `https://content.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`;
  const hasil = await axios.get(url, {
    headers: {
      referer:
        "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
      "x-origin": "https://explorer.apis.google.com"
    }
  });
  panda = hasil.data.items;

  let i = 0;
  let cubi = hasil.data.nextPageToken;
  // console.log(hasil.data.pageInfo.totalResults)
  while (cubi) {
    // console.log(cubi)
    const jamba = await nextPage(url, cubi);
    cubi = jamba.nextPageToken;
    panda.push.apply(panda, jamba.items);
    i++;
    // await sleep(10000)
    console.log(i);
  }
  console.log("done scraping");
  for (let i = 0; i < panda.length; i++) {
    const cek = await Video.where({ video_id: panda[i].id.videoId }).count();
    console.log(i);
    if (cek === 0) {
      await Video.forge({
        video_id: panda[i].id.videoId,
        title: panda[i].snippet.title,
        date: panda[i].snippet.publishedAt.slice(0, 19).replace("T", " "),
        channel_id: panda[i].snippet.channelId,
        published_at: panda[i].snippet.publishedAt,
        page_token: ""
      }).save();
    }
  }
  console.log("done saving");
  await countWords(source, id);
  return "done";
  // console.log("total", hasil.data.pageInfo.totalResults)
  // console.log(panda.length)
}
async function countWords(source, id) {
  var decode = require("unescape");

  const countWord = await Video.where({ channel_id: id }).fetchAll();

  let saveWord = {};
  for (let i = 0; i < countWord.models.length; i++) {
    let sementara = decode(countWord.models[i].attributes.title).replace(
      /[^a-zA-Z/\s]/g,
      ""
    );
    const allWord = sementara;
    const semua = allWord.split(" ").filter(a => a !== "");

    for (let j = 0; j < semua.length; j++) {
      if (saveWord[semua[j]] === undefined) {
        saveWord[semua[j]] = {
          word: semua[j],
          translated: "",
          count: 1,
          title: [],
          parsedTitle: [],
          videoId: [],
          channelId: ""
        };
        saveWord[semua[j]].count = 1;
        saveWord[semua[j]].title = [countWord.models[i].attributes.title];
        saveWord[semua[j]].parsedTitle = [allWord];
        saveWord[semua[j]].videoId = [countWord.models[i].attributes.video_id];
        saveWord[semua[j]].channelId =
          countWord.models[i].attributes.channel_id;
      } else {
        saveWord[semua[j]].count += 1;
        saveWord[semua[j]].title.push(countWord.models[i].attributes.title);
        saveWord[semua[j]].parsedTitle.push(allWord);
        saveWord[semua[j]].videoId.push(
          countWord.models[i].attributes.video_id
        );
      }
    }
  }
  // return res.json(saveWord)
  let terakhir = [];
  for (let a in saveWord) {
    const tra = await translate(source, saveWord[a].word);
    saveWord[a].translated = tra;
    terakhir.push(saveWord[a]);
    console.log(saveWord[a].word);
  }
  try {
    await CountString.where({ channel_id: id }).destroy();
  } catch (e) {
    console.log(e.message);
  }

  for (let k = 0; k < terakhir.length; k++) {
    await CountString.forge({
      channel_id: terakhir[k].channelId,
      real_word: terakhir[k].word,
      word: terakhir[k].translated,
      count: terakhir[k].count
    }).save();
  }
  console.log("done saving word");
  return "done";
  // res.json({ total: terakhir.length, terakhir })
}
async function translate(source, val) {
  try {
    const key = process.env.YANDEX_TRANSLATE_API;
    const bro = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${encodeURIComponent(
      val
    )}&lang=${source}-en`;
    const pap = `https://cxl-services.appspot.com/proxy?url=${encodeURIComponent(
      `https://translation.googleapis.com/language/translate/v2/?q=${val}&source=${source}&target=en`
    )}&token=03AOLTBLQ8Z6BFWwdsKJveUhj_LocrEQqRVzbN6-2PszxHx-gn2S5orAbMVfmDeNu524I5KJA8HN-xrubPTlr8MmudAzsk5aC5IVXIb7J-vyrhmG4oGsphZT0uJVlWH0KS1BPgl-JcN1AyYVhrpnKVsfRKZ7pdJJAn5_s08kKLdwutmQuUa-nb-WRqwp4sIhlPd5FrlyQWrz39pYA3J1F4bFlFu_HKn2Zall1HSAuVoNVHCIGcd4jRIkNURSkf5svdhVws4S0AU64LfpptFDQFLdzr_QUpzciMMJ6W9b3IFdtcg8oZvDRUd_lPZKxdVkfrcaEzP-L7f_nvC-FoctR4W3LeWSdwy0PQuQ_eiV5SVqzClVvj-r8sX0CFoC821TdyAjNiwdz_Wh-a5IQTekCldO7nyT1N38H7ysyc-9uKJvHT9-SKvYj9vqLO5kA2USEElC6epa3FxN7GHqNLP-OL7DRRRWzyNPMnVSUfKtuz8LYsr-wAyGME2KxhfWk2xYAmm82HNOlZN1hev9utMfEoWq8ZrCVIwMRh4g`;
    const apa = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=en&dt=t&q=${encodeURIComponent(
      val
    )}`;
    const hasil = await axios.get(bro);
    return hasil.data.text[0];
  } catch (e) {
    return e;
  }
}
async function nextPage(url, pageToken) {
  const axios = require("axios");
  const hasil = await axios.get(`${url}&pageToken=${pageToken}`, {
    headers: {
      referer:
        "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
      "x-origin": "https://explorer.apis.google.com"
    }
  });
  return hasil.data;
}
async function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
module.exports = { scrape };
