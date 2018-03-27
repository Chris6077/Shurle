// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
var api = false;
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
  $('.api').on('click', function(){
    if(api){
      $('.container')[0].innerHTML = '<div class="input-group input-group-lg"> <input id="url-field" type="text" class="form-control" placeholder="Paste a link..."> <span class="input-group-btn"> <button class="btn btn-shorten" type="button">SHORTEN</button> </span> </div> <div id="link"></div>';
      $('.api')[0].innerHTML = "API Usage";
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
      api = false;
    }
    else {
      $('.container')[0].innerHTML = "<h2>Example inputs:</h2> <p>https://shurle.glitch.me/new/google.com</p> <p>https://shurle.glitch.me/new/http://www.google.com</p> <p>https://shurle.glitch.me/new/http://google.com</p> <p>https://shurle.glitch.me/new/www.google.com</p> <h2>These inputs will return this:</h2> <p>{ \"shortUrl\": \"https://shurle.glitch.me/m7Kp\" }</p> <h2> This service differs HTTPS and HTTP and automatically adds HTTP if no protocol is given. Works with mailto etc. too.</h2>";
      $('.api')[0].innerHTML = "Back to Shurle";
      api = true;
    }
  });
});