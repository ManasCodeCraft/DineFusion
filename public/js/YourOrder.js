document.addEventListener("DOMContentLoaded", function () {
  const ordersList = document.getElementById("orders-list");

  fetchMyOrders();

  function fetchMyOrders() {
    fetch("/order/fetchuserorder")
      .then(handleResponse)
      .then(renderOrders)
      .catch(handleError);
  }

  function handleResponse(response) {
    if (response.status === 200) {
      return response.json();
    } else {
      handleError(
        new Error("Error in fetching your order, please try again later")
      );
    }
  }

  function handleError(error) {
    document.body.innerHTML =
      "<h1> Error in fetching your order, please try again later</h1>";
    console.error("Error:", error.message);
  }

  function renderOrders(ordersData) {
    ordersData.forEach(renderOrder);
  }

  function renderOrder(order) {
    const orderItem = createOrderItem(order);
    ordersList.appendChild(orderItem);
  }

  function createOrderItem(order) {
    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");
    orderItem.setAttribute("data-orderid", order._id);

    const orderDetails = createOrderDetails(order);
    orderItem.appendChild(orderDetails);

    return orderItem;
  }

  function createOrderDetails(order) {
    const orderDetails = document.createElement("div");
    orderDetails.classList.add("order-details");

    orderDetails.innerHTML = `
          <span class="order-status">Status: ${order.status}</span>
          <span class="order-price">Price: Rs ${order.price.toFixed(2)}</span>
          <p>Details: ${order.details}</p>
          <span class="pickup">Pickup Time: ${order.pickupTime}</span>
      `;

    const orderActions = createOrderActions(order);
    orderDetails.appendChild(orderActions);
    if(order.status === 'Cancelled') {
      orderDetails.querySelector('.pickup').remove()
    }
    return orderDetails;
  }

  function createOrderActions(order) {
    const orderActions = document.createElement("div");
    orderActions.classList.add("order-actions");

    const trackButton = createButton("Track", () => {
       window.location.href = `/order/track/?id=${order.id}`;
    });

    const cancelButton = createButton("Request Cancel", () => {
      showCancelModal(order);
    });

    const feedbackbutton = createButton("Feedback",()=>{
       window.location.href = `/userFeedback?order=${order.id}`
    })

    const feedbackComplete = document.createElement('p')
    feedbackComplete.classList.add('bg-success')
    feedbackComplete.style = `
      margin: 10px;
      padding: 15px;
      border-radius: 20px;
      display:block;
      width: fit-content;
      color:white;
    `
    feedbackComplete.innerHTML = "Thanks for Feedback"

    if(order.status === 'Completed'){
      if(!order.feedback){
      orderActions.appendChild(feedbackbutton)
      }
      else{
        orderActions.appendChild(feedbackComplete)
      }
    }
    else if(order.status === 'Cancelled'){
      //
    }
    else{
      orderActions.appendChild(trackButton);
      orderActions.appendChild(cancelButton);
    }

    return orderActions;
  }

  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.classList.add("order-action");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  function showCancelModal(order) {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
          <div class="modal fade" id="cancelModal-${
            order.id
          }" tabindex="-1" aria-labelledby="cancelModalLabel-${
      order.id
    }" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="cancelModalLabel-${
                            order.id
                          }">Request cancel</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <p class="cancel-order-details">Status: ${
                            order.status
                          }</p>
                          <p class="cancel-order-details">Price: $${order.price.toFixed(
                            2
                          )}</p>
                          <p class="cancel-order-details">Details: ${
                            order.details
                          }</p>
                          <p class="cancel-order-details">Pickup Time: ${
                            order.pickupTime
                          }</p>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-danger" id="cancelConfirmButton-${
                            order.id
                          }", data-orderid="${order.id}">Yes, Cancel</button>
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
              </div>
          </div>
      `;
    document.body.appendChild(modalContainer);

    const modal = new bootstrap.Modal(
      document.getElementById(`cancelModal-${order.id}`)
    );
    modal.show();

    const confirmButton = document.getElementById(
      `cancelConfirmButton-${order.id}`
    );
    confirmButton.addEventListener("click", () => {
      fetch("/order/updateorderstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: confirmButton.dataset.orderid,
          status: "Pending Approval to Cancel",
        })
      })
        .then((response) => {
            if (response.status == 200) {
              fetchMyOrders();
            } else {
              alert("An error occurred");
            }
            return response.json();
          })
          .then((data) => {})
          .catch((error) => {
            console.log("Error", error.message);
          }),
      modal.hide();
    });
  }
});
