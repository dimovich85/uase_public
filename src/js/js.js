(function(factory){if(typeof exports==="object"){factory(require("jquery"))}else if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{factory(jQuery)}})(function($){$.extend({bez:function(encodedFuncName,coOrdArray){if($.isArray(encodedFuncName)){coOrdArray=encodedFuncName;encodedFuncName="bez_"+coOrdArray.join("_").replace(/\./g,"p")}if(typeof $.easing[encodedFuncName]!=="function"){var polyBez=function(p1,p2){var A=[null,null],B=[null,null],C=[null,null],bezCoOrd=function(t,ax){C[ax]=3*p1[ax],B[ax]=3*(p2[ax]-p1[ax])-C[ax],A[ax]=1-C[ax]-B[ax];return t*(C[ax]+t*(B[ax]+t*A[ax]))},xDeriv=function(t){return C[0]+t*(2*B[0]+3*A[0]*t)},xForT=function(t){var x=t,i=0,z;while(++i<14){z=bezCoOrd(x,0)-t;if(Math.abs(z)<.001)break;x-=z/xDeriv(x)}return x};return function(t){return bezCoOrd(xForT(t),1)}};$.easing[encodedFuncName]=function(x,t,b,c,d){return c*polyBez([coOrdArray[0],coOrdArray[1]],[coOrdArray[2],coOrdArray[3]])(t/d)+b}}return encodedFuncName}})});;

(function($){
	$(function(){

	// Работа с гамбургером

		$('.hamb').on('click', function(e){
			$('header.header').toggleClass('mobile')
						      .find('.lang-menu')
						      .toggleClass('animate');
			if($(window).outerWidth() <= 950){
				$('aside.left-menu').toggleClass('mobile')
									.toggleClass('animate');
				$('body').toggleClass('ov-h');
			}
		});
		
	});

	// Добавляет кнопку сворачивания меню к пунктам с подпунктами

		var ulInLi = $('menu.left-menu_ul li').has('ul');
		ulInLi.each(function(ind, el){
			var spanButton = $('<span>').addClass('dropdown-text').text('show menu');
			var button = $('<button>').addClass('dropdown').append(spanButton);
			$(this).append(button);
		});

	// Сворачивает подпункты и обрабатывает нажатия на кнопки сворачивания пунктов

		$('button.dropdown').on('click', function(e){
			var target = $(e.target);

			if(target.hasClass('opened')) target.removeClass('opened').parent().find('ul').slideToggle(500, $.bez([.23,.86,.68,1.08]));
			else target.addClass('opened').parent().find('ul').slideToggle(500, $.bez([.23,.86,.68,1.08]));

		});
	// Добавляет placeholder виджету поиска

		var text = $('.left-menu .form-wrapper input[type=submit]').val();
		$('.left-menu .form-wrapper input[type=text]').attr('placeholder', text);

	// Настройки slick слайдера

		$('.slider').slick({
			slidesToShow: 3,
			arrows: false,
			dots: true,
			autoplay: true,
			slidesToScroll: 2,
			infinite: true,
			autoplaySpeed: 1800,
			pauseOnFocus: false,
			pauseOnHover: false,
			responsive: [
			    {
			      breakpoint: 970,
			      settings: {
			        slidesToShow: 3,
			      }
			    },
			    {
			      breakpoint: 650,
			      settings: {
			        slidesToShow: 2,
			      }
			    },
			    {
			    	breakpoint: 400,
			    	settings: {
			    		slidesToShow: 1
			    	}
			    }
			]
		});

	// Добавляет классы clearfix для родителей элементов с флоатами

		var p = $('.main-article p');
		for(var i = p.length - 1; i >= 0; i--){
			var current = $(p[i]);
			var finded = current.find('.alignleft, .alignright');
			if(finded.length > 0 && !current.hasClass('clearfix')){
				current.addClass('clearfix');
				return false;
			}
		}
	// Рбаота с аттрибутами в анкете

	$('.wpcf7-form-control.wpcf7-checkbox').each(function(ind, el){
		try{
			var $el = $(el);
			var ident = $el.attr('id');
			$el.removeAttr('id');
			$el.find('input[type="checkbox"]').attr('id', ident);
		} catch(e){
			return;
		}
	});

})(jQuery);