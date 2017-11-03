var Profile = function() {

    var handleValidation = function() {

            var jsonRules = {
                    OrderDate: {
                        required: true
                    },
                    PropertyType: {
                        required: true
                    },
                    UnitNumber: {
                        required: true
                    },
                    BuildingPrice: {
                        required: true
                    },
                    CustomerName: {
                        required: true
                    },
                    CustomerPhone: {
                        required: true,
                        phone: true
                    },
                    CustomerEmail: {
                        email: true,
                        required: true
                    },
                    CustomerAddress: {
                        required: true
                    },
                    ClientSituation: {
                        required: true
                    },
                    InvestmentOption: {
                        required: true
                    },
                    DepositPath: {
                        required: true   
                    },
                    CustomerIDPath: {
                        required: true
                    },
                    SalesName: {
                        required: true
                    },
                    SalesMobile: {
                        required: true,
                        phone: true
                    },
                    SalesEmail: {
                        email: true,
                        required: true
                    }
                };
            
            var toggle = $('#defaultLawyer').parent().hasClass("active");
            if(!toggle) {
               jsonRules.lawyercompany = {
                        required: true
                    };
                jsonRules.lawyername = {
                        required: true
                    };
               jsonRules.lawyerphone = {
                        phone: true,
                        required: true
                    };
               jsonRules.lawyeremail = {
                        email: true,
                        required: true
                    };
               jsonRules.lawyeraddress = {
                        required: true
                    };

            };
            //console.log(jsonRules);
            $('.addOrder').validate({
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