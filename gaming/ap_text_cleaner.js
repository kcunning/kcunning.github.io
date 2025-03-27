var processText = function() {
	// Get the text in base text
	var text = document.getElementById("basetext").value;

	// Let's remove the line breaks...
	text = text.replaceAll('\n', ' ');

	// Let's add some back in for successes...
	text = text.replace(". Critical Success", '.\nCritical Success')
	text = text.replace(". Success", '.\nSuccess')
	text = text.replace(". Failure", '.\nFailure')
	text = text.replace(". Critical Failure", '.\nCritical Failure')

	// Let's get those dice rolls...
	const regex = /[0-9]+[d][0-9]+/g;
	const nums = '0123456789';
	var dice = [];
	var working_text = text;
	// We need a list of the dice rolls in the text.
	while (working_text.search(regex) > 0) {
		var i = working_text.search(regex);
		var die = '';
		do {
			die += working_text[i];
			i++;
		} while ((working_text[i] == 'd') || (nums.search(working_text[i]) >= 0))
		dice.push(die);	
		working_text = working_text.slice(i);
	}

	// Dedupe the dice so we don't end up with [[[[[[endlessbrackets]]]]]]
	dice = [...new Set(dice)];

	// Now let's replace dice!
	for (var i=0; i<dice.length; i++) {
		var wdie = "[[" + dice[i] + "]]"
		text = text.replaceAll(dice[i], wdie)
	}

	// Put it in the results box
	var resultBox = document.getElementById("results");
	resultBox.value = text;
}

var selectText = function () {
	// When we click in the results box, select everything
	const input = document.getElementById("results");
	input.focus();
	input.select();
}

var clearText = function () {
	// Clear the form because html is hard
	var input = document.getElementById("results");
	var text = document.getElementById("basetext");
	input.value = '';
	text.value = '';
}