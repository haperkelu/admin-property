var Profile = function() {

    var handleValidation = function() {

            var jsonRules = {
                    role: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    level: {
                        required: true
                    },
                    surname: {
                        required: true
                    },
                    firstname: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    passwordconfirm: {
                        required: true
                    },
                    fullname: {
                        required: true
                    },
                    bank: {
                        required: true
                    },
                    BSB: {
                        required: true
                    },
                    ACC: {
                        required: true
                    },
                    ABN: {
                        required: true   
                    }
            };
            //console.log(jsonRules);
            $('.adduser').validate({
                ignore: "",
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: jsonRules,

                invalidHandler: function(event, validator) { //display error alert on form submit

                },

                highlight: function(element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                success: function(label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },

                errorPlacement: function(error, element) {
                    if (element.attr("name") == "bed" || element.attr("name") == "bath" || element.attr("name") == "carpark") {
                    }
                    else if (element.attr("name") == "deposit") { // insert checkbox errors after the container
                        error.insertAfter($('#dipositError'));
                    }
                    else if (element.attr("name") == "clientIDPhoto") { // insert checkbox errors after the container
                        error.insertAfter($('#clientIDPhotoError'));
                    }
                    else if (element.closest('.input-icon').size() === 1) {
                        error.insertAfter(element.closest('.input-icon'));
                    } else {
                        error.insertAfter(element);
                    }
                },

                submitHandler: function(form) {
                    form.submit(); // form validation success, call ajax form submit
                }
            });

            $('.adduser_submit').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.adduser').validate().form()) {
                        $('.adduser').submit(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
    
    }
   return {

        //main function
        init: function() {
            //$("form").validate();
            handleValidation();
        }
        
        
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        Profile.init();
    });
}