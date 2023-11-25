var play_puzzle = (function(){
	var firstMatrix, shuffleMatrix, allMatrixesFn, allMatrixes;
	// var box_size_global = 33.333333333333336;
	var box_size_global = 0;
	var default_image = 'puzzle.jpg';
	var puzzle_box_cls = '.puzzle_box';
	var puzzle_box = $(puzzle_box_cls);
	var start_puzzle = $('.start_puzzle');
	var start_puzzle_size = $('.start_puzzle_size');
	var reset_puzzle_btn = $('.reset_puzzle_btn');
	var check_puzzle_image = $('.check_puzzle_image');
	var solved_banner = $('.solved_banner');
	var total_move = $('.total_move_count');
    var main_puzzle_box_con = $('.main_puzzle_box_con');
    var start_options = $('.start_options');
    var start_options_open = false;

	var total_move_count = 0, playTime = 0, playing = false;

	var style = $('<style>'+
					'.puzzle_box,.puzzle_box>.box>.child_1 { background-image: url('+default_image+'); }'+
					'.puzzle_box.checking{ background-image: url('+default_image+') !important; }'+
				  '</style>');
	$('body').find('.extra_style').html(style);

	var reset_puzzle = function(){
		puzzle_box.removeClass('started_puzzle').removeClass('solved');
		puzzle_box.html('');
		total_move.html('0');
		total_move_count = 0;
        playTime = 0;
        playing = false;
        show_main_puzzle_box_con();
        timeToString();
	};

    var show_start_options = function(){
        if(start_options_open){
            start_options.addClass('hidden');
            main_puzzle_box_con.removeClass('hidden');
            start_options_open = false;
        }
        else{
            start_options.removeClass('hidden');
            main_puzzle_box_con.addClass('hidden');
            start_options_open = true;
        }
        
    };

    var show_main_puzzle_box_con = function(){
        start_options.addClass('hidden');
        main_puzzle_box_con.removeClass('hidden');
        start_options_open = false;
    };

    function timeToString() {
        var totalSeconds = playTime;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
    
      
        let formattedHH = hours.toString().padStart(2, "0");
        let formattedMM = minutes.toString().padStart(2, "0");
        let formattedSS = seconds.toString().padStart(2, "0");
      
        let text = `${formattedHH}:${formattedMM}:${formattedSS}`;
        $('.timer_count').text(text);
    }

	function getIndexOfK(arr, k) {
	  for (var i = 0; i < arr.length; i++) {
	    var index = arr[i].indexOf(k);
	    if (index > -1) {
	      return [i, index];
	    }
	  }
	}
	var getInvCount = (function(arr){
		var arr_length = arr.length;
	    var inv_count = 0;
	    for (var i = 0; i < arr_length - 1; i++)
	        for (var j = i+1; j < arr_length; j++)
	             if (arr[j] !== undefined && arr[i] !== undefined && arr[i] != 0 && arr[j] != 0 &&   arr[i] > arr[j])
	                  inv_count++;
	    return inv_count;
	});

	var odd_even = (function(i){
		if(i%2 == 0)
			return 2;
		else
			return 1;
	});

	var posibility_check = (function(arr){
		var matrix = shuffle(arr);
		var inv_count = getInvCount(matrix);
		var inv_count_odd_even = odd_even(inv_count);
		var freshMetrix_length = firstMatrix.matrix().length;
		var freshMetrix_length_odd_even = odd_even(freshMetrix_length);
		var freshMetrix = [];
		var firstMatrixCount = 0;
		var row_of_zero = null;
		var zero_position_from_bottom = 1;
		var posibility = false;
		for(var i = 0; i<freshMetrix_length; i++){
			for(var j = 0; j<freshMetrix_length; j++){
				if(matrix[firstMatrixCount] == 0){
					row_of_zero = i;
					break;
				}

				firstMatrixCount++;
			}
			if(row_of_zero != null)
				break;
		}
		var row_of_zero_2 = freshMetrix_length - row_of_zero;
		if(odd_even(row_of_zero_2) == 2) zero_position_from_bottom = 2;
		if(
			(freshMetrix_length_odd_even == 1 && inv_count_odd_even == 2) || 
			(freshMetrix_length_odd_even == 2 && zero_position_from_bottom == 2 && inv_count_odd_even == 1 ) ||
			(freshMetrix_length_odd_even == 2 && zero_position_from_bottom == 1 && inv_count_odd_even == 2 ) 
		){
			posibility = true;
		}
		if(posibility){
			return matrix;
		}
		else
			return posibility_check(matrix);
	});

	var shuffle = (function(arra1){
		var ctr = arra1.length, temp, index;
		while(ctr>0){
			index=Math.floor(Math.random()*ctr);
			ctr--;
			temp=arra1[ctr];
			arra1[ctr]=arra1[index];arra1[index]=temp;
		}
		return arra1;
	});

	var firstMatrixFn = (function(puzzleFigure){
		var firstMatrix_2 = [];
		var firstMatrixCount = 1;
		for(var i = 0; i<puzzleFigure; i++){
			firstMatrix_2[i] = [];
			for(var j = 0; j<puzzleFigure; j++){
				firstMatrix_2[i][j] = firstMatrixCount;
				firstMatrixCount++;
			}
		}
		firstMatrix_2[puzzleFigure-1][puzzleFigure-1] = 0;
		return {
			matrix: function(){
				return firstMatrix_2;
			},
			string: function(){
				return firstMatrix_2.join();
			}
		};
	});

	var puzzleMatrix = (function(obj){
		obj = $.extend({
	    	initialize:false,
	    	initializedMatrix: false,
	    	puzzleFigure: 3
	    },obj);
	    var puzzleFigure = obj.puzzleFigure;
		var freshMetrix, output, shuffledMatrix;

		freshMetrix = [];
		var firstMatrixCount = 0;
		for(var i = 0; i<puzzleFigure; i++){
			for(var j = 0; j<puzzleFigure; j++){
				freshMetrix[firstMatrixCount] = firstMatrixCount;
				firstMatrixCount++
			}
		}
		shuffledMatrix = posibility_check(freshMetrix);
		output = {
			getMatrix: function(){
				return shuffledMatrix;
			},
		};
		return output;
	});

	allMatrixesFn = (function(obj){
		obj = $.extend({
			initialize:true
	    },obj);
	    var output;
	    var check_match = (function(a){
	    	var a_str = a.join();
	    	total_move_count++;
	    	total_move.html(total_move_count);
	    	if(a_str ==  firstMatrix.string()){
	    		puzzle_box.addClass('solved');
	    		solved_banner.addClass('show');
                playing = false;
	    		setTimeout(function(){solved_banner.removeClass('show');},3000);
	    	}
	    });
	    var change_position = (function(a,b){
	    	var element_a = puzzle_box.find('.box[data-current-state="'+a+'"]');
	    	var element_b = puzzle_box.find('.box[data-current-state="'+b+'"]');
	    	if(element_a.length && element_b.length){
	    		var element_a_style = element_a.attr('style');
	    		var element_b_style = element_b.attr('style');
	    		var element_a_x = element_a.attr('data-x');
	    		var element_a_y = element_a.attr('data-y');
	    		var element_b_x = element_b.attr('data-x');
	    		var element_b_y = element_b.attr('data-y');
	    		if(
	    			typeof element_a_style !== 'undefined' && 
	    			typeof element_b_style !== 'undefined' &&
	    			typeof element_a_x !== 'undefined' &&
	    			typeof element_a_y !== 'undefined' &&
	    			typeof element_b_x !== 'undefined' &&
	    			typeof element_b_y !== 'undefined'
	    			){
	    			element_a.attr('style',element_b_style);
	    			element_a.attr('data-x',element_b_x);
	    			element_a.attr('data-y',element_b_y);
	    			element_b.attr('style',element_a_style);
	    			element_b.attr('data-x',element_a_x);
	    			element_b.attr('data-y',element_a_y);
	    			return true;
	    		}
	    	}
	    	return false;
	    });
	    output = {
	    	getFreshMatrix: function(){
	    		return obj.freshMetrix;
	    	},
	    	getShuffledMatrix: function(){ return obj.shuffleMatrix;},
	    	changeShuffledMatrix: function(x,y){
	    		var getShuffledMatrix = obj.shuffleMatrix;
	    		var processing = false;
	    		var processing_complete = false;
	    		var temp_1, temp_2, x2, y2;
	    		temp_1 = getShuffledMatrix[x][y];
	    		temp_2 = 0;

	    		var position_of_zero = getIndexOfK(getShuffledMatrix,0);
    			var puzzle_grid = getShuffledMatrix.length;
    			if(x == position_of_zero[0]){
    				if(y > position_of_zero[1]){}
    			}
    			else if(y == position_of_zero[1]){

    			}
    			else{

    			}
	    		if(
		    			x >= 0 && 
		    			y >= 0 && 
		    			position_of_zero[0] >= 0 && 
		    			position_of_zero[1] >= 0 &&
		    			getShuffledMatrix[x] !== undefined &&
		    			getShuffledMatrix[x][y] !== undefined &&
		    			getShuffledMatrix[position_of_zero[0]] !== undefined &&
		    			getShuffledMatrix[position_of_zero[0]][position_of_zero[1]] !== undefined

	    			){

	    			var direction = ''; // up, down, left, right
	    			var line = ''; // row, column
	    			var start_slice = 0;
	    			var end_slice = 0;
	    			if(position_of_zero[1] == y){
	    				line = 'column';
	    				if(position_of_zero[0] > x){
	    					direction = 'down';
	    					start_slice = position_of_zero[0]-1;
	    					end_slice = x;
	    					for(var i = start_slice; i >= end_slice; i--){		// reverse
	    						var temp_1 = getShuffledMatrix[i][position_of_zero[1]];
	    						change_position(0,temp_1);
			    				getShuffledMatrix[i+1][position_of_zero[1]] = temp_1;
			    				getShuffledMatrix[i][position_of_zero[1]] = 0;
			    				processing = true;
	    					}
	    				}
	    				else{
	    					direction = 'up';
	    					start_slice = position_of_zero[0]+1;
	    					end_slice = x;
	    					for(var i = start_slice; i <= end_slice; i++){		// normal
	    						var temp_1 = getShuffledMatrix[i][position_of_zero[1]];
	    						change_position(0,temp_1);
			    				getShuffledMatrix[i-1][position_of_zero[1]] = temp_1;
			    				getShuffledMatrix[i][position_of_zero[1]] = 0;
			    				processing = true;
	    					}
	    				}
	    			}
	    			else if(position_of_zero[0] == x){
	    				line = 'row';
	    				if(position_of_zero[1] > y){
	    					direction = 'right';
	    					start_slice = position_of_zero[1]-1;
	    					end_slice = y;
	    					for(var j = start_slice; j >= end_slice; j--){		// reverse
	    						var temp_1 = getShuffledMatrix[position_of_zero[0]][j];
	    						change_position(0,temp_1);
			    				getShuffledMatrix[position_of_zero[0]][j+1] = temp_1;
			    				getShuffledMatrix[position_of_zero[0]][j] = 0;
			    				processing = true;
	    					}
	    				}
	    				else{
	    					direction = 'left';
	    					start_slice = position_of_zero[1]+1;
	    					end_slice = y;
	    					for(var j = start_slice; j <= end_slice; j++){		// reverse
	    						var temp_1 = getShuffledMatrix[position_of_zero[0]][j];
	    						change_position(0,temp_1);
			    				getShuffledMatrix[position_of_zero[0]][j-1] = temp_1;
			    				getShuffledMatrix[position_of_zero[0]][j] = 0;
			    				processing = true;
	    					}
	    				}
	    			}

	    			if(processing == true){
	    				processing_complete = true;
	    				obj.shuffleMatrix = getShuffledMatrix;
	    				allMatrixes = allMatrixesFn(obj);
	    				check_match(allMatrixes.getShuffledMatrix());
	    			}
	    		}
	    	},
	    };
		return output;
	});



	var puzzleDefine = (function (obj){
	    obj = $.extend({
	    	callback: false,
	    	puzzleFigure: 3,
	    },obj);

		var puzzleFigure = obj.puzzleFigure;
		var boxWidth = 100/puzzleFigure;
		box_size_global = boxWidth;
		var startBoxValue = 0;
		var startMatrix = [];
		var startHtmlContent = [];
		firstMatrix = firstMatrixFn(puzzleFigure);

		shuffleMatrix = puzzleMatrix({initialize:true,puzzleFigure:puzzleFigure});

		var shuffleMatrix_2 = shuffleMatrix.getMatrix();
		var shuffleMatrix_3 = [];
		for(var i = 0; i < puzzleFigure; i++){
			startMatrix[i] = [];
			shuffleMatrix_3[i] = [];
			shuffleMatrix_3
			for(var j = 0; j < puzzleFigure; j++){
				startMatrix[i][j] = startBoxValue;
				shuffleMatrix_3[i][j] = shuffleMatrix_2[startBoxValue];
				var top = i*boxWidth;
				var left = j*boxWidth;
				var current_state = getIndexOfK(firstMatrix.matrix(), shuffleMatrix_3[i][j]);
				startHtmlContent[startBoxValue] = '<div class="box box_'+startBoxValue+'" data-x="'+i+'" data-y="'+j+'" data-original-state="'+startBoxValue+'" data-current-state="'+shuffleMatrix_3[i][j]+'" data-state="'+firstMatrix.matrix()[i][j]+'" data-left="'+left+'" data-top="'+top+'" style="width:'+boxWidth+'%;padding-top:'+boxWidth+'%;top:'+top+'%;left:'+left+'%;" >'+
											'<div class="child_1" style="width:'+(puzzleFigure*100)+'%;padding-top:'+(puzzleFigure*100)+'%; top:'+(-1*100*current_state[0])+'%; left:'+(-1*100*current_state[1])+'%;"></div>'+
											'<div class="child_2">'+shuffleMatrix_3[i][j]+'</div>'+
							  			 '</div>';
				startBoxValue++;
			}	
		}
		allMatrixes = allMatrixesFn({
			freshMetrix: firstMatrix.matrix(),
			shuffleMatrix: shuffleMatrix_3,
		});
		var boxHtml = startHtmlContent.join('');
		puzzle_box.html('');
		puzzle_box.append(boxHtml);
        playing = true;
        playTime = 0;
        var playTimeInterval = setInterval(function(){
            if(!playing){
                clearInterval(playTimeInterval)
            }
            else{
                playTime += 1;
                timeToString();
            }
        }, 1000);
		if(typeof obj.callback === "function"){
			obj.callback();
		}
	});

	$(function () {
			$(".puzzle_image_browse").change(function () {
				if (this.files && this.files[0]) {
					var reader = new FileReader();
					reader.onload = imageIsLoaded;
					reader.readAsDataURL(this.files[0]);
				}
			});
		});

	function imageIsLoaded(event) {
		var img_path = event.target.result;
		reset_puzzle();
		var style = $('<style>'+
					'.puzzle_box,.puzzle_box>.box>.child_1 { background-image: url('+img_path+'); }'+
					'.puzzle_box.checking{ background-image: url('+img_path+') !important; }'+
				  '</style>');
		$('body').find('.extra_style').html(style);
	};

	puzzle_box.on('click','.box',function(){
		var element = $(this);
		var _parent = element.closest(puzzle_box_cls);
		if(!_parent.hasClass('solved')){
			var data_x = element.attr('data-x');
			var data_y = element.attr('data-y');
			data_x = parseInt(data_x);
			data_y = parseInt(data_y);
			if(isNaN(data_x)) data_x = 0;
			if(isNaN(data_y)) data_y = 0;
			allMatrixes.changeShuffledMatrix(data_x,data_y);
		}
	});

	start_puzzle_size.click(function(event){
		event.preventDefault();
		var element = $(this);

		if(!start_puzzle.hasClass('disabled')){
			puzzle_box.removeClass('checking');
			check_puzzle_image.removeClass('open');
			check_puzzle_image.html('Show');
			var size = element.attr('data-size');
			if(typeof size === 'undefined')
				size = 3;
			size = parseInt(size);
			start_puzzle.addClass('disabled');
			reset_puzzle();
			puzzleDefine({puzzleFigure:size,callback:function(){puzzle_box.addClass('started_puzzle'); start_puzzle.removeClass('disabled');}});
		}
	});

	reset_puzzle_btn.click(function(event){
		reset_puzzle();
	});

	check_puzzle_image.click(function(event){
		event.preventDefault();
		var element = $(this);
		if(element.hasClass('open')){
			puzzle_box.removeClass('checking');
			element.removeClass('open');
			element.html('Show');
		}
		else{
			puzzle_box.addClass('checking');
			element.addClass('open');
			element.html('Play');
		}
	});

    $('.start-btn').click(function(event){
        event.preventDefault();
        show_start_options();
    })

});
$(document).ready(function(){
	play_puzzle();
});