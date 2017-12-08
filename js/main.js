/**** Funtion to track user scroll in case we decide we want to pause video on scroll
 * I kind of like having it continue to play over the website but we can add in that
 * functionality later if you want
window.onscroll = function (e) {

}
*/

// $(window).on("scroll.scroll3", function () {
// 	// console.log($(window).scrollTop());
// 	// console.log($(window).scrollTop() + $(window).height());
// 	// console.log($(".vis2_drugs_section").height() * 3);
// 	// console.log($(".vis2_drugs_section").position());
// 	// var topDivHeight = $(".vis1_section").height();	

// 	var window_bottom = $(window).scrollTop() + $(window).height();

// 	if (window_bottom - ($(window).height() / 5) > $(".vis2_guns_section").position().top) {
// 	    $('.vis2guns').css('visibility', 'visible').hide().fadeIn(4000);
// 	    $(this).off('scroll.scroll3');   
//     }
// });

// $(window).on("scroll.scroll2", function () {
// 	var window_bottom = $(window).scrollTop() + $(window).height();

// 	// fade in for vis2 drug deaths
//     if (window_bottom - ($(window).height() / 5) > $(".vis2_car_section").position().top) {
//         $('.vis2car').css('visibility', 'visible').hide().fadeIn(4200);
//         $(this).off('scroll.scroll2');   
//     }
// });

// $(window).on("scroll.scroll1", function () {
// 	var window_bottom = $(window).scrollTop() + $(window).height();

// 	// fade in for vis2 drug deaths
//     if (window_bottom - ($(window).height() / 5) > $(".vis2_drugs_section").position().top) {
//         $('.vis2drugs').css('visibility', 'visible').hide().fadeIn(4500); 
//         $(this).off('scroll.scroll1');   
//     }
// });

var gun_container = document.getElementById('gun_icons');
var car_container = document.getElementById('vis2car');
var drug_container = document.getElementById('vis2drugs');

function append_gun_icons(i) {
	gun_container.insertAdjacentHTML('beforeend', '<i id="gun_icon_' + i + '" class="fa fa-male fa-4x" aria-hidden="true"></i>');
	$('#gun_icon_' + i).css('visibility', 'visible').hide().fadeIn(150);

    if (--i > -1) {
		setTimeout(function () { append_gun_icons(i); }, 100);
    }
}
function append_car_icons(i) {
	car_container.insertAdjacentHTML('beforeend', '<i id="car_icon_' + i + '" class="fa fa-male fa-4x" aria-hidden="true"></i>');
	$('#car_icon_' + i).css('visibility', 'visible').hide().fadeIn(250);

    if (--i > -1) {
  		setTimeout(function () { append_car_icons(i); }, 50);
    }
}
function append_drug_icons(i) {
	drug_container.insertAdjacentHTML('beforeend', '<i id="drug_icon_' + i + '" class="fa fa-male fa-4x" aria-hidden="true"></i>');
	$('#drug_icon_' + i).css('visibility', 'visible').hide().fadeIn(250);

    if (--i > -1) {
		setTimeout(function () { append_drug_icons(i); }, 50);
    }
}


$(window).on("scroll.scroll1", function () {
	var window_top = $(window).scrollTop();
	var window_bottom = $(window).scrollTop() + $(window).height();
	var window_middle = (window_top + window_bottom) / 2.0;

	var target_top = $(".vis2_section").position().top;
	var target_bottom = $(".vis2_section").position().top + $(window).height();


	console.log("middle: " + window_middle);
	console.log("top: " + target_top);
	console.log("bottom: " + target_bottom);

	if(window_middle > target_top && window_middle < target_bottom) {
		setTimeout(function () { 
			$('#gun_text').css('visibility', 'visible').hide().fadeIn(2000);
			$('#vis2gun').css('visibility', 'visible').hide().fadeIn(3000);
			append_gun_icons(13);
		}, 400);

		setTimeout(function () { 
			$('#car_text').css('visibility', 'visible').hide().fadeIn(2000);
			$('#vis2car_icon').css('visibility', 'visible').hide().fadeIn(3000);
			$('#car_row').css('background-color', '#4f5357').hide().fadeIn(1000);	
			append_car_icons(38);
		}, 2000);

		setTimeout(function () { 
			$('#drug_text').css('visibility', 'visible').hide().fadeIn(2000);
			$('#vis2can').css('visibility', 'visible').hide().fadeIn(3000);
			$('#drug_row').css('background-color', '#464a4d').hide().fadeIn(1000);
			append_drug_icons(52);
		}, 4600);

		$(this).off('scroll.scroll1'); 
	}
});


		// function wait(){
		// 	if (window_middle > target_top && window_bottom < target_bottom){
		// 		setTimeout(wait, 100);
		// 	} else {
		// 		$('#gun_text').css('visibility', 'hidden').hide().fadeIn(4000);
		// 		$('#vis2gun').css('visibility', 'hidden').hide().fadeIn(6000);

		// 		$('#car_text').css('visibility', 'hidden').hide().fadeIn(4000);
		// 		$('#vis2car_icon').css('visibility', 'hidden').hide().fadeIn(6000);
		// 		$('#car_row').css('background-color', '#585d61').hide().fadeIn(2000);

		// 		$('#drug_text').css('visibility', 'hidden').hide().fadeIn(4000);
		// 		$('#vis2can').css('visibility', 'hidden').hide().fadeIn(6000);
		// 		$('#drug_row').css('background-color', '#585d61').hide().fadeIn(2000);

		// 		$(this).on('scroll.scroll1'); 
		// 	}
		// }
		// wait();








