//用margin-left实现轮播图
//1.0实现流程：
//.carousel-container固定大小，.carousel-wrapper包含.carousel-slide，设置.carousel-wrapper的margin-left,然后将第一个.carousel-slide移到末尾
//如此循环和左右切换做轮播图没有问题
//(而当需要点击小圆点任意跳转的时候有bug,因为上面把移动顺序改变了，要实现就要对.carouel-slide做标记了。没实现这个。)

//1.1上面括号内说的已实现：也将程序组织结构改了，终于感受到了面向对象思想的好处了
//实现流程的改动：将轮播图，和里面的小圆点，箭头，滑动图都看成是对象，在对象里面定义各自的属性和行为，
// 然后将这些属性行为组合调用起来就构成了轮播图

;(function ($) {
    "use strict";
    $.fn.carousel = function (opt) {

        return this.each(function (index, ele) {
            var _this = this;
            var option = $.extend({}, $.fn.carousel.option, opt);

            var bulletsObj = (function () {
                var $bulletBox = $(_this).find('.carousel-bullet');
                var $bullets = $bulletBox.children();
                var count = $bullets.length;
                var currentIndex = 0;
                var sliderObj;

                function initView(slider) {
                    sliderObj = slider;
                    showBullet(0);
                    setBulletBoxCenterHorizontal();
                    bindClickToSlider();
                };

                function bindClickToSlider() {
                    $bullets.each(function (index, ele) {
                        $(this).click(function (e) {
                            var startIndex = currentIndex;
                            if (index < startIndex) {
                                for (var i = 0; i < startIndex - index; i++) {
                                    sliderObj.displayShowRight();
                                }
                            } else if (index > startIndex) {
                                for (var i = 0; i < index - startIndex; i++) {
                                    sliderObj.displayShowLeft();
                                }
                            }
                        });
                    });
                };

                function turnRight() {
                    if (currentIndex === count - 1) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                    showBullet(currentIndex);
                };

                function turnLeft() {
                    if (currentIndex === 0) {
                        currentIndex = count - 1;
                    } else {
                        currentIndex--;
                    }
                    showBullet(currentIndex);
                }

                function showBullet(index) {
                    if (index < 0 || index >= count)
                        throw new Error('the bullet index outBoundary,so bullets show abnomal');
                    $bullets.css('background-color', 'white');
                    $($bullets[index]).css('background-color', 'green');
                }

                function setBulletBoxCenterHorizontal() {
                    var bulletBoxWidth = 0;
                    var bulletBoxMode = $bulletBox.css('box-sizing');
                    if (bulletBoxMode === 'content-box') {
                        bulletBoxWidth = parseInt($bulletBox.width())
                            + parseInt($bulletBox.css('margin-left'))
                            + parseInt($bulletBox.css('margin-right'))
                            + parseInt($bulletBox.css('padding-left') + $bulletBox.css('padding-right'));
                    } else if (bulletBoxMode === 'border-box') {
                        bulletBoxWidth = parseInt($bulletBox.width());
                    }
                    var offset = (parseInt($bulletBox.parent().width()) - bulletBoxWidth) / 2;
                    $bulletBox.css('left', offset);
                }

                return {
                    initView: initView,
                    turnLeft: turnLeft,
                    turnRight: turnRight
                };
            })();

            var arrowsObj = (function () {
                var $arrows = $(_this).find('.carousel-arrow');
                var sliderObj;

                function initView(slider) {
                    bindChangeSlider();
                    hide();
                    sliderObj = slider;
                };

                function bindChangeSlider() {
                    var $arrowPre = $(_this).find('.carousel-pre');
                    var $arrowNext = $(_this).find('.carousel-next');
                    $arrowPre.click(function (e) {
                        sliderObj.displayShowRight();
                    });
                    $arrowNext.click(function (e) {
                        sliderObj.displayShowLeft();
                    });
                };

                function show() {
                    $arrows.show();
                };

                function hide() {
                    $arrows.hide();
                };

                return {
                    initView: initView,
                    show: show,
                    hide: hide
                }
            })();
            var sliderObj = (function Slider() {
                var flagAutoRun = 0;
                var $slide = $(_this).find('.carousel-slide');
                var $wrapper = $(_this).find('.carousel-wrapper');
                var count = $slide.length;
                var arrowsObj;
                var bulletsObj;

                var initView = function (arrow, bullet) {
                    $wrapper.css({'width': parseInt($(_this).width()) * $slide.length + 'px', 'height': $slide.height()});
                    $slide.css({'width': $(_this).width(), 'height': $slide.height()});
                    bindCheckDisplay();
                    arrowsObj = arrow;
                    bulletsObj = bullet;
                };

                function bindCheckDisplay() {
                    $(_this).mouseenter(function (e) {
                        console.log('mouseenter');
                        arrowsObj.show();
                        clearInterval(flagAutoRun);
                    });

                    $(_this).mouseleave(function (e) {
                        console.log('mouseleave');
                        arrowsObj.hide();
                        autoDisplay();
                    });
                }

                var autoDisplay = function () {
                    flagAutoRun = setInterval(function (args) {
                        displayShowLeft(option.swipeTime);
                    }, option.standingTime + option.swipeTime);
                };

                function displayShowRight(time) {
                    time = time || 500;
                    $wrapper.stop(true, true);
                    $wrapper.children().last().prependTo($wrapper);
                    $wrapper.animate({'margin-left': '-' + $(_this).width()}, 0);
                    $wrapper.animate({'margin-left': 0}, time);
                    bulletsObj.turnLeft();
                }

                function displayShowLeft(time) {
                    time = time || 500;
                    $wrapper.stop(true, true);
                    $wrapper.animate({'margin-left': '-' + $(_this).width()}, time, function () {
                        $wrapper.children().first().appendTo($wrapper);
                        $wrapper.animate({'margin-left': 0}, 0);
                    });
                    bulletsObj.turnRight();
                }

                return {
                    initView: initView,
                    autoDisplay: autoDisplay,
                    displayShowRight: displayShowRight,
                    displayShowLeft: displayShowLeft
                }
            })();

            ;(function () {
              //  $(_this).css({'width': option.width, 'height': option.height});
                sliderObj.initView(arrowsObj, bulletsObj);
                bulletsObj.initView(sliderObj);
                arrowsObj.initView(sliderObj);
                sliderObj.autoDisplay();
            })();
        });
    };

    $.fn.carousel.option = {
        standingTime: 1000,
        swipeTime: 2000
    };
})(jQuery);
