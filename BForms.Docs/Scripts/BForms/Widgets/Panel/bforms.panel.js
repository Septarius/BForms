﻿(function (factory) {
	if (typeof define === "function" && define.amd) {
		define('bforms-panel', ['jquery', 'bootstrap', 'amplify', 'bforms-ajax', 'bforms-form'], factory);
	} else {
		factory(window.jQuery);
	}
})(function ($) {

	var bsPanel = function () {

	};

	bsPanel.prototype.options = {
		collapse: true,
		loaded: false,
		editable : true,

		toggleSelector: '.bs-togglePanel',

		editSelector: '.bs-editPanel',
		cancelEditSelector: '.bs-cancelEdit',
        saveFormSelector : '.bs-savePanel',

        containerSelector : '.bs-containerPanel',
        contentSelector: '.bs-contentPanel',

        cacheReadonlyContent : false
	};

	bsPanel.prototype._init = function () {
		this.$element = this.element;

		this._initDefaultProperties();
		this._initSelectors();
		this._delegateEvents();

		if (this.options.loaded === true) {
			this._initControls();
			this._loadState();
		} else {
		    this._loadReadonlyContent().then($.proxy(function () {
		        this._initControls();
		        this._loadState();
		    }, this));
		}
	};

	bsPanel.prototype._initDefaultProperties = function () {
	    this._name = this.options.name || this.element.prop('id');

	    if (typeof this._name === "undefined" || this._name == '') {
	        throw "boxForm required an unique name";
	    }

	    this._componentId = this.$element.data('component');
	    
        if (typeof this._componentId === "undefined") {
            console.warn("No component id specified for " + this._name);
        }

	    this._key = window.location.pathname + '|BoxForm|' + this._name;

	    this.options.readonlyUrl = this.options.readonlyUrl || this.$element.data('readonlyurl');
	    this.options.editableUrl = this.options.editableUrl || this.$element.data('editableurl');

	};

	bsPanel.prototype._initSelectors = function () {
	    this.$container = this.$element.find(this.options.containerSelector);
	    this.$content = this.$element.find(this.options.contentSelector);
	};

	bsPanel.prototype._delegateEvents = function () {

		this.$element.on('click', this.options.toggleSelector, $.proxy(this._onToggleClick, this));

		this.$element.on('click', this.options.editSelector, $.proxy(this._onEditClick, this));

		this.$element.on('click', this.options.cancelEditSelector, $.proxy(this._onCancelEditClick, this));
	};

	//#region events
	bsPanel.prototype._onToggleClick = function (e) {
		e.preventDefault();
		e.stopPropagation();

		if (this._state) {
			this.close();
		} else {
			this.open();
		}

	};

	bsPanel.prototype._onEditClick = function (e) {
		e.preventDefault();
		e.stopPropagation();

		this._loadEditableContent().then($.proxy(function () {
		    if (!this._state) {
		        this.open();
		    }
		},this));
	};

	bsPanel.prototype._onCancelEditClick = function (e) {
	    e.preventDefault();
	    e.stopPropagation();

	    if (this.options.cacheReadonlyContent && this._cachedReadonlyContent) {

	        this.$content.html(this._cachedReadonlyContent);
	        this._toggleEditBtn(true);

	        if (!this._state) {
	            this.open();
	        }
	    } else {
	        this._loadReadonlyContent().then($.proxy(function () {
	            this._toggleEditBtn(true);

	            if (!this._state) {
	                this.open();
	            }
	        },this));
	    }
	};

	//#endregion

	//#region private methods
	bsPanel.prototype._saveState = function () {
	    amplify.store(this._key, this._state);
	};

	bsPanel.prototype._loadState = function () {

		var lastState = amplify.store(this._key);

		if (lastState != null) {

			if (lastState == true) {
				this.open();
			} else {
				this.close();
			}
		}

	};

	bsPanel.prototype._initControls = function () {

		if (this.options.editable) {
		    this._toggleEditBtn(true);
		}

	};

	bsPanel.prototype._toggleLoading = function (show) {
	    if (show) {
	        this.$element.find('.bs-panelLoader').show();
	    } else {
	        this.$element.find('.bs-panelLoader').hide();
	    }
	};

	bsPanel.prototype._toggleCaret = function (show) {
	    if (show) {
	        this.$element.find('.bs-panelCaret').show();
	    } else {
	        this.$element.find('.bs-panelCaret').hide();
	    }
	};

    bsPanel.prototype._toggleEditBtn = function(show) {
        if (show) {
            this.$element.find(this.options.cancelEditSelector).hide().end()
                .find(this.options.editSelector).show();
        } else {
            this.$element.find(this.options.editSelector).hide().end()
                .find(this.options.cancelEditSelector).show();
        }
    };

    bsPanel.prototype._getXhrData = function () {
        
        return {
            component: this._componentId
        };
        
    };
	//#endregion

	//#region ajax
    bsPanel.prototype._loadReadonlyContent = function () {

        var data = this._getXhrData();
        
        this._trigger('beforeReadonlyLoad', data);

	    return $.bforms.ajax({
            name : 'BsPanel|LoadReadonly|' + this._name,
            url: this.options.readonlyUrl,
            
            data: data,
            
            context : this,
            success: this._onReadonlyLoadSuccess,
            error : this._onReadonlyLoadError
	    });
	};

    bsPanel.prototype._onReadonlyLoadSuccess = function (response) {
	    this.$content.html(response.Html);

	    this._toggleLoading();
	    this._toggleCaret(true);
	};

    bsPanel.prototype._onReadonlyLoadError = function () {

	};

    bsPanel.prototype._loadEditableContent = function () {
        
        var data = this._getXhrData();

        this._trigger('beforeEditableLoad', data);

	    return $.bforms.ajax({
	        name: 'BsPanel|LoadEditable|' + this._name,
	        url: this.options.editableUrl,
	        context: this,
	        
            data : data,

	        success: this._onEditableLoadSuccess,
	        error: this._onEditableLoadError
	    });
	};

    bsPanel.prototype._onEditableLoadSuccess = function (response) {

	    if (this.options.cacheReadonlyContent) {
	        this._cachedReadonlyContent = this.$content.html();
	    }

	    this.$content.html(response.Html);

	    var $form = this.$content.find('form'),
            $saveBtn = $form.find(this.options.saveFormSelector);

	    if ($form.length == 0) {
	        console.warn('No editable form found');
	    }

	    if ($saveBtn.length == 0) {
	        console.warn("No save button found");
	    }

	    this.$content.find('form').bsForm({
	        actions: [{
	            name: 'save',
	            selector: this.options.saveFormSelector,
                validate : true
	        }]
	    });

	    this._toggleEditBtn();
	};

    bsPanel.prototype._onEditableLoadError = function () {

	};
	//#endregion

	//#region public methods
    bsPanel.prototype.open = function () {
		var openData = {
			allowOpen: true,
			$content: this.$content
		};

		this._trigger('beforeOpen', openData);

		if (openData.allowOpen === true) {
		    this.$container.stop(true, true).slideDown(300);
		    this.$element.find(this.options.toggleSelector).addClass('dropup');
		}

		this._state = true;
		this._saveState();

		this._trigger('afterOpen');
	};

    bsPanel.prototype.close = function () {
		var closeData = {
			allowClose: true,
			$content: this.$content
		};

		this._trigger('beforeClose', closeData);

		if (closeData.allowClose === true) {
		    this.$container.stop(true, true).slideUp(300);
		    this.$element.find(this.options.toggleSelector).removeClass('dropup');
		}

		this._state = false;

		this._saveState();

		this._trigger('afterClose');
	};
	//#endregion

    $.widget('bforms.bsPanel', bsPanel.prototype);

	return bsPanel;
});