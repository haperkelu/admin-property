var Profile = function() {

    var handleTouchSpins = function() {
        $("#bed").TouchSpin({
            verticalbuttons: true
        });
        $("#bath").TouchSpin({
            verticalbuttons: true
        });
        $("#carpark").TouchSpin({
            verticalbuttons: true
        });
    }

    var handleValidation = function() {

            $('.addResaleHome').validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    propertytype: {
                        required: true
                    },
                    bed: {
                        required: true
                    },
                    bath: {
                        required: true
                    },
                    carpark: {
                        required: true
                    },
                    saletype: {
                        required: true
                    },
                    sourcetype: {
                        required: true
                    },
                    address: {
                        required: true
                    },
                    title: {
                        required: true
                    },
                    phone: {
                        required: true,
                        phone: true
                    },
                    email: {
                        email: true
                    },
                    img1: {
                        required: true
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

            $('.addResaleHome input').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.addResaleHome').validate().form()) {
                        $('.addResaleHome').submit(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
    }
    
    var handleAddress = function() {

    }

     
   return {

        //main function
        init: function() {
            //$("form").validate();
            handleTouchSpins();
            handleValidation();
        }
        
        
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        Profile.init();
    });
}