'use strict';

// @ngInject
module.exports = function (ADMIN_ACCESS_CONSTANT) {
    return function (accessLevel) {
        var result;
        switch (accessLevel) {
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_0:
                result = 'Users cannot access BUILD at all.';
                break;
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_1:
                result = 'Users can access a BUILD study by invitation only as a Guest user.';
                break;
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_2:
                result = 'Users can access a BUILD study OR project by invitation only. When the user is invited to the project, user becomes a Standard user so they can collaborate on the project.';
                break;
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_3:
                result = 'Users can sign in to BUILD as a Guest user and access the Study by invitation or by URL. When the user receives a study invitation from other users, they can access the study, as well.';
                break;
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_4:
                result = 'User can sign in to BUILD as a Guest user and access the Study by invitation or by URL. When users are invited to a project, user become a Standard user so they can collaborate on the project.';
                break;
            case ADMIN_ACCESS_CONSTANT.ACCESS_LEVEL.LEVEL_5:
                result = 'User has full access to all BUILD features.';
                break;
        }
        return result;
    };
};
