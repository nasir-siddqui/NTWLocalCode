/*global define*/(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):window.jQuery&&e(window.jQuery)})(function(e){e.fn.passwordValidation=function(){return this.each(function(){function s(e){e?u():a()}function o(e){e?f():l()}function u(){r.addClass("valid");r.removeClass("invalid")}function a(){r.addClass("invalid");r.removeClass("valid")}function f(){i.addClass("valid");i.removeClass("invalid")}function l(){i.addClass("invalid");i.removeClass("valid")}var t=e("#newPassword"),n=e("#repeatPassword"),r=e(t).siblings(".tsIconBackground"),i=e(n).siblings(".tsIconBackground");e("#newPassword, #newPasswordText, #repeatPassword, #repeatPasswordText").bind("keyup",function(){console.log("bind validation");var t=e(this).attr("id");t.match(/^new/)&&s(e(this).val().length>5);o(e("#newPassword").val()===e("#repeatPassword").val()&&e("#repeatPassword").val().length>5)})})}});