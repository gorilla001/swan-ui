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

        describe('updateClusterCache node status update', function() {
            it('should update cluster caches when node status updated', function() {
                var wsData = {
                    status: 'running',
                    clusterId: 82,
                    nodeId: '6a82ce517a4c4dfe82fcae0d92f9bb4d'
                };
                var clusters = [
                    {
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
                                    {name: 'bamboo_gateway', status: 'running'},
                                    {name: 'bamboo_proxy', status: 'running'},
                                    {name: 'cadvisor', status: 'running'},
                                    {name: 'exhibitor', status: 'running'},
                                    {name: 'logcollection', status: 'running'},
                                    {name: 'marathon', status: 'running'},
                                    {name: 'master', status: 'running'},
                                    {name: 'slave', status: 'running'},
                                    {name: 'zookeeper', status: 'running'}
                                ],
                                status: 'running',
                                updated_at: '2015-12-07 11:22:28'
                            }
                        ],
                        status: 'terminated',
                        updated_at: '2015-12-02 15:19:31'
                    },{
                        cluster_type: '1_master',
                        created_at: '2015-12-02 15:18:01',
                        id: 83,
                        name: '222',
                        nodes: [
                            {
                                agent_version: 'v0.1.112600',
                                attributes: [],
                                created_at: '2015-12-03 14:11:40',
                                id: 'nodeId2',
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
                    }
                ];
                var clusterCache = {
                    nodeStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'terminated'},
                    rawStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'terminated'},
                    servicesCache: {
                        '6a82ce517a4c4dfe82fcae0d92f9bb4d': [
                            {name: 'bamboo_gateway', status: 'running'},
                            {name: 'bamboo_proxy', status: 'running'},
                            {name: 'cadvisor', status: 'running'},
                            {name: 'exhibitor', status: 'running'},
                            {name: 'logcollection', status: 'running'},
                            {name: 'marathon', status: 'running'},
                            {name: 'master', status: 'running'},
                            {name: 'slave', status: 'running'},
                            {name: 'zookeeper', status: 'running'}
                        ]
                    },
                    amounts: {
                        failed: 0,
                        initing: 0,
                        installing: 0,
                        running: 0,
                        terminated: 1,
                        upgrading: 0
                    }
                };

                var updetedClusterCaches = groupNodes.updateClusterCache(clusters, wsData, clusterCache);

                expect(updetedClusterCaches.newAmounts.terminated).toEqual(0);
                expect(updetedClusterCaches.newAmounts.running).toEqual(1);
            });
        });

        describe('updateClusterCache services update', function() {

            it('should update cluster caches when node services updated to running', function() {
                var wsData = {
                    clusterId: 82,
                    nodeId: '6a82ce517a4c4dfe82fcae0d92f9bb4d',
                    master: 'running',
                    slave: 'running'
                };

                var clusters = [
                    {
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
                                    {name: 'bamboo_gateway', status: 'running'},
                                    {name: 'bamboo_proxy', status: 'running'},
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
                    },{
                        cluster_type: '1_master',
                        created_at: '2015-12-02 15:18:01',
                        id: 83,
                        name: '222',
                        nodes: [
                            {
                                agent_version: 'v0.1.112600',
                                attributes: [],
                                created_at: '2015-12-03 14:11:40',
                                id: 'nodeId2',
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
                                    {name: 'slave', status: 'running'},
                                    {name: 'zookeeper', status: 'running'}
                                ],
                                status: 'running',
                                updated_at: '2015-12-07 11:22:28'
                            }
                        ],
                        status: 'running',
                        updated_at: '2015-12-02 15:19:31'
                    }
                ];

                var clusterCache = {
                    nodeStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'failed'},
                    rawStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'running'},
                    servicesCache: {
                        '6a82ce517a4c4dfe82fcae0d92f9bb4d': [
                            {name: 'bamboo_gateway', status: 'running'},
                            {name: 'bamboo_proxy', status: 'running'},
                            {name: 'cadvisor', status: 'running'},
                            {name: 'exhibitor', status: 'running'},
                            {name: 'logcollection', status: 'running'},
                            {name: 'marathon', status: 'running'},
                            {name: 'master', status: 'failed'},
                            {name: 'slave', status: 'running'},
                            {name: 'zookeeper', status: 'running'}
                        ]
                    },
                    amounts: {
                        failed: 1,
                        initing: 0,
                        installing: 0,
                        running: 0,
                        terminated: 0,
                        upgrading: 0
                    }
                };

                var updetedClusterCaches = groupNodes.updateClusterCache(clusters, wsData, clusterCache);
                expect(updetedClusterCaches.newAmounts.failed).toEqual(0);
                expect(updetedClusterCaches.newAmounts.running).toEqual(1);
            });

            it('should update cluster caches when node services updated to failed', function() {
                var wsData = {
                    clusterId: 82,
                    nodeId: '6a82ce517a4c4dfe82fcae0d92f9bb4d',
                    master: 'failed'
                };

                var clusters = [
                    {
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
                                    {name: 'bamboo_gateway', status: 'running'},
                                    {name: 'bamboo_proxy', status: 'running'},
                                    {name: 'cadvisor', status: 'running'},
                                    {name: 'exhibitor', status: 'running'},
                                    {name: 'logcollection', status: 'running'},
                                    {name: 'marathon', status: 'running'},
                                    {name: 'master', status: 'running'},
                                    {name: 'slave', status: 'running'},
                                    {name: 'zookeeper', status: 'running'}
                                ],
                                status: 'running',
                                updated_at: '2015-12-07 11:22:28'
                            }
                        ],
                        status: 'running',
                        updated_at: '2015-12-02 15:19:31'
                    },{
                        cluster_type: '1_master',
                        created_at: '2015-12-02 15:18:01',
                        id: 83,
                        name: '222',
                        nodes: [
                            {
                                agent_version: 'v0.1.112600',
                                attributes: [],
                                created_at: '2015-12-03 14:11:40',
                                id: 'nodeId2',
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
                    }
                ];

                var clusterCache = {
                    nodeStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'running'},
                    rawStatusCache: {'6a82ce517a4c4dfe82fcae0d92f9bb4d': 'running'},
                    servicesCache: {
                        '6a82ce517a4c4dfe82fcae0d92f9bb4d': [
                            {name: 'bamboo_gateway', status: 'running'},
                            {name: 'bamboo_proxy', status: 'running'},
                            {name: 'cadvisor', status: 'running'},
                            {name: 'exhibitor', status: 'running'},
                            {name: 'logcollection', status: 'running'},
                            {name: 'marathon', status: 'running'},
                            {name: 'master', status: 'running'},
                            {name: 'slave', status: 'running'},
                            {name: 'zookeeper', status: 'running'}
                        ]
                    },
                    amounts: {
                        failed: 0,
                        initing: 0,
                        installing: 0,
                        running: 1,
                        terminated: 0,
                        upgrading: 0
                    }
                };

                var updetedClusterCaches = groupNodes.updateClusterCache(clusters, wsData, clusterCache);

                expect(updetedClusterCaches.newAmounts.failed).toEqual(1);
                expect(updetedClusterCaches.newAmounts.running).toEqual(0);
            });
        });

    });
})();