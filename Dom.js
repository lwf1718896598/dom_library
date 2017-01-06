(function(){

	var addEvent = function(element,type,fn){
		if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}else{
			element.attachEvent("on" + type,fn);
		}
	}

	var removeEvent = function(element,type,fn){
		if(element.removeEventListener){
			element.removeEventListener(type,fn,false);
		}else{
			element.detachEvent("on" + type,fn);
		}
	}

	//查找元素的方法
	function searchElements(selector){

		//字面量声明数组
		var result = [];

		if(typeof selector == "string"){
			var reg = /^[#\.a-zA-Z]/;

			if(reg.test(selector)){

				var first = selector[0];

				// 传递过来的是id
				if(first == "#"){ //$("#div")
					var elem = document.getElementById(selector.slice(1));
					result = elem ? [elem] : [];
				}else if(first == "."){ //$(".div")

					var elems = document.getElementsByTagName("*");
					var len = elems.length;

					for(var i = 0; i < len; i++) {

						var name = elems[i].className;
						var string = "###" + name.split(" ").join("###") + "###";

						// 似懂非懂的一步一步console.log
						// console.log(name.split(" ").join("###"));
						
						if(string.search("###" + selector.slice(1) + "###") != -1){
							result.push(elems[i]);
						}
					}
				}else{
					var elems = document.getElementsByTagName(selector);

					//把集合转换成数组
					result = [].slice.call(elems,0);
				}
			}
		}else if(selector.nodeType == 1){
			result.push(selector);
		}else if(selector instanceof HTMLCollection || 
			selector instanceof Init){
			result = selector;
		}

		return result;
	}





	//获取样式表的样式
	function getStyle(elem,style){
		if(elem.currentStyle){
			return elem.currentStyle[style];
		}else{
			return window.getComputedStyle(elem,false)[style];
		}
	}

	function addPx(property,value){
		var object = {
			"z-index" : 1,
			"opacity" : 1
		}

		//object下没有property就添加px
		if(!object[property]){
			value += "px";
		}

		return value;
	}


	//构造函数
	function Init(selector){

		var arr = searchElements(selector);
		var len = arr.length;

		this.length = len;

		for(var i = 0; i < len; i++){
			this[i] = arr[i];
		}

	}

	Init.prototype = {

		//循环操作当前this对象下的每一个元素 （this对象是一个类数组）
		/*
			each用法 ：

			$(".div").each(function(i,e){
				console.log($(e).hasClass("header"));
			})
		*/
		each : function(callback){
			for(var i = 0; i < this.length; i++){
				callback.call(this[i],i,this[i]);
			}
		},

		addClass : function(name){
			this.each(function(i,e){
				if($(e).hasClass(name) == false){
					e.className += " " + name;
				}	
			})
		},

		hasClass : function(name){
			var arr = this[0].className.split(" ");
			var isExist = false;

			for(var i = 0; i < arr.length; i++){
				if(arr[i] == name){
					isExist = true;
				}
			}

			return isExist;
		},

		removeClass : function(name){
			
			//var reg_str = "\\s" + name + "\\s"; 
			//var reg = new RegExp(reg_str);

			this.each(function(i,e){

				// 达枝的方法
				if($(e).hasClass(name)){
					var className = e.className;
					var newClass = className.replace(name,"");
					e.className = newClass;
				}

				/*if($(e).hasClass(name)){
					var className = " " + e.className + " ";
					var new_name = className.replace(" " + name, "");
					e.className = new_name;
				}*/
			});
		},

		toggleClass : function(name){

			this.each(function(i,e){
				if($(e).hasClass(name)){
					$(e).removeClass(name);
				}else{
					$(e).addClass(name);
				}
			});
		},

		/*
		* 有两种参数
		* 1.可以是一串html的字符串
		* 2.可以是一个元素节点
		*/
		append : function(element){
			this.each(function(i,e){
				if(typeof element == "string"){
					e.insertAdjacentHTML("beforeend",element);
				}else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					e.appendChild(elem);				
				}
			});			
		},

		appendTo : function(parent){
			var self = this;

			// parent必须是一个$( )构造的对象
			if(parent instanceof Init){
				parent.each(function(i,e){
					if(e.nodeType == 1){
						var elem = self[0].cloneNode(true);
						e.insertAdjacentElement("beforeend",elem);
					}	
				});
			}			
		},

		// 插入到第一个位置
		prepend : function(element){

		},

		prependTo : function(parent){

		},

		css : function(property,value){
			var arg_len = arguments.length;

			//获取css属性
			if(arg_len == 1 && typeof property == "string"){

				//返回当前元素的样式
				return getStyle(this[0],property);
			}

			//设置
			if(arg_len == 2 && typeof property == "string"){

				if(typeof value == "number"){
					value = addPx(property,value);
				}

				this[0].style[property] = value;
			}

			//设置多个style
			if(typeof property == "object"){
				var value;

				for(var key in property){

					//console.log(key,property[key]);
					if(typeof property[key] == "number"){
						value = addPx(key,property[key]);
					}else{
						value = property[key];
					}

					this[0].style[key] = value;
				}
			}
		},

		attr : function(property,value){

			var arg_len = arguments.length;

			//获取属性
			if(arg_len == 1 && typeof property == "string"){
				return this[0].getAttribute(property);
			}

			//设置
			if(arg_len == 2 && typeof property == "string"){
				this[0].setAttribute(property,value);
			}

			//设置多个style
			if(typeof property == "object"){

				for(var key in property){
					this[0].setAttribute(key,property[key]);
				}
			}
		},

		siblings : function(){

			//var arr = [];
			var newDom = $("");
			var all = this[0].parentNode.children;
			var index = 0;

			/*for(var i = 0; i < all.length; i++){
				if(all[i] != this[0]){
					arr.push(all[i])
				}
			}	

			for(var i = 0; i < arr.length; i++){
				newDom[i] = arr[i];
				newDom.length = i+1;
			}*/

			for(var i = 0; i < all.length; i++){

				console.log(i,index)

				if(all[i] != this[0]){	
					newDom[index] = all[i]
					index++;			
				}
			}
			newDom.length = index;

			return newDom;
		},

		//把自身给删除
		//并且返回自身
		remove : function(){

			this.each(function(i,e){
				var parent = e.parentNode;
				parent.removeChild(e);
			})

			return this;
		},

		next : function(){
			$("div").next();
			next.function(){
				this[0];
			}

			var time = this[0];
			function abc(){
				for (var i = 0; i < time.length; i++) {
					
				}
			}
		},

		prev : function(){
			$("div").prev();
			prev:function(){
				this[0];
	}
		},

		// 01-06
		on : function(type,fn){
			this.each(function(i,e){
				//事件名唯一
				only++;
				var name = "handle" + only;

				//把事件和事件添加到events对象
				events[name] = fn;
				addEvent(e,type,fn);

				if(!e.eventName){
					e.eventName = {};
				}
			/*	把事件名添加到该元素的eventName属性上
				  eventName 是一个对象
				  
				  	eventName = {
				 		"click" ：["handle1"]; 
						
				}*/
				e.eventName[type].push(name);

			})
		},

		off : function(type){
			this.each(function(i,e){
				if(e.eventName){

					//找到该元素下要删除的事件类型的事件名
					var arr = e.eventName[type];
					for(var i = 0; i < arr.length; i++){

						// 匹配events对象下的函数
						removeEvent(e,type,events[arr[i]]);
					}
				}
			})
		},

		//把Dom对象转换成类数组
		push: [].push,
		sort: [].sort,
		splice: [].splice

	}
	function Dom(selector){
		return new Init(selector);
	}

	window.$ = Dom;
}())

// $("#div")
