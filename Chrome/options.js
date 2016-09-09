//
//  options.js
//  Shard Developemnt
//
//  Copyright © 2016 Shard Development. All rights reserved.
//

// Custom variables
var wordArray = []
var pagesArray = []
var defaultWords = ["Shit", "Fuck", "Bitch", "Cunt", "Asshole", "Slut", "Crap", "Faggot", "Dick"];

// Add method to to String class to allow the removal of whirespace
String.prototype.trim = function () {

    return this.replace(/\s/g, "") 

}

//****************************************************************
//  divClicked(id) is called when a naviagtion bar item is clicked
//****************************************************************
function divClicked(id) {

	// Set all divs to off
	document.getElementById("navBarItem1").style.backgroundColor = "transparent";
	document.getElementById("arrow1").style.visibility = "hidden";

	document.getElementById("navBarItem2").style.backgroundColor = "transparent";
	document.getElementById("arrow2").style.visibility = "hidden";		

	document.getElementById("navBarItem3").style.backgroundColor = "transparent";
	document.getElementById("arrow3").style.visibility = "hidden";

	// Set the selected div to being on
	document.getElementById(id).style.backgroundColor = "#F73637";
	document.getElementById("arrow" + id.slice(-1)).style.visibility = "visible";

}

//***************************************************************************
//  changeSettingsPane(id) is called when a settings page will be changed
//***************************************************************************
function changeSettingsPane(id) {

	// Turn all divs off
	document.getElementById("generalSettingsDiv").style.display = "none";
	document.getElementById("wordsSettingsDiv").style.display = "none";
	document.getElementById("pagesSettingsDiv").style.display = "none";

	// Turn selected div on
	document.getElementById(id).style.display = "block";

}

//************************************************
//  reloadWordsAndPages() refreshes the words list
//************************************************
function reloadWordsAndPages() {

	// Clear all words
	var wordListDivChildren = document.getElementById("wordListingDiv").children
	document.getElementById("wordListingDiv").innerHTML = ""

	// Clear all pages
	var pageListDivChildren = document.getElementById("pageListingDiv").children
	document.getElementById("pageListingDiv").innerHTML = ""

	// Re-add all the words
	for (word in wordArray) {
		createWordCell(wordArray[word])
	}	

	// Re-add all the pages
	for (page in pagesArray) {
		createPageCell(pagesArray[page])
	}	

}

//**************************************************************************************
//  createContentCell(content, parentDiv) creates a cell for either to word or page divs
//**************************************************************************************
function createContentCell(content, parentDiv) {

	// Create main cell body
  	var mainDiv = document.createElement("DIV");
  	mainDiv.style.width = "90%";
  	mainDiv.style.padding = "10px";
  	mainDiv.style.marginRight = "auto";
  	mainDiv.style.marginLeft = "auto";
  	mainDiv.style.marginTop = "20px";
  	mainDiv.style.position = "relative";
  	mainDiv.style.backgroundColor = "white";
  	mainDiv.style.borderRadius = "5px";

  	// Create main title for cell
  	var titleElement = document.createElement("H2");
  	titleElement.style.marginLeft = "20px";
  	titleElement.style.width = "75%";
  	titleElement.style.wordWrap = "break-word";
  	titleElementText = document.createTextNode(content);
  	titleElement.appendChild(titleElementText);

  	// Add edit button
  	var editIcon = document.createElement("IMG");
  	editIcon.style.position = "absolute"
  	editIcon.style.right = "65px"
  	editIcon.style.top = "20px"
  	editIcon.style.height = "26";
  	editIcon.style.width = "30";
  	editIcon.src="images/edit.png";

  	// Add listener to edit icon click
  	editIcon.addEventListener('click', function() {

		if (parentDiv == "wordListingDiv") {

			//*******************************
			//  Edit button tapped was a word
			//*******************************

			// Get index of clicked item in the word
	  		var index = wordArray.indexOf(titleElement.innerHTML)

			// Prompt for the new word
			var newWord = prompt("Word edit", wordArray[index]);

			if (newWord != null && newWord.length > 0) {

				// Change word
				wordArray[index] = newWord;
				titleElement.childNodes[0].nodeValue = wordArray[index];

			}

		} else {

			//*******************************
			//  Edit button tapped was a page
			//*******************************

			// Get the index of the item in the page array
			var index = pagesArray.indexOf(titleElement.innerHTML)

			// Prompt for the new word
			var newPage = prompt("Page edit", pagesArray[index]);

			// Ensure word entered is a page
			if (newPage != null && newPage.length > 0) {

				// Change page
				pagesArray[index] = newPage;
				titleElement.childNodes[0].nodeValue = pagesArray[index];

			}

		}

		// Save the settings
		saveSettings();

  	});

  	// Add trash button
  	var trashIcon = document.createElement("IMG");
  	trashIcon.style.position = "absolute"
  	trashIcon.style.right = "20px"
  	trashIcon.style.top = "20px"
  	trashIcon.style.height = "26";
  	trashIcon.style.width = "30";
  	trashIcon.src="images/garbage.png";

  	// Add listener to the trash button
  	trashIcon.addEventListener('click', function() {

		var index = wordArray.indexOf(content)

		if (index >= 0) {

			//********************************
			//  Trash button tapped was a word
			//********************************

			// Remove word
			wordArray.splice(index, 1);
			mainDiv.parentNode.removeChild(mainDiv);

		} else {

			//********************************
			//  Trash button tapped was a page
			//********************************

			// Remove page
			pagesArray.splice(pagesArray.indexOf(content), 1);
			mainDiv.parentNode.removeChild(mainDiv);

		}

		// Save settings
		saveSettings();

  	});

  	// Add sub-elements to the cell
  	mainDiv.appendChild(titleElement);
  	mainDiv.appendChild(editIcon);
  	mainDiv.appendChild(trashIcon);

  	// Add cell
  	document.getElementById(parentDiv).appendChild(mainDiv);

}

//**********************************************************
//  createWordCell(word) will create a cell for the word div
//**********************************************************
function createWordCell(word) {

	createContentCell(word, "wordListingDiv");

}

//**********************************************************
//  createPageCell(word) will create a cell for the page div
//**********************************************************
function createPageCell(word) {

	createContentCell(word, "pageListingDiv");

}

//***********************************************
//  initialise() is called to initialise the page
//***********************************************
function initialise() {

	chrome.storage.local.get({

	  words: [],
	  pages: [],
	  defaultWord: false,
	  customWords: true,
	  imageSensoring: true

	}, function(items) {

	  	// Set local variables to the stored values
	  	wordArray = items.words;
	  	pagesArray = items.pages;

	  	// Loop thorugh all words
	  	for (var word in wordArray) {

	  		// Create a word cell
			createWordCell(wordArray[word]);

	  	}

	  	// Loop thorugh all pages
	  	for (var page in pagesArray) {

	  		// Create a page cell
			createPageCell(pagesArray[page]);

	  	}

	  	// Set the value of the default words switch
	  	document.getElementById('generalSettings1').checked = items.defaultWord
	  	document.getElementById('generalSettings2').checked = items.imageSensoring

	});

}

//****************************************************************************************
//  saveSettings() is called when items have been changed and need saving to local storage
//****************************************************************************************
function saveSettings() {

  chrome.storage.local.set({

    words: wordArray,
    pages: pagesArray

  }, function() {

  	//**********************************
	//  OPTIONS SAVED INTO LOCAL STORAGE
	//**********************************

  });

}

//*******************************************************
//  wordAdd() is called when a new word needs to be added
//*******************************************************
function wordAdd() {

	// Prompt user for word
	var word = prompt("What word would you like to add?");

	// Check word length
	while (word.trim().length < 1) {

		// Remprompt user for word
		word = prompt("What word would you like to add?");

	}

	// Ensure word does not exist
	if (wordArray.indexOf(word) >= 0) {} else { 

		// Create word cell
		createWordCell(word);

		// Add word to the main word array
		wordArray.push(word)

		// Save the settings
		saveSettings();

	}

} 

//**********************************************************************************
//  enableOrDisableDefaultWords() is called when the default words switch is toggled
//**********************************************************************************
function enableOrDisableDefaultWords() {

	// Check the state of the switch
	if (document.getElementById('generalSettings1').checked) {

		//**************
		//  SWITCH IS ON
		//**************

		// Apply default words
		wordArray.push.apply(wordArray, defaultWords);

	} else {

		//***************
		//  SWITCH IS OFF
		//***************

		// Remove all default words
		wordArray = wordArray.filter( function( el ) {
			console.log(defaultWords.indexOf(el) < 0)
		  	return defaultWords.indexOf(el) < 0;
		});

	}

	// Save the settings
	saveSettings()

	// Reload all the cells
	reloadWordsAndPages()

}

//*******************************************************
//  switchChanged() is called when a switch changes state
//*******************************************************
function switchChanged() {

	// Access switch
	var defaultWord = document.getElementById("generalSettings1").checked
	var imageSensoring = document.getElementById("generalSettings2").checked

	// Store state of switch
	chrome.storage.local.set({

	    defaultWord: defaultWord,
	    imageSensoring: imageSensoring

	}, function() {

	  	//**********************************
		//  OPTIONS SAVED INTO LOCAL STORAGE
		//**********************************

	});

}

document.addEventListener('DOMContentLoaded', function() {

	// Initialise the page
	initialise()

	//*****************************************
	//  APPLY LISTENERS TO NAVIGATION BAR ITEMS
	//*****************************************

	// Apply listener to the first navigation bar item
	document.getElementById('navBarItem1').addEventListener('click', function() {

		divClicked('navBarItem1');
		changeSettingsPane("generalSettingsDiv")

	});

	// Apply listener to the second navigation bar item
	document.getElementById('navBarItem2').addEventListener('click', function() {

		divClicked('navBarItem2');
		changeSettingsPane("wordsSettingsDiv")

	});

	// Apply listener to the third navigation bar item
	document.getElementById('navBarItem3').addEventListener('click', function() {

		divClicked('navBarItem3');
		changeSettingsPane("pagesSettingsDiv")

	});

	//*****************************
	//  APPLY LISTENERS TO SWITCHES
	//*****************************

	// Apply listener to the first switch
	document.getElementById('generalSettings1').addEventListener('click', function() {

		switchChanged();
		enableOrDisableDefaultWords()

	});

	// Apply listener to the first switch
	document.getElementById('generalSettings2').addEventListener('click', function() {

		switchChanged();
		enableOrDisableDefaultWords()

	});

	//********************************
	//  APPLY LISTENERS TO ADD BUTTONS
	//********************************

	// Apply listener to the words add button
	document.getElementsByClassName('addButton')[0].addEventListener('click', function() {

		wordAdd();

	});

	// Set the first div to be clicked
	divClicked('navBarItem1');

	//Set the first div to be the general settings
	changeSettingsPane("generalSettingsDiv")

});