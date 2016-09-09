//
//  popup.js
//  Shard Developemnt
//
//  Copyright © 2016 Shard Development. All rights reserved.
//


window.onload = function() {

	//*******************
    //  popup.html loaded
    //*******************

	initialise()

}

//*******************************************************
//  initialise() is called to initialise the popup window
//*******************************************************

function initialise() {

	chrome.storage.local.get({

	  	pages: []

	}, function(items) {

		chrome.tabs.getSelected(null, function(tab) {

			// Obtain webpage url
	    	var tablink = tab.url;

	    	// Determine if url is in the blocked pages array
	  		if (items.pages.indexOf(tablink) >= 0) {

	  			//*****************************
			    //  Webpage is blocked
			    //*****************************

			    // Apply listeners and text to target document objects
	  			document.getElementById('statusField').innerHTML = "Blocked"
	  			document.getElementById('statusIcon').src = "images/unsuccessful.png"
	  			document.getElementById("disableButton").innerHTML = "Enable for this site"
	  			document.getElementById("disableButton").addEventListener('click', function() {

					enableForSite();

				});

	  		} else {

	  			//*****************************
			    //  Webpage is not blocked
			    //*****************************

			    // Apply listeners and text to target document objects
	  			document.getElementById('statusField').innerHTML = "Successful"
	  			document.getElementById('statusIcon').src = "images/successful.png"
				document.getElementById("disableButton").innerHTML = "Disable for this site"
	  			document.getElementById("disableButton").addEventListener('click', function() {

					disableForSite();

				});

	  		}

	   });

	});

	setInterval(function() {

		//**********************************************************
	    //  Query the amount of words blocked on a page every second
	    //**********************************************************

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			
			//****************************************************************************
		    //  Communicate with the main.js file (to recieve the amount of words blocked)
		    //****************************************************************************

		  	chrome.tabs.sendMessage(tabs[0].id, {message: "wordsBlocked"}, function(response) {

		  		// Set wordsBlocked element text
		    	document.getElementById("wordsBlocked").innerHTML = response.wordsBlockedCount;

		  	});

		});

	}, 1000)

	// Apply listener to the options button
	document.getElementById("optionsButton").addEventListener('click', function() {

		optionsButtonClicked();

	});

}

//***********************************************************
//  enableForSite() is called to turn the extension on
//***********************************************************

function enableForSite() {

	chrome.tabs.getSelected(null, function(tab) {

		// Obtain webpage url
	    var tablink = tab.url;

		chrome.storage.local.get({

		  pages: []

		}, function(items) {

			// Remove page from blocked page array
			var pages = items.pages;
			pages.splice(pages.indexOf(tablink), 1);

			chrome.storage.local.set({

			    pages: pages

			  }, function() {

			  	// Chnage button text
			  	document.getElementById("disableButton").innerHTML = "Disable for this site"

			});

		});

	});

	chrome.tabs.getSelected(null, function(tab) {

		// Reload both the webpage and the popup.html page
	    chrome.tabs.reload(tab.id);
	   	window.location.reload()

	});
	
}

//***********************************************************
//  disableForSite() is called to turn the extension off
//***********************************************************

function disableForSite() {

	chrome.tabs.getSelected(null, function(tab) {

		// Get access go the page url
	    var tablink = tab.url;

		chrome.storage.local.get({

		  pages: []

		}, function(items) {

			// Add page to blocked pages array
			var newPages = items.pages;
			newPages.push(tablink);

			chrome.storage.local.set({

			    pages: newPages

			  }, function() {

			  	// Change button text
			  	document.getElementById("disableButton").innerHTML = "Enable for this site"

			});

		});

	});

	chrome.tabs.getSelected(null, function(tab) {

		// Reload both the webpage and the popup.html page
	    chrome.tabs.reload(tab.id);
	    window.location.reload()

	});

}


//************************************************************
//  optionsButtonClicked() is called to open the options page
//************************************************************

function optionsButtonClicked() {

	// Open the options page
	chrome.tabs.create({ url: "options.html" });

}