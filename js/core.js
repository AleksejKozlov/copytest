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
        editCodes: '.edit-code-item > input',
        codeNumber: '.number',
        msgWrapper: $('.msg-wrapper'),
        msg: $('.msg'),

        init: function () {
            //document.addEventListener('deviceready', this.onDeviceReady, false);
            app.onDeviceReady(); // for web testing
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
            app.$codeList.empty();

            var w = window.innerWidth,
                h = window.innerHeight - app.$header.innerHeight(),
                gutter = 25,
                x, y;

            // 4x9 layout
            x = (w - gutter * 5) / 4;
            y = (h - gutter * 10) / 9;

            for (var i = 1; i <= count; i++) {
                var code = app.codes[i],
                    item = '<li class="code-item"><span class="number '+app.checkIfEmptyCode(code)+'" data-code="'+code+'" style="width: ' + x + 'px; height: ' + y + 'px; line-height: ' + y + 'px">' + i + '</span></li>';

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

            if (!number.hasClass('empty')) {
                $(app.codeNumber).removeClass('active');
                number.addClass('active');

                window.plugins.clipboard.copy(code);
                app.showMsg('Copied to Clipboard');
            }
        },
        
        showMsg: function (msg) {
            app.msg.text(msg);

            app.msgWrapper.removeClass('hidden');
            setTimeout(function () {
                app.msgWrapper.addClass('hidden');
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

            // save to db
            app.db.transaction(app.saveCodesToDB, app.errorCB);

            // rebuild code list
            app.buildCodeList(app.maxCodes);
        },

        toggleEditCodeList: function () {
            $(this).toggleClass('settings');
            
            if (app.$mainWrapper.hasClass('active')) {
                app.saveCodes();
            }

            app.$mainWrapper.toggleClass('active');
        },

        bindEvents: function () {
            this.$headerIcon.on('click', this.toggleEditCodeList);
            this.$codeList.on('click', this.codeNumber, this.copyCode);
        },

        openDB: function () {
            app.db = window.openDatabase("Database", "0.0.1", "Copy Code", 200000);
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

                app.buildCodeList(app.maxCodes);
                app.updateEditCodeList();
            }
        },

        saveCodesToDB: function (tx) {
            $.each(app.codes, function (i, val) {
                tx.executeSql('UPDATE codes SET code = "' + val + '" WHERE id = ' + i + '');
            });
        },

        updateEditCodeList: function() {
            var codes = $(app.editCodes);

            $.each(codes, function (i) {
                var code = $(this);

                code.attr('value', app.codes[i+1]);
            });
        },

        onDeviceReady: function () {
            app.openDB();
            app.db.transaction(app.populateDB, app.errorCB, app.successCB);

            this.buildEditList(this.maxCodes);
            this.bindEvents();
        }
    }

    app.init();

})(window.jQuery);