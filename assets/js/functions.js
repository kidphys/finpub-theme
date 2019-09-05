var didScroll;
var lastScrollTop = 0;
var delta = 5;
var body = $( 'body' );
var navbar = $( '#navigation-bar' );
var navbarHeight = navbar.outerHeight();
var mask = $( '#hero-mask' );
var heroHeight = $( '#hero' ).outerHeight();

jQuery( document ).ready( function( $ ) {

	( function() {
		'use strict';

		noImagePosts( $ );
		initRetinaLogo( $ );
		initMobileNavbar( $ );
		initSocialLinks( $ );
		initFeaturedPosts( $ );
		initTopStories( $ );
		initFitVids( $ );
		initPostShare( $ );
		initRelatedPosts( $ );
		loadInstagramPhotos( $ );
		initCopyright( $ );
		initGallery( $ );
	} )( jQuery );

} );

jQuery( window ).load( function( $ ) {

	( function( $ ) {
		'use strict';

		mediaFeedHeight( $ );
	} )( jQuery );

} );

jQuery( window ).resize( function() {

	( function( $ ) {
		'use strict';

		window.requestAnimationFrame( mediaFeedHeight );
	} )( jQuery );

} );

jQuery( window ).scroll( function() {

	( function( $ ) {
		'use strict';

		didScroll = true;
		window.requestAnimationFrame( heroMask );
	} )( jQuery );

} );

setInterval( function() {
	'use strict';

  if ( didScroll ) {
    hasScrolled();
    didScroll = false;
  }
}, 250 );

function hasScrolled() {
	'use strict';

	hideNavbar();
}

function noImagePosts( $ ) {
	'use strict';

	$( '.tag-no-image' ).addClass( 'no-image' );
}

function initRetinaLogo( $ ) {
	'use strict';

	var logo = $( '.brand-logo' );
	var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

	if ( mondoOptions.retina_logo != '' && ( window.devicePixelRatio > 1 || ( window.matchMedia && window.matchMedia( mediaQuery ).matches ) ) ) {
		logo.attr( 'src', mondoOptions.retina_logo );
	}
}

function hideNavbar() {
	'use strict';

	var st = $( window ).scrollTop();

  if ( Math.abs( lastScrollTop - st ) <= delta ) {
    return;
  }

  if ( body.hasClass( 'with-transparent-navbar' ) ) {
  	if ( st > 0 ) {
  		navbar.removeClass( 'transparent' );
  	} else {
  		navbar.addClass( 'transparent' );
  	}
  }

  if ( st > lastScrollTop && st > navbarHeight * 4 ) {
    navbar.addClass( 'up' );
  } else {
    if( st + $( window ).height() < $( document ).height() ) {
      navbar.removeClass( 'up' );
    }
  }

  lastScrollTop = st;
}

function initSocialLinks( $ ) {
	'use strict';

	var wrapper = $( '.social-links' );
	var links = mondoOptions.social_links;
	var output = '';

	for ( var key in links ) {
		if ( links[ key ] != '' ) {
			output += '<li><a href="' + links[ key ] + '" target="_blank"><i class="fa fa-' + key + '"></i></a></li>';
		}
	}

	wrapper.html( output );
}

function initMobileNavbar( $ ) {
	'use strict';

	var element = $( '#main-navigation' );

	$( '#mobile-nav-toggle' ).click( function() {
		if ( ! element.is( ':visible' ) && ! element.hasClass( 'velocity-animating' ) ) {
			element.velocity( 'slideDown', { duration: 300 } );
		} else {
			element.velocity( 'slideUp', { duration: 300 } );
		}
	} );
}

function heroMask() {
	'use strict';

	var st = jQuery( window ).scrollTop();

	mask.css( 'opacity', ( 0.4 + 1 / heroHeight * st * 1.5 ) );
}

function fetch( url ) {
	'use strict';

	return $.get( url );
}

function initFeaturedPosts( $ ) {
	'use strict';

	var wrapper = $( '#featured-posts' );

	wrapper.slick( {
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 4,
		responsive: [
		{
			breakpoint: 992,
			settings: {
			slidesToShow: 3,
			slidesToScroll: 3
			}
		},
		{
			breakpoint: 768,
			settings: {
			slidesToShow: 2,
			slidesToScroll: 2
			}
		},
		{
			breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
		]
	} );

	// call _oldInitFeaturedPosts(mondoOptions) for old code
}

function _oldInitFeaturedPosts(mondoOptions) {
	var results = [];
	var index, response, bg, tags;
	var output = '';
	if ( mondoOptions.slider_items.length > 0 ) {

		for ( index in mondoOptions.slider_items ) {
			results.push( fetch( mondoOptions.slider_items[ index ] ) );
		}

		$.when.apply( this, results ).done( function () {
			for ( var i = 0; i < mondoOptions.slider_items.length; i++ ) {
				if ( mondoOptions.slider_items.length == 1 ) {
					response = $( arguments[0] );
				} else {
					response = $( arguments[ i ][0] );
				}

				output += '<article class="featured-post"';

				bg = response.find( '#hero' ).css( 'background-image' );
				bg = bg.replace( /"/g, "'" );

				if ( bg != '' ) {
					output += ' style="background-image: ' + bg + ';"';
				}

				output += '>';
				output += '<div class="entry-content">';
				output += '<h3 class="entry-title"><a href="' + mondoOptions.slider_items[ i ] + '" rel="bookmark">' + response.find( '.hero-title' ).text() + '</a></h3>';

				tags = response.find( '.cat-links' ).html().split( '</a>' );
				tags.pop();
				tags = tags.join( '</a>, ' ) + '</a>';
				output += '<span class="entry-meta">' + tags + '</span>';

				output += '</div></article>';
			}

			wrapper.html( output );

			wrapper.slick( {
				infinite: true,
			  slidesToShow: 4,
			  slidesToScroll: 4,
			  responsive: [
			    {
			      breakpoint: 992,
			      settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3
			      }
			    },
			    {
			      breakpoint: 768,
			      settings: {
			        slidesToShow: 2,
			        slidesToScroll: 2
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1
			      }
			    }
			  ]
			} );
		} );
	} else {
		wrapper.remove();
	}

}

function initTopStories( $ ) {
	'use strict';

	var wrapper = $( '.widget-top-stories' ).find( '.posts' );
	var results = [];
	var index, response;
	var output = '';

	for ( index in mondoOptions.top_stories ) {
		results.push( fetch( mondoOptions.top_stories[ index ] ) );
	}

	$.when.apply( this, results ).done( function () {
		for ( var i = 0; i < mondoOptions.top_stories.length; i++ ) {
			if ( mondoOptions.top_stories.length == 1 ) {
				response = $( arguments[0] );
			} else {
				response = $( arguments[ i ][0] );
			}
			output += '<li class="clearfix">';
			output += '<a class="thumbnail-link" href="#" rel="bookmark">' + ( i + 1 ) + '</a>';
			output += '<div class="entry-content">';
			output += '<h5 class="entry-title"><a href="' + mondoOptions.top_stories[ i ] + '" rel="bookmark">' + response.find( '.hero-title' ).text() + '</a></h5>';
			output += response.find( '.entry-date' )[0].outerHTML;
			output += '</div></li>';
		}

		wrapper.html( output );
	} );
}

function initFitVids( $ ) {
	'use strict';

	$( '.post-template' ).find( '.post' ).fitVids();
}

function initPostShare( $ ) {
	'use strict';

	var toggle = $( '.post .entry-share > .fa' );
	var popup = toggle.next( '.popup' );
	var link = popup.find( '.link' );

	toggle.click( function() {
		$( this ).next( '.popup' ).toggleClass( 'open' );
	} );

	link.click( function( e ) {
		e.preventDefault();

		openPopup( $( this ).attr( 'href' ), '', 500, 300 );
	} );
}

function openPopup( url, title, w, h ) {
	'use strict';

  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ( ( width / 2 ) - ( w / 2 ) ) + dualScreenLeft;
  var top = ( ( height / 2 ) - ( h / 2 ) ) + dualScreenTop;
  var newWindow = window.open( url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left );

  if ( window.focus ) {
    newWindow.focus();
  }
}

function initRelatedPosts( $ ) {
	'use strict';

	$( '#related-posts' ).ghostRelated( {
		titleClass: '.hero-title',
		tagsClass: '.cat-links',
		limit: 3
	} );
}

function loadInstagramPhotos( $ ) {
	'use strict';

	var wrapper = $( '#media-feed-thumbnails' );
	var photos;

	if ( mondoOptions.instagram.access_token != '' ) {
		if ( localStorage.getItem( 'instagram' ) !== null && ( Math.floor( Date.now() / 1000 ) - JSON.parse( localStorage.getItem( 'instagram' ) ).timestamp ) < 300 ) {
			photos = JSON.parse( localStorage.getItem( 'instagram' ) ).photos;
			outputInstagramPhotos( photos, wrapper );
		} else {
			var feed = new Instafeed( {
		    get: 'user',
		    userId: mondoOptions.instagram.user_id,
		    accessToken: mondoOptions.instagram.access_token,
		    resolution: 'standard_resolution',
		    limit: 7,
		    mock: true,
		    success: function( result ) {
		    	photos = result.data;
		    	var cache = {
		    		photos: photos,
		    		timestamp: Math.floor( Date.now() / 1000 )
		    	};

		    	localStorage.setItem( 'instagram', JSON.stringify( cache ) );

		    	outputInstagramPhotos( photos, wrapper );
		    }
		  } );

		  feed.run();
		}
	} else {
		$( '#mondo-media-feed' ).remove();
	}
}

function outputInstagramPhotos( photos, wrapper ) {
	'use strict';

	var photo;
	var output = '';

	for ( var index in photos ) {
		photo = photos[ index ];
		output += '<a class="thumbnail" href="' + photo.link + '" target="_blank" style="background-image: url(' + photo.images.standard_resolution.url + ');"></a>';
	}

	wrapper.html( output );
}

function mediaFeedHeight( $ ) {
	'use strict';

	var wrapper = jQuery( '#mondo-media-feed' );
	var container = jQuery( '#media-feed-thumbnails' );
	var element = container.find( '.thumbnail:first-child' );
	var containerHeight = element.height() * 2;

	container.height( containerHeight );

	if ( wrapper.hasClass( 'dribbble' ) ) {
		var bigElement = container.find( '.thumbnail:nth-child(3) img' );
		bigElement.height( containerHeight - 10 );
	}

	wrapper.removeClass( 'invisible' );
}

function initCopyright( $ ) {
	'use strict';

	var wrapper = $( '#colophon' ).find( '.bottom-top' );
	var text = mondoOptions.copyright_text;

	wrapper.html( text );
}

function initGallery( $ ) {
	'use strict';

	var images = document.querySelectorAll('.kg-gallery-image img');
	images.forEach(function (image) {
		var container = image.closest('.kg-gallery-image');
		var width = image.attributes.width.value;
		var height = image.attributes.height.value;
		var ratio = width / height;
		container.style.flex = ratio + ' 1 0%';
	})
}

function quoteattr( s, preserveCR ) {
	'use strict';

  var preserveCR = preserveCR ? '&#13;' : '\n';
  return ( '' + s ) /* Forces the conversion to string. */
    .replace( /&/g, '&amp;' ) /* This MUST be the 1st replacement. */
    .replace( /'/g, '&apos;' ) /* The 4 other predefined entities, required. */
    .replace( /"/g, '&quot;' )
    .replace( /</g, '&lt;' )
    .replace( />/g, '&gt;' )
    /*
    You may add other replacements here for HTML only
    (but it's not necessary).
    Or for XML, only if the named entities are defined in its DTD.
    */
    .replace( /\r\n/g, preserveCR ) /* Must be before the next replacement. */
    .replace( /[\r\n]/g, preserveCR );
    ;
}
