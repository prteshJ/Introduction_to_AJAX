
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    //CODE TO MAKE PAGE DYNAMIC!
    var streetStr, cityStr, address,  streetViewUrl, articles, articleStr;
    streetStr = $('#street').val();
    cityStr = $('#city').val();
    address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    // load streetview
    streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
           address + '';

    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr +
                      '&sort=newest&api-key=ef19bbf7b23d46ce85197aca8462a42a';

    $.getJSON(nytimesUrl, function( data) {
        $nytHeaderElem.text('New York Times Article About ' + cityStr);

        articles = data.response.docs;
        for(var i=0; i<articles.length;i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                            '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                            '<p>' + article.snippet + '</p>' +
                            '</li>');
        }
    }).fail( function(e) { // jQuery's Error Handling
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Wikipedia AJAX request goes here
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                   cityStr +
                   '&format=json&callback=wikiCallback'; // Specify callback since JSONP requires
                                                         // it!

    // Custom Error Handling
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed To Get Wikipedia Resources');
    },8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp", // To overcome Cross Origin Resource Sharing issue
        // jsonp: "callback",
        success: function(response) {
            var articleList = response[1];

            for(var i=0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout); // Disable timeout if response was successful!
        }
    });

    return false;
};

$('#form-container').submit(loadData);
