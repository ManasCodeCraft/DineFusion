
document.addEventListener('DOMContentLoaded', async function () {
    await renderStaff();
    var StaffLoginModal = new bootstrap.Modal("#authModalStaffSignUp", {
        keyboard: false,
    });
    var MessageModal = new bootstrap.Modal('#messageModal', {
        keyboard: false,
      })
    document.querySelector('.staffsignuptrigger').addEventListener('click',()=>{
        StaffLoginModal.show();
    })
    document.querySelector('.signUpFormStaff').addEventListener('submit',addStaff)


    async function fetchAllStaff() {
        try {
            const response = await fetch('/auth/fetchstaff'); 
            if (!response.ok) {
                throw new Error('Failed to fetch staff data');
            }
            const data = await response.json();
            return data.staff;
        } catch (error) {
            console.error('Error fetching staff data:', error);
            return []; 
        }
    }
    
    async function renderStaff() {
        const staffTable = document.querySelector('.table tbody');
        staffTable.innerHTML = ''; 
    
        const staffData = await fetchAllStaff();
        staffData.forEach((staff, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>
                    <button type="button" class="btn btn-danger")">Remove</button>
                </td>
            `;
            staffTable.appendChild(row);
            staffTable.querySelector('button').addEventListener('click',()=>{
                removeUser(staff.name, staff._id)
            })
        });
    }
    
    async function removeUser(staffName, staffId) {
        let ans = confirm(`Are you sure to remove ${staffName} from staff?`)
        if(ans){
        try {
            const response = await fetch('/auth/removestaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ staffId: staffId })
            });
            if (!response.ok) {
                throw new Error('Failed to remove staff member');
            }
            await renderStaff();
        } catch (error) {
            console.error('Error removing staff:', error);
        }
    }
    }
    
    
    function formDataToJson(formData) {
        const json = {};
        formData.forEach((value, key) => {
            json[key] = value;
        });
        return json;
    }
    function addStaff(event) {
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
                 StaffLoginModal.hide();
                 MessageModal.show();
                //  renderStaff(); 
            }
            return response.json();
        })
        .then(data => {
            if(data.name=='ValidationError'){
                const validationError = data
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
        })
        .catch(error => {
            console.log(error);
        });
    }

});


