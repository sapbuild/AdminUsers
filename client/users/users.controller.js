'use strict';
// @ngInject
module.exports = function ($scope, AdminUsersService, $timeout, uiError) {

    $scope.users = [];
    $scope.nbUsers = 0;
    $scope.userDeleted = '';
    $scope.idDeleted = '';
    $scope.toggleGuest = true;
    $scope.displaySimple = true;
    var SEARCH_DELAY = 250;

    $scope.top = 50;
    $scope.skip = 0;
    $scope.nbPages = 1;
    $scope.currentPage = 1;
    $scope.search = '';
    $scope.isFirst = false;
    $scope.isLast = false;

    // We have to use an object to store these values because of angular scopes
    // Name/email search value
    $scope.search = {
        value: ''
    };
    // Role of the hovered user
    $scope.user = {
        role: ''
    };

    // Calling API for pagination
    var _pagination = function () {
        var options = {
            name: $scope.search.value,
            skip: $scope.skip,
            top: $scope.top
        };

        AdminUsersService.getUsers(options, function (response) {
            if (response) {
                $scope.users = response.users;
                $scope.nbUsers = response.nbUsers;
                // Normally we should always have at least 1 user (ourself)
                $scope.nbPages = ($scope.nbUsers ? Math.ceil($scope.nbUsers / $scope.top) : 1);

                // Disable Previous if on first page
                $scope.isFirst = $scope.currentPage === 1;

                // Disable Next if on first page
                if ($scope.currentPage >= $scope.nbPages) {
                    $scope.currentPage = $scope.nbPages;
                    $scope.isLast = true;
                }
                else {
                    $scope.isLast = false;
                }

            }
        }, function (/*error*/) {});
    };

    _pagination();

    // Get the name and the id of the user to be deleted
    $scope._getInfoToDelete = function (user) {
        $scope.$broadcast('dialog-open', 'idDeleteDialog');
        $scope.userDeleted = user.name;
        $scope.idDeleted = user.id;
    };

    // Call the API to remove user, decrement the number of users and send a toast message
    $scope.delete = function () {
        // call delete API if 200 then do code below
        AdminUsersService.deleteUser({id: $scope.idDeleted}, function (response) {
            if (response) {
                uiError.create({
                    content: $scope.userDeleted + ' has been removed from the list',
                    dismissOnTimeout: true,
                    dismissButton: true,
                    timeout: 5000,
                    className: 'success'
                });
                // Call pagination again
                // Need to reset pagination for search
                $scope.skip = 0;
                $scope.nbPages = 1;
                $scope.currentPage = 1;
                _pagination();
            }
        });
    };

    // Previous behavior
    $scope._onPrevious = function () {
        if ($scope.currentPage > 1) {
            $scope.skip -= $scope.top;
            $scope.currentPage--;
            _pagination();
        }
    };

    // Next behavior
    $scope._onNext = function () {
        if ($scope.currentPage < $scope.nbPages) {
            $scope.skip += $scope.top;
            $scope.currentPage++;
            _pagination();
        }
    };

    // Search behavior
    $scope._onSearch = function () {
        if ($scope.timer) {
            $timeout.cancel($scope.timer);
        }

        $scope.timer = $timeout(function () {
            // Need to reset pagination for search
            $scope.skip = 0;
            $scope.nbPages = 1;
            $scope.currentPage = 1;

            _pagination();
        }, SEARCH_DELAY);
    };

    // Handle the display of the red message for guest
    $scope._onChangeRole = function () {
        $scope.toggleGuest = $scope.selectedUser.newRole !== 'guest';
    };

    // Call the save API and display the selected role
    $scope._onSave = function (id) {

        $scope.toggleGuest = true;

        var options = {
            id: id,
            role: $scope.selectedUser.newRole
        };

        AdminUsersService.setRole(options, function (response) {
            if (response) {
                $scope.selectedUser.roles[0] = $scope.selectedUser.newRole;
                delete $scope.selectedUser.newRole;
            }
        }, function (/*error*/) {});
    };

    // On Cancel remove the red message for guest
    $scope._onCancel = function () {
        $scope.toggleGuest = true;
        delete $scope.selectedUser.newRole;
    };

    $scope.setMouseEnter = function (user) {
          user.hovered = true;
    };

    $scope.setMouseLeave = function (user) {
            user.hovered = false;
    };


    $scope.setSimpleDisplay = function (isSimpleDisplay) {
        $scope.displaySimple = isSimpleDisplay;
    };

    // Evaluate the role to be display and open the dialog
    $scope._openDialog = function (user) {
        $scope.selectedUser = user;
        $scope.selectedUser.newRole = $scope.selectedUser.roles[0];
        $scope.$broadcast('dialog-open', 'idRoleDialog');
    };

};
