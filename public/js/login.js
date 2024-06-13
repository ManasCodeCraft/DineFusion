document.addEventListener("DOMContentLoaded", function () {
  var StudentSignUpModal = new bootstrap.Modal("#authModalStudentSignUp", {
    keyboard: false,
  });

  var StudentLoginModal = new bootstrap.Modal("#authModalStudentLogin", {
    keyboard: false,
  });

  var StaffLoginModal = new bootstrap.Modal("#authModalStaffLogin", {
    keyboard: false,
  });

  var OwnerLoginModal = new bootstrap.Modal("#authModalOwnerLogin", {
    keyboard: false,
  });


  function addClickEventListeners(selector, callback) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (element) {
        element.addEventListener("click", callback);
      });
  }
  
  addClickEventListeners(".studentlogintrigger", launchStudentLoginModal);
  addClickEventListeners(".studentsignuptrigger", launchStudentSignUpModal);
  addClickEventListeners(".ownerlogintrigger", launchOwnerLogInModal);
  addClickEventListeners(".stafflogintrigger", launchStaffLoginModal);

  function launchStudentLoginModal() {
      StudentSignUpModal.hide();
      OwnerLoginModal.hide();
      
      StaffLoginModal.hide();
      StudentLoginModal.hide();
    
      StudentLoginModal.show();
  }
    
  function launchStudentSignUpModal() {
      StudentSignUpModal.hide();
      OwnerLoginModal.hide();
      
      StaffLoginModal.hide();
      StudentLoginModal.hide();
    
      StudentSignUpModal.show();
  }
    
  function launchOwnerLogInModal() {
      StudentSignUpModal.hide();
      OwnerLoginModal.hide();
      
      StaffLoginModal.hide();
      StudentLoginModal.hide();
    
      OwnerLoginModal.show();
  }
    
  function launchStaffLoginModal() {
      StudentSignUpModal.hide();
      OwnerLoginModal.hide();
      
      StaffLoginModal.hide();
      StudentLoginModal.hide();
    
      StaffLoginModal.show();
  }

  function formDataToJson(formData) {
      const json = {};
      formData.forEach((value, key) => {
          json[key] = value;
      });
      return json;
  }

  function handleFormSubmit(event) {
      event.preventDefault();
  
      var form = event.target;
      var formData = new FormData(form);

      var role = form.dataset.role;
      formData.append("role", role);
      fetch(form.action, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json', 
          },
          body: JSON.stringify(formDataToJson(formData)),
      })
      .then(response => {
          if(response.status==200){
             if(role === 'staff'){
              window.location.href = '/ownerpage'
             }
             renderchangeonlogin()
          }
          else{
          }
          return response.json();
      })
      .then(data => {
          if(data.message=='Validation Error'){
              const validationError = data
              console.log(validationError);
              for (const field in validationError.errors) {
                  const errorMessage = validationError.errors[field];
                  const errorElement = form.querySelector(`.${field}_error`);
                  errorElement.innerHTML = errorMessage;
                  const inputElement = form.querySelector(`[name="${field}"]`);
                  inputElement.classList.add('error-border');
                  inputElement.addEventListener('focus', function() {
                      inputElement.classList.remove('error-border');
                      errorElement.innerHTML = '';
                  });
                  inputElement.addEventListener('input', function() {
                      inputElement.classList.remove('error-border');
                      errorElement.innerHTML = '';
                  });
              }
          }
          else{
            StudentSignUpModal.hide();
            OwnerLoginModal.hide();
            
            StaffLoginModal.hide();
            StudentLoginModal.hide();

            if(form.dataset.role === 'owner'){
                window.location.href = '/ownerpage'
            }
          }
      })
      .catch(error => {
          console.log(error);
      });
  }
  
  var forms = document.querySelectorAll("form");
  forms.forEach(function (form) {
      if(form.dataset.type === "auth"){
      form.addEventListener("submit", handleFormSubmit);
      }
  });

  function logout(){
      let ans = confirm('Are you sure you want to log out?')
      if(ans){
      fetch('/auth/logout',{
        method:'POST'
      }).then((response)=>{
        if(response.status===200){
           window.location.reload();
        }
        else{
          alert('An error occurred')
        }
      })
    }
}

fetch('/auth/checkuserlogin').then((response)=>{
  if(response.status==200){
     renderchangeonlogin()
  }
})

function renderchangeonlogin(){
  let loginbtn =  document.querySelector('.navauthbtn')
  loginbtn.innerHTML = 'Logout'
  loginbtn.classList.remove('studentlogintrigger')
  loginbtn.classList.add('logoutbtn')
  loginbtn.classList.remove('btn-primary')
  loginbtn.classList.add('btn-outline-primary')
  loginbtn.addEventListener('click',logout)

  var myorderlist = document.createElement('li')
  myorderlist.classList.add('nav-item')
  myorderlist.innerHTML = `<a href="/order/myorders">My Orders</a>`
  document.querySelector('.navbar ul').appendChild(myorderlist)

  var myorderlist_ = document.createElement('li')
  myorderlist_.classList.add('nav-item')
  myorderlist_.innerHTML = `<a href="/order/myorders" class="dropdown-item">My Orders</a>`
  document.querySelector('.navbardropdown').appendChild(myorderlist_)
 localStorage.setItem('user-login',true)
}

function getErrorMessageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('error');
}

const errorMessage = getErrorMessageFromURL();
if (errorMessage) {
  alert(errorMessage);
  window.location.href = '/'
}

});
