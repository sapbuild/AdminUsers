'use strict';

// @ngInject
module.exports = function () {

    this.$get = ['$rootScope', function () {
        return {
            assertLevelValidity: function (accessLevelItems, policy, accessLevel) {
                var result;
                accessLevel = accessLevel || policy.RestrictedAccessLevel;
                if (!accessLevel) {
                    return true;
                }
                var accessLevelIndex = accessLevelItems.indexOf(accessLevel);
                var policyIndex = accessLevelItems.indexOf(policy.accessLevel);
                if (accessLevelIndex >= policyIndex && policyIndex < accessLevelItems.length - 1) {
                    policy.invalidAccessLevel = true;
                    policy.RestrictedAccessLevel = accessLevel;
                    result = false;
                }
                else {
                    if (policy.invalidAccessLevel === true) {
                        this.clearInvalidAccessLevels([policy]);
                    }
                    result = true;
                }
                return result;
            },
            clearInvalidAccessLevels: function (policies) {
                for (var k = 0; k < policies.length; k++) {
                    delete policies[k].invalidAccessLevel;
                    delete policies[k].RestrictedAccessLevel;
                }
            }

        };
    }]
    ;
};

