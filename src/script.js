
function pay() {

    const options = {
        key: "rzp_test_TV7hB4PLNUBB63",

        amount: 52500,

        currency: "INR",

        name: "Test",

        description: "GST Wallet Recharge",

        order_id: "order_TWnMTIsGaLsIpk",

        handler: function (response) {

            console.log(response);

        }
    };

    const rzp = new Razorpay(options);

    rzp.open();
}
