//(function ($) {
//    'use strict';

    var app = {
        numbers: document.getElementsByClassName('number'),

        init: function () {
            //console.log('start');
            this.buildDOM();
            this.bindEvents();
        },

        buildDOM: function () {
            var w = window.innerWidth,
                h = window.innerHeight - 50,
                gutter = 25,
                x, y;

            x = (w - gutter * 5) / 4;
            y = (h - gutter * 10) / 9;

            for (i = 0; i < app.numbers.length; i++) {
                app.numbers[i].style.width = x + 'px';
                app.numbers[i].style.height = y + 'px';
                app.numbers[i].style.lineHeight = y + 'px';
            }
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
            for (i = 0; i < this.numbers.length; i++) {
                this.numbers[i].addEventListener('click', this.copyCode, false);
            }
        
            document.addEventListener('deviceready', this.onDeviceReady, false);
            /*
            $('.header-icon-holder').on('click', function () {
                $(this).toggleClass('active');
            });
            */
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

//})(window.jQuery);