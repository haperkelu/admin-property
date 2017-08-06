var Profile = function() {

    var handlePersonalInfo = function() {

        $('.personalinfo').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                phone: {
                    phone: true
                }
            },

            messages: {
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
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_tnc_error'));
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

        $('.personalinfo input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.personalinfo').validate().form()) {
                    $('.personalinfo').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
        
        $('.mt-clipboard').each(function(){
            var clipboard = new Clipboard(this);	

            clipboard.on('success', function(e) {
                paste_text = e.text;
                console.log(paste_text);
            });
        });

    }

    var handleResetPassword = function() {
        $('.resetpassword').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                newpassword: {
                    required: true,
                    minlength:8,
                    maxlength:20
                },
                oldpassword: {
                    required: true
                },
                rpassword: {
                    equalTo: "#register_password"
                }
            },

            messages: { // custom messages for radio buttons and checkboxes
                tnc: {
                    required: "Please accept TNC first."
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
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form[0].submit();
            }
        });

    }

     
   return {

        //main function
        init: function() {
            //$("form").validate();
            handlePersonalInfo();
            handleResetPassword();
        },
        
        
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        Profile.init();
    });
}