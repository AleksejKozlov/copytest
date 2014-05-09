(function ($) {
    'use strict';

    var app = {
        $header: $('header'),
        $headerIcon: $('.header-icon-holder'),
        $number: $('.code-list .number'),
        $main: $('.main'),
        $editCodeList: $('.edit-code-list'),

        init: function () {
            this.buildCodeList();
            this.buildEditList(36);
            this.bindEvents();
        },

        buildEditList: function (count) {
            for (var i = 1; i <= count; i++) {
                var item = '<li><div class="edit-code-item"><span class="number">' + i + '</span><span class="code"></span></div></li>';

                app.$editCodeList.append(item);
            }
        },

        buildCodeList: function () {
            var w = window.innerWidth,
                h = window.innerHeight - app.$header.innerHeight(),
                gutter = 25,
                x, y;

            x = (w - gutter * 5) / 4;
            y = (h - gutter * 10) / 9;

            $.each(app.$number, function () {
                $(this).css('width', x + 'px')
                       .css('height', y + 'px')
                       .css('line-height', y + 'px');
            })
        },

        copyCode: function (event) {
            var number = event.currentTarget,
                code = number.getAttribute('data-code');

            for (i = 0; i < app.numbers.length; i++) {
                app.numbers[i].setAttribute('class', 'number');
            }
            number.setAttribute('class', 'number active');

            window.plugins.clipboard.copy(code);
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            /*
            for (i = 0; i < this.numbers.length; i++) {
                this.numbers[i].addEventListener('click', this.copyCode, false);
            }
            */
            //document.addEventListener('deviceready', this.onDeviceReady, false);
            

            this.$headerIcon.on('click', function () {
                $(this).toggleClass('settings');
                app.$main.toggleClass('active');
            });
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicity call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    }

    app.init();

})(window.jQuery);