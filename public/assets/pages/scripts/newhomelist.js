var Profile = function() {

    var handleValidation = function() {
            $('.ConsultantForm').validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    propertyname: {
                        required: true
                    },
                    name: {
                        required: true
                    },
                    phone: {
                        required: true,
                        phone: true
                    },
                    email: {
                        required: true,
                        email: true
                    }
                },

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
                    else if (element.attr("name") == "img1") { // insert checkbox errors after the container
                        error.insertAfter($('#img1error'));
                    } else if (element.closest('.input-icon').size() === 1) {
                        error.insertAfter(element.closest('.input-icon'));
                    } else {
                        error.insertAfter(element);
                    }
                },

                submitHandler: function(form) {
                    form.submit(); // form validation success, call ajax form submit
                }
            });

            $('.ConsultantForm input').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.ConsultantForm').validate().form()) {
                        $('.ConsultantForm').submit(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
    }

     
   return {
        //main function
        init: function() {
            handleValidation();
        }
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        Profile.init();
    });
}
