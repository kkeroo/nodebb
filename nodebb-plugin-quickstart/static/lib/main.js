'use strict';

/* globals document, $ */
function poslji() {
    var da_radio = document.getElementById('da')
    var ne_radio = document.getElementById('ne')
    var vrednost_radio = "";
    if (da_radio.checked){vrednost_radio = "da";}
    else if (ne_radio.checked){vrednost_radio = "ne";}
    console.log(vrednost_radio);
    if (vrednost_radio == ""){alert("Izponite polja");}

	var komentar_textarea = document.getElementById("komentar");
	let komentar = komentar_textarea.value;
	console.log(komentar);

	var naslov = document.getElementsByClassName("topic-title");
	var tekst = naslov[0].childNodes[2].nodeValue;
	tekst = tekst.substring(6);	//zaradi formata naslova
	tekst = tekst.slice(0, -5);
	console.log(tekst);

	var podatki = {
		"naslov": tekst,
		"komentar": komentar,
		"odziv": vrednost_radio
	};

	$.ajax({
		url:"http://localhost:4567/odzivi",
		type:"POST",
		data:JSON.stringify(podatki),
		contentType:'application/json',
		success: function(data){
			console.log("data");
		}
	});

	komentar_textarea.value = "";
	da_radio.checked = false;
	ne_radio.checked = false;
}

$(document).ready(function () {
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	console.log('nodebb-plugin-quickstart: loaded');
	$("#poslji").on('click', function(){
		console.log("cliki");
	});
	// Note how this is shown in the console on the first load of every page
});
