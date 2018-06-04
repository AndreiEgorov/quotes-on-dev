$(document).ready(function () {
  (function ($) {
    'use strict';
    /**
     * Ajax-based random post fetching & History API
     */
    var lastPage = " ";
    $('#new-quote-button').on('click', function (event) {
      event.preventDefault();

      $.ajax({
        method: 'GET',
        url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
        cache: false,
      }).done(function (data) {

        var postObj = data[0];
        var postTitle = '&mdash; ' + postObj.title.rendered;
        var quoteSrc = postObj._qod_quote_source;
        var quoteSrcComma = ' ,' + postObj._qod_quote_source;
        var quoteSrcUrl = postObj._qod_quote_source_url;
        var quoteSrcHtml = ', <a href="' + quoteSrcUrl + '">' + quoteSrc + '</a>';
        $('.entry-title').html(postTitle);

        $('.source').html(quoteSrc);
        if (quoteSrc.length > 0) {
          $('.source').empty();
          $('.source').html(quoteSrcComma);
          if (quoteSrcUrl.length > 0) {
            $('.source').empty();
            $(".source").html(quoteSrcHtml);
          }
        }
        $('.entry-content').html(data[0].content.rendered);
        lastPage = document.URL;
        history.pushState(null, null, data[0].slug);
      }).fail(function () {
        alert("An unexpected error occured. Please, try again later.")
      });
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
          status: "pending",
          title: quote,
          content: author,
          _qod_quote_source: source,
          _qod_quote_source_url: url,
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
        }
      }).done(function () {
        $('#quote-submission-form').slideUp('slow', function () {
          $('.submit-success-message').css("display", "block").html(api_vars.success);
        })
      }).fail(function () {
        alert(api_vars.failure);
      });

    });

    $(window).on('popstate', function () {
      window.location.replace(lastPage);
    });
  })(jQuery);
});
