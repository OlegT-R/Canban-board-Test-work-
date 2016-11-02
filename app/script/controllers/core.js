/**
 * Created by Versus on 25.10.2016.
 */
/* MainPersonal Controller */
app.controller('AuthCtrl', [
    '$scope', 'serverProvider', '$cookies', '$location',
    function ($scope, serverProvider, $cookies, $location) {
        $scope.authFormSubmit = function () {
            serverProvider.loginByCredentials($scope.user).then(
                function (success) { // save result auth - name, id, token
                    $cookies.put('AUTH_TOKEN', success.token);
                    $cookies.put('AUTH_NAME', success.name);
                    $cookies.put('AUTH_ID', success.id);
                    $location.path("/lk");
                },
                function (error) {
                    console.info("error", error);
                }
            );
        }
    }
]);
app.controller('LkCtrl', [
    '$scope', 'serverProvider', '$cookies', '$location',
    function ($scope, serverProvider, $cookies, $location) {
        $scope.userName = $cookies.get('AUTH_NAME');
        serverProvider.getBoards($cookies.get('AUTH_ID')).then( //get users boards
            function (success) {
                $scope.boardList = success;
            },
            function (error) {
                console.info("error", error);
            }
        );
        $scope.logout = function () { //remove cookies and redirect to /
            $cookies.remove('AUTH_TOKEN');
            $cookies.remove('AUTH_NAME');
            $cookies.remove('AUTH_ID');
            serverProvider.logout(); // send logout to server
            $location.path("#/");
        }
        $scope.addBoard = function () {
            var data = {
                id: $cookies.get("AUTH_ID"),
                name: $scope.boardName
            }
            serverProvider.addBoard(data).then( //add board
                function (success) {
                    $scope.boardList.push(success);
                },
                function (error) {
                    console.info("error", error);
                }
            )
        }
        $scope.delBoard = function (id) {
            console.info("del", id);
            var resIds = [];
            angular.forEach( $scope.boardList, function (value, key) {
                if (value.id != id) {
                    resIds.push(value);
                }
            });
            serverProvider.delBoard({id : id}).then( //delete board
                function (success) {
                    $scope.boardList = resIds; //success delete from server, update local board list
                },
                function (error) {
                    console.info("error", error);
                })

        }

    }
]);
app.controller('RegCtrl', [
    '$scope', 'serverProvider', '$cookies', '$location',
    function ($scope, serverProvider, $cookies, $location) {
        $scope.regFormSubmit = function () {
            serverProvider.regUser($scope.user).then(
                function (success) { // save reg result - name, id, token
                    $cookies.put('AUTH_TOKEN', success.token);
                    $cookies.put('AUTH_NAME', success.name);
                    $cookies.put('AUTH_ID', success.id);
                    $location.path("/lk");
                },
                function (error) {
                    console.info("error", error);
                }
            );
        }
    }
]);