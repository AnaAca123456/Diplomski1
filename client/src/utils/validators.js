export const validateMentorCode = (code) => {
    return code === "250321";
};

export const validateLicenseNumber = (license) => {
    const pattern = /^\d{2}\/\d{2}$/;
    return pattern.test(license);
};

export const passwordsMatch = (pass, confirmPass) => {
    return pass === confirmPass;
};
