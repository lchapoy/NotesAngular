'use strict';

/**
 * @ngdoc function
 * @name todoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the todoApp
 */
angular.module('todoApp')
  .constant({'baseUrl':'https://api.mongolab.com/api/1/databases/',apiKey:'Kd9-A_GFQpphBwn4nQVP6B1d7ucxvxq6',
		  database:'notes',
		  collection:'todo'
	  })
  .controller('MainCtrl', function ($scope,baseUrl,noteService,$interval) {  
	 $scope.notes= noteService.all;
  })
  .factory('noteService',function($resource,baseUrl,apiKey,database,collection){
		var resource=$resource(baseUrl+database+'/collections/'+collection+'/:id',
			{'id':'@_id.$oid','apiKey':apiKey},{ create: { method: 'POST' }, save: { method: 'PUT' },get:{method:'GET'}});
		var allNotes=[],currentNote;
		//************************************************************************************
		//getAll Notes
		var notes=resource.query();
		notes.$promise.then(function (data) {
			Array.prototype.push.apply(allNotes, data);
			//console.log(allNotes)
		});
		//*************************************************************************************				
		//Create a new Note
		 var createNote=function(newNote){
			//console.log(newNote);
			return new resource(newNote).$create()
			.then(function(retNote){
				allNotes.push(retNote);
				//console.log('done in');
			});
			//console.log('done out');
		 };

		//Get an actual note
		//var getNote=function(gNote){
		//	return resource.get(gNote);
		// };
		//***************************************************************************************
		//Update a Note
		var updNote=function(uNote){
			//console.log(uNote);
			uNote.$save();
		 };
		 //Set Current Note being updated
		 var setEdit=function(note){
			currentNote=note;
		};
		//****************************************************************************************
		//Delete Note
		var delNote=function(dNote){
			//console.log("D")
			 //resource.delete({id:id})
			dNote.$delete().then(function () {
				allNotes.splice(allNotes.indexOf(dNote), 1);
			});
		};
		//****************************************************************************************
		//Get Note by Id
		var getNote=function(id){
			for(var i=0; i<allNotes.length;i++){
				if(allNotes[i]._id.$oid===id)
					return allNotes[i];
			}
		};
		//****************************************************************************************
		//Get Current
		var getCurrent=function(){
			return currentNote;
		};
		  return{
			  new:createNote,
			  all: allNotes,
			  get:getNote,
			  update:updNote,
			  delete:delNote,
			  setEdit:setEdit,
			  getCurrent:getCurrent
		  };
  })
  .directive('notes',function(noteService,$location,$route){
	return {
		scope:{source:"=source"
		},
		templateUrl:'../../views/noteTemp.html',
		compile:function(tScope,tElement,tAttrs){
		
			return {
				post:function(scope,element,attrs){
					//console.log(element);
				element.on("click",function(event){
					var id=angular.element(event.target).attr("info");
					if(event.target.name==="delete"){
						//console.log(noteService.get(id));
						noteService.delete(noteService.get(id));
					}
					if(event.target.name==="edit"){
					//	console.log("hi from path ",$location.path())
						$location.path("/add");
						$route.reload();
						noteService.setEdit(noteService.get(id));
					}
				});
				
				}
			};			
		 }
		//link:
		

	};  
	  
  });
