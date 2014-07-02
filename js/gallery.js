(function($){
    var gallery = {
        countPhotos: 30,
        arrows: $('.arrow'),
        buttonImagePrev: $('.image-prev'),
        buttonImageNext: $('.image-next'),
        thumbsContent: $('#thumbs-content'),
        photoSection: $('#main-photos'),
        position: 0,

        init: function() {
            $.getJSON('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?', function(data) {
                for(var i = 0; i < gallery.countPhotos; i++) {
                    gallery.thumbsContent.append('<a href="#' + data.entries[i].id +'" class="thumb_wrap" ><img src="'+ data.entries[i].img.XXS.href +'" width="'+ data.entries[i].img.XXS.width +'" height="'+ data.entries[i].img.XXS.height +'"> </a> ');
                    gallery.photoSection.append('<span class="main-photo-wrap" ><img src="'+ data.entries[i].img.L.href +'" width="'+ data.entries[i].img.L.width +'" height="'+ data.entries[i].img.L.height +'"> </span> ');
                }
                gallery.photoSection.width(gallery.countPhotos * 100 + '%');
                $('.main-photo-wrap').width(100 / gallery.countPhotos + '%');
                gallery.itemWidth = $('.thumb_wrap').width();
                gallery.thumbsContent.width(gallery.itemWidth * gallery.countPhotos);

                if(location.hash) {
                    var lastImg = $('a[href="' + location.hash + '"]');
                    lastImg.addClass('active');
                    gallery.position = - 100 * (lastImg.index());
                    gallery.photoSection.css('left', gallery.position + '%');
                    gallery.checkArrows();
                    gallery.scrollThumbs(lastImg.index() + 1);
                } else {
                    $(".thumb_wrap:first-child").addClass('active');
                }
                gallery.binds()
            });
        },

        binds: function() {
            //  Наведение курсора на документ
            $(document).hover(function() {
                gallery.checkArrows()
            }, function() {
                gallery.arrows.stop().fadeOut()
            });

            //  Наведение курсора на галарею слайдов
            $('#thumbs').hover(function(){
                gallery.thumbsContent.stop().css('bottom', '0');
            }, function(){
                gallery.thumbsContent.stop().css('bottom', '-102px');
            });

            //  Скролл мышкой на галерее
            gallery.thumbsContent.mousewheel(function(event, delta){
                gallery.scrollThumbs(0, delta);
            });

            //  Нажатие на слайд в галерее
            $(document).on('click', '.thumb_wrap', gallery.showImageFromGallery);

            //  Кнопка следующий слайд
            gallery.arrows.click(gallery.showImageFromArrows);

            //  Изменение размера главного окна
            $(window).resize(gallery.resizeWindow);
        },

        checkArrows: function(){
            var image_active = $('.thumb_wrap.active');

            if(!(image_active.prev().html())) {
                gallery.buttonImageNext.stop().fadeIn();
                gallery.buttonImagePrev.hide();
            } else if(!(image_active.next().html())) {
                gallery.buttonImagePrev.stop().fadeIn();
                gallery.buttonImageNext.hide();
            } else {
                gallery.arrows.stop().fadeIn();
            }
        },

        showImageFromGallery: function() {
            var img = $(this).index();
            $('.thumb_wrap.active').removeClass('active');
            $(this).addClass('active');
            gallery.position = - 100 * img;
            gallery.photoSection.css('left', gallery.position + '%');
            gallery.checkArrows();
            gallery.scrollThumbs(img + 1);
        },

        showImageFromArrows: function(){
            var imageActive = $('.thumb_wrap.active');
            var imageNew;

            if($(this).hasClass('image-next')) {
                imageNew = imageActive.next();
                gallery.position = gallery.position - 100;
            } else {
                imageNew = imageActive.prev();
                gallery.position = gallery.position + 100;
            }

            location.hash = imageNew.attr('href');
            imageActive.removeClass('active');
            imageNew.addClass('active');
            gallery.photoSection.css('left', gallery.position + '%');
            gallery.checkArrows();
            gallery.scrollThumbs(imageNew.index() + 1);
        },

        scrollThumbs: function(image, delta){
            var thisImage = image || 0;
            var thumbsWrapWidth = $('#thumbs').width();
            var lastItemPosition = thumbsWrapWidth - gallery.thumbsContent.width();
            var itemsWrapPosition;

            if(thisImage){
                itemsWrapPosition = -(gallery.itemWidth * (thisImage - 0.5) - thumbsWrapWidth / 2);
            } else {
                itemsWrapPosition = parseInt(gallery.thumbsContent.css('left')) + (delta > 0 ? gallery.itemWidth * 3 : -gallery.itemWidth * 3);
            }

            if(itemsWrapPosition <= 0 && itemsWrapPosition > lastItemPosition ){
                $('#thumbs-content').css('left', itemsWrapPosition);
            } else if(itemsWrapPosition > 0){
                $('#thumbs-content').css('left', 0);
            } else {
                $('#thumbs-content').css('left', lastItemPosition);
            }
        },

        resizeWindow: function() {
            var thisMainPhoto = $($('.main-photo-wrap')[parseFloat($('.thumb_wrap.active').index())]).find('img');
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            if(winHeight < thisMainPhoto.attr('height')) {
                thisMainPhoto.css({'max-height' : winHeight, 'max-width': 'auto'});
            }
            if(winHeight > thisMainPhoto.attr('height')) {
                thisMainPhoto.css({'max-height' : ''});
            }
            if(winWidth < thisMainPhoto.attr('width')) {
                thisMainPhoto.css({'width' : winWidth, 'height': 'auto'});
            }
            if(winWidth > thisMainPhoto.attr('width')) {
                thisMainPhoto.css({'width' : '', 'height': ''});
            }
        }
    };
gallery.init();
})(jQuery);


