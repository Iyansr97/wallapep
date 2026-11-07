export let validateFormDataInputRequired =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^(.+)$/;
        let errorMessage = "Required"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateFormDataInputEmail =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        let errorMessage = "Not email format"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexEmail, errorMessage)
    }

export let validateFormDataInputProductTitle =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexTitle = /^.{5,50}$/
        let errorMessage = "Title must have between 5 and 50 characters"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexTitle, errorMessage)
    }

export let validateFormDataInputPrice =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexPrice = /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/
        let errorMessage = "Price must be a number greater than 0"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexPrice, errorMessage)
    }

let documentControlLetter = (number) => "TRWAGMYFPDXBNJZSQVHLCKE".charAt(number % 23);

export const documentExamples = { DNI: "e.g. 12345678Z", NIE: "e.g. X1234567L", Passport: "e.g. AAB123456" };

export let documentNumberError = (type, number) => {
    let value = number?.trim().toUpperCase();
    if (!value)
        return null;
    if (type == null)
        return "Select the document type";

    if (type == "DNI") {
        if (!/^\d{8}[A-Z]$/.test(value))
            return "A DNI has 8 digits and a letter";
        if (value.charAt(8) != documentControlLetter(Number(value.slice(0, 8))))
            return "The letter of this DNI is not correct";
    }
    if (type == "NIE") {
        if (!/^[XYZ]\d{7}[A-Z]$/.test(value))
            return "A NIE has X, Y or Z, 7 digits and a letter";
        let digits = "XYZ".indexOf(value.charAt(0)) + value.slice(1, 8);
        if (value.charAt(8) != documentControlLetter(Number(digits)))
            return "The letter of this NIE is not correct";
    }
    if (type == "Passport" && !/^[A-Z0-9]{6,9}$/.test(value))
        return "A passport has 6 to 9 letters or digits";

    return null;
}

export let validateFormDataInput =
    (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {
        if (formData[inputKey] == null) {
            return true
        }

        if (formErrors[inputKey]?.type == "server") {
            return false
        }

        if (formData[inputKey] != null && regex.test(formData[inputKey])) {
            if (formErrors[inputKey] != null ) {
                formErrors[inputKey] = null;
                setFormErrors(formErrors)
            }
            return true;
        }

        if (formErrors[inputKey] == null) {
            formErrors[inputKey] = {msg: msgError }
            setFormErrors(formErrors)
        }
        return false;
    }

export let allowSubmitForm = (formData, formErrors, requiredInputWithNoErrors) => {
    let result = true;
    requiredInputWithNoErrors.forEach(inputKey => {
        if ((formData[inputKey] == null
            || formErrors[inputKey] != null) && formErrors[inputKey]?.type != "server" ) {

            result = false;
            return;
        }
    })
    return result;
}

export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {}
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            newFormErrors[e.field] = { msg: e.msg, type: "server" }
        });
    }
    setFormErrors(newFormErrors)
}

export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null){
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}

