(function () {
    'use strict';

    describe('group node services', function() {

        beforeEach(module('glance'));
        var groupNodes;

        beforeEach(inject(function(_groupNodes_) {
            groupNodes = _groupNodes_;
        }));

        describe('getOriginalCluster', function() {
            it('should get original cluster caches successfully', function() {
                var mockClusterData = {
                    cluster_type: '1_master',
                    created_at: '2015-12-02 15:18:01',
                    id: 82,
                    name: '111',
                    nodes: [
                        {
                            agent_version: 'v0.1.112600',
                            attributes: [],
                            created_at: '2015-12-03 14:11:40',
                            id: '6a82ce517a4c4dfe82fcae0d92f9bb4d',
                            ip: '10.3.10.40',
                            name: '10.3.10.40',
                            role: 'master',
                            services: [
                                {name: 'bamboo_gateway', status: 'uninstalled'},
                                {name: 'bamboo_proxy', status: 'uninstalled'},
                                {name: 'cadvisor', status: 'running'},
                                {name: 'exhibitor', status: 'running'},
                                {name: 'logcollection', status: 'running'},
                                {name: 'marathon', status: 'running'},
                                {name: 'master', status: 'failed'},
                                {name: 'slave', status: 'failed'},
                                {name: 'zookeeper', status: 'running'}
                            ],
                            status: 'running',
                            updated_at: '2015-12-07 11:22:28'
                        }
                    ],
                    status: 'running',
                    updated_at: '2015-12-02 15:19:31'
                };
                var nodeId = mockClusterData.nodes[0].id;
                var services = mockClusterData.nodes[0].services;

                var originalCluster = groupNodes.getOriginalCluster(mockClusterData);
                expect(originalCluster.services[nodeId]).toEqual(services);
                expect(originalCluster.nodeStatus[nodeId]).toEqual('failed');
                expect(originalCluster.rawStatus[nodeId]).toEqual('running');
                expect(originalCluster.amounts.failed).toEqual(1);
            });
        });

        describe('updateClusterCache', function() {

        });

    });
})();