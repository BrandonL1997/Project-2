$("#button").on("click", function () {
    console.log($(this).data('id'))
    $.ajax('/api/' +$(this).data('id', {
        type: 'PUT',
    }).then(function() {
        location.reload();
    })
})