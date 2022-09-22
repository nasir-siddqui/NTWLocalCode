define(["underscore"], function(_) {
    
    var translation = [
        { key: "TEST", value: "test value" },
        { key: "B2B_main", value: "Mybusiness user" },
        { key: "PERSONAL_INFO", value: "Testar" },
        { key: "PORTAL_ACCESS", value: "Testar" },
        { key: "FULL_ACCESS", value: "Testar" },
        { key: "ma", value: 'Mobil administration' },
        { key: "REQUEST", value: "Ny ansökan" },
        { key: "ACTIVE", value: "Aktiv" },
        { key: "INVITE", value: "Inbjudan" },
        { key: "FIRSTNAME", value: "Förnamn" },
        { key: "EMAIL_ERROR", value: "Epostadressen är inte giltig" },
        { key: "INVITE", value: "Inbjudan" },
        { key: "NO", value: "Nej" },
        { key: "INVITE_SENT", value: "Denna inbjudan skapades av {0} och skickades {1}" },
        { key: "SAVE_REDIRECT_TEXT", value: 'Inbjudan sparades och skickades. Du dirigeras om till listvyn om {{ seconds }} sekunder. Du kan också <a href="{{ link }}">Klicka här</a>' },
        { key: "SMS_TOKEN_SENT", value: "SMS har skickats till mobil med nummer {0}" },
        { key: "ADMIN_ADDED_ORGANISATIONS", value: "Vi har lagt till ytterligare {0} organisationer i dina sparade organisationer eftersom de ingick i inbjudan"},
        { key: "ADD_GENERAL_HEADER", value: "Lägg till roller" }
    ];

    var replaceArgs = function(text, args) {
        var s = text;
        if (args && args.length > 0) {
            for (var i = 0; i < args.length; i++) {
                s = s.replace("{" + i +"}", args[i]);
            }
        }
        return s;
    };

    return {

        translate: function(key, args) {
            var o = _.find(translation, function(item) { return item.key === key; });
            if (o) {
                return replaceArgs(o.value, args);
            }
            return key;
        }

    };

});