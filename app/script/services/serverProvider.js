'use strict';

app.factory('serverProvider', ['$q', '$http', '$cookies', '$location', function ($q, $http, $cookies, $location) {
    var config = {
        timeWait: 20000,
        server: "http://188.187.148.235:43287",
        authPefix: "/auth",
        regPefix: "/reg",
        logoutPefix: "/logout",
        boardsPrefix: "/boards",
        boardDeletePrefix: "/board/delete",
        boardCardsPrefix: "/board/cards",
        cardPrefix: "/card",
        cardDeletePrefix: "/card/delete",
        tasksPrefix: "/task",
        delPrefix: "/task/delete",
        tasksListPrefix: "/task/list"
    }
    function parseError(status, data){
        console.info("status error",status);
        switch (status){
            case 403:
                $location.path("#/");
                break;
            case 400:
                alert(data);
                $location.path("#/");
                break;
            case 500:
                alert(data);
                break;
            default:
                alert(data);
        }
    }
    function postPromise(url, data) {
        $http.defaults.headers.post  = { 'X-Token' : $cookies.get('AUTH_TOKEN') }; //add token to all post request
        var promise = $http({method: 'POST', url: url, data: data, timeout: config.timeWait});
        var deferred = $q.defer();
        promise.success(function (data, status, headers, config) {
            deferred.resolve(data);
        });
        promise.error(function (data, status, headers, config) {
            parseError(status, data);
            deferred.reject("ERROR_CONNECTION");
        });
        return deferred.promise;
    }

    function getPromise(url) {
        $http.defaults.headers.get  = { 'X-Token' : $cookies.get('AUTH_TOKEN') };//add token to all get request
        var promise = $http({method: 'GET', url: url, timeout: config.timeWait});
        var deferred = $q.defer();
        promise.success(function (data, status, headers, config) {
            deferred.resolve(data);
        });
        promise.error(function (data, status, headers, config) {
            parseError(status, data);
            deferred.reject("ERROR_CONNECTION");
        });
        return deferred.promise;
    }

    var service = {};
    service.loginByCredentials = function (data) {
        return postPromise(config.server + config.authPefix, data);
    }
    service.regUser = function (data) {
        return postPromise(config.server + config.regPefix, data);
    }
    service.logout = function () {
        return postPromise(config.server + config.logoutPefix);
    }
    service.getBoards = function (query) {
        var param = "?id=" + query;
        return getPromise(config.server + config.boardsPrefix + param);
    }
    service.addBoard = function (data) {
        return postPromise(config.server + config.boardsPrefix, data);
    }
    service.delBoard = function (data) {
        return postPromise(config.server + config.boardDeletePrefix, data);
    }
    service.getCard = function (id) {
        var strParam = "/" + id;
        return getPromise(config.server + config.cardPrefix + strParam);
    }
    service.addCard = function (data) {
        return postPromise(config.server + config.cardPrefix, data);
    }
    service.updateCard = function (id, data) {
        var strParam = "/" + id;
        return postPromise(config.server + config.cardPrefix + strParam, data);
    }
    service.getCardsByBoadr = function (id) {
        var strParam = "/" + id;
        return getPromise(config.server + config.boardCardsPrefix + strParam);
    }
    service.deleteCard = function (id) {
        var strParam = "/" + id;
        return postPromise(config.server + config.cardDeletePrefix + strParam);
    }
    service.createTask = function (data) {
        return postPromise(config.server + config.tasksPrefix, data);
    }
    service.getTaskList = function (data) {
        return postPromise(config.server + config.tasksListPrefix, data);
    }
    service.deleteTask = function (data) {
        return postPromise(config.server + config.delPrefix, data);
    }
    service.updateTask = function (id, data) {
        var strParam = "/" + id;
        return postPromise(config.server + config.tasksPrefix + strParam, data);
    }
    return service;
}]);
