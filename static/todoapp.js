$(document).ready(function(){
    $("#add_task_button").click(function(){
        var ready_to_submit = true;
        var task_description = $.trim($('input[name=task_description_input]').val());
        var email = $.trim($('input[name=email_input]').val());
        var priority = $('#selected_priority').attr('values');

        $(".error").remove();
        if (task_description.length == 0) {
          $('input[name=task_description_input]').after('<span class="error">This field is required</span>');
          ready_to_submit = false;
        }
        if (email.length == 0) {
          $('input[name=email_input]').after('<span class="error">This field is required</span>');
          ready_to_submit = false;
        } else {
          var regEx = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          var validEmail = regEx.test(email);
          if (!validEmail) {
            $('input[name=email_input]').after('<span class="error">Enter a valid email</span>');
            ready_to_submit = false;
          }
        }

        if (ready_to_submit) {
            $.ajax({
                type: 'POST',
                url: "/submit",
                data: '{' +
                    '"task_description":"' + task_description + '",' +
                    '"email":"' + email + '",' +
                    '"priority":"' + priority + '"' +
                    '}',
                contentType: "application/json",
                dataType: 'json',
                success: [function(response) { window.location.href = "/"; }]
            });
        }
    });

    $(".delete_task_button").click(function() {
        var id_to_del = parseInt($(this).parent().parent().attr('id'));
        $.ajax({
            type: 'POST',
            url: '/clear',
            data: '{"id_to_del":' + id_to_del + '}',
            contentType: "application/json",
            dataType: 'json',
            success: [function(response) { window.location.href = "/"; }]
        });
    });

    $('ul li').click(function() {
        $(this).siblings().removeAttr('id');
        $(this).attr('id', 'selected_priority');
    })
});