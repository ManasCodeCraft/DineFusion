document.addEventListener('DOMContentLoaded',()=>{
  let orderparam = new URLSearchParams(window.location.search);
  orderid =  orderparam.get('id');
  fetch(`/order/trackorderdata`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId: orderid
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch order data");
    }
    return response.json();
  })
  .then(data => {
    updateOrderTracking(data.order);
  })
  .catch(error => {
    console.error("Error fetching order data:", error);
  });
  
  function updateOrderTracking(data) {
  const estimatedDeliveryTimeElement = document.querySelector(".card-body .col:first-child");
  estimatedDeliveryTimeElement.innerHTML = `<strong>Estimated Delivery time:</strong><br>${data.pickupTime}`;
  
  const shippingAddressElement = document.querySelector(".card-body .col:nth-child(2)");
  shippingAddressElement.innerHTML = `<strong>Shipping To:</strong><br>${data.address}`;
  
  const orderStatusElement = document.querySelector(".card-body .col:nth-child(3)");
  orderStatusElement.innerHTML = `<strong>Status:</strong><br>${data.status}`;
  
  const steps = document.querySelectorAll(".step");
  for (let i = 0; i < steps.length; i++) {
  if (i < data.steps) {
    steps[i].classList.add("active");
  }
  }
  }
})

