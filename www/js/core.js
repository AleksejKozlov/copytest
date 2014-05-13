(function ($) {
    'use strict';

    var app = {
        maxCodes: 36,
        db: null,
        codes: {},
        $header: $('header'),
        $headerIcon: $('.header-icon-holder'),
        $mainWrapper: $('.main-wrapper'),
        $codeList: $('.code-list'),
        $editCodeList: $('.edit-code-list'),
        editCodesItem: '.edit-code-item',
        editCodes: '.edit-code-item > input',
        codeNumber: '.number',
        msg: $('.msg'),
        codeSelected: false,
        gutter: 25,

        init: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);

            this.bindEvents();
        },

        buildEditList: function (count) {
            var w = window.innerWidth,
                gutter = app.gutter,
                inputWidth = w - 4 * gutter;

            for (var i = 1; i <= count; i++) {
                var item = '<li><div class="edit-code-item"><label class="number" for="number_' + i + '">' + i + '</label><input data-index="'+i+'" class="code" type="number" name="number_' + i + '" id="number_' + i + '" style="width: ' + inputWidth + 'px"/></div></li>';

                app.$editCodeList.append(item);
            }
        },

        buildCodeList: function (count) {
            var w = window.innerWidth,
                h = window.innerHeight - app.$header.innerHeight(),
                gutter = app.gutter,
                x, y;

            // 4x9 layout
            x = (w - gutter * 5) / 4;
            y = (h - gutter * 10) / 9;

            for (var i = 1; i <= count; i++) {
                var item = '<li class="code-item"><span class="number empty" data-code="" style="width: ' + x + 'px; height: ' + y + 'px; line-height: ' + y + 'px">' + i + '</span></li>';

                app.$codeList.append(item);
            }
        },

        checkIfEmptyCode: function(code) {
            var className = (code == '') ? 'empty' : '';
            
            return className;
        },
        
        copyCode: function (event) {
            var number = $(this),
                code = number.data('code');

            if (!number.hasClass('empty') && !app.codeSelected) {
                app.codeSelected = true;

                $(app.codeNumber).removeClass('active');
                number.addClass('active');

                window.plugins.clipboard.copy(code);
                app.showMsg('Copied to Clipboard');

                setTimeout(function () {
                    app.codeSelected = false;
                }, 1250);
            }
        },
        
        showMsg: function (msg) {
            app.msg.text(msg)
               .removeClass('hidden');

            setTimeout(function () {
                app.msg.addClass('hidden');
            }, 1250);
        },

        saveCodes: function() {
            var codes = $(app.editCodes);

            $.each(codes, function () {
                var $code = $(this),
                    id = $code.data('index'),
                    value = $code.val();
                
                app.codes[id] = value;
            });

            $(app.editCodesItem).removeClass('active');

            // hide keyboard
            SoftKeyboard.hide();
            
            // save to db
            app.db.transaction(app.saveCodesToDB, app.errorCB);
            
            app.showMsg('Saved');

            // update code list
            app.updateCodeList(app.maxCodes);
        },

        toggleEditCodeList: function () {
            $(this).toggleClass('settings');
            
            if (app.$mainWrapper.hasClass('active')) {
                app.saveCodes();

                setTimeout(function () {
                    app.$mainWrapper.toggleClass('active');
                }, 500);
            } else {
                app.$mainWrapper.toggleClass('active');
            }
        },

        bindEvents: function () {
            this.$headerIcon.on('click', this.toggleEditCodeList);
            this.$codeList.on('click', this.codeNumber, this.copyCode);
            this.$editCodeList.on('click', this.editCodesItem, this.makeEditListItemActive);
        },

        makeEditListItemActive: function() {
            var item = $(this);

            $(app.editCodesItem).removeClass('active');
            item.addClass('active');
        },

        openDB: function () {
            app.db = window.openDatabase("Database", "0.0.1", "Copy Code", 100000);
        },

        populateDB: function (tx) {
            //tx.executeSql('DROP TABLE IF EXISTS codes');
            tx.executeSql('CREATE TABLE IF NOT EXISTS codes (id unique, code)');
        },

        errorCB: function (err) {
            app.showMsg('Some problem occured, sorry.');
        },

        successCB: function () {
            app.db.transaction(app.getCodes, app.errorCB);
        },

        getCodes: function (tx) {
            tx.executeSql('SELECT * FROM codes', [], app.getCodesSuccess, app.errorCB);
        },

        getCodesSuccess: function (tx, results) {
            var len = results.rows.length;

            if (len == 0) {
                for (var i = 1; i <= app.maxCodes; i++) {
                    tx.executeSql('INSERT INTO codes (id, code) VALUES ('+i+', "")');
                }
            } else {
                for (var i = 0; i < len; i++) {
                    app.codes[results.rows.item(i).id] = results.rows.item(i).code;
                }

                app.updateCodeList();
                app.updateEditList();
            }
        },

        saveCodesToDB: function (tx) {
            $.each(app.codes, function (i, val) {
                tx.executeSql('UPDATE codes SET code = "' + val + '" WHERE id = ' + i + '');
            });
        },

        updateEditList: function() {
            var codes = $(app.editCodes);

            $.each(codes, function (i) {
                var code = $(this);

                code.attr('value', app.codes[i + 1]);
            });
        },

        updateCodeList: function () {
            var numbers = $(app.codeNumber);

            $.each(numbers, function (i) {
                var number = $(this);

                if (app.codes[i + 1] !== '') {
                    number.removeClass('empty');
                    number.data('code', app.codes[i + 1]);
                } else {
                    number.addClass('empty');
                }
            });
        },

        onDeviceReady: function () {
            app.buildCodeList(app.maxCodes);
            app.buildEditList(app.maxCodes);

            app.openDB(); 
            app.db.transaction(app.populateDB, app.errorCB, app.successCB);
        }
    }

    app.init();

})(window.jQuery);