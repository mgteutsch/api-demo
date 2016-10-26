"use strict";

let apiKeys = {};

let imageList = (searchText) => {
	return new Promise ((resolve,reject) => {
		$.ajax({
			method: 'GET',
			url: '../apiKeys.json'
		}).then((response) => {
			//console.log("response:", response);
			apiKeys = response;
			let authHeader = 'Client-ID ' + apiKeys.client_id; // needs to be a string; she figured this out on StackOverflow


			$.ajax({
				method: 'GET',
				headers: {
					'Authorization': authHeader
				},
				url: ` https://api.imgur.com/3/gallery/t/${searchText}` //deleted sort and page from url, added the ${searchText}, also using ` ` instead of quotes
			}).then((response2) => {
				//console.log("imgur response: ", response2.data.items);
				resolve(response2.data.items);
			}, (errorResponse2) => {
				//console.log("imgur fail: ", errorResponse2);
				reject(errorResponse2);
			});


		}, (errorResponse) => {
			console.log("errorResponse:", errorResponse); // these 2 lines are an error message if the 'then' statement fails
			reject(errorResponse);
		});
	});
};


$(document).ready(function(){
	console.log("jQuery is ready");
	$('#clicky-button').on('click', () => {
		$('#clicky-button').button('loading'); 
		$('#output').html(""); // Clears the output for a new search
		let searchy = $('#imgur-search').val();
		console.log("It's working!", searchy);
		imageList(searchy).then((dataFromImgur) => {
			$('#clicky-button').button('reset'); 
			console.log("dataFromImgur: ", dataFromImgur);
			dataFromImgur.forEach((image) => {
				$('#output').append(`<img src="${image.link}">`);
			}).catch((error) => { //if the search is rejected (can't be found), this will prevent it from being stuck in "loading" mode forever
				$('#clicky-button').button('reset');
			}); 	
		});
	});	
});

