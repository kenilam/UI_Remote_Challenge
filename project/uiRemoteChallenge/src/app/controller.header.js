"use strict";
(
    function (app) {
        app.controller('header', [
            '$rootScope', '$scope',
            function (root, scope) {
                root.resource.$promise.then(function (data) {
                    scope.info = data.info;
                });
            }
        ]);
    }
)(URC);