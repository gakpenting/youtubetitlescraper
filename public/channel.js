Vue.use(Vuetable);
var app = new Vue({
    el: "#app",
    components: {
        'vuetable-pagination': Vuetable.VuetablePagination
    },
    data: {
        real_word: "",
        fields: [{
            name: 'id',
            title: 'ID'
        },
        {
            name: 'title',
            title: 'Title'
        },
        {
            name: 'channel_id',
            title: 'channel id'
        },
        {
            name: 'channel_url',
            title: 'channel url'
        },
        {
            name: 'published_at',
            title: 'published at'
        },
        {
            name: 'username',
            title: 'username'
        },

            '__slot:actions']
    },
    methods: {
        async saveRemoveWord() {
            const { value: url } = await Swal.fire({
                inputPlaceholder: 'Enter channel url',
                input: "text",
                inputValidator: (value) => {
                    if (value.trim() === '') {
                        return 'You need to write something!'
                    }
                }
            })

            if (url.trim() !== '') {

                const hasil = await axios.post("/savechannel", { url })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'channel added Successfully',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'please try again',
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
        async editRow(rowData) {
            const id = rowData.id
            const { value: url } = await Swal.fire({
                inputPlaceholder: 'Enter updated channel url',
                input: "text",
                inputValidator: (value) => {
                    if (value.trim() === '') {
                        return 'You need to write something!'
                    }
                },
                inputValue: rowData.channel_url,
            })

            if (real_word.trim() !== '') {

                const hasil = await axios.post(`/updatechannel/${id}`, { url })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'channel updated Successfully',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'Try change the channel url again',
                        'error'
                    )
                }

            }
            // alert("You clicked edit on" + JSON.stringify(rowData))
        },
        async deleteRow(rowData) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                const hasil = await axios.get(`/deletechannel/${rowData.id}`)
                if (hasil.data.status) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
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
        }
    },
    mounted: async function () {


    }
});
function bubbleChart() {

}