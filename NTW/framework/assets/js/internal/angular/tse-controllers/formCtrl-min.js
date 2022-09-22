function formCtrl(e) {
    e.submitForm = function() {
        e.submitted = !1;
        e.myForm.$valid ? alert("submit") : e.myForm.submitted = !0;
    };
}

var uppercase = !1, number = !1, specialchar = !1, lowercase = !1, password = "", repeatedpassword = "";

app.directive("checkpassword", function() {
    return {
        require: "ngModel",
        link: function(e, t, n, r) {
            r.$parsers.unshift(function(e) {
                password = $("input[name=userpassword]").val();
                if (password.length == 0) {
                    uppercase = !1;
                    number = !1;
                    specialchar = !1;
                    lowercase = !1;
                }
                lowercase = /[a-z]/.test(password);
                uppercase = /[A-Z]/.test(password);
                number = /[0-9]/.test(password);
                specialchar = /[!,@,£,$,∞,/,&,),(,+,#,€,%,=,-,_]/.test(password);
                if (uppercase == 1 && number == 1 && specialchar == 1 && lowercase == 1) {
                    r.$setValidity("checkpassword", !0);
                    uppercase = !1;
                    number = !1;
                    specialchar = !1;
                    lowercase = !1;
                    return e;
                }
                r.$setValidity("checkpassword", !1);
                return undefined;
            });
        }
    };
});

app.directive("matchpassword", function() {
    return {
        require: "ngModel",
        link: function(e, t, n, r) {
            r.$parsers.unshift(function(e) {
                repeatedpassword = $("input[name=repeatpassword]").val();
                if (password == repeatedpassword) {
                    r.$setValidity("matchpassword", !0);
                    return e;
                }
                r.$setValidity("matchpassword", !1);
                return undefined;
            });
        }
    };
});