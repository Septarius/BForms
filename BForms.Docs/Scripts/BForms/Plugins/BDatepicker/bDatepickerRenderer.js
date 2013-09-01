﻿(function (factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'icanhaz'], factory);
    } else {
        factory(window.jQuery, window.ich);
    }

}(function ($) {

    var bDatepickerRenderer = function (opts) {
        this.options = $.extend(true, {}, opts);

        this.r = ich;
        this.moment = moment();

        this.initTemplates();
    };

    bDatepickerRenderer.prototype.enums = {
        Display: {
            Days: 0,
            Months: 1,
            Years: 2
        },
        Type: {
            Datepicker: 1,
            Timepicker: 2,
            DateTimepicker: 3
        }
    };


    bDatepickerRenderer.prototype.renderDatepicker = function (model) {
        
        var template = this.r.bDatepicker(model, true);

        return $(template);
    };
    
    bDatepickerRenderer.prototype.renderRangeContainer = function (model) {

        var template = this.r.rangePicker(model, true);

        return $(template);
    };

    bDatepickerRenderer.prototype.renderDate = function (model) {
        var template = this.r.datepickerTemplate(model, true);

        return $(template);
    };

    bDatepickerRenderer.prototype.renderTime = function (model) {
        var template = this.r.timepickerTemplate(model, true);

        return $(template);
    };

    bDatepickerRenderer.prototype.getTemplate = function (model) {
        return this.r.bDatepicker(model, true);
    };

    bDatepickerRenderer.prototype.initTemplates = function () {

        if(typeof this.r.yearsTemplate !== "function") {
            this.r.addTemplate("yearsTemplate", this.dateTemplates.yearsTemplate);
        }
        
        if (typeof this.r.monthsTemplate !== "function") {

            this.r.addTemplate("monthsTemplate", this.dateTemplates.monthsTemplate);
        }

        if (typeof this.r.daysTemplate !== "function") {

            this.r.addTemplate("daysTemplate", this.dateTemplates.daysTemplate);
        }

        if (typeof this.r.dateHeadTemplate !== "function") {

            this.r.addTemplate("dateHeadTemplate", this.dateTemplates.headTemplate);
        }
        
        if (typeof this.r.dateContTemplate !== "function") {

            this.r.addTemplate("dateContTemplate", this.dateTemplates.contTemplate);
        }
        
        if (typeof this.r.dateFooterTemplate !== "function") {

            this.r.addTemplate("dateFooterTemplate", this.dateTemplates.secondaryActions);
        }

        if (typeof this.r.timeContTemplate !== "function") {

            this.r.addTemplate("timeContTemplate", this.timeTemplates.contTemplate);
        }
        
        if (typeof this.r.timeFooterTemplate !== "function") {

            this.r.addTemplate("timeFooterTemplate", this.timeTemplates.secondaryActions);
        }

        if (typeof this.r.datepickerTemplate !== "function") {

            this.r.addTemplate("datepickerTemplate", this.mainTemplates.datepickerTemplate);
        }
        
        if (typeof this.r.timepickerTemplate !== "function") {

            this.r.addTemplate("timepickerTemplate", this.mainTemplates.timepickerTemplate);
        }

        if (typeof this.r.bDatepicker !== "function") {

            this.r.addTemplate("bDatepicker", this.mainTemplates.mainTemplate);
        }

        if (typeof this.r.rangePicker !== "function") {

            this.r.addTemplate("rangePicker", this.mainTemplates.rangeTemplate);
        }

    };

    bDatepickerRenderer.prototype.mainTemplates = {
        
        rangeTemplate: '<div class="bs-range-picker">' +
                            '<div class="ranges">' +
                                '<div class="form-group">' +
                                    '<label>From</label><div class="input-group">' +
                                    '<input type="text" class="bs-rangeStartLabel" value="" disabled="disabled">' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label>To</label>' +
                                '<div class="input-group">' +
                                '<input type="text" class="bs-rangeEndLabel" value="" disabled="disabled">' +
                            '</div>' +
                            '</div>' +
                            '<button class="btn btn-default bs-applyRange">Apply</button>&nbsp;' +
                            '<button class="btn bs-cancelRange">Cancel</button>' +
                            '</div>' +
            
                        '<div class="bs-start-replace"></div>' +
                        '<div class="bs-end-replace"></div>' +
            
                        '</div>',

        mainTemplate: '<div class="bs-datetime-picker {{WrapperClass}}">' +

                           '{{#ShowClose}}<a href="#" class="btn btn-close bs-closeBtn"></a>{{/ShowClose}}' +
                           '{{#WithDate}} {{>datepickerTemplate}} {{/WithDate}}' +
                           '{{#WithTime}} {{>timepickerTemplate}} {{/WithTime}}' +

                       '</div>',

        datepickerTemplate: '<div class="bs-date-wrapper">' +

                                '{{>dateHeadTemplate}}' +
                                '{{>dateContTemplate}}' +
                                '{{>dateFooterTemplate}}' +

                             '</div>',

        timepickerTemplate: '<div class="bs-time-wrapper" {{#WithDate}}{{#DateVisible}}style="display:none"{{/DateVisible}}{{/WithDate}}>' +

                                '{{>timeContTemplate}}' +
                                '{{>timeFooterTemplate}}' +

                             '</div>'
    };

    bDatepickerRenderer.prototype.dateTemplates = {
        headTemplate: '<div class="bs-date-action">' +

                           '<a href="#" class="btn btn-left bs-prevView"></a>' +
                           '<a href="#" class="month bs-upView">{{HeadText}}</a>' +
                           '<a href="#" class="btn btn-right bs-nextView"></a>' +

                        '</div>',
        contTemplate: '{{>yearsTemplate}}' +
                      '{{>monthsTemplate}}' +
                      '{{>daysTemplate}}',

        secondaryActions: '<div class="bs-secondary-action">' +
                            '{{#DateNowButton}}<a href="#" class="btn btn-default bs-dateNow">{{NowText}}</a>{{/DateNowButton}}' +
                            '{{#WithTime}}<a href="#" class="btn btn-set time pull-right bs-setTimeBtn">{{SetTimeText}}</a>{{/WithTime}}' +
                        '</div>',

        yearsTemplate: '<ul class="years" {{#HideYears}}style="display:none"{{/HideYears}}>' +
                           '{{#Years}}' +
                                '<li class="{{#selected}}active{{/selected}} {{#otherDecade}}new{{/otherDecade}}"><a href="#" class="bs-yearValue" data-value="{{value}}">{{year}}</a></li>' +
                           '{{/Years}}' +
                        '</ul>',

        monthsTemplate: '<ul class="months" {{#HideMonths}}style="display:none"{{/HideMonths}}>' +
                            '{{#Months}}' +
                                '<li class="{{#selected}}active{{/selected}}"><a href="#" class="bs-monthValue" data-value="{{value}}">{{month}}</a></li>' +
                            '{{/Months}}' +
                         '</ul>',
        daysTemplate: '<ul class="days" {{#HideDays}}style="display:none"{{/HideDays}}>' +
                            '{{#DaysNames}}' +
                                '<li class="day">{{.}}</li>' +
                            '{{/DaysNames}}' +
                            '{{#Days}}' +
                                '<li class="{{#selectable}}{{#selected}}active {{/selected}} {{#otherMonth}} new {{/otherMonth}} {{/selectable}}' +
                                            '{{^selectable}} bs-notSelectable {{/selectable}} {{ cssClass }}' +
                                '" {{#tooltip}}title="{{tooltip}}}"{{/tooltip}}><a href="#" class="bs-dateValue" data-value="{{value}}">{{day}}</a></li>' +
                            '{{/Days}}' +
                      '</ul>'
    };

    bDatepickerRenderer.prototype.timeTemplates = {
        contTemplate: '<ul class="{{#Is12Hours}}us-time{{/Is12Hours}}">' +
                            '<li><span>HH</span></li>' +
                            '<li><span>MM</span></li>' +
                            '<li><span>SS</span></li>' +
                            '{{#Is12Hours}}<li>&nbsp;</li>{{/Is12Hours}}' +

                            '<li><a href="#" class="btn btn-up bs-hourUp"></a></li>' +
                            '<li><a href="#" class="btn btn-up bs-minuteUp"></a></li>' +
                            '<li><a href="#" class="btn btn-up bs-secondUp"></a></li>' +
                            '{{#Is12Hours}}<li>&nbsp;</li>{{/Is12Hours}}' +

                            '<li><input type="text" class="bs-hourInput" maxlength="2" value="{{Time.hour}}"></li>' +
                            '<li><input type="text" class="bs-minuteInput" maxlength="2" value="{{Time.minute}}"></li>' +
                            '<li><input type="text" class="bs-secondInput" maxlength="2" value="{{Time.second}}"></li>' +
                            '{{#Is12Hours}}<li><a href="#" class="btn btn-default bs-timeMeridiem">{{Time.meridiem}}</a></li>{{/Is12Hours}}' +

                            '<li><a href="#" class="btn btn-down bs-hourDown"></a></li>' +
                            '<li><a href="#" class="btn btn-down bs-minuteDown"></a></li>' +
                            '<li><a href="#" class="btn btn-down bs-secondDown"></a></li>' +
                            '{{#Is12Hours}}<li>&nbsp;</li>{{/Is12Hours}}' +
                     '</ul>',
        secondaryActions: '<div class="bs-secondary-action">' +

                              '{{#TimeNowButton}}<a href="#" class="btn btn-default bs-timeNow">{{NowText}}</a>{{/TimeNowButton}}' +
                              '{{#WithDate}}<a href="#" class="btn btn-set date pull-right bs-setDateBtn">{{SetDateText}}</a>{{/WithDate}}' +


                          '</div>'
    };

    bDatepickerRenderer.prototype._extendOptions = function (opts) {
        return $.extend(true, {}, opts, this.options);
    };

    //attach to global scope
    window.bDatepickerRenderer = bDatepickerRenderer;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = bDatepickerRenderer;
    }

    if (typeof define !== "undefined" && define.amd) {
        return bDatepickerRenderer;
    }

}));