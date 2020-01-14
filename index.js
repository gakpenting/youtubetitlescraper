const express = require('express')
const app = express()
const port = process.env.PORT
const axios = require("axios")
var bodyParser = require('body-parser')
const Video = require('./models/video');
const Channel = require('./models/channel');
const CountString = require('./models/countString');
const RemoveWord = require('./models/removeWord');
const User = require('./models/user');
const Queue = require('./models/queue');
const lib = require('./panda')
app.use(bodyParser.json())
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render("landing"))
app.get('/admin', (req, res) => res.render("admin", { tipe: "dashboard" }))
app.get('/removeword', (req, res) => res.render("remove_word", { tipe: "removeword" }))
app.get('/channels', (req, res) => res.render("channel", { tipe: "channels" }))
app.get('/json', async (req, res) => res.json(await youtubeSearch(req.query.channel)))
app.get('/byTime', async (req, res) => res.json(await youtubeSearchByTime(req.query.language, req.query.publishedAfter, req.query.publishedBefore, req.query.channelId)))
app.get('/channelToken', async (req, res) => res.json(await youtubeSearchNextPage(req.query.val, req.query.channelToken)))
app.get('/translate', async (req, res) => res.json(await translate(req.query.source, req.query.translate)))
app.get('/supportedLanguage', async (req, res) => res.json(await supportedLanguage()))
app.get('/allremoveword', async (req, res) => {
    const page = req.query.page === undefined ? 1 : req.query.page;
    const hasil = await RemoveWord.simplePaginate({ page: page })
    const total = await RemoveWord.count()
    const last_page = Math.ceil(total / hasil.meta.pagination.per_page)
    const per_page = hasil.meta.pagination.per_page
    const current_page = hasil.meta.pagination.current_page

    const next_page_url = hasil.meta.pagination.links.next !== null ? `/allremoveword?page=${hasil.meta.pagination.links.next}` : hasil.meta.pagination.links.next
    const prev_page_url = hasil.meta.pagination.links.previous !== null ? `/allremoveword?page=${hasil.meta.pagination.links.previous}` : hasil.meta.pagination.links.previous
    const to = current_page * per_page
    const from = to - last_page
    const data = hasil.data

    res.json({ total, per_page, current_page, last_page, next_page_url, prev_page_url, from, to, data })
})
app.get('/allchannel', async (req, res) => {
    const page = req.query.page === undefined ? 1 : req.query.page;

    const hasil = await Channel.simplePaginate({ page: page })
    const total = await Channel.count()
    const last_page = Math.ceil(total / hasil.meta.pagination.per_page)
    const per_page = hasil.meta.pagination.per_page
    const current_page = hasil.meta.pagination.current_page

    const next_page_url = hasil.meta.pagination.links.next !== null ? `/allchannel?page=${hasil.meta.pagination.links.next}` : hasil.meta.pagination.links.next
    const prev_page_url = hasil.meta.pagination.links.previous !== null ? `/allchannel?page=${hasil.meta.pagination.links.previous}` : hasil.meta.pagination.links.previous
    const to = current_page * per_page
    const from = to - last_page
    const data = hasil.data

    res.json({ total, per_page, current_page, last_page, next_page_url, prev_page_url, from, to, data })
})
app.get('/allwords/:id/all', async (req, res) => {
    const removeWord = await RemoveWord.fetchAll()
    let go = removeWord.models.map(a => `'${a.attributes.real_word.toLowerCase()}'`)

    const hasil = await CountString.query(function (qb) {
        qb.where("channel_id", "=", req.params.id)
        if (go.length > 0) {
            qb.whereRaw(`LOWER(word) NOT IN (${go.join(",")})`)
        }

        qb.limit(20);
    }).orderBy('count', 'DESC').fetchAll()
    res.json(hasil)
})
app.get('/allwords/:id', async (req, res) => {

    const page = req.query.page === undefined ? 1 : req.query.page;

    const hasil = await CountString.where({ channel_id: req.params.id }).orderBy('count', 'DESC').simplePaginate({ page: page })
    const total = await CountString.where({ channel_id: req.params.id }).count()
    const last_page = Math.ceil(total / hasil.meta.pagination.per_page)
    const per_page = hasil.meta.pagination.per_page
    const current_page = hasil.meta.pagination.current_page

    const next_page_url = hasil.meta.pagination.links.next !== null ? `/allwords/${req.params.id}?page=${hasil.meta.pagination.links.next}` : hasil.meta.pagination.links.next
    const prev_page_url = hasil.meta.pagination.links.previous !== null ? `/allwords/${req.params.id}?page=${hasil.meta.pagination.links.previous}` : hasil.meta.pagination.links.previous
    const to = current_page * per_page
    const from = to - last_page
    const data = hasil.data

    res.json({ total, per_page, current_page, last_page, next_page_url, prev_page_url, from, to, data })
})
app.get('/trilema', async (req, res) => {

    var decode = require('unescape');

    const countWord = await Video.where({ channel_id: "UCRxgRBFHeivnzVM3NSIaQAA" }).fetchAll()


    let saveWord = {}
    for (let i = 0; i < countWord.models.length; i++) {

        let sementara = decode(countWord.models[i].attributes.title).replace(/[^a-zA-Z/\s]/g, "")
        const allWord = await translate("id", sementara)
        const semua = allWord.split(" ").filter(a => a !== "")

        for (let j = 0; j < semua.length; j++) {
            if (saveWord[semua[j]] === undefined) {
                saveWord[semua[j]] = { word: semua[j], count: 1, title: [], parsedTitle: [], videoId: [], channelId: "" }
                saveWord[semua[j]].count = 1
                saveWord[semua[j]].title = [countWord.models[i].attributes.title]
                saveWord[semua[j]].parsedTitle = [allWord]
                saveWord[semua[j]].videoId = [countWord.models[i].attributes.video_id]
                saveWord[semua[j]].channelId = countWord.models[i].attributes.channel_id
            } else {
                saveWord[semua[j]].count += 1
                saveWord[semua[j]].title.push(countWord.models[i].attributes.title)
                saveWord[semua[j]].parsedTitle.push(allWord)
                saveWord[semua[j]].videoId.push(countWord.models[i].attributes.video_id)

            }
        }
    }
    // return res.json(saveWord)
    let terakhir = []
    for (let a in saveWord) {
        // const translation = await translate("id", saveWord[a].word)
        // saveWord[a].translated = translation
        terakhir.push(saveWord[a])
        console.log(saveWord[a].word)
    }


    console.log("done")
    res.json({ total: terakhir.length, terakhir })
    // res.json({ total: ho.length, data: ho })

})
app.get('/allvideo/:id', async (req, res) => {

    const page = req.query.page === undefined ? 1 : req.query.page;

    const hasil = await Video.where({ channel_id: req.params.id }).orderBy('date', 'DESC').simplePaginate({ page: page })
    const total = await Video.where({ channel_id: req.params.id }).count()
    const last_page = Math.ceil(total / hasil.meta.pagination.per_page)
    const per_page = hasil.meta.pagination.per_page
    const current_page = hasil.meta.pagination.current_page

    const next_page_url = hasil.meta.pagination.links.next !== null ? `/allvideo/${req.params.id}?page=${hasil.meta.pagination.links.next}` : hasil.meta.pagination.links.next
    const prev_page_url = hasil.meta.pagination.links.previous !== null ? `/allvideo/${req.params.id}?page=${hasil.meta.pagination.links.previous}` : hasil.meta.pagination.links.previous
    const to = current_page * per_page
    const from = to - last_page
    const data = hasil.data

    res.json({ total, per_page, current_page, last_page, next_page_url, prev_page_url, from, to, data })
})
let kue = {};
app.get('/allqueue', async (req, res) => {
    if (kue === {}) {
        const pu = await Queue.fetchAll();
        pu.forEach(async (a) => await Queue.forge({ id: a.attributes.id }).save({ autoOrManual: "" }))

    }
    const page = req.query.page === undefined ? 1 : req.query.page;

    const hasil = await Queue.simplePaginate({ page: page })
    const total = await Queue.count()
    const last_page = Math.ceil(total / hasil.meta.pagination.per_page)
    const per_page = hasil.meta.pagination.per_page
    const current_page = hasil.meta.pagination.current_page

    const next_page_url = hasil.meta.pagination.links.next !== null ? `/allqueue?page=${hasil.meta.pagination.links.next}` : hasil.meta.pagination.links.next
    const prev_page_url = hasil.meta.pagination.links.previous !== null ? `/allqueue?page=${hasil.meta.pagination.links.previous}` : hasil.meta.pagination.links.previous
    const to = current_page * per_page
    const from = to - last_page
    const data = hasil.data

    res.json({ total, per_page, current_page, last_page, next_page_url, prev_page_url, from, to, data })
})
app.get('/getallchannel', async (req, res) => {
    let hasilQueue = await Queue.fetchAll();
    let hasilChannel = await Channel.fetchAll();
    let semua = {}
    let queue = hasilQueue.map(a => a.attributes.channel_id)
    let channel = hasilChannel.forEach(z => {
        if (queue.indexOf(z.attributes.channel_id) === -1) {
            semua[z.attributes.channel_id] = z.attributes.channel_url
        }
    })

    res.json(semua)
})
app.post('/savechannel', async (req, res) => {
    try {
        const url = new URL(req.body.url);
        let channel = null;
        if (url.pathname.indexOf("user") > -1 && url.hostname.indexOf("youtube") > -1) {
            channel = await lib.channelDescUsername(url.pathname.split("/")[2])
            const cek = await Channel.where({ channel_id: channel.id }).count()
            if (cek === 0) {
                const total = await lib.totalVideo(channel.id)
                const totalVideo = total.pageInfo.totalResults
                const selesai = await Channel.forge({
                    title: channel.snippet.title,
                    channel_url: req.body.url,
                    channel_id: channel.id,
                    published_at: channel.snippet.publishedAt,
                    page_token: "",
                    username: channel.snippet.customUrl,
                    total_video: totalVideo
                }).save()
                if (selesai) {
                    res.json({ status: true })
                } else {
                    res.json({ status: false })
                }
            } else {
                res.json({ status: false })
            }


        } else {
            channel = await lib.channelDescId(url.pathname.split("/")[2])
            const cek = await Channel.where({ channel_id: channel.id }).count()
            if (cek === 0) {
                const total = await lib.totalVideo(channel.id)
                const totalVideo = total.pageInfo.totalResults
                const selesai = await Channel.forge({
                    title: channel.snippet.title,
                    channel_url: req.body.url,
                    channel_id: channel.id,
                    published_at: channel.snippet.publishedAt,
                    page_token: "",
                    username: channel.snippet.customUrl,
                    total_video: totalVideo
                }).save()
                if (selesai) {
                    res.json({ status: true })
                } else {

                    res.json({ status: false })
                }
            } else {
                // res.json({ cek })
                res.json({ status: false })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.json({ status: false })
    }
})
var job = {} //keeping the job in memory to kill it

app.get('/startqueuemanual/:source/:id', async function (req, res) {

    const auto = await Queue.forge({ id: req.params.id }).save({ autoOrManual: "manual" })
    const channel = await Queue.where({ id: req.params.id }).fetch()
    const s = require("./job")
    await s.scrape(req.params.source, channel.attributes.channel_id)
    if (auto) {
        await Queue.forge({ id: req.params.id }).save({ autoOrManual: "" })
        return res.json({ status: true })
    } else {
        await Queue.forge({ id: req.params.id }).save({ autoOrManual: "" })
        return res.json({ status: false })
    }
})



app.get('/startqueueauto/:source/:id', async (req, res) => {
    var CronJob = require('cron').CronJob;
    const job = new CronJob('0 0 0 * * *', async function () {
        const channel = await Queue.where({ id: req.params.id }).fetch()
        const s = require("./job")
        await s.scrape(req.params.source, channel.attributes.channel_id)
    });

    kue[req.params.id] = job
    kue[req.params.id].start()
    const auto = await Queue.forge({ id: req.params.id }).save({ autoOrManual: "auto" })
    if (auto) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }

})
app.get('/stopqueuemanual/:id', async (req, res) => {
    console.log("stopped manual")

    const auto = await Queue.forge({ id: req.params.id }).save({ autoOrManual: "" })
    if (auto) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }

})
app.get('/stopqueueauto/:id', async (req, res) => {
    console.log("stopped")
    kue[req.params.id].stop()
    const auto = await Queue.forge({ id: req.params.id }).save({ autoOrManual: "" })
    if (auto) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }

})
app.post('/savequeue', async (req, res) => {
    try {
        let url = req.body.url;
        let channel = null;

        channel = await Channel.where({ channel_id: url }).fetch()

        const cek = await Queue.where({ channel_id: channel.attributes.channel_id }).count()
        if (cek === 0) {

            const selesai = await Queue.forge({
                channel_id: channel.attributes.channel_id,
                completed: false,
                ongoing: true,
                pageToken: "",
                autoOrManual: "",
                username: channel.attributes.username,

            }).save()
            if (selesai) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        } else {
            res.json({ status: false })
        }

    } catch (e) {
        console.log(e.message)
        res.json({ status: false })
    }
})
app.post('/saveremoveword', async (req, res) => {
    const sukses = await RemoveWord.forge({ real_word: req.body.real_word }).save()
    if (sukses) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
})
app.get('/deletechannel/:id', async (req, res) => {
    // res.send(req.params.id)
    const sukses = await Channel.forge({ id: req.params.id }).destroy()
    if (sukses) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
})
app.get('/deleteremoveword/:id', async (req, res) => {
    // res.send(req.params.id)
    const sukses = await RemoveWord.forge({ id: req.params.id }).destroy()
    if (sukses) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
})

app.post('/updatechannel/:id', async (req, res) => {
    try {
        const url = new URL(req.body.url);
        let channel = null;
        if (url.pathname.indexOf("user") > -1 && url.hostname.indexOf("youtube") > -1) {
            channel = await lib.channelDescUsername(url.pathname.split("/")[2])
            const cek = await Channel.where({ channel_id: channel.id }).count()

            if (cek === 0) {
                const total = await lib.totalVideo(channel.id)
                const totalVideo = total.pageInfo.totalResults
                const selesai = await Channel.forge({ id: req.params.id }).save({
                    title: channel.snippet.title,
                    channel_url: req.body.url,
                    channel_id: channel.id,
                    published_at: channel.snippet.publishedAt,
                    page_token: "",
                    username: channel.snippet.customUrl,
                    total_video: totalVideo
                })
                if (selesai) {
                    res.json({ status: true })
                } else {
                    res.json({ status: false })
                }
            } else {
                res.json({ status: false })
            }


        } else {
            channel = await lib.channelDescId(url.pathname.split("/")[2])
            const cek = await Channel.where({ channel_id: channel.id }).count()
            if (cek === 0) {
                const total = await lib.totalVideo(channel.id)
                const totalVideo = total.pageInfo.totalResults
                const selesai = await Channel.forge({ id: req.params.id }).save({
                    title: channel.snippet.title,
                    channel_url: req.body.url,
                    channel_id: channel.id,
                    published_at: channel.snippet.publishedAt,
                    page_token: "",
                    username: channel.snippet.customUrl,
                    total_video: totalVideo
                })
                if (selesai) {
                    res.json({ status: true })
                } else {
                    res.json({ status: false })
                }
            } else {
                res.json({ status: false })
            }
        }
    } catch (e) {
        res.json({ status: false })
    }

})
app.post('/updateremoveword/:id', async (req, res) => {
    const sukses = await RemoveWord.forge({ id: req.params.id }).save({ real_word: req.body.real_word })
    if (sukses) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
})
app.get('/video', async (req, res) => {
    const video = await Video.fetchAll()
    res.json({ video })
})
app.get('/video/:channel_id', async (req, res) => {
    const video = await Video.where({ channel_id: req.params.channel_id })
    res.json({ video })
})
app.get('/save', async (req, res) => {
    const video = await Video.fetchAll()
    res.json({ video })

})

async function translate(source, val) {
    try {
        const key = `trnsl.1.1.20200109T052340Z.6fe109dbf7acb136.e947fd22f811e31967d58041b10d645c16bba1bb`
        const bro = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${encodeURIComponent(val)}&lang=${source}-en`
        const pap = `https://cxl-services.appspot.com/proxy?url=${encodeURIComponent(`https://translation.googleapis.com/language/translate/v2/?q=${val}&source=${source}&target=en`)}&token=03AOLTBLQ8Z6BFWwdsKJveUhj_LocrEQqRVzbN6-2PszxHx-gn2S5orAbMVfmDeNu524I5KJA8HN-xrubPTlr8MmudAzsk5aC5IVXIb7J-vyrhmG4oGsphZT0uJVlWH0KS1BPgl-JcN1AyYVhrpnKVsfRKZ7pdJJAn5_s08kKLdwutmQuUa-nb-WRqwp4sIhlPd5FrlyQWrz39pYA3J1F4bFlFu_HKn2Zall1HSAuVoNVHCIGcd4jRIkNURSkf5svdhVws4S0AU64LfpptFDQFLdzr_QUpzciMMJ6W9b3IFdtcg8oZvDRUd_lPZKxdVkfrcaEzP-L7f_nvC-FoctR4W3LeWSdwy0PQuQ_eiV5SVqzClVvj-r8sX0CFoC821TdyAjNiwdz_Wh-a5IQTekCldO7nyT1N38H7ysyc-9uKJvHT9-SKvYj9vqLO5kA2USEElC6epa3FxN7GHqNLP-OL7DRRRWzyNPMnVSUfKtuz8LYsr-wAyGME2KxhfWk2xYAmm82HNOlZN1hev9utMfEoWq8ZrCVIwMRh4g`
        const apa = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=en&dt=t&q=${encodeURIComponent(val)}`
        const hasil = await axios.get(bro)
        return hasil.data.text[0]
    } catch (e) {
        return e
    }


}
async function supportedLanguage() {
    try {
        const key = `trnsl.1.1.20200109T052340Z.6fe109dbf7acb136.e947fd22f811e31967d58041b10d645c16bba1bb`
        const apa = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=${key}`
        // const apa = `https://cxl-services.appspot.com/proxy?url=${encodeURI("https://translation.googleapis.com/language/translate/v2/languages/?target=en")}&token=03AOLTBLQ8Z6BFWwdsKJveUhj_LocrEQqRVzbN6-2PszxHx-gn2S5orAbMVfmDeNu524I5KJA8HN-xrubPTlr8MmudAzsk5aC5IVXIb7J-vyrhmG4oGsphZT0uJVlWH0KS1BPgl-JcN1AyYVhrpnKVsfRKZ7pdJJAn5_s08kKLdwutmQuUa-nb-WRqwp4sIhlPd5FrlyQWrz39pYA3J1F4bFlFu_HKn2Zall1HSAuVoNVHCIGcd4jRIkNURSkf5svdhVws4S0AU64LfpptFDQFLdzr_QUpzciMMJ6W9b3IFdtcg8oZvDRUd_lPZKxdVkfrcaEzP-L7f_nvC-FoctR4W3LeWSdwy0PQuQ_eiV5SVqzClVvj-r8sX0CFoC821TdyAjNiwdz_Wh-a5IQTekCldO7nyT1N38H7ysyc-9uKJvHT9-SKvYj9vqLO5kA2USEElC6epa3FxN7GHqNLP-OL7DRRRWzyNPMnVSUfKtuz8LYsr-wAyGME2KxhfWk2xYAmm82HNOlZN1hev9utMfEoWq8ZrCVIwMRh4g`
        const hasil = await axios.get(apa)
        return hasil.data.langs
    } catch (e) {
        return e.message
    }
}
async function loopingNext(token, timing, channelId) {
    // try {

    const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?pageToken=${token}&part=snippet${timing}&channelId=${channelId}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
        headers: {
            "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
            "x-origin": "https://explorer.apis.google.com",

        }
    })
    return hasil.data
    // } catch (e) {

    // }

}
async function youtubeSearchByTime(language, publishedAfter, publishedBefore, channelId) {
    // return { "hai": "sa " }
    let total, totalSementara, sementara, semua, translates = 0
    let timing = `&publishedBefore=${publishedBefore}&publishedAfter=${publishedAfter}`
    if (publishedBefore.trim() === '' && publishedAfter.trim() === '') {
        timing = ''
    }
    try {
        const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet${timing}&channelId=${channelId}&maxResults=50&type=video&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM&order=date`, {
            headers: {
                "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
                "x-origin": "https://explorer.apis.google.com",

            }
        })
        semua = hasil.data
        sementara = hasil.data.items;

        let cekToken = "";

        if (hasil.data.nextPageToken) {
            cekToken = hasil.data.nextPageToken
        }
        let j = 0;
        for (; ;) {
            if (cekToken.trim() === '') {
                break;
            }
            j++
            const res = await loopingNext(cekToken, timing, channelId)
            for (let i = 0; i < res.items.length; i++) {
                sementara.push(res.items[i])
            }
            if (res.nextPageToken) {
                cekToken = res.nextPageToken
            }
            if (j === 3) break;
        }
        total = hasil.data.pageInfo.totalResults
        totalSementara = sementara.length
        translates = []

        // for (let k = 0; k < sementara.length; k++) {
        //     const translation = await translate(language, sementara[k].snippet.title)
        //     // console.log(sementara[k].snippet.title)

        //     const title = sementara[k].snippet.title
        //     const hasilTranslate = translation.text[0]
        //     // let hasilAkhir = "";
        //     // for (let g = 0; g < hasilTranslate.length; g++) {
        //     //     hasilAkhir += hasilTranslate[g][0]
        //     // }
        //     translates.push({ hasilTranslate, title })

        // }
        // console.log("done")
        return { total, sementara, totalSementara, semua, translates }
    } catch (e) {
        const fail = e.message
        return { fail, total, sementara, totalSementara, semua, translates }

    }

}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
async function youtubeSearchNextPage(val, token) {
    // return { "hai": "sa " }
    try {
        const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&q=${val}&type=channel&pageToken=${token}&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM`, {
            headers: {
                "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
                "x-origin": "https://explorer.apis.google.com",

            }
        })
        return hasil.data
    } catch (e) {
        return e.message

    }

}
async function youtubeSearch(val) {
    // return { "hai": "sa " }
    try {
        const hasil = await axios.get(`https://content.googleapis.com/youtube/v3/search?part=snippet&q=${val}&type=channel&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM`, {
            headers: {
                "referer": "https://content.googleapis.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.sMn3oj1Y3cA.O%2Fam%3DgQc%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCPqBV3I8WSHGVZdFwzpG63NJd9nNw%2Fm%3D__features__",
                "x-origin": "https://explorer.apis.google.com",

            }
        })
        return hasil.data
    } catch (e) {
        return e.message

    }

}
app.listen(port, () => console.log(`Example app listening on port ${port}!`))