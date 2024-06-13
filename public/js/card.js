document.addEventListener('DOMContentLoaded', function () {
    //Menu Toggle Script
    document.getElementById('menu-toggle').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('wrapper').classList.toggle('toggled');
    });

    // For highlighting activated tabs
    document.getElementById('tab1').addEventListener('click', function () {
        document.querySelectorAll('.tabs').forEach(function (tab) {
            tab.classList.remove('active1');
            tab.classList.add('bg-light');
        });
        document.getElementById('tab1').classList.add('active1');
        document.getElementById('tab1').classList.remove('bg-light');
        // Show Internet Banking form and hide others
        document.getElementById('menu1').classList.add('active', 'show');
        document.getElementById('menu2').classList.remove('active', 'show');
        document.getElementById('menu3').classList.remove('active', 'show');
    });

    document.getElementById('tab2').addEventListener('click', function () {
        document.querySelectorAll('.tabs').forEach(function (tab) {
            tab.classList.remove('active1');
            tab.classList.add('bg-light');
        });
        document.getElementById('tab2').classList.add('active1');
        document.getElementById('tab2').classList.remove('bg-light');
        // Show Card form and hide others
        document.getElementById('menu2').classList.add('active', 'show');
        document.getElementById('menu1').classList.remove('active', 'show');
        document.getElementById('menu3').classList.remove('active', 'show');
    });

    document.getElementById('tab3').addEventListener('click', function () {
        document.querySelectorAll('.tabs').forEach(function (tab) {
            tab.classList.remove('active1');
            tab.classList.add('bg-light');
        });
        document.getElementById('tab3').classList.add('active1');
        document.getElementById('tab3').classList.remove('bg-light');
        // Show UPI/QR form and hide others
        document.getElementById('menu3').classList.add('active', 'show');
        document.getElementById('menu1').classList.remove('active', 'show');
        document.getElementById('menu2').classList.remove('active', 'show');
    });
});

document.addEventListener('DOMContentLoaded',()=>{
    getprice()
    function getprice(){
        var items = JSON.parse(localStorage.getItem('cartItems'));
        var total = 0;
        for(var i=0;i<items.length;i++){
            total += items[i].price;
        }
        document.querySelector('.pricetopay').innerHTML = total
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#qr form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        placeorder()
    });

    function placeorder() {
        let loginuser = localStorage.getItem('user-login');
        if (loginuser) {
            var items = JSON.parse(localStorage.getItem('cartItems'));
            if (items.length > 0) {
                const transactionId = document.getElementById('transactionId').value.trim();
                const address = document.getElementById('address').value.trim();
    
                fetch('/order/placeorder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: items,
                        transactionId: transactionId,
                        address: address
                    })
                })
                .then((response) => {
                    if (response.status == 200) {
                        console.log('successfully created transaction')
                    } else {
                        console.log('got an error')
                        alert('An error occurred in placing order !');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.message === 'Validation Error') {
                        console.log('Validation Error', data.errors);
                    }
                    if (data.loginerror) {
                        alert('Please log in first');
                    }
                    window.location.href = `/order/congrats/?id=${data.order._id}`;
                })
                .catch((error) => {
                    console.log(error.message);
                });
            }
        } else {
            alert('please login first');
        }
    }
    
    
});

