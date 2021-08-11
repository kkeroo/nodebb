'use strict';

// funkcija za pridobitev objav.
function getPosts() {
	var csv = 'Naslov, Kontekst\n';
	console.log("klic");
	$.ajax({
		url: "http://localhost:4567/api/recent/posts/week",
		type: "GET",
		success: function (objave){
			objave.forEach(objava => {
				var vrstica = objava.topic.title + "," + objava.content + '\n';
				csv += vrstica;
			});
			console.log(csv);

			var downloadlink = document.createElement("a");
			var blob = new Blob(["\ufeff", csv]);
			var url = URL.createObjectURL(blob);
			downloadlink.href = url;
			downloadlink.download = "porocilo.csv";
			document.body.appendChild(downloadlink);
			downloadlink.click();
			document.body.removeChild(downloadlink);
		}
	});
}

/* globals $, app, socket, define, config */

define('admin/plugins/quickstart', ['settings', 'uploader', 'admin/modules/colorpicker'], function (settings, uploader, colorpicker) {
	var ACP = {};

	console.log("Pozdrav");
	$(document).ready(function(){
		$("#print-porocilo").on('click', hi);
	});

	ACP.init = function () {
		console.log("INIT");
		//setupColorInputs();
		//setupUploader();
		settings.load('quickstart', $('.quickstart-settings'));
		$('#save').on('click', saveSettings);
		$("#print-porocilo").on('click', getPosts);
	};

	function saveSettings() {
		settings.save('quickstart', $('.quickstart-settings'), function () {
			app.alert({
				type: 'success',
				alert_id: 'quickstart-saved',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	function setupColorInputs() {
		var colorInputs = $('[data-settings="colorpicker"]');
		colorpicker.enable(colorInputs, updateColors);
		colorInputs.on('change', updateColors);
		updateColors();
	}

	function updateColors() {
		$('#preview').css({
			color: $('#color').val(),
			'background-color': $('#bgColor').val(),
		});
	}

	function setupUploader() {
		$('#content input[data-action="upload"]').each(function () {
			var uploadBtn = $(this);
			uploadBtn.on('click', function () {
				uploader.show({
					route: config.relative_path + '/api/admin/upload/file',
					params: {
						folder: 'quickstart',
					},
					accept: 'image/*',
				}, function (image) {
					$('#' + uploadBtn.attr('data-target')).val(image);
				});
			});
		});
	}

	return ACP;
});
