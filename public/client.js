// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
$(document).ready(function(){
  $('.btn-shorten').on('click', function(){
    $.ajax({
      url: '/new',
      type: 'POST',
      dataType: 'JSON',
      data: {url: $('#url-field').val()},
      success: function(data){
          if(data.shortUrl != undefined){
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
          } else {
            var resultHTML = '<p class="result">' + data.error + '</p>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
          }
      }
    });
  });
});