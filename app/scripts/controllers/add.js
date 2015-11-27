'use strict';

/**
 * @ngdoc function
 * @name todoApp.controller:AddCtrl
 * @description
 * # AddCtrl
 * Controller of the todoApp
 */
angular.module('todoApp')
  .controller('AddCtrl', function ($scope,noteService) {
	$scope.current=noteService.getCurrent();
  }).directive('add&cancel',function(noteService,$location,$route){
	  return{

		 link:function(scope,element){
			element.on("click",function(event){
				var date;
					if(event.target.innerText==="Save"){
						date=new Date();
						scope.current.date=date.toString().replace(/GMT.+/,"");
						noteService.new(scope.current);
						
					}else 
					if(event.target.innerText==="Edit"){
						date=new Date();
						scope.current.edit=date.toString().replace(/GMT.+/,"");
						noteService.update(scope.current);
						
					}else if(event.target.innerText!=="Cancel"){
						return;
					}
					$location.path("/");
					$route.reload();
					noteService.setEdit({});
			});
		 }
	  };
  });
