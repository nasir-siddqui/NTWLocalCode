(function($) {

	$.fn.checkAge = function() {
		var strippedPersonalNumber = function(value)
		{
			value = value.replace(/[^\d]/g,'');
			
			if(value.length < 12) {
		      var todayYear = parseInt((new Date().getFullYear() + '').substring(2));
		      var inputYear = parseInt(value.substring(0,2));
		      if(inputYear < todayYear - 10) {
		        value = '20' + value;
		      } else {
		        value = '19' + value;
		      }
		    }
		    return value.substring(0,8) + '-' + value.substring(8);

		}
		var error = function(show, element, numberinput, number)
		{
			show ? element.css('display','block') :element.css('display','none'); 
			numberinput.addClass('error');
			numberinput.val(number);
		}

		var getAge = function (dateString) {
			var today = new Date();
			var birthDate = new Date(dateString);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		}

		var validateBirthday = function(number)
		{
			var year = number.substring(0, 4),
				month =(parseInt(number.substring(4, 6))),
				day = number.substring(6, 8);

			var age = getAge(year+'/'+month+'/'+day);

			return age < 28 && age >= 18;

		};

		var validateNumber = function(value){

		    var info = value.match(/((\d)(\d)(\d)(\d))((\d)(\d))((\d)(\d))\-(\d)(\d)(\d)(\d)/);
		    
			if (info) {
                // check that the date is ok
                var year = parseInt(info[1], 10);
                var month = parseInt(info[6], 10) - 1;
                var day = parseInt(info[9], 10);

                var d = new Date(year, month, day);
                if (!(d.getFullYear() === year && d.getMonth() === month && d.getDate() === day)) {
                	return false;
                }

                // check that the numbers are valid
                var numbers = $.map($.grep(info, function(item, index) { return index > 3 && index !== 6 && index !== 9; }), function(item) { return parseInt(item, 10); });
                
                var checksum = 0;
                $.each(numbers, function(index, item) {
                	var sum = item * (index % 2 === 0 ? 2 : 1);
                	checksum += sum > 9 ? 1 + sum - 10 : sum;
                });
                return checksum % 10 === 0;
                return true;

            }
            return false;
        }
        var element = $(this),
	        numberinput = element.find('#socialsecuritynumber'),
	        number = strippedPersonalNumber(numberinput.val()),
	        modalId = element.closest('.tsModal-wrapper').attr('id'),
	        errortext = element.find('.tsValidation-error');

        if(number.length < 12)
        {	
        	error(true, errortext, numberinput, '');
        	return;
        }
        else
        {
        	if(validateNumber(number) && validateBirthday(number))
        	{
        		$('#view1').css('display','none');

        		var newView = $('#view2');
        			// link = $('[data-target="#'+modalId+'"]').attr('href');
        		
	        		// newView.find('a').attr('href', link);
	        		newView.css('display','block');
	        		return;
        	}
        	
        	error(true, errortext, numberinput, number);
        }

    };

}( jQuery ));

$(function() {
	if($('.tsModal-wrapper').length > 0)
	{
		$('.tsModal-wrapper').on('shown.bs.modal', function (e) {
			setModalHeight($(this));
			$('#view2').find('a').attr('href', $(e.relatedTarget).attr('href'));
		});


		$('.tsModal-wrapper').on('submit', '#checkage', function(e){
			e.preventDefault();
			$(this).checkAge();
		});
	}

});









