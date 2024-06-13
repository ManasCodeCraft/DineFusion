
fetch_order_request()
function fetch_order_request(){
        fetch("/order/fetchorderrequest")
        .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Error in fetching your order, please try again later");
                }
            })
        .then((data) => {
                renderorders(data)
                document.querySelectorAll('.setpickuptime').forEach((element)=>{
                    element.addEventListener('change', updatepickuptime)
                    element.addEventListener('input', updatepickuptime)
                })
        })
        .catch((error) => {
                console.log(error.message)
        });
}


function renderorders(data){
    document.querySelectorAll('.accordion-body').forEach((accordion)=>{
        accordion.innerHTML = ''
    })
    for(request of data){
        if(request.status==='Pending'){
            var requestelement = document.createElement('div');
            requestelement.classList.add('order-item');
            requestelement.setAttribute('data-orderid', request.orderid)
            requestelement.innerHTML = `
            <div class="order-details">
              <label>Order Details: </label>${request.orderdetails}<br />
              <label>Customer Name: </label>${request.user}<br />
              <label>Price: </label>${request.price}<br />
              <label>Status: </label>${request.status}<br />
              <label>TransactionId: </label>${request.transactionId}<br />
              <label>Address: </label>${request.address}<br />
              <label>PickUpTime: </label><input type="text" class="setpickuptime" value="${request.pickupTime}"><br />
            </div>
            <div class="accept-reject">
              <button class="btn btn-accept">Accept</button>
              <button class="btn btn-decline">Decline</button>
            </div>
            `
            document.getElementById('newrequestaccordion').appendChild(requestelement)
            requestelement.querySelector('.btn-accept').addEventListener('click', acceptorder)
            requestelement.querySelector('.btn-decline').addEventListener('click',declineorder)
        }

        else if(request.status === 'Accepted'){
            var requestelement = document.createElement('div');
            requestelement.classList.add('order-item');
            requestelement.setAttribute('data-orderid', request.orderid)
            requestelement.innerHTML = `
            <div class="order-details">
              <label>Order Details: </label>${request.orderdetails}<br />
              <label>Customer Name: </label>${request.user}<br />
              <label>Price: </label>${request.price}<br />
              <label>Status: </label>${request.status}<br />
              <label>PickUpTime: </label><input type="text" class="setpickuptime" value="${request.pickupTime}"><br />
            </div>
            <div class="accept-reject">
              <button class="btn btn-start">Start</button>
              <button class="btn btn-decline">Decline</button>
            </div>
            `
            document.getElementById('acceptedrequestaccordion').appendChild(requestelement)
            requestelement.querySelector('.btn-start').addEventListener('click', startorder)
            requestelement.querySelector('.btn-decline').addEventListener('click', declineorder)
        }

        else if(request.status === 'In Progress'){
            var requestelement = document.createElement('div');
            requestelement.classList.add('order-item');
            requestelement.setAttribute('data-orderid', request.orderid)
            requestelement.innerHTML = `
            <div class="order-details">
              <label>Order Details: </label>${request.orderdetails}<br />
              <label>Customer Name: </label>${request.user}<br />
              <label>Price: </label>${request.price}<br />
              <label>Status: </label>${request.status}<br />
              <label>PickUpTime: </label><input type="text" class="setpickuptime" value="${request.pickupTime}"><br />
            </div>
            <div class="accept-reject">
              <button class="btn btn-outfordelivery">Out For Delivery</button>
              <button class="btn btn-decline">Decline</button>
            </div>
            `
            document.getElementById('inprogressrequestaccordion').appendChild(requestelement)
            requestelement.querySelector('.btn-outfordelivery').addEventListener('click', OutForDelivery)
            requestelement.querySelector('.btn-decline').addEventListener('click', declineorder)
        }

        else if(request.status === 'Pending Approval to Cancel'){
            var requestelement = document.createElement('div');
            requestelement.classList.add('order-item');
            requestelement.setAttribute('data-orderid', request.orderid)
            requestelement.innerHTML = `
            <div class="order-details">
              <label>Order Details: </label>${request.orderdetails}<br />
              <label>Customer Name: </label>${request.user}<br />
              <label>Price: </label>${request.price}<br />
              <label>Status: </label>${request.status}<br />
              <label>PickUpTime: </label><input type="text" class="setpickuptime" value="${request.pickupTime}"><br />
            </div>
            <div class="accept-reject">
              <button class="btn btn-approve-cancellationreq">Approve</button>
              <button class="btn btn-reject-cancellationreq">Reject</button>
            </div>
            `
            document.getElementById('cancellationrequestaccordion').appendChild(requestelement)
            
            requestelement.querySelector('.btn-approve-cancellationreq').addEventListener('click', approveCancellation)
            requestelement.querySelector('.btn-decline').addEventListener('click', declineCancellation)
        }

        else if(request.status === 'On the Way'){
            var requestelement = document.createElement('div');
            requestelement.classList.add('order-item');
            requestelement.setAttribute('data-orderid', request.orderid)
            requestelement.innerHTML = `
            <div class="order-details">
              <label>Order Details: </label>${request.orderdetails}<br />
              <label>Customer Name: </label>${request.user}<br />
              <label>Price: </label>${request.price}<br />
              <label>Status: </label>${request.status}<br />
              <label>PickUpTime: </label><input type="text" class="setpickuptime" value="${request.pickupTime}"><br />
            </div>
            <div class="accept-reject">
              <button class="btn btn-completed">Completed</button>
            </div>
            `
            document.getElementById('onthewayrequestaccordion').appendChild(requestelement)
            requestelement.querySelector('.btn-completed').addEventListener('click', CompletedOrder)
        }
    }
}

function acceptorder(){
    changeorderstatus('Accepted',this.parentElement.parentElement.dataset.orderid)
}

function declineorder(){
   changeorderstatus('Declined',this.parentElement.parentElement.dataset.orderid)
}

function startorder(){
    changeorderstatus('In Progress',this.parentElement.parentElement.dataset.orderid)
}
function OutForDelivery(){
    changeorderstatus('On the Way',this.parentElement.parentElement.dataset.orderid)
}

function CompletedOrder(){
    changeorderstatus('Completed',this.parentElement.parentElement.dataset.orderid)
}

function approveCancellation(){
    changeorderstatus('Cancelled',this.parentElement.parentElement.dataset.orderid)
}

function declineCancellation(){
    changeorderstatus('In Progress',this.parentElement.parentElement.dataset.orderid)
}

function changeorderstatus(status, orderid) {
    fetch('/order/updateorderstatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderId: orderid,
            status: status
        })
    })
    .then((response) => {
        if (response.status == 200) {
            fetch_order_request();
        }
    })
    .then((data) => {
    })
    .catch((error) => {
        console.log('Error', error.message);
    });
}

function updatepickuptime() {
    var newpickuptime = this.value
    var orderId = this.parentElement.parentElement.dataset.orderid
    fetch('/order/updatepickuptime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderId: orderId,
            pickupTime: newpickuptime
        })
    })
  .then((response) => {
        if(response.status !== 200) {
            alert('Got error in updating pickup time')
        }
    })
.then((data) => {
})
 .catch((error) => {
        console.log('Error', error.message);
    });
}