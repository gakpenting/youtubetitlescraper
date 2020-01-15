Vue.use(Vuetable);
Vue.component('detail-row', {
    props: {
        rowData: {
            type: Object,
            required: true
        },
        rowIndex: {
            type: Number
        },
        youtubeUrl: {
            type: String
        },
        title: {
            type: String
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
                                        <div class="card-header"> 
                                        <h4>{{title}}</h4>
                                        <a :href="youtubeUrl" >{{youtubeUrl}}</a>
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
                                        <div class="row d-flex justify-content-center" v-if="terlihat">
                                        <span class="dot"  :style="styleDot"></span> 
                                        </div>
                                        <div class="row d-flex justify-content-center" v-if="terlihat" style="font-size:25px">
                                        name: {{objek.name}} value: {{objek.value}}
                                        </div>
                                    </div>
  </div>`
})
var app = new Vue({
    el: "#app",

});
