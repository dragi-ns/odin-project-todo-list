import { toTitleCase } from '../utils';

function isFormValid(form) {
    let formValid = true;
    for (const input of form.elements) {
        if (input.type === 'submit') {
            continue;
        }

        if (!input.validity.valid) {
            displayInputError(input);
            formValid = false;
        } else {
            hideInputError(input);
        }
    }
    return formValid;
}

function displayInputError(input) {
    const inputLabelText = input.previousElementSibling.textContent;
    const inputError = input.nextElementSibling;
    let msg = null;
    if (input.validity.valueMissing) {
        msg = 'is required';
    } else if (input.validity.tooLong) {
        msg = `should have maximum ${input.maxLength} characters; you entered ${input.value.length}`;
    } else if (input.validity.rangeOverflow) {
        msg = `should be less than or equal to ${input.max}; you entered ${input.value}`;
    } else if (input.validity.rangeUnderflow) {
        msg = `should be greater than or equal to ${input.min}; you entered ${input.value}`;
    } else {
        msg = 'is invalid';
    }
    inputError.textContent = `${toTitleCase(inputLabelText)} ${msg}!`;
}

function hideInputError(input) {
    if (input.type !== 'submit') {
        input.nextElementSibling.textContent = '';
    }
}

export {
    isFormValid
};
