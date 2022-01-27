
function validator(formSelector) {

    var formRules = {}



    // quy ước tạo rule:
    // -nếu có lỗi thì retủn `error message`
    // -nếu ko có lỗi thì retủn `undefined`

    var validatoRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value) {
            let regex = /\w+\@\w+/i
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhât ${min} kí tự`
            }

        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`
            }

        }
    }
    
    var formElement = document.querySelector(formSelector)

    if (formElement) {
        var inputs=formElement.querySelectorAll('[name][rules]')

        for (var input of inputs) {

            var rules = input.getAttribute('rules').split('|')

            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':')
                var ruleInfo

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                
                var ruleFunc = validatoRules[rule]

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }


            //handle onblur and change event

            input.onblur = handleValidate

            input.oninput = handleClearError
        }

        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage

            for (var rule of rules) {
                var errorMessage = rule(event.target.value)
                if(errorMessage) {
                    break
                }
            }

            // rules.find(function(rule) {
            //     errorMessage = rule(event.target.value)
            //     return errorMessage
            // })
            
            if (errorMessage) {
                var formGroup = event.target.closest('.form-group')
                var errorElement = formGroup.querySelector('.form-message')
                errorElement.innerHTML = errorMessage
                formGroup.classList.add('invalid')
            }
            return !errorMessage
        }

        function handleClearError(event) {
            var formGroup = event.target.closest('.form-group')
            if (formGroup.classList.contains('invalid')) {
                var errorElement = formGroup.querySelector('.form-message')
                errorElement.innerHTML = ''
                formGroup.classList.remove('invalid')
            }
        }


    }


    formElement.onsubmit = function(e) {
        e.preventDefault();

        var inputs=formElement.querySelectorAll('[name][rules]')
        var hasInvalidInput = false
        var inputValues = {}

        for (var input of inputs) {
            if(!handleValidate({
                target: input
            })) {
                hasInvalidInput = true
            }

            inputValues[input.name] = input.value
        }


        if (hasInvalidInput) {
            console.log('co loi roi nha')
        }
        else {
            console.log(JSON.stringify(inputValues))
        }
    }
}