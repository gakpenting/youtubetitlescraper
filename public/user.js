Vue.use(Vuetable);
var app = new Vue({
    el: "#app",
    components: {
        'vuetable-pagination': Vuetable.VuetablePagination
    },
    data: {

        fields: [{
            name: 'id',
            title: 'ID'
        },
        {
            name: 'username',
            title: 'User'
        },
            '__slot:actions']
    },
    methods: {
        async saveRemoveWord() {
            const { value: formValues } = await Swal.fire({
                title: 'Multiple inputs',
                html:
                    `<input id="swal-input1" class="swal2-input" placeholder="username"> 
                    <input id="swal-input2" class="swal2-input" type="password" placeholder="password">
                    <input id="swal-input3" class="swal2-input" type="password" placeholder="confirm password">
                    <select id="swal-input4" class="swal2-input">
                    <option value=""></option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    
                    </select>
                    `,
                focusConfirm: false,

                preConfirm: () => {
                    if (document.getElementById('swal-input1').value.trim() === '' ||
                        document.getElementById('swal-input2').value.trim() === '' ||
                        document.getElementById('swal-input3').value.trim() === '' ||
                        document.getElementById('swal-input4').value.trim() === '') {
                        return Swal.showValidationMessage(
                            `please fill in all blank form`
                        )
                    }
                    if (document.getElementById('swal-input2').value.trim() !==
                        document.getElementById('swal-input3').value.trim()) {
                        return Swal.showValidationMessage(
                            `confirm password and password is not the same please check again`
                        )
                    }
                    return [
                        document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').value,
                        document.getElementById('swal-input4').value
                    ]
                }
            })





            if (formValues[0].trim() !== '' && formValues[1].trim() !== '' && formValues[2].trim() !== '') {

                const hasil = await axios.post("/saveuser", { username: formValues[0], password: formValues[1], privilage: formValues[2] })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'user added Successfully',
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
            const { value: formValues } = await Swal.fire({
                title: 'Multiple inputs',
                html:
                    `<input id="swal-input1" class="swal2-input" placeholder="username"> 
                    <input id="swal-input2" class="swal2-input" type="password" placeholder="password">
                    <input id="swal-input3" class="swal2-input" type="password" placeholder="confirm password">
                    <select id="swal-input4" class="swal2-input">
                    <option value=""></option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    
                    </select>
                    `,
                focusConfirm: false,

                preConfirm: () => {
                    if (document.getElementById('swal-input1').value.trim() === '' ||
                        document.getElementById('swal-input2').value.trim() === '' ||
                        document.getElementById('swal-input3').value.trim() === '' ||
                        document.getElementById('swal-input4').value.trim() === '') {
                        return Swal.showValidationMessage(
                            `please fill in all blank form`
                        )
                    }
                    if (document.getElementById('swal-input2').value.trim() !==
                        document.getElementById('swal-input3').value.trim()) {
                        return Swal.showValidationMessage(
                            `confirm password and password is not the same please check again`
                        )
                    }
                    return [
                        document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').value,
                        document.getElementById('swal-input4').value
                    ]
                }
            })
            if (formValues[0].trim() !== '' && formValues[1].trim() !== '' && formValues[2].trim() !== '') {

                const hasil = await axios.post(`/updateuser/${id}`, { username: formValues[0], password: formValues[1], privilage: formValues[2] })
                if (hasil.data.status) {
                    Swal.fire(
                        'Saved',
                        'user updated Successfully',
                        'success'
                    )
                    this.$refs.vuetable.refresh()
                } else {
                    Swal.fire(
                        'Error',
                        'Try change the user info again',
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
                const hasil = await axios.get(`/deleteuser/${rowData.id}`)
                if (hasil.data.status) {
                    Swal.fire(
                        'Deleted!',
                        'Your user has been deleted.',
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