/**
 * Created by naveed on 7/27/14.
 */

var app=angular.module('app',['ngAnimate','toaster']);


app.controller("pushController",function($scope,$http,toaster){

$scope.payload={aps:{}};
$scope.data={};

    $scope.$watch("data", function(newValue, oldValue) {
        console.log($scope.data);
        console.log(newValue);
        console.log(oldValue);

            $scope.addPayload();


       /* if(newValue!=oldValue){

            $scope.addPayload();
        }*/
    },true);

$scope.addPayload=function(){
    console.log("add");
    var data=$scope.data;
     console.log(data);
    if(data.device_tokens ||data.device_tokens==''){
        if(data.device_tokens==''){
            delete $scope.payload.device_tokens;
            console.log("delete")
        }
        else

    $scope.payload.device_tokens=[data.device_tokens];

    }
     if(data.alias){

    //    $scope.payload.aliases=[data.alias];

    }
     if (data.badge || data.badge==''){

         if(data.badge=='' ){
         delete $scope.payload.aps.badge;
         console.log("delete")
         }
         else {

         var badge=data.badge>=0?"+"+data.badge:data.badge;

        $scope.payload.aps.badge=badge;
         }
    }
    if (data.sound || data.sound==''){
        if(data.sound==''){
            delete $scope.payload.aps.sound;
            console.log("delete")
        }
        else
        $scope.payload.aps.sound=data.sound;

    }
    if (data.alert || data.alert=='')
    {
        if(data.alert=='' ){
            delete $scope.payload.aps.alert;
            console.log("delete")
        }
        else
        $scope.payload.aps.alert=data.alert;

    }
    console.log($scope.payload);
}
$scope.sendPayload=function(data){
    console.log("payload");
    $http.post('/api/push',$scope.payload).then( function (res) {//Success
            toaster.pop('success', "Notification", "sent successfully!");
            console.log(res);
        },
        function (res) {//Failure

            if(res.status=="417")
                toaster.pop('error', "Operation Failed", "Something went wrong while processing your request. Please input correctly.");
            else
                toaster.pop("error","Unknown Error Occurred:"+res.status);
            console.log(res);
        });

};
    $scope.check=function(){
        console.log("called");


    }
 /*  $scope.popit = function(){
       console.log("pop it");
       toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
        toaster.pop('error', "title", '<ul><li>Render html</li></ul>', null, 'trustedHtml');
        toaster.pop('wait', "title", null, null, 'template');
        toaster.pop('note', "title", "text");
    };*/

 var successCallback=   function (res) {
        if(res.result==='success'){
      //      toaster.pop('success', "New Record Creation", "Operation Successful!");
       //     $location.path(PATH_LIST_VIEW);//list view page
        } else {
            if(res.status=="417")
                toaster.pop('error', "Operation Failed", "Something went wrong while processing your request. Please input correctly.");
            else
                toaster.pop("error","Unknown Error Occurred:"+res.status);
        }
    }








});

