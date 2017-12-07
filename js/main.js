/**** Funtion to track user scroll in case we decide we want to pause video on scroll
 * I kind of like having it continue to play over the website but we can add in that
 * functionality later if you want
window.onscroll = function (e) {

}
*/

$(window).on("scroll.scroll3", function () {
	// console.log($(window).scrollTop());
	// console.log($(window).scrollTop() + $(window).height());
	// console.log($(".vis2_drugs_section").height() * 3);
	// console.log($(".vis2_drugs_section").position());
	// var topDivHeight = $(".vis1_section").height();	

	var window_bottom = $(window).scrollTop() + $(window).height();

	if (window_bottom - ($(window).height() / 5) > $(".vis2_guns_section").position().top) {
	    $('.vis2guns').css('visibility', 'visible').hide().fadeIn(4000);
	    $(this).off('scroll.scroll3');   
    }
});

$(window).on("scroll.scroll2", function () {
	var window_bottom = $(window).scrollTop() + $(window).height();

	// fade in for vis2 drug deaths
    if (window_bottom - ($(window).height() / 5) > $(".vis2_car_section").position().top) {
        $('.vis2car').css('visibility', 'visible').hide().fadeIn(4200);
        $(this).off('scroll.scroll2');   
    }
});

$(window).on("scroll.scroll1", function () {
	var window_bottom = $(window).scrollTop() + $(window).height();

	// fade in for vis2 drug deaths
    if (window_bottom - ($(window).height() / 5) > $(".vis2_drugs_section").position().top) {
        $('.vis2drugs').css('visibility', 'visible').hide().fadeIn(4500); 
        $(this).off('scroll.scroll1');   
    }
});










