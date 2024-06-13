document.addEventListener("DOMContentLoaded", () => {
    var additem = new bootstrap.Modal("#addItemModal", {
      keyboard: false,
    });
  
    document.querySelector(".additembtn").addEventListener("click", () => {
      additem.show();
    });


    document.querySelector('.itemimageupdateform').addEventListener('submit',(e)=>{
        e.preventDefault()
        var form = e.target
        let formdata = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formdata
        }).then((response)=>{
            if(response.status===200){
                document.querySelectorAll('.menu-item').forEach((menuitem)=>{
                    menuitem.remove()
                })
                fetchallitem()
            }
            else{
                alert('An error occurred')
            }
            return response.json();
        }).then((data)=>{}).catch((error)=>console.log(error.message))
    }) 
  

    var additemform = document.querySelector("#additemform");
    additemform.addEventListener("submit", (e) => {
      e.preventDefault();
  
      var formdata = new FormData(additemform);
  
      fetch("/menu/addItem", {
        method: "POST",
        body: formdata,
      })
        .then((response) => {
          if (response.status === 200) {
            alert("successfully added");
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if(data.item){
              var item = data.item
              let itemtag = document.createElement("div");
              itemtag.classList.add("col-lg-4", "menu-item");
              itemtag.setAttribute("data-itemId", item._id);
              itemtag.innerHTML = `
            <a href="#">
              <img src="${item.image}" class="menu-img img-fluid" alt=""/>
            </a>
            <h4 contentEditable="true" class="itemName">${item.itemName}</h4>
            <p class="price">₹<span contentEditable="true">${item.price}</span></p>
            <button class="btn btn-primary deleteitembtn">Delete</button>
          `;
              document
                .querySelector(`.menu-${item.category} .row`)
                .appendChild(itemtag);
      
              itemtag.querySelector('.deleteitembtn').addEventListener('click', deleteitem);
              itemtag.querySelector('.price span').addEventListener('input', updateitemPrice);
              itemtag.querySelector('.itemName').addEventListener('input', updateitem);
              itemtag.querySelector('img').addEventListener('click',()=>{
                var form = document.querySelector('.itemimageupdateform')
                form.querySelector('.id').value = item._id
                form.querySelector('.category').value = item.category
                form.querySelector('input[type="file"]').click()
              })
          }
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    fetchallitem()
  
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
        <h4 contentEditable="true" class="itemName">${item.itemName}</h4>
        <p class="price">₹<span contentEditable="true">${item.price}</span></p>
        <button class="btn btn-primary deleteitembtn">Delete</button>
      `;
          document
            .querySelector(`.menu-${item.category} .row`)
            .appendChild(itemtag);
  
          itemtag.querySelector('.deleteitembtn').addEventListener('click', deleteitem);
          itemtag.querySelector('.price span').addEventListener('input', updateitemPrice);
          itemtag.querySelector('.itemName').addEventListener('input', updateitem);
          itemtag.querySelector('img').addEventListener('click',()=>{
            var form = document.querySelector('.itemimageupdateform')
            form.querySelector('.id').value = item._id
            form.querySelector('.category').value = item.category
            form.querySelector('input[type="file"]').click()
          })
        }
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
    }
  
    function deleteitem() {
      let ans = confirm('Please confirm your deletion')
      if (ans) {
        var itemId = this.parentElement.getAttribute('data-itemId');
        var item = this.parentElement
        fetch(`/menu/deleteItem`, {
          method: "POST",
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: itemId
          })
        }).then((response) => {
          if (response.status === 200) {
            item.remove()
            alert("successfully deleted");
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        }).then((data) => {}).catch((error) => console.log(error.message))
      }
    }


    var form = document.querySelector('.itemimageupdateform')
    const imageInput = form.querySelector('input[type="file"]');
    imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            form.querySelector('button').click()
        }
    });


    function updateitem(){
        let itemId = this.parentElement.getAttribute('data-itemId');
        let item = this.parentElement
        let price = parseInt(item.querySelector('.price').innerText.replace('₹', ''));
        let itemName = item.querySelector('.itemName').innerHTML
        let category_ = item.parentElement.id
        let category = category_.replace('menu-','')
        fetch('/menu/updateItem',{
            method: "POST",
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: itemId,
              itemName:itemName,
              price:price,
              cateogory:category
            })
        }).then((response)=>{
            if(response.status != 200){
                alert('An error occurrd in updating the item')
            }
        }).then((data)=>{}).catch((error)=>console.log(error))
    }

    function updateitemPrice(){
        let itemId = this.parentElement.parentElement.getAttribute('data-itemId');
        let item = this.parentElement.parentElement
        let price = parseInt(item.querySelector('.price').innerText.replace('₹', ''));
        if(!price || price<=0){
            alert('Please enter a valid price')
            window.location.reload()
            return;
        }
        let itemName = item.querySelector('.itemName').innerHTML
        let category_ = item.parentElement.id
        let category = category_.replace('menu-','')
        fetch('/menu/updateItem',{
            method: "POST",
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: itemId,
              itemName:itemName,
              price:price,
              cateogory:category
            })
        }).then((response)=>{
            if(response.status != 200){
                alert('An error occurrd in updating the item')
            }
        }).then((data)=>{}).catch((error)=>console.log(error))
    }
  });
  