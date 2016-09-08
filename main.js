//
//  main.js
//  Shard Developemnt
//
//  Copyright © 2016 Shard Development. All rights reserved.
//

// Call begin
begin();

//******************************************************************************
//  begin() is called before the page has loaded -  in order to apply the filter
//******************************************************************************
function begin(){

	// Custom variables
	var documentImages = document.getElementsByTagName("img");

	// Stop the page displaying
    document.getElementsByTagName("html")[0].style.display = "none";

    window.onload = function(){

		var wordsBlocked = 0
		var badWordsArr = [];

		// Add listener for the head loading
		document.getElementsByTagName("head")[0].addEventListener("load", initialise());

		// Add listener for requests from popup.html
		chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

			// Determine message type
		    if (request.message == "wordsBlocked") {

		    	// Respond the with amoutn of words blocked on the page
		    	sendResponse({wordsBlockedCount: wordsBlocked});

		    }

		    return true

		  });

		//****************************************************************
		//  initialise() is called to begin oporations the Bleep extension
		//****************************************************************
		function initialise() {

			chrome.storage.local.get({

			  words: [],
			  pages: [],
			  imageSensoring: true

			}, function(items) {

				// Set local variable
			  	badWordsArr = items.words;

		  		// Determine if page is blocked
		  		if (items.pages.indexOf(window.location.href) < 0) {

		  			// Replace words on page
		  			replace()

		  		} else {

		  			// Display page as normal
		    		document.getElementsByTagName("html")[0].style.display="block";

		  		}

			});

		}

		//********************************************************
		//  replace() is the function which replaces the bad words
		//********************************************************
		function replace() {

			// Reference the documents main tree
			var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

			// Define local variables
			var badWordLowerCase = []

			// Loop through all the bad words
			for (word in badWordsArr) {

				// Add the lowervased version of the bad words
				badWordLowerCase.push(badWordsArr[word].toLowerCase())

			}

			// Continue this oporation while there is always more nodes
			while (node = walker.nextNode()) {

				// Split the text inside a node
				nodeTextArray = node.nodeValue.split(' ')

				// Loop through every word inside the node
				for (word in nodeTextArray) {

					// Loop thorugh all the bad words
					for (badWord in badWordLowerCase) {

						// Determin if a bad word is included in a string
						if (nodeTextArray[word].toLowerCase().includes(badWordLowerCase[badWord])) {

							// Sensor the bad words
							nodeTextArray[word] = '&#%!@?!"&#%!@?!"&#%!@?!"&#%!@?!?!"&#%!@?!"&#%!@?!&#%!@?!"&#%!@?!"&#%!@?!"&#%!@?!?!"&#%!@?!"&#%!@?!'.substring(0, nodeTextArray[word].length);
							wordsBlocked += 1

						}

					}

				}

				// Join the array
				final = nodeTextArray.join(' ')

				// Set the new text
				node.nodeValue = final

			}

			// REPLACE FINISHED - display webpage
		    document.getElementsByTagName("html")[0].style.display="block";

		}

    }

}