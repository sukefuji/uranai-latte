/// <reference path="./jquery-3.1.0.min.js" />

$(function () {
    $('#submit-button').click(function () {
        paramDate = getFormattedDate(new Date());

        var ajax = $.ajax({
            type: 'GET',
            url: 'http://api.jugemkey.jp/api/horoscope/free/' + paramDate,

            // 通信成功時の処理
            success: function (result, textStatus, xhr) {
                var responseText = $.parseXML(result.responseText);
                var text = $(responseText).find('body').text();
                var json = $.parseJSON(text);

                inputDate = new Date($('#birth').val());
                detectFortuneTelling(inputDate, json, paramDate);
            },

            // 通信失敗時の処理
            error: function (xhr, textStatus, error) {
                console.error(textStatus);
                alert('NG...');
            }
        })

    });

    function getFormattedDate(date) {
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }

    function detectFortuneTelling(date, json, paramDate) {

        var constellation = getConstellation(date);
        console.log(constellation);

        json.horoscope[Object.keys(json.horoscope)[0]].forEach(function(element) {
            if (constellation == element.sign) {
                console.log(element);
                return element;
            }
        }, this);;

    }

    function getConstellation(date) {
        // 星座リスト
        var constellations = new Array("山羊座", "水瓶座", "魚座", "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座");
        // 境界となる日付
        var borderDays = new Array(20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22);

        var month = date.getMonth();
        var day = date.getDate();

        // 境界日付との前後関係から星座を決定
        var borderDay = borderDays[month];
        var index = day < borderDay ? month : month + 1;
        if (index >= constellations.length) {
            index = 0; // 12月後半生まれの時の処置
        }
        return constellations[index];
    }

    //占い情報の表示
	function printFortuneData(obj){	
		$('#content').html(obj['content']);
		$('#money').html(obj['money']);
		$('#job').html(obj['job']);
		$('#love').html(obj['love']);
		$('#total').html(obj['total']);
		$('#item').html(obj['item']);
		$('#color').html(obj['color']);
		$('#rank').html(obj['rank']);
		$('#sign').html(obj['sign']);
	}

})
