﻿"use strict";

angular.module("RoleList", [])
    .controller("RoleListController", ['$scope', '$http', function ($scope, $http) {
        $scope.initial = function () {

            $http.get("../api/RoleList")
                .success(function (data) {
                    $scope.roleList = data;
                    $('#ListTable').bootstrapTable('load', data);
                }).error(function (error) {
                    alert(error);
                });
        };


        $scope.Query = function () {
            var params = $scope.role;
            $http.get("../api/RoleList/?paramstring=" + encodeURI(JSON.stringify(params)))
                .success(function (data) {
                    $('#ListTable').bootstrapTable('load', data);
                }).error(function (error) {
                    if (error.status == 403) {
                        window.location.href = "/Account/Login?ReturnUrl=" + window.location.pathname;
                    } else {
                        modal.alertMsg("加载失败！");
                    }
                });
        };

        $scope.Add = function () {
            $scope.info = {
                title: "新增角色"
            };
        };

        $scope.SaveInfo = function () {
            $http.post('/api/Role', $scope.info).success(function (status) {
                $scope.Query();
                $('#InfoModal').modal('toggle');
            }).error(function (error) {

            });
        };



        $scope.initial();


    }]);


angular.bootstrap(angular.element("#RoleList"), ["RoleList"]);




function rowNumberFormatter(value, row, index) {
    return '<span>' + (Number(index) + 1) + '</span>';
}



function controlFormatter(value, row, index) {
    var controlFormat = '<button class="btn btn-default  controlBtn detail" data-target="#InfoModal" data-toggle="modal">修改</button><button class="btn btn-default  controlBtn delete">删除</button>';
    return controlFormat;
}

var operateEvents = {
    'click .detail': function (e, value, row, index) {
        var ctrlScope = angular.element('[ng-controller=RoleListController]').scope();
        ctrlScope.info = row;
        ctrlScope.info.title = "修改角色";
        ctrlScope.$apply();
    },
    'click .delete': function (e, value, row, index) {
        var id = row.Id;
        $.ajax({
            url: '../api/Role?id=' + id,
            type: 'DELETE',
            success: function (result) {
                angular.element('#btnQuery').triggerHandler('click');
            },
            error: function (error) {
                alert(error);
            }
        });
    }

};