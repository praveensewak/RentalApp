/**
 * Created by naveed on 7/27/14.
 */

var app=angular.module('app',['ngAnimate','toaster','ngTable','ngGrid']);


app.controller("passengerController",function($scope,$http,toaster){

    $scope.myData = [{name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}];
    $scope.gridOptions = {
        data: 'myData',
        columnDefs: [{field: 'name', displayName: 'Name'}, {field:'age', displayName:'Age'}]
    };



});

app.controller('DemoCtrl', function($scope, ngTableParams,$http) {
    $http.post('/api/driver/trips', { driverid: 'taxidriver@yahoo.com', startdate: '2014-07-22', enddate: '2014-08-18' }).success(function(response) {
       console.log(response);
        $scope.response = response;

    });


    var data = [
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"},
        {date: "22/5/2014", startAddress: "NYC", endAddress:"Shicago", totalMiles:50, totalMinutes:50, payment: 100, status:"fulfilled"}]

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});

app.controller('MyCtrl', function($scope) {
    $scope.myData = [{name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}];
    $scope.gridOptions = {
        data: 'myData',
        columnDefs: [{field: 'name', displayName: 'Name'}, {field:'age', displayName:'Age'}]
    };

    $scope.update_columns = function($event){ console.log("asd")
        $scope.myData = [{new_name: "Moroni", new_age: 50, pin: 123},
            {new_name: "Tiancum", new_age: 43, pin: 345},
            {new_name: "Jacob", new_age: 27, pin: 567},
            {new_name: "Nephi", new_age: 29, pin: 789},
            {new_name: "Enos", new_age: 34, pin: 012}
        ];

        $scope.gridOptions.columnDefs = [
            {field: 'new_name', displayName: 'New Name'},
            {field:'new_age', displayName:'New Age'},
            {field:'pin', displayName:'Pin'}
        ];

    }
});