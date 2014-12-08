$( document ).ready( function() {
	var currentPage = "";
 
 	browserAlert();
	bindClickEvents();
	bindKeyEvents();
	setupPage();
	onResizeEvents();
	setCubeTime();
	setInterval( function() {
		updateChat();
	}, 1000);
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
		$( "#pollQuestion" ).on( "click", function( event ) {
			submitpollForm();
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
		$( "#uploadSend" ).on( "click", function() {
			uploadFile();
		});
		$( "#chatSend" ).on( "click", function() {
			sendChat();
		});
		$( ".cube" ).on( "click", function() {
			alert("It's just a cube.", "It doesn't do anything.");
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
				if ( currentPage == "type" && $( document.activeElement ).attr( "id" ) == "chatInput" ) {
					sendChat();
					return;
				}
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
		var uploadPos = Math.max( (( height - 250 ) / 2), 0 );
		var pollPos = Math.max( (( height - 400 ) / 2), 0 );

		if ( $( "#nav_" + currentPage ).length ) {
			var pageLeftPos = $( "#nav_" + currentPage ).position().left;
		} else {
			var pageLeftPos = -50;
		}

		moveNavPointer();

		translateDiv( $( ".cubeContainer" ), cubePos, "Y" );
		translateDiv( $( "#contact" ), contactPos, "Y" );
		translateDiv( $( "#help" ), helpPos, "Y" );
		translateDiv( $( "#resume" ), resumePos, "Y" );
		translateDiv( $( "#pay" ), payPos, "Y" );
		translateDiv( $( "#404" ), errorPos, "Y" );
		translateDiv( $( "#403" ), errorPos, "Y" );
		translateDiv( $( "#500" ), errorPos, "Y" );
		translateDiv( $( "#upload" ), uploadPos, "Y" );
		translateDiv( $( "#navHover" ), pageLeftPos, "X" );
		translateDiv( $( "#navPointer" ), pageLeftPos, "X" );
		translateDiv( $( "#poll" ), pollPos, "Y" );
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

		if (Math.ceil(Math.random() * 2) == 2) {
			$(".joshua").css( "background", "url(./style/joshua.jpg)" );
			$(".joshua").css( "background-position", "0% 34%" );
			$(".joshua:hover").css( "background-position", "0% 34%" );
		}
		setTimeout( function() {
			$(".joshua").css( "-webkit-transition", "1s" );
			$(".joshua").css( "transition", "1s" );
		}, 10);
	}

	function openPage( name, ignoreHash ) {
		if ( ignoreHash == undefined) location.hash = "#" + name;
		if ( name == "" ) name = "home";

		currentPage = name;

		moveNavPointer();

		//Must delay to work with webkit browsers with visible scroll bars
		setTimeout( function() {
			moveNavPointer()
		}, 500);

		$( ".page" ).addClass("transparent").removeClass("opaque").addClass("pageLoad");
		setTimeout( function() {
			$( ".page" ).css( "display", "none" );
			$("#" + name ).css( "display", "block" );
			setTimeout( function() {
				$("#" + name ).removeClass("transparent").addClass("opaque").removeClass("pageLoad");
			}, 100);
		}, 500);
	}

	function moveNavPointer() {
		var leftPos;

		if ( $("#nav_" + currentPage ).length ) {
			leftPos = $("#nav_" + currentPage ).position().left;
		} else {
			leftPos = -50;
		}

		translateDiv( $( "#navHover" ), leftPos, "X" );
		translateDiv( $( "#navPointer" ), leftPos, "X" );
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
		} else if ( cents < 100 ) {
			alert( "Please enter an amount greater than $0.99" );
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

	function uploadFile() {
		var fileInput = document.getElementById( "uploadFile" );
		var file = fileInput.files[0];

		if (!file) {
			alert( "Please select a file" );
			return;
		}

		$( ".progressOuter" ).css( "opacity", "1" );

		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener( "progress", onprogressHandler, false );
		xhr.open( "POST", "./scripts/uploadFile.php", true );
		xhr.setRequestHeader( "X-File-Name", file.name );
		xhr.setRequestHeader( "Content-Type", "application/octet-stream" );
		xhr.send( file );

		xhr.onreadystatechange = function( data ) {
			alert(xhr.responseText);
			$( "#uploadProgress" ).css( "width", 0 + "%" );
			$( ".progressOuter" ).css( "opacity", "0" );
		}

		function onprogressHandler( event ) {
		    var percent = event.loaded/event.total*100;
			$( "#uploadProgress" ).css( "width", percent + "%" );
		}
	}

	function updateChat() {
		if ( currentPage == "type" ) {
			oldContent = $( "#chatHistory" ).html();
			$.get( "https://joshua.diaddigo.com/scripts/chat/chat.html", function( newContent ) {
   				if ( newContent != oldContent ) {
   					$( "#chatHistory" ).html( newContent );
   					$( "#type" ).animate( { scrollTop: $( "#type" )[0].scrollHeight }, 1000 );
   				}
			});
		}
	}

	function sendChat() {
		name = $( "#chatInputName" ).val();
		message = $( "#chatInput" ).val();
		$.post( 
	    	"./scripts/sendChat.php",
	        { name: name,
	        message: message },
	        function( data ) {
	        	if ( data ) {
	        		alert( data );
	        	} else {
	            	updateChat();
					$( "#chatInput" ).val("");
	        	}
	        }
	    );
	}

	// Start temp code
	function submitpollForm() {
		var videoName = $( "input[name=videoName]" ).val();
		var videoVote = $( "input[name=videoVote]:checked" ).val();

		alert("Sending...");

		$( "#pollQuestion" ).addClass( "disabledButton" );

        $.post( 
        	"./scripts/poll.php",
            { videoName: videoName,
            videoVote: videoVote },
            function( data ) {
                alert( data, "", "Ok", closePopup );
                if ( data !== "Vote failed! :(" ) {
					$( "#pollQuestion1" ).val("");
					$( "#pollQuestion2" ).val("");
                }
				$( "#pollQuestion" ).removeClass( "disabledButton" );
            }
        );
	}
	// End temp code
});
