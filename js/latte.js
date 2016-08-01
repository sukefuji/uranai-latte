/// <reference path="./jquery-3.1.0.min.js" />

$(function () {
	
    $('#fortuneResultArea').hide();
	initPrintArea();
    $('#form').submit(function () {
        event.preventDefault();

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
                var resultObj = detectFortuneTelling(inputDate, json, paramDate);
				resultObj["message"] = getMessage($('#userName').val(),inputDate);
				printFortuneData(resultObj);
            },

            // 通信失敗時の処理
            error: function (xhr, textStatus, error) {
                console.error(textStatus);
                alert('NG...');
            }
        })
    });

    function getMessage(name, inputDate) {
        var kansaiben = getKansaiben(name, 0, inputDate.getDate());

        if (kansaiben == '') {
            kansaiben = 'つれもてしよら〜'
        }

        return kansaiben;
    }

    function getKansaiben(name, counter, day) {

        if (counter > 2) {
            return '';
        }

        switch (String(day * name.length).slice(-1)) {
            case '0':
                result = 'まいどおおきに！';
                break;
            case '1':
                result = 'ええ感じやで！';
                break;
            case '2':
                result = 'もうかりまっか？';
                break;
            case '3':
                result = 'めっちゃおもろいやん！';
                break;
            case '4':
                result = '調子ええなぁ！';
                break;
            default:
                result = getKansaiben(name, counter + 1, (day + 1));
                break;
        }
        return result;
    }

    function getFormattedDate(date) {
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }

    function detectFortuneTelling(date, json, paramDate) {
        var result;

        var constellation = getConstellation(date);

        json.horoscope[Object.keys(json.horoscope)[0]].forEach(function (element) {
            if (constellation == element.sign) {
                result = element;
            }
        }, this);;

        return result;

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
		//２度目を押されたときように隠す
		$('#fortuneResultArea').hide();
		
		initPrintData(obj);
		$('#content').html(obj['content']);
		$('#item').html(obj['item']);
		$('#color').html(obj['color']);
		$('#rank').html(obj['rank']);
		$('#sign').html(obj['sign']);
		$('#message').html(obj['message']);
		
		$('#kansaiben').hide();
		$('#fortuneResultArea').fadeIn(500);
		$('#kansaiben').fadeIn(3000);
		
	}
	//占い情報の成形
	function initPrintData(obj){
		$('#money').rateit('value',obj['money']);
		$('#job').rateit('value',obj['job']);
		$('#love').rateit('value',obj['love']);
		$('#total').rateit('value',obj['total']);
		obj['rank'] = obj['rank']+"位";
	}
	//占い情報表示エリアの初期設定
	//(htmlベースでなぜかならないので)
	function initPrintArea(){
		$('#money').rateit({
			value:0,
			readonly:true
		});
		$('#job').rateit({
			value:0,
			readonly:true
		});
		$('#love').rateit({
			value:0,
			readonly:true
		});
		$('#total').rateit({
			value:0,
			readonly:true
		});
	}
})
