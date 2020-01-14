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
        }, {
            name: 'real_word',
            title: 'word'
        }, '__slot:actions']
    },
    methods: {
        async saveRemoveWord() {
            const { value: real_word } = await Swal.fire({
                inputPlaceholder: 'Enter remove word',
                input: "text",
                inputValidator: (value) => {
                    if (value.trim() === '') {
                        return 'You need to write something!'
                    }
                }
            })

            if (real_word.trim() !== '') {

                const hasil = await axios.post("/saveremoveword", { real_word })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'Word saved Successfully',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'Try save the word again',
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
            const { value: real_word } = await Swal.fire({
                inputPlaceholder: 'Enter updated remove word',
                input: "text",
                inputValidator: (value) => {
                    if (value.trim() === '') {
                        return 'You need to write something!'
                    }
                },
                inputValue: rowData.real_word,
            })

            if (real_word.trim() !== '') {

                const hasil = await axios.post(`/updateremoveword/${id}`, { real_word })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'Word saved Successfully',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'Try save the word again',
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
                const hasil = await axios.get(`/deleteremoveword/${rowData.id}`)
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