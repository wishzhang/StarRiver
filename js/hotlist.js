(function () {
    /*
    * 理解事件机制
    * TODO:本身网络请求具有一定的封装性，然而具体的页面需求可能会改，包括数据接口都可能更改，更改接口数据设计，页面交互
    * */

    //hbug:获取当前目录

    var songlist = {
        init: function () {
            var _this = this;
            $.ajax({
                type: 'post',
                url: 'test/hotlist_song.json',
                success: function (data) {
                    console.log('hotlist_song success');
                    console.log(data);
                    _this.render(data);
                    _this.bindOnClick();
                },
                error: function (e) {
                    console.log(e.toLocaleString());
                }
            })
        },
        render: function (data) {
            var $hotlist_content = $('#hotlist-content');
            var $listGroup = $hotlist_content.find('.list-group');
            for (var i = 0; i < data.data.length; i++) {
                var template =
                    '                        <a href="song.html" class="list-group-item list-group-item-action d-flex">\n' +
                    '                            <div class="col-8">\n' +
                    '                                <div class="form-check">\n' +
                    '                                    <input class="form-check-input" type="checkbox" value="why" id="song1"></input>\n' +
                    '                                    <label for="song1">' + data.data[i].singer + '-' + data.data[i].name + '</label>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                            <div class="col-4 text-right">\n' +
                    '                                <small>' + data.data[i].timeLength + '</small>\n' +
                    '                            </div>\n' +
                    '                        </a>';
                $listGroup.append(template);
            }
        },
        bindOnClick: function () {
            var $hotlist_content = $('#hotlist-content');
            var $listGroupItems = $hotlist_content.find('.list-group-item');
            $listGroupItems.each(function () {
                $(this).click(function () {
                    location.href = 'song.html';
                });
            })
        }
    }

    var hostlist = {
        init: function () {
            var _this = this;
            $.ajax({
                type: 'post',
                url: 'test/hotlist.json',
                success: function (data) {
                    console.log('request success');
                    console.log(data);
                    _this.render(data);
                    _this.bindOnClick();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('request error:' + errorThrown);
                }
            })
        },
        render: function (data) {
            var $menu = $('#menu');
            for (var i = 0; i < data.length; i++) {
                var $template = $('        <div class="card">' +
                    '                    <div class="card-header" id="headingOne">' +
                    '                        <h5 class="mb-0">' +
                    '                            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + i + '"' +
                    '                                    aria-expanded="true" aria-controls="collapseOne">' + data[i].name +
                    '                            </button>' +
                    '                        </h5>' +
                    '                    </div>' +
                    '                    <div id="collapse' + i + '" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">' +
                    '                        <div class="card-body">' +
                    '                            <div class="list-group list-group-flush">' +
                    '                            </div>' +
                    '                        </div>' +
                    '                    </div>' +
                    '                </div>');

                for (var j = 0; j < data[i].child.length; j++) {
                    var childTemplate = '<a href="#" class="list-group-item list-group-item-action" id="' + data[i].child[j].id + '">' + data[i].child[j].name + '</a>';
                    var $listGroup = $template.find('.list-group');
                    $listGroup.append(childTemplate);
                }
                $menu.append($template);
            }
        },
        bindOnClick: function () {
            var $collapse = $('#menu').find('.list-group-item');
            $collapse.each(function (value, index) {
                $(this).click(function (e) {
                    console.log('id=' + $(this).attr('id'));
                    songlist.init();
                })
            });
        }
    };

    hostlist.init();

})();
