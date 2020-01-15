

var app = new Vue({
    el: "#app",

    data: {

        username: "",
        pass: "",
        loginFailed: false
    },
    methods: {
        async checkForm() {
            let username = this.username
            let password = this.pass
            if (username.trim() !== "" && password.trim() !== "") {
                const res = await axios.post("/cekform", { username, password })
                if (res.data.status) {
                    this.loginFailed = false
                    window.location.href = "/admin"
                } else {
                    this.loginFailed = true
                }
            }
        }
    },
    mounted: async function () {


    }
});
function bubbleChart() {

}