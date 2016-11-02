/**
 * Created by Versus on 26.10.2016.
 */

app.directive("card", function ($http, serverProvider) {
    return {
        restrict: "EA",
        templateUrl: 'templates/card.tpl.html',
        replace: true,
        scope: {
            cardId: '@',
            delCallback: '='
        },
        controller: function ($scope, $http, serverProvider) {
            var parentId = $scope.$parent.boardDate.id; // get parent current id
            serverProvider.getCard($scope.cardId).then(
                function (success) {
                    $scope.card = success;
                    if (parentId != $scope.card.boardId) { // if current parent id != server parent id -> update card
                        serverProvider.updateCard($scope.cardId, {boardId: parentId});
                    }
                    serverProvider.getTaskList({cardId: $scope.cardId}).then( // get cards task
                        function (success) {
                            $scope.card.tasks = success;
                            console.info("task", success);
                        },
                        function (error) {
                        }
                    )
                },
                function (error) {
                    console.info("error", error);
                }
            )
        },
        link: function (scope, el) {
            var taskInput = el.find('.add-task');
            var nameInput = el.find('.card-name');

            taskInput.bind("keydown keypress", function (event) {
                var text = $(taskInput).val();
                if (event.which === 13 && text != '') { //watch press enter to add task
                    addTask(text);
                    $(taskInput).val("");
                    event.preventDefault();
                }
            });
            nameInput.bind("keydown keypress", function (event) {
                var text = $(nameInput).val();
                if (event.which === 13 && text != '') { //watch press enter to change name
                    serverProvider.updateCard(scope.cardId, {name: text});
                    $(nameInput).blur();
                    event.preventDefault();
                }
            });
            scope.changeCheckBox = function (id) {
                var checkBox = el.find('#checkbox_' + id);
                var status = $(checkBox).is(":checked") ? "checked" : "unchecked";
                serverProvider.updateTask(id, {status: status});
            }

            scope.deleteCard = function () {
                scope.delCallback(scope.cardId);
            }
            scope.deleteTask = function (index) {
                serverProvider.deleteTask({id: scope.card.tasks[index].id});
                scope.card.tasks.splice(index, 1);
            }
            function addTask(text) {
                var dateStr = new Date().getTime().toString(); // uniq id
                var objTask = {
                    id: dateStr, // add temporary id
                    name: text,
                    status: 'disabled' // disable before server response
                };
                scope.card.tasks.push(objTask);
                var index = scope.card.tasks.length - 1; // remember index new element
                scope.$digest(); // apply local change
                serverProvider.createTask({cardId: scope.cardId, name: text}).then( // get cards task
                    function (success) {
                        scope.card.tasks[index].status = 'enabled';
                    },
                    function (error) {
                    }
                )
            }

        }
    }
});
