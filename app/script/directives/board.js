/**
 * Created by Versus on 26.10.2016.
 */
'use strict';
app.directive("board", function ($http, serverProvider) {
    return {
        restrict: "EA",
        templateUrl: 'templates/board.tpl.html',
        replace: true,
        scope: {
            boardDate: '=',
            delCallback: '='
        },
        controller: function ($scope, $http, serverProvider) {
            console.info("board", $scope.boardDate);
            serverProvider.getCardsByBoadr($scope.boardDate.id).then(
                function (success) {
                    $scope.ids = success;
                },
                function (error) {
                    console.info("error", error);
                }
            );
        },
        link: function (scope, el) {
            scope.deleteCard = function (id) {
                console.info("del", id);
                var resIds = [];
                angular.forEach(scope.ids, function (value, key) {
                    if (value != id) {
                        resIds.push(value);
                    }
                });
                serverProvider.deleteCard(id).then( // delete card
                    function (success) {
                        scope.ids = resIds; // remove local card
                    },
                    function (error) {
                        console.info("error", error);
                    }
                );
            }
            scope.addCard = function () {
                var params = scope.formCard;
                params.boardId = scope.boardDate.id;
                serverProvider.addCard(params).then(
                    function (success) {
                        scope.ids.push(success);
                    },
                    function (error) {
                        console.info("error", error);
                    }
                );
            }
            scope.deleteBoard = function () {
                scope.delCallback(scope.boardDate.id);
            }

        }
    }
});
