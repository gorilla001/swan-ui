(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl() {
        var self = this;


        self.markdown = '###Markdown directive *It works!*';
        self.fields =
            [
                {
                    type: 'string',
                    default: '1111',
                    label: 'Name',
                    descrition: 'demo demo'
                },
                {
                    type: 'int',
                    default: 300,
                    label: '22222',
                    descrition: 'demo demo'
                },
                {
                    type: 'boolean',
                    default: true,
                    label: 'Animal',
                    descrition: 'boolean boolean'
                },
                {
                    type: 'multiline',
                    default: '1231332',
                    label: 'textarea',
                    descrition: 'demo demo'
                },
                {
                    type: 'enum',
                    default: 'a',
                    label: 'enum',
                    descrition: 'demo demo',
                    options: ['a', 'b']
                },
                {
                    type: 'service',
                    label: 'service',
                    descrition: 'demo demo'
                },
                {
                    type: 'password',
                    label: 'password',
                    default: 1234123,
                    descrition: 'demo demo'
                }
            ];
    }
})();