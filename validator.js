
function validator(option) {

    var ruleSelectors = {}


    function validate(inputElement, rule) {
        var parentElement = inputElement.closest(option.formGroupSelector)

        var errorElement = parentElement.querySelector(option.errorSelector)

        var rules = ruleSelectors[rule.selector]

        var errorMessage

        for (var i = 0;i < rules.length;i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage
            parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerHTML = ''
            parentElement.classList.remove('invalid')
        }

        return !!errorMessage
    }

    var formElement = document.querySelector(option.formSelector)

    //xử lí lọc qua mỗi rule (lắng nghe sự kiện blur, input)
    if (formElement) {

        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true

            option.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                if (inputElement) {
                    var isValid = validate(inputElement, rule)
                    if (isValid) {
                        isFormValid = !isValid
                    }
                }
            })

            if (isFormValid) {
                if (typeof option.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        switch (input.type) {
                            case('radio'):
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }
                                break
                            case('checkbox'):
                                if (input.matches(':checked')) {
                                    if (Array.isArray(values[input.name])) {
                                        values[input.name].push(input.value)
                                    } else {
                                        values[input.name] = [input.value]
                                    }
                                }
                                break
                            case('file'):
                                values[input.name] = input.files;
                                break
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {})
                    option.onSubmit(formValues)
                }
                else {
                    formElement.submit()
                }
            } 
            else {
                console.log('co loi roi nha')
            }
        }
        option.rules.forEach(function(rule) {
            var inputElements = formElement.querySelectorAll(rule.selector)
            for (var i =0; i<inputElements.length;i++) {
                let inputElement=inputElements[i]
                if (Array.isArray(ruleSelectors[rule.selector])) {
                    ruleSelectors[rule.selector].push(rule.test)
                } 
                else {
                    ruleSelectors[rule.selector] = [rule.test]
                }
                if (inputElement) {
                    inputElement.onblur = function () {
                        validate(inputElement, rule)
                    }
    
                    inputElement.oninput = function () {
                        var parentElement = inputElement.closest(option.formGroupSelector)
                        var errorElement = parentElement.querySelector(option.errorSelector)
                        errorElement.innerHTML = ''
                        parentElement.classList.remove('invalid')
                    }
                }
            }
        }) 
    }
}


validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này' 
        }
    }
}

validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /\w+\@\w+/i
            return regex.test(value) ? undefined : message || 'Email không hợp lệ'
        }
    }
}

validator.minLength = function (selector, minLength, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minLength ? undefined : message || `Mật khẩu cần tối thiểu ${minLength} kí tự`
        }
    }
}

validator.isConfirmed = function (selector, getConfirmedValue, message) {
    return {
        selector: selector, 
        test: function(value) {
            return value === getConfirmedValue() ? undefined : message || 'giá trị nhập vào không chính xác'
        }
    }
}
