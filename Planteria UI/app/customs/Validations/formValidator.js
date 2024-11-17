
const validateForm = (email, password, firstname, lastName, phoneNumber) => {
    let isValid = true;
    const errors = {};
  
    if (!email || !email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }
  
    // Validate password format
    if (!password || !password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!&<>@#$%]).{8,40}$/.test(password)
    ) {
      errors.password =
        'Password must have at least one numeric, lowercase, uppercase character, and one special symbol among !&<>@#$%, and length between 8 and 30 characters';
      isValid = false;
    }
  
    // Validate first name
    if (!firstname || !firstname.trim()) {
      errors.firstname = 'First Name is required';
      isValid = false;
    }
  
    // Validate last name
    if (!lastName || !lastName.trim()) {
      errors.lastName = 'Last Name is required';
      isValid = false;
    }
  
    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone Number must be 10 digits';
      isValid = false;
    }
  
    return { isValid, errors };
  };
  
  export default validateForm;
  