/**
* ngWorker Module
*
* github: https://github.com/match08/ngWorker
* website http://www.weismarts.com
* Description match08
*/
angular.module('ngWorker', [])

//woker
.factory('wsWorker', function () {
	
	var WORKER_ENABLED = !!(window && window.URL && window.Blob && window.Worker);

	var self = {};
	var pools = {};

	function _checkWorker(id){
		if(!pools[id]){
			console.warn('id "'+ id + '" worker no created or terminate');
			return null;
		}
		return pools[id];
	}
	//
	self.isWorker = function(){
		return WORKER_ENABLED;
	};
	// create worker
	self.$new = function(id, js){
		if(!WORKER_ENABLED){
			console.error('Worker nonsupport');
			return;
		}
		var __jsStr = js.toString();
	  	if (__jsStr.lastIndexOf('.js')<=0) {//factory、service
	      var functionBody = __jsStr.trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
	      var url = window.URL.createObjectURL(new (window.Blob)([functionBody], { type: "text/javascript" }));
	      pools[id] = new (window.Worker)(url||'');
	    }else{//  *.js
	      pools[id] = new (window.Worker)(js||'');
	    }
	};

	//on message
	self.onMessage = function(id, onfn){
		var w = _checkWorker(id);
		w && (w.onmessage = onfn);
	};

	//send message
	self.postMessage = function(id, msg){
		var w = _checkWorker(id);
		w && w.postMessage(msg);
	};
	//end worker
	self.terminate = function(id){
		var w = _checkWorker(id);
		if(w){
			w.terminate();
			delete pools[id];	
		}
	};

	return self;
});