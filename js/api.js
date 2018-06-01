(function ($) {
  'use strict';


  /**
   * Ajax-based random post fetching & History API
   */

  var lastPage = "";


  $('#new-quote-button').on('click', function (event) {
    event.preventDefault();

    lastPage = document.URL;


    $.ajax({
      method: 'get',
      url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      cache: false,
    }).done(function (data) {

      history.pushState(null, null, data[0].slug);


      $('.entry-content').html(data[0].content.rendered);
      $('.entry-title').html(data[0].title.rendered);
      $('.source').html(data[0]._qod_quote_source);


      //append dat to html, look at content.php

    }).fail(function () {
      //some message for the user sying there was an error

    });

  });

  $(window).on('popstate', function () {
    window.location.replace(lastPage);
  });










  /**
   * Ajax-based front-end post submissions.
   */

  $('#quote-submission-form').on('submit', function (event) {

    event.preventDefault();
    var author = $('#quote-author').val();
    var quote = $('#quote-content').val();
    var source = $('#quote-source').val();
    var url = $('#quote-source-url').val();

    $.ajax({
      method: 'post',
      url: api_vars.root_url + 'wp/v2/posts',
      data: {
        status: "draft",
        title: quote,
        content: author,
        _qod_quote_source: source,
        _qod_quote_source_url: url,

      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
      }
    }).done(function () {
      alert(api_vars.success);
    }).fail(function () {
      alert(api_vars.failure);
    });

  });



  //see slides wp javascript slides fo r post request
  //also in the redsprouit theme

})(jQuery);


