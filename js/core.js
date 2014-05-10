(function ($) {
    'use strict';

    var app = {
        db: null,
        codes: {},
        $header: $('header'),
        $headerIcon: $('.header-icon-holder'),
        $mainWrapper: $('.main-wrapper'),
        $codeList: $('.code-list'),
        $editCodeList: $('.edit-code-list'),
        editCodes: '.edit-code-item > input',

        init: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            //app.onDeviceReady(); // for web testing
        },

        buildEditList: function (count) {
            var w = window.innerWidth,
                gutter = 25,
                inputWidth = w - 4 * gutter;

            for (var i = 1; i <= count; i++) {
                var item = '<li><div class="edit-code-item"><label class="number" for="number_' + i + '">' + i + '</label><input data-index="'+i+'" class="code" type="number" name="number_' + i + '" id="number_' + i + '" style="width: ' + inputWidth + 'px"/></div></li>';

                app.$editCodeList.append(item);
            }
        },

        buildCodeList: function (count) {
            var w = window.innerWidth,
                h = window.innerHeight - app.$header.innerHeight(),
                gutter = 25,
                x, y;

            x = (w - gutter * 5) / 4;
            y = (h - gutter * 10) / 9;

            for (var i = 1; i <= count; i++) {
                var item = '<li><span class="number" data-code="" style="width: ' + x + 'px; height: ' + y + 'px; line-height: ' + y + 'px">' + i + '</span></li>';

                app.$codeList.append(item);
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

        saveCodes: function() {
            console.log('save all');

            var codes = $(app.editCodes);

            $.each(codes, function () {
                var $code = $(this),
                    id = $code.data('index'),
                    value = $code.val();
                
                //console.log(id);
                //console.log(value);

                app.codes[id] = value;
            });

            alert('save to db now');
            //app.db.transaction(app.saveCodesToDB, app.errorCB);
        },

        toggleEditCodeList: function () {
            alert('show 2nd slide');

            $(this).toggleClass('settings');
            
            if (app.$mainWrapper.hasClass('active')) {
                app.saveCodes();
            }

            app.$mainWrapper.toggleClass('active');
        },

        bindEvents: function () {
            this.$headerIcon.on('click', this.toggleEditCodeList);
        },

        openDB: function () {
            app.db = window.openDatabase("Database", "0.0.1", "Copy Code", 200000);
        },

        populateDB: function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS DEMO');
            tx.executeSql('CREATE TABLE IF NOT EXISTS codes (id INTEGER PRIMARY KEY, code)');
        },

        errorCB: function (err) {
            alert("Error processing SQL: " + err.code);
        },

        successCB: function () {
            app.db.transaction(app.getCodes, app.errorCB);
        },

        getCodes: function (tx) {
            tx.executeSql('SELECT * FROM codes', [], app.getCodesSuccess, app.errorCB);
        },

        getCodesSuccess: function (tx, results) {
            var len = results.rows.length;
            alert(len);
            /*
            for (var i = 0; i < len; i++) {
                $.app.taskList.append("<li id='" + results.rows.item(i).id + "'><span class='task'>" + results.rows.item(i).task + "</span></li>");
            }

            $.app.lastTaskId = ($.app.taskList.children().length > 0) ? $($.app.taskList.children()[0]).attr('id') : 0;
            */
        },

        saveCodesToDB: function (tx) {
            alert('save to db');

            $.each(app.codes, function (i, val) {
                //console.log('id: ' + i + ' value: ' + val);
                alert('UPDATE codes SET code = "' + val + '" WHERE id = "' + i + '"');
                //tx.executeSql('UPDATE codes SET code = "' + val + '" WHERE id = "' + i + '"');
            });
        },

        onDeviceReady: function () {
            app.openDB();
            app.db.transaction(app.populateDB, app.errorCB, app.successCB);

            this.buildCodeList(36);
            this.buildEditList(36);

            this.bindEvents();   
        }
    }

    app.init();

})(window.jQuery);