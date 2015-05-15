$(function() {
	var currentPage = "";

 	browserAlert();
	bindClickEvents();
	bindKeyEvents();
	setupPage();
	webGLSetup();
	webGLRender();
	onResizeEvents();
	setInterval( function() {
		updateChat();
	}, 1000);

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
		$( "#nav_projects" ).on( "click", function() {
			openPage( "projects" );
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
			alert("joshua.diaddigo.com", "I built this site entirely from scratch over my two day Fall break of 2014. With the exception of the payment processing, no third party plugins are in use. Feel free to browse through the code and contact me if you have any questions! <br/> <br/> - Joshua Diaddigo", "cool!", closePopup);
		});
		$( "#payAboutButton" ).on( "click", function( event ) {
			alert("payment portal", "This payment portal is 100% PCI compliant. Your information is sent as an encrypted token over a secure connection, and the payment data itself never touches my own server.", "great!", closePopup);
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
		$( ".logoContainer" ).on( "click", function() {
			alert("my initials are in there somewhere", "no really.", "ok then");
		});
		$( "#joshua" ).on( "click", function() {
			$( "#joshua" ).toggleClass( "joshuaHover" );
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
				if ( currentPage == "things" && $( document.activeElement ).attr( "id" ) == "chatInput" ) {
					sendChat();
					return;
				}

				if (currentPage != "pay") {
		    		closePopup();
				}
			}
		});
	}

	function browserAlert() {
		var ie = (window.navigator.userAgent.indexOf("MSIE ") > 0);
		if ( ie ) {
			alert("browser error", "Hmm... It looks like you're using Internet Explorer. My site will work with later versions of Internet Explorer, though it will not be as pretty. I definitely encourage you to consider upgrading your browser to Chrome or Firefox to make browsing the internet a better experience.");
		}
	}

	function onResizeEvents() {
		var height = $( window ).height();
		var logoPos = Math.max( ((height - 170) / 2), 60 );
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

		translateDiv( $( ".logoContainer" ), logoPos, "Y" );
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

		setTimeout( function() {
			$(".expandableImage").css( "-webkit-transition", "1s" );
			$(".expandableImage").css( "transition", "1s" );
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
			button = "ok";
		}

		if ( buttonFunction == undefined ) {
			buttonFunction = closePopup;
		}

		$( ".page" ).addClass("blur");
		$( ".nav" ).addClass("blur");
		$( ".footer" ).addClass("blur");

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
		$( ".page" ).removeClass("blur");
		$( ".nav" ).removeClass("blur");
		$( ".footer" ).removeClass("blur");

		$( ".popup" ).addClass("transparent").removeClass("opaque");
		setTimeout( function() {
			$( ".popup" ).css( "display", "none" );
		}, 500);
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
					alert(	"Password",
							"Please enter the password: <input type=\"text\" size=\"20\" id = \"payPassword\"/>",
							"Ok",
							function() {
								Stripe.card.createToken( $( "#payForm" ), stripeResponseHandler );
							},
							true
						);
				}, 
				true 
			);
		return false;
	}

	function stripeResponseHandler(status, response ) {
		var payPassword = $("#payPassword").val();
		if (response.error) {
			alert(response.error.message);
		} else {
			token = response.id;
			alert( "Sending..." );
			$.post( 
		    	"./scripts/pay.php",
		        { stripeToken: token,
		        payPassword: payPassword,
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
		if ( currentPage == "things" ) {
			oldContent = $( "#chatHistory" ).html();
			$.ajax({
				url: "https://joshua.diaddigo.com/scripts/chat/chat.html", 
    			cache: false,
    			dataType: "html",
				success: function( newContent ) {
	   				if ( newContent != oldContent ) {
	   					$( "#chatHistory" ).html( newContent );
	   					$( "#type" ).animate( { scrollTop: $( "#type" )[0].scrollHeight }, 1000 );
	   				}
	   			}
			});
		}
	}

	function sendChat() {
		name = $( "#chatInputName" ).val();

		name = (name == "") ? "anonymous" : name;

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

	var webGLLogo1 = null;
	var weGLLogo2 = null;
	var webGLLogo3 = null;
	var scene;
	var camera;
	var renderer;

	function webGLSetup() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 25, 1, 0.1, 2000 );

		renderer = Detector.webgl? new THREE.WebGLRenderer({ alpha: true }): new THREE.CanvasRenderer();
		renderer.setSize( 500, 500 );
		renderer.domElement.classList.add("logoWebGL");
		renderer.setClearColor( 0xdddddd, 1 );

		$(".logoContainer").html( renderer.domElement );

		var light = new THREE.AmbientLight( 0x999999 );
		scene.add( light );

		hemiLight = new THREE.HemisphereLight( 0xfffffff, 0xffffff, 1 ); 
		scene.add(hemiLight);

		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 0, 500, 0 );
		scene.add( spotLight );

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;

		loader.load( "scripts/WebGL/logoPart1.dae", function ( collada ) {
			var dae = collada.scene;
			var skin = collada.skins[ 0 ];
			dae.position.set(0, 0, 0);
			dae.scale.set(0.15, 0.15, 0.15);
			webGLLogo1 = dae;
			scene.add(webGLLogo1);
		});

		loader.load( "scripts/WebGL/logoPart2.dae", function ( collada ) {
			var dae = collada.scene;
			var skin = collada.skins[ 0 ];
			dae.position.set(0, 0, 0);
			dae.scale.set(0.15, 0.15, 0.15);
			weGLLogo2 = dae;
			scene.add(weGLLogo2);
		});

		loader.load( "scripts/WebGL/logoPart3.dae", function ( collada ) {
			var dae = collada.scene;
			var skin = collada.skins[ 0 ];
			dae.position.set(0, 0, 0);
			dae.scale.set(0.15, 0.15, 0.15);
			webGLLogo3 = dae;
			scene.add(webGLLogo3);
		});

		camera.position.z = 5;
	}

	function webGLRender() {
		requestAnimationFrame( webGLRender );

		if (webGLLogo1 != null) {
			webGLLogo1.rotation.y += 0.005;
			webGLLogo1.rotation.z -= 0.03;
		}
		if (weGLLogo2 != null) {
			weGLLogo2.rotation.y += 0.005;
			weGLLogo2.rotation.z -= 0.04;
		}
		if (webGLLogo3 != null) {
			webGLLogo3.rotation.y += 0.005;
			webGLLogo3.rotation.z -= 0.05;
		}

		renderer.render(scene, camera);
	};
});