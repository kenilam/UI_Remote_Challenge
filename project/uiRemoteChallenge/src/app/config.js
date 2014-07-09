"use strict";
(
    function (app) {
        app
            .config([
                '$stateProvider',
                '$urlRouterProvider',
                '$locationProvider',
                function (stateProvider, urlRouterProvider, locationProvider) {
                    stateProvider
                        .state('section', {
                            url: '/:section',
                            templateUrl: function (state) {
                                return 'view/' + state.section + '.html';
                            },
                            controller: [
                                '$scope', '$rootScope', '$state', '$stateParams',
                                function (scope, rootScope, state, stateParams) {
                                    
                                }
                            ]
                        });

                    urlRouterProvider.otherwise(function(){
                        return 'home';
                    });
                }
            ]);
    }
)(URC);