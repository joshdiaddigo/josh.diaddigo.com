$( document ).ready( function() {
	var currentPage = "";
 
 	browserAlert();
	bindClickEvents();
	bindKeyEvents();
	setupPage();
	onResizeEvents();
	setCubeTime();
	setInterval( function() {
		setCubeTime();
	}, 60000);

	function bindClickEvents() {
		$( "#nav_home" ).on( "click", function() {
			openPage( "home" );
		});
		$( "#nav_info" ).on( "click", function() {
			openPage( "info" );
		});
		$( "#nav_contact" ).on( "click", function() {
			openPage( "contact" );
		});
		$( "#nav_media" ).on( "click", function() {
			openPage( "media" );
		});
		$( "#nav_resume" ).on( "click", function() {
			openPage( "resume" );
		});
		$( "#nav_pay" ).on( "click", function() {
			openPage( "pay" );
		});
		$( "#sendMessage" ).on( "click", function( event ) {
			submitForm( "message" );
		});
		$( "#sendQuestion" ).on( "click", function( event ) {
			submitForm( "question" );
		});
		$( "#surveyQuestion" ).on( "click", function( event ) {
			submitSurveyForm();
		});
		$( ".footerRight" ).on( "click", function( event ) {
			alert("joshua.diaddigo.com", "I built this site entirely from scratch over my two day Fall break of 2014. With the exception of the payment processing, no third party plugins are in use. Feel free to browse through the code and contact me if you have any questions! <br/> <br/> - Joshua Diaddigo", "Cool!", closePopup);
		});
		$( "#payAboutButton" ).on( "click", function( event ) {
			alert("Payment Portal", "This payment portal is 100% PCI compliant. Your information is sent as an encrypted token over a secure connection, and the payment data itself never touches my own server.", "Great!", closePopup);
		});
		$( "#payButton" ).on( "click", function() {
			sendMoney();
		});

		$( ".popupCancelButton" ).on( "click", closePopup );

		$( ".nav_button" ).on( "mouseover", function() {
			var leftPos = $(this).position().left;
			$( "#navHover" ).css( "-ms-transform", "translateX(" + leftPos + "px)" );
			$( "#navHover" ).css( "-webkit-transform", "translateX(" + leftPos + "px)" );
			$( "#navHover" ).css( "transform", "translateX(" + leftPos + "px)" );
		});
	}

	function bindKeyEvents() {
		$( document ).keypress( function( event )  {
			if ( event.which == 13 ) {
		    	closePopup();
			}
		});
	}

	function browserAlert() {
		var ie = (window.navigator.userAgent.indexOf("MSIE ") > 0);
		if ( ie ) {
			alert("Browser Error", "Hmm... It looks like you're using Internet Explorer. My site will work with later versions of Internet Explorer, though it will not be as pretty. I definitely encourage you to consider upgrading your browser to Chrome or Firefox to make browsing the internet a better experience.");
		}
	}

	function onResizeEvents() {
		var height = $( window ).height();
		var cubePos = Math.max( ((height - 100) / 2), 60 );
		var contactPos = Math.max( (( height - $("#contact").outerHeight() ) / 2), 0 );
		var helpPos = Math.max( (( height - $("#contact").outerHeight() ) / 2), 0 );
		var payPos = Math.max( (( height - 400 ) / 2), 0 );
		var resumePos = Math.max( (( height - 350 ) / 2), 0 );
		var errorPos = Math.max( (( height - 200 ) / 2), 0 );

		if ( $( "#nav_" + currentPage ).length ) {
			var pageLeftPos = $( "#nav_" + currentPage ).position().left;
		} else {
			var pageLeftPos = -50;
		}

		translateDiv( $( ".cubeContainer" ), cubePos, "Y" );
		translateDiv( $( "#contact" ), contactPos, "Y" );
		translateDiv( $( "#help" ), helpPos, "Y" );
		translateDiv( $( "#resume" ), resumePos, "Y" );
		translateDiv( $( "#pay" ), payPos, "Y" );
		translateDiv( $( "#404" ), errorPos, "Y" );
		translateDiv( $( "#403" ), errorPos, "Y" );
		translateDiv( $( "#500" ), errorPos, "Y" );
		translateDiv( $( "#navHover" ), pageLeftPos, "X" );
		translateDiv( $( "#navPointer" ), pageLeftPos, "X" );
	}
	$( window ).on( "resize", onResizeEvents);

	function translateDiv(div, amount, axis) {
		div.css( "-ms-transform", "translate" + axis + "(" + amount + "px)" );
		div.css( "-webkit-transform", "translate" + axis + "(" + amount + "px)" );
		div.css( "transform", "translate" + axis + "(" + amount + "px)" );
	}

	function setupPage() {
	    var theDate = new Date()
	    var url = $( location ).attr( "href" );

   		$( ".year" ).text( theDate.getFullYear() );

	 	if ( url.indexOf('#') !== -1 ) {
			openPage( url.substring( url.indexOf( "#" ) + 1 ) );
		} else {
			openPage( "home" )
		}

		if ("onhashchange" in window) {
			$( window ).on( "hashchange", function() {
				url = $( location ).attr( "href" );
				openPage( url.substring( url.indexOf( "#" ) + 1 ), "ignoreHash" );
			});
		}
	}

	function openPage( name, ignoreHash ) {
		if ( ignoreHash == undefined) location.hash = "#" + name;
		if ( name == "" ) name = "home";

		currentPage = name;

		var leftPos;
		if ( $("#nav_" + name ).length ) {
			leftPos = $("#nav_" + name ).position().left;
		} else {
			leftPos = -50;
		}

		$( "#navHover" ).css( "-ms-transform", "translateX(" + leftPos + "px)" );
		$( "#navHover" ).css( "-webkit-transform", "translateX(" + leftPos + "px)" );
		$( "#navHover" ).css( "transform", "translateX(" + leftPos + "px)" );
		$( "#navPointer" ).css( "-ms-transform", "translateX(" + leftPos + "px)" );
		$( "#navPointer" ).css( "-webkit-transform", "translateX(" + leftPos + "px)" );
		$( "#navPointer" ).css( "transform", "translateX(" + leftPos + "px)" );

		$( ".page" ).addClass("transparent").removeClass("opaque").addClass("pageLoad");
		setTimeout( function() {
			$( ".page" ).css( "display", "none" );
			$("#" + name ).css( "display", "block" );
			setTimeout( function() {
				$("#" + name ).removeClass("transparent").addClass("opaque").removeClass("pageLoad");
			}, 100);
		}, 500);
	}

	function alert( title, message, button, buttonFunction, showCancel ) {

		if ( showCancel ) {
			$( ".popupCancelButton" ).css( "display", "block" );
		} else {
			$( ".popupCancelButton" ).css( "display", "none" );
		}

		if ( message == undefined ) {
			message = "";
		} 

		if ( button == undefined ) {
			button = "Ok";
		}

		if ( buttonFunction == undefined ) {
			buttonFunction = closePopup;
		}

		$( ".popup" ).css( "display", "table" );
		$( ".popupTitle" ).html( title );
		$( ".popupText" ).html( message );
		$( ".popupButton" ).html( button );
		$( ".popupButton" ).unbind( "click" );
		$( ".popupButton" ).on( "click", buttonFunction );
		setTimeout( function() {
			$( ".popup" ).removeClass("transparent").addClass("opaque");
		}, 100);
	}

	function closePopup() {
		$( ".popup" ).addClass("transparent").removeClass("opaque");
		setTimeout( function() {
			$( ".popup" ).css( "display", "none" );
		}, 500);
	}

	function setCubeTime() {
		var time = new Date($.now());
		var hour = time.getHours();
		var timeOfDay;
		var padding;

		if (hour >= 12) {
			hour -= 12;
			timeOfDay = "pm";
		} else {
			timeOfDay = "am";
		}
		if (hour == 0) hour = 12;

		var minute = time.getMinutes();
		padding = minute < 10 ? "0" : "";

		$("#cubeFront").text( hour + ":" + padding + minute + timeOfDay ); 
	}

	function submitForm( formType ) {

		if ( formType == "message" ) {
			var formTypeCap = "Message";
			var prefix = "form";
		} else if ( formType == "question" ) {
			var formTypeCap = "Question";
			var prefix = "help";
		}

		var name = $( "." + prefix + "Name" ).val();
		var email = $( "." + prefix + "Email" ).val();
		var message = $( "." + prefix + formTypeCap ).val();

		if ( name == "" ) {
			alert( "Before I send this...", "It would be awesome if I could get your name!", "Ok" );
			return;
		}

		if ( email == "" ) {
			alert( "Before I send this...", "I can't reply if I don't have your email address!" );
			return;
		}

		if ( message == "" ) {
			alert( "Before I send this...", "You might want to say something first (:" );
			return;
		}

		alert("Sending...");

		$( "#send" + formTypeCap ).addClass( "disabledButton" );

        $.post( 
        	"./scripts/" + formType + ".php",
            { name: name,
            email: email,
            message: message },
            function( data ) {
                alert( data, "", "Ok", closePopup );
                if ( data !== "Message failed! :(" ) {
			        $( "." + prefix + "Name" ).val("");
			        $( "." + prefix + "Email" ).val("");
			        $( "." + prefix + formTypeCap ).val("");
                }
				$( "#send" + formTypeCap ).removeClass( "disabledButton" );
            }
        );
	}

	Stripe.setPublishableKey('pk_live_wgJXm3NkIQQRUgI0VCPLQnGA');

	var cents;
	var name;
	var email;

	function sendMoney() {

		name = $( "#payName" ).val();

		if ( name == "" ) {
			alert( "Please enter your name." );
			return false;
		}

		email = $( "#payEmail" ).val();

		if ( email == "" ) {
			alert( "Please enter your email address." );
			return false;
		}

		cents = parseInt( parseFloat( $( "#payAmount" ).val() ) * 100 );
		if ( !isFinite( String( cents ) ) ) {
			alert( "Please enter a valid amount." );
			return false;
		} else if ( cents < 500 ) {
			alert( "Please enter an amount greater than $4.99" );
			return false;
		}

		alert( 	"Amount ok?", 
				"Are you sure you want to send $" + ( cents / 100 ).toFixed(2) + " to me?", 
				"Yes", 
				function() {
					Stripe.card.createToken( $( "#payForm" ), stripeResponseHandler );
				}, true );
		return false;
	}

	function stripeResponseHandler(status, response ) {
		alert( "Sending..." );
		if (response.error) {
			alert(response.error.message);
		} else {
			token = response.id;

			$.post( 
		    	"./scripts/pay.php",
		        { stripeToken: token,
		        payAmount: cents,
		        payEmail: email },
		        function( data ) {
		            alert( data, "", "Ok", closePopup );
		            if ( data == "Payment sent!") {
		            	$( "#payForm" ).find( "input[type=text]" ).val("");
		            }
		        }
		    );
		}
	};

	// Start temp code
	function submitSurveyForm() {
		var Q1 = $( "#surveyQuestion1" ).val();
		var Q2 = $( "#surveyQuestion2" ).val();
		var Q3 = $( "#surveyQuestion3" ).val();
		var Q4 = $( "#surveyQuestion4" ).val();

		alert("Sending...");

		$( "#surveyQuestion" ).addClass( "disabledButton" );

        $.post( 
        	"./scripts/survey.php",
            { Q1: Q1,
            Q2: Q2,
            Q3: Q3,
            Q4: Q4 },
            function( data ) {
                alert( data, "", "Ok", closePopup );
                if ( data !== "Message failed! :(" ) {
					$( "#surveyQuestion1" ).val("");
					$( "#surveyQuestion2" ).val("");
					$( "#surveyQuestion3" ).val("");
					$( "#surveyQuestion4" ).val("");
                }
				$( "#surveyQuestion" ).removeClass( "disabledButton" );
            }
        );
	}
	// End temp code
});