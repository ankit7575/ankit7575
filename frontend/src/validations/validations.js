export const validateTrade = (values) => {
    const errors = {};
    const today = new Date();

    // Validate Name
    if (!values.name?.trim()) {
        errors.name = "Name is required.";
    }

    // Validate Email
    if (!values.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid.";
    }

    // Validate Phone Number
    if (!values.phoneNumber?.trim()) {
        errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(values.phoneNumber)) {
        errors.phoneNumber = "Phone number must be 10 digits.";
    }

    // Validate Date of Birth
    if (!values.dob) {
        errors.dob = "Date of birth is required.";
    } else {
        const dobDate = new Date(values.dob);
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            errors.dob = "You must be at least 18 years old.";
        } else if (dobDate >= today) {
            errors.dob = "Date of birth must be in the past.";
        }
    }

    // Validate Country
    if (!values.country?.trim()) {
        errors.country = "Country is required.";
    }

    // Validate MT5 ID
    if (!values.mt5Id?.trim()) {
        errors.mt5Id = "MT5 ID is required.";
    }

    // Validate MT5 Password
    if (!values.mt5Password) {
        errors.mt5Password = "MT5 Password is required.";
    } else if (values.mt5Password.length < 6) {
        errors.mt5Password = "MT5 Password must be at least 6 characters.";
    }

    // Validate Broker Name
    if (!values.brokerName?.trim()) {
        errors.brokerName = "Broker name is required.";
    }

    // Validate Plan
    if (!values.plan) {
        errors.plan = "Please select a plan.";
    }

    // Validate Capital
    if (!values.capital) {
        errors.capital = "Capital is required.";
    } else if (isNaN(values.capital) || values.capital <= 0) {
        errors.capital = "Capital must be a positive number.";
    }

    return errors;
};
