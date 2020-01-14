Vue.use(Vuetable);
Vue.component('detail-row', {
    props: {
        rowData: {
            type: Object,
            required: true
        },
        rowIndex: {
            type: Number
        }
    },
    data: function () {
        return {
            fieldsWord: [{
                name: 'id',
                title: 'ID'
            },
            {
                name: 'channel_id',
                title: 'Channel Id'
            },
            {
                name: 'real_word',
                title: 'Real Word'
            },
            {
                name: 'word',
                title: 'Translated Word'
            },
            {
                name: 'count',
                title: 'Count'
            },
            ],
            fieldsVideo: [{
                name: 'id',
                title: 'ID'
            },
            {
                name: 'channel_id',
                title: 'Channel Id'
            },
            {
                name: 'video_id',
                title: 'Video Id'
            },
            {
                name: 'title',
                title: 'Title'
            },
            {
                name: 'date',
                title: 'Date Published'
            },
            ],
            styleDot: {
                "height": "25px",
                "width": "25px",
                "backgroundColor": "#bbb",
                "border-radius": "50%",
                "display": "inline-block"
            },
            objek: { name: "", value: "" },
            terlihat: false
        }

    },
    methods: {
        onPaginationDataWord(paginationData) {
            this.$refs.paginationWord.setPaginationData(paginationData)
        },
        onChangePageWord(page) {
            this.$refs.vuetableWord.changePage(page)
        },
        onPaginationDataVideo(paginationData) {
            this.$refs.paginationVideo.setPaginationData(paginationData)
        },
        onChangePageVideo(page) {
            this.$refs.vuetableVideo.changePage(page)
        },
    }, mounted: function () {
        var raw;

        var size = Math.min(Math.min(window.innerWidth, window.innerHeight), 600);
        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var chart = d3.select("#bubbleWord" + this.rowData.channel_id)
            .append('svg')
            .attr("width", size)
            .attr("height", size);

        var pack = d3.pack()
            .size([size, size])
            .padding(size * 0.005);
        let ini = this
        d3.text(`/allwords/${this.rowData.channel_id}/all`, function (error, data) {
            if (error) throw error;

            // raw = data.split(/\W+/);
            let counts = {}

            var keys = JSON.parse(data).map(a => a.word);
            JSON.parse(data).forEach(a => counts[a.word] = a.count)
            // count the word frequency
            // var counts = raw.reduce(function (obj, word) {
            //     if (!obj[word]) {
            //         obj[word] = 0;
            //         keys.push(word);
            //     }
            //     obj[word]++;
            //     return obj;
            // }, {});

            // // sort the keys from highest to lowest
            // keys.sort(function (a, b) {
            //     return counts[b] - counts[a];
            // });

            // only keep words used 10 or more times
            // keys = keys.filter(function(key) {
            // 	return counts[key] >= 10 ? key : '';
            // });
            // console.log(counts)
            var root = d3.hierarchy({ children: keys })
                .sum(function (d) {

                    return counts[d];
                });

            // console.log(root);

            var node = chart.selectAll(".node")
                .data(pack(root).leaves())
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.append("circle")
                .attr("id", function (d) { return d.data; })
                .attr("r", function (d) { return d.r; })
                .style("fill", function (d) { return color(d.data); })
                .on('mouseover', function (d) {
                    ini.styleDot.backgroundColor = color(d.data)
                    ini.objek.name = d.data
                    ini.objek.value = d.value
                    ini.terlihat = true
                }).on('mouseout', function (d) {
                    ini.styleDot.backgroundColor = "#bbb"
                    ini.objek.name = ""
                    ini.objek.value = ""
                    ini.terlihat = false
                });

            node.append("clipPath")
                .attr("id", function (d) { return "clip-" + d.data; })
                .append("use")
                .attr("xlink:href", function (d) { return "#" + d.data; });

            node.append("text")
                .attr("clip-path", function (d) { return "url(#clip-" + d.data + ")"; })
                .attr("text-anchor", "middle")
                // .append("tspan")
                // .attr("x", 0)
                // .attr("y", function (d) { return d.r / 8; })
                // .attr("font-size", function (d) { return d.r / 2; })
                .text(function (d) {

                    return d.data + '\n'
                })
                .style("font-size", "1px")
                .each(getSize)
                .style("font-size", function (d) { return d.scale + "px"; })
                .on('mouseover', function (d) {
                    ini.styleDot.backgroundColor = color(d.data)
                    ini.objek.name = d.data
                    ini.objek.value = d.value
                    ini.terlihat = true
                }).on('mouseout', function (d) {
                    ini.styleDot.backgroundColor = "#bbb"
                    ini.objek.name = ""
                    ini.objek.value = ""
                    ini.terlihat = false
                });;

            function getSize(d) {
                var bbox = this.getBBox(),
                    cbbox = this.parentNode.getBBox(),
                    scale = Math.min(cbbox.width / bbox.width, cbbox.height / bbox.height);
                d.scale = scale;
            }
            // .append("tspan")

            // .attr("font-size", function (d) { return d.r / 3; })
            // .text(function (d) {

            //     return d.value
            // });


        });

    },
    template: ` <div >
    
    
    <div class="main-card mb-3 card">
                                        <div class="card-header"><i class="header-icon lnr-license icon-gradient bg-plum-plate"> </i>Detail
                                            <div class="btn-actions-pane-right">
                                                <div role="group" class="btn-group-sm nav btn-group">
                                                    <a data-toggle="tab" href="#tab-eg1-0" class="btn-shadow btn btn-primary active show">Bubble Words</a>
                                                    <a data-toggle="tab" href="#tab-eg1-1" class="btn-shadow btn btn-primary show">Words</a>
                                                    <a data-toggle="tab" href="#tab-eg1-2" class="btn-shadow btn btn-primary show">Video List</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                        
                                            <div class="tab-content">

                                                <div class="tab-pane active show" id="tab-eg1-0" role="tabpanel">
                                                <div class="ui vertical masthead center aligned segment" :id="'bubbleWord'+rowData.channel_id">
    
    </div>
                                                    </div>
                                                <div class="tab-pane show" id="tab-eg1-1" role="tabpanel">
                                                <vuetable ref="vuetableWord" :api-url="'/allwords/'+rowData.channel_id" :fields="fieldsWord" pagination-path=""
                                                @vuetable:pagination-data="onPaginationDataWord">
                                                
                                            </vuetable>
                                            <vuetable-pagination ref="paginationWord" @vuetable-pagination:change-page="onChangePageWord">
                                            </vuetable-pagination>
                                                </div>
                                                <div class="tab-pane show" id="tab-eg1-2" role="tabpanel">
                                                <vuetable ref="vuetableVideo" :api-url="'/allvideo/'+rowData.channel_id" :fields="fieldsVideo" pagination-path=""
                                                @vuetable:pagination-data="onPaginationDataVideo">
                                                
                                            </vuetable>
                                            <vuetable-pagination ref="paginationVideo" @vuetable-pagination:change-page="onChangePageVideo">
                                            </vuetable-pagination>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="ui vertical masthead center aligned " v-if="terlihat">
                                        <span class="dot"  :style="styleDot"></span> 
                                        </div>
                                        <div class="ui vertical masthead center aligned" v-if="terlihat" style="font-size:25px">
                                        name: {{objek.name}} value: {{objek.value}}
                                        </div>
                                    </div>
  </div>`
})
var app = new Vue({
    el: "#app",
    components: {
        'vuetable-pagination': Vuetable.VuetablePagination
    },
    data: {
        dataChannel: "",
        totalResults: 0,
        youtubeChannel: [],
        channelId: "",
        prevChannelToken: "",
        nextChannelToken: "",
        selectedTime: "",
        selectedLanguage: "",
        country: [],
        scrapingStatus: "",
        fields: [{
            name: 'id',
            title: 'ID'
        }, {
            name: 'channel_id',
            title: 'Channel id'
        },
        {
            name: 'username',
            title: 'username'
        },

        {
            name: 'created_at',
            title: 'Created at'
        },
            '__slot:actions']
    },
    methods: {
        onCellClicked(data, field, event) {

            this.$refs.vuetable.toggleDetailRow(data.id)
        },
        async saveRemoveWord() {
            const hasil = await axios.get("/getallchannel")


            const { value: color } = await Swal.fire({
                title: 'Select Channel',
                input: 'select',
                inputOptions: hasil.data,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to choose something!'
                    }
                }
            })

            if (color) {

                const hasil = await axios.post("/savequeue", { url: color })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'please scraping auto or manual in the table',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'Try save the scraping channel again',
                        'error'
                    )
                }


            }




        },

        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData)
        },
        onChangePage(page) {
            this.$refs.vuetable.changePage(page)
        },
        async stopManual(rowData) {
            Swal.fire({
                title: 'Are you sure you want to stop manual scraping?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then(async (result) => {
                const hasil = await axios.get(`/stopqueuemanual/${rowData.id}`)
                if (hasil.data.status) {

                    Swal.fire(
                        'Success!',
                        'Your channel is stopped scraping',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error!',
                        'Error',
                        'error'
                    )
                }
            })
            // alert("You clicked edit on" + JSON.stringify(rowData))
        },
        async stopJob(rowData) {
            Swal.fire({
                title: 'Are you sure you want to stop scraping?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then(async (result) => {
                const hasil = await axios.get(`/stopqueueauto/${rowData.id}`)
                if (hasil.data.status) {

                    Swal.fire(
                        'Success!',
                        'Your channel is stopped scraping',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error!',
                        'Error',
                        'error'
                    )
                }
            })
            // alert("You clicked edit on" + JSON.stringify(rowData))
        },
        async editRow(rowData) {
            Swal.fire({
                title: 'Are you sure you want to automatically scrape this per day?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, scrape now!'
            }).then(async (result) => {
                const hasils = await axios.get("/supportedlanguage")


                const { value: col } = await Swal.fire({
                    title: 'Select Source Language',
                    input: 'select',
                    inputOptions: hasils.data,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to choose something!'
                        }
                    }
                })
                if (col) {
                    if (result.value) {
                        // this.$refs.vuetable.refresh()
                        rowData.autoOrManual = "auto"
                        const hasil = await axios.get(`/startqueueauto/${col}/${rowData.id}`)

                        if (hasil.data.status) {

                            Swal.fire(
                                'Success!',
                                'Your channel is still scraped',
                                'success'
                            )
                            this.$refs.vuetable.refresh()
                        } else {

                            Swal.fire(
                                'Error!',
                                'Error',
                                'error'
                            )
                        }
                    }
                }

            })
            // alert("You clicked edit on" + JSON.stringify(rowData))
        },
        async deleteRow(rowData) {
            Swal.fire({
                title: 'Are you sure you want to manually scrape this?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, scrape now!'
            }).then(async (result) => {
                const hasils = await axios.get("/supportedlanguage")


                const { value: col } = await Swal.fire({
                    title: 'Select Source Language',
                    input: 'select',
                    inputOptions: hasils.data,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to choose something!'
                        }
                    }
                })
                if (col) {
                    if (result.value) {
                        // this.$refs.vuetable.refresh()
                        rowData.autoOrManual = "manual"
                        const hasil = await axios.get(`/startqueuemanual/${col}/${rowData.id}`)


                        if (hasil.data.status) {

                            Swal.fire(
                                'Success!',
                                'Your channel is scraped',
                                'success'
                            )
                            this.$refs.vuetable.refresh()
                        } else {

                            Swal.fire(
                                'Error!',
                                'Error',
                                'error'
                            )
                        }
                    }
                }
            })
        },
        searchChannel: async function () {
            const channel = this.dataChannel;
            const hasil = await axios.get(`/json`, { params: { channel: encodeURI(channel) } });
            const res = hasil.data;
            res.items.forEach(a => a.style = { cursor: "pointer", backgroundColor: "white" })
            this.youtubeChannel = res.items
            if (res.nextPageToken) {
                this.nextChannelToken = res.nextPageToken
            }
            if (res.prevPageToken) {
                this.prevChannelToken = res.prevPageToken
            }
            this.totalResults = res.pageInfo.totalResults;

        },
        nextChannel: async function (token) {
            const channel = this.dataChannel;
            const hasil = await axios.get(`/channeltoken`, { params: { channelToken: token, val: encodeURI(channel) } });
            const res = hasil.data;
            res.items.forEach(a => a.style = { cursor: "pointer", backgroundColor: "white" })
            this.youtubeChannel = res.items
            if (res.nextPageToken) {
                this.nextChannelToken = res.nextPageToken
            }
            if (res.prevPageToken) {
                this.prevChannelToken = res.prevPageToken
            }
            this.totalResults = res.pageInfo.totalResults;

        },
        prevChannel: async function (token) {
            const channel = this.dataChannel;
            const hasil = await axios.get(`/channeltoken`, { params: { channelToken: token, val: encodeURI(channel) } });
            const res = hasil.data;
            res.items.forEach(a => a.style = { cursor: "pointer", backgroundColor: "white" })
            this.youtubeChannel = res.items
            if (res.nextPageToken) {
                this.nextChannelToken = res.nextPageToken
            }
            if (res.prevPageToken) {
                this.prevChannelToken = res.prevPageToken
            }
            this.totalResults = res.pageInfo.totalResults;

        },
        searchVideo: async function (val) {
            this.selectedTime = val
        },
        selectLanguage: async function (val) {
            this.selectedLanguage = val
        },
        calculateVideo: async function () {
            const alerts = Swal.fire({
                title: 'please wait still calculating words!',

                allowOutsideClick: false,

                onBeforeOpen: () => {
                    Swal.showLoading()

                },

            })
            const time = {
                "24Hours": function () {
                    var date = new Date();

                    const publishedBefore = date.toISOString(); //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

                    let publishedAfter = new Date(date.setDate(date.getDate() - 1));
                    publishedAfter.toISOString()

                    return { publishedAfter, publishedBefore }

                },
                "lastWeek": function () {
                    var date = new Date();

                    const publishedBefore = date.toISOString(); //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

                    let publishedAfter = new Date(date.setDate(date.getDate() - 6));
                    publishedAfter.toISOString()
                    return { publishedAfter, publishedBefore }

                },
                "last1Month": function () {
                    var date = new Date();
                    const month = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30]
                    const publishedBefore = date.toISOString(); //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                    let bulan = 0;
                    if (bulan === 1) {
                        let tahun = date.getFullYear() % 4
                        if (tahun === 0) {
                            bulan = 29
                        } else {
                            bulan = month[date.getMonth()]
                        }

                    } else {
                        bulan = month[date.getMonth()]
                    }
                    let publishedAfter = new Date(date.setDate(date.getDate() - bulan));
                    publishedAfter.toISOString()
                    return { publishedAfter, publishedBefore }

                },
                "last12Month": function () {
                    var date = new Date();
                    let year = 0;
                    if (date.getFullYear() % 4 === 0) {
                        year = 365
                    } else {
                        year = 364
                    }
                    const publishedBefore = date.toISOString(); //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

                    let publishedAfter = new Date(date.setDate(date.getDate() - year))
                    publishedAfter.toISOString()
                    return { publishedAfter, publishedBefore }

                },
                "allTime": function () {
                    var date = new Date();

                    const publishedBefore = ""; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

                    const publishedAfter = "";

                    return { publishedAfter, publishedBefore }

                },
            }
            const channelId = this.channelId;
            // console.log(time)
            try {
                const hasil = await axios.get(`/byTime`, { params: { language: this.selectedLanguage, channelId: channelId, publishedAfter: time[this.selectedTime]().publishedAfter, publishedBefore: time[this.selectedTime]().publishedBefore } });
                const res = hasil.data;

                alerts.close()
            } catch (e) {
                alerts.close()
                console.log(e.message)
            }
        },
        clickChannel: async function (index) {
            this.channelId = this.youtubeChannel[index].id.channelId;
            if (this.youtubeChannel[index].style.backgroundColor === "white") {
                let channelLain = this.youtubeChannel.filter(s => s.backgroundColor !== "white")
                channelLain.forEach(j => j.style.backgroundColor = "white")
                this.youtubeChannel[index].style.backgroundColor = "blue";

            }
        }
    },
    mounted: async function () {
        const country = await axios.get(`/supportedlanguage`)
        let countrys = country.data
        for (let a in countrys) {
            this.country.push({ name: countrys[a], language: a })
        }
        this.country.sort((a, b) => a.name > b.name)

    }
});
function bubbleChart() {

}