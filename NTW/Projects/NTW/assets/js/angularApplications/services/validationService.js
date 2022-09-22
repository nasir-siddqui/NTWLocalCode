/**

Copied from mypages (and exetended, the extended functions are placed after the b2b comment),
shall be merged once the require/angular architecture is determined.
// Peter Wintzell

*/
define(['angular'], function(angular) {
    var app = angular.module('validationService', []);

    app.factory('validationService', function () {
        return {
            validatePhoneNumber: function(phoneNumber) {
                if(phoneNumber.match("-")) {
                    phoneNumber = phoneNumber.replace("-", "");
                }
                return _isPhoneNumber(phoneNumber);
            },

            validateMobileNumber: function(mobileNumber) {
                if(mobileNumber.match("-")) {
                    mobileNumber = mobileNumber.replace("-", "");
                }
                return _isPhoneNumber(mobileNumber) && (mobileNumber.substring(0,2) === "07") || _isPhoneNumber(mobileNumber) && (mobileNumber.substring(1,3) === "46");
            },

            validateEmail: function(email) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },

            validatePassword: function(password) {
                var validLength = (password.length > 5);
                passwordRules = /^\w*$/.test(password);
                var isNotSame = (!password.match("password")) && (!password.match("qwerty")) && (!password.match("telia"));

                return validLength && passwordRules && isNotSame;
            },

            areEqualValues: function(one, two) {
                return (one === two);
            },

            validateSocialSecurityNumber: function(socialSecurityNumber) {
                var year = socialSecurityNumber.substring(0,4);
                var month = socialSecurityNumber.substring(4,6);
                var day = socialSecurityNumber.substring(6,8);

                var validDate = _isDate(year, (month-1), day);
                
                var indexOfLine = socialSecurityNumber.indexOf("-");
                
                if(indexOfLine === 8) {
                    socialSecurityNumber = socialSecurityNumber.replace("-", "");
                }
                
                var validLength = (socialSecurityNumber.length === 12);
                var validFinalDigit = _validateFinalSocialSecurityNumberDigit(socialSecurityNumber);

                return (validDate && validLength && validFinalDigit);
            },

            validateUsername: function(username) {
                return /^[\w]*[\-\@\.]*$/.test(username);
            },

            ///////////////////////////// B2B additional here ///////////////////

            validateEmailWithMax50Chars: function(email) {
                var validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
                return validEmail && email.length <= 50 ;
            },

            validateGroupName: function(groupName) {
                var validGroupName = /d/.test(groupName);
                return validGroupName && validGroupName.length <=2;
            },

            equalTo: function(value1, value2) {
                return value1 === value2;
            }
        };
    });
});


var _isPhoneNumber = function(phoneNumber) {
    return /^[+]{0,1}\d+$/.test(phoneNumber);
}

var _validateFinalSocialSecurityNumberDigit = function(socialSecurityNumber) {
    var checkSum = 0;
    var n;

    for(var i = 2; i <= 10; i++) {
        n = parseInt(socialSecurityNumber[i]);

        if(i % 2 == 0) {
            var nTimesTwo = n * 2;
            checkSum += nTimesTwo % 10;
            if (nTimesTwo >= 10) {
                checkSum++;
            }
        } else {
            checkSum += n;
        }
    }

    return ((10 - (checkSum % 10)) % 10 == socialSecurityNumber[11]);
}

var _isDate = function(year, month, day) {
    var tmpDate = new Date(year,month,day);
    return ((tmpDate.getFullYear() == year) && (month == tmpDate.getMonth()) && (day == tmpDate.getDate()));
}