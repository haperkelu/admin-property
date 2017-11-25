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
                    PropertyType: {
                        required: true
                    },
                    LowPrice: {
                        required: true,
                        number: true
                    },
                    NumOfRoom: {
                        required: true,
                        range: [1, 10]
                    },
                    NumOfBath: {
                        required: true,
                        range: [0, 10]
                    },
                    NumOfPark: {
                        required: true,
                        range: [0, 10]
                    },
                    PurchaseType: {
                        required: true
                    },
                    Source: {
                        required: true
                    },
                    Address: {
                        required: true
                    },
                    title: {
                        required: true
                    },
                    Phone: {
                        required: true,
                        phone: true
                    },
                    Email: {
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
                    nicEditors.findEditor('Description').saveContent();
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

    var handleSummernote = function () {
        //$('#summernote_1').summernote({height: 300});
        //API:
        //var sHTML = $('#summernote_1').code(); // get code
        //$('#summernote_1').destroy(); // destroy
    }
    
    var handleAddress = function() {

    }

     
   return {

        //main function
        init: function() {
            //$("form").validate();
            handleTouchSpins();
            handleValidation();
            handleSummernote();
        }
        
        
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        Profile.init();
    });
}