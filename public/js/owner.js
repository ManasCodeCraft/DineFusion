document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".logoutbtn").addEventListener("click", logout);
  function logout() {
    let ans = confirm("Are you sure you want to log out from owner?");
    if (ans) {
      fetch("/auth/logout", {
        method: "POST",
      }).then((response) => {
        if (response.status == 200) {
           window.location.href = '/'
        } else {
          alert("An error occurred");
        }
      });
    }
  }


  fetch('/auth/checkstafflogin').then((response)=>{
    if(response.status==200){
       renderchangeonlogin()
    }
  })

   function renderchangeonlogin(){
     document.querySelectorAll('.owner-nav-action').forEach((element)=>{
        element.classList.add('disabled')
        element.parentElement.classList.add('disabled')
        element.href = '#'
     })

   }  
});
