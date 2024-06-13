
document.addEventListener('DOMContentLoaded',()=>{

  fetchallitem()
  // rendercartfromlocalstorage()
  localStorage.setItem('cartItems',JSON.stringify([]))
  function fetchallitem(){
    fetch("/menu/fetchallitem")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch menu items");
        }
      })
      .then((menudata) => {
        for (let item of menudata) {
          let itemtag = document.createElement("div");
          itemtag.classList.add("col-lg-4", "menu-item");
          itemtag.setAttribute("data-itemId", item._id);
          itemtag.innerHTML = `
        <a>
          <img src="${item.image}" class="menu-img img-fluid" alt=""/>
        </a>
        <h4 class="itemName">${item.itemName}</h4>
        <p class="price">₹<span>${item.price}</span></p>
      `;
          document
            .querySelector(`.menu-${item.category} .row`)
            .appendChild(itemtag);
        
            itemtag.addEventListener('click',()=>{
              document.querySelector('#addcartModal').setAttribute('data-itemName',item.itemName)
              document.querySelector('#addcartModal').setAttribute('data-price',item.price)
              document.querySelector('#addcartModal').setAttribute('data-itemid',item._id)

              document.querySelector('#addcartModal .modal-header').innerHTML = item.itemName
              document.querySelector('#quantity').value = 1
              document.querySelector('.addtocartbtn').addEventListener('click',addtocart)
              var cartmodal = new bootstrap.Modal('#addcartModal',{
                keyboard: false
              })
             cartmodal.show()
             })

        }
       })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
    }


    function addtocart() {
      const itemName = document.querySelector('#addcartModal').getAttribute('data-itemName');
      const itemId = document.querySelector('#addcartModal').getAttribute('data-itemid');
      const price = parseInt(document.querySelector('#addcartModal').getAttribute('data-price'));
      const quantity = parseInt(document.querySelector('#quantity').value);
    
      if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
      }
    
      const item = {
        menuItem:itemId,
        name: itemName,
        price: price*quantity,
        quantity: quantity
      };

      let existing_cart_items = JSON.parse(localStorage.getItem('cartItems')) || []
      existing_cart_items.push(item)
      localStorage.setItem('cartItems', JSON.stringify(existing_cart_items))
    
      rendercartfromlocalstorage()
      var cartmodal = bootstrap.Modal.getInstance(document.getElementById('addcartModal'));
      cartmodal.hide();
    }

    function rendercartfromlocalstorage(){
      const tableBody = document.getElementById('cartItemsTableBody');
      tableBody.innerHTML = '';
      var items = JSON.parse(localStorage.getItem('cartItems')) || [];
      for(let item of items)
      {
        const row = document.createElement('tr');
        row.setAttribute('data-itemId',item.menuItem)
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td><button class="btn btn-danger cartitemremovebtn">Remove</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector('.cartitemremovebtn').addEventListener('click',removefromcart)
      };
    }

    function removefromcart(){
       let itemId = this.parentElement.parentElement.dataset.itemId
       let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
       cartItems = cartItems.filter((item)=> item.itemId !== itemId)
       localStorage.setItem('cartItems', JSON.stringify(cartItems))
       this.parentElement.parentElement.remove()
    }


    document.querySelector('.placeordercartbtn').addEventListener('click',()=>{
      window.location.href = `/paymentportal`
    })


})