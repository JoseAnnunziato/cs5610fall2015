"use strict";
(function() {

    angular
        .module("FormBuilderApp")
        .factory("FormService", FormService);

    function FormService ($http, $q) {

        var api = {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById,
            findFormById: findFormById
        };

        return api;

        function findAllFormsForUser (userId) {

            var deferred = $q.defer();
            $http.get("/api/assignment/user/"+userId+"/form")
                .success(function(forms){
                    console.log(forms);
                    deferred.resolve(forms);
                });

            return deferred.promise;
        }

        function findFormById (formId) {

            var deferred = $q.defer();
            $http.get("/api/assignment/form/"+formId)
                .success(function(form){
                    console.log(form);
                    deferred.resolve(form);
                });

            return deferred.promise;
        }

        function createFormForUser (userId, newForm) {
            var deferred = $q.defer();
            var id = guid();
            newForm.id = id;
            $http.post("/api/assignment/user/" + userId + "/form", newForm)
                .success(function(forms){
                    deferred.resolve(forms);
                });

            return deferred.promise;
        }

        function deleteFormById (formId) {
            var deferred = $q.defer();
            $http.delete("/api/assignment/form/"+ formId)
                .success(function(forms){
                    deferred.resolve(forms);
                });

            return deferred.promise;
        }

        function updateFormById (formId, updatedForm) {
            var deferred = $q.defer();

            $http.put("/api/assignment/form/" + formId, updatedForm)
                .success(function(forms){
                    deferred.resolve(forms);
                });

            return deferred.promise;
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        return service;
    }
}) ();