var Profile = function() {

    var handleValidation = function() {

            $('.addOrder').validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    address: {
                        required: true
                    },
                    area: {
                        required: true
                    },
                    propertytype: {
                        required: true
                    },
                    name: {
                        required: true
                    },
                    popular: {
                        required: true
                    },
                    img: {
                        required: true
                    },
                    begindate: {
                        required: true
                    },
                    enddate: {
                        required: true
                    },
                    commission: {
                        required: true,
                        number: true
                    },
                    link: {
                        url: true
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
                    else if (element.attr("name") == "img") { // insert checkbox errors after the container
                        error.insertAfter($('#imgerror'));
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

            $('.addOrder_submit').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.addOrder').validate().form()) {
                        $('.addOrder').submit(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
    }

    var handleSummernote = function () {
        $('#summernote_1').summernote({height: 300});
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