$(document).ready(function() {
  function colorcycle() {
    var colors = [
        '#54c8eb', // light blue
        '#4ea9de', // med blue
        '#4b97d2', // dark blue
        '#92cc8f', // light green
        '#41bb98', // mint green
        '#c9de83', // yellowish green
        '#dee569', // yellowisher green
        '#c891c0', // light purple
        '#9464a8', // med purple
        '#7755a1', // dark purple
        '#f069a1', // light pink
        '#f05884', // med pink
        '#e7457b', // dark pink
        '#ffd47e', // peach
        '#f69078' // salmon
    ];

    var color = colors[parseInt(Math.random() * (colors.length - 1), 10)];
      $('.funky--border').css('transition', 'border-color 15s').css('border-color', color);
    }

    setTimeout(function () {
      colorcycle();
      setInterval(colorcycle, 15000);
    }, 1000);
    
    $('.search__button').on('click', function() {
        $('.result__block').empty()
        var url = $('.search__field').val();
        $('.loader').show();
        
        $.post('/detect', {
            url: url
        }, function(data) {
            var result = data[0];

            if (result) {
              $('.loader').hide();
              $.get('/similar/' + result.faceId, function(data2) {
                var result = data2[0];

                if (result) {
                  $('.result__block').empty().append('<img src="' + result.url + '"/>');
                } else {
                  $('.result__block').empty().append('<img src="' + 'http://myhealthyfitlife.com/wp-content/uploads/2010/09/No-Results-Found.jpg' + '"/>');
                }
              });
            }
            else{$('.loader').hide();}
        }, 'json');
    });
});
