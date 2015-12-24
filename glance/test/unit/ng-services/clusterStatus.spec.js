(function () {
    'use strict';
    describe('clusterStatus', function() {
        var clusterStatus;

        beforeEach(module('glance'));

        beforeEach(inject(function(_clusterStatus_) {
            clusterStatus = _clusterStatus_;
        }));

        describe('getClusterStatus', function() {
            it('cluster status should be running', function() {
                var nodes = [ {
                  agent_version: 'v0.1.121800',
                  attributes: [{attribute: 'gateway'}],
                  created_at: '2015-12-08 11:51:33',
                  id: 'fbb15260d254423d9ccfda45ba66ddce',
                  ip: '10.3.10.40',
                  name: '10.3.10.40',
                  role: 'master',
                  status: 'running',
                  updated_at: '2015-12-21 15:11:41',
                  node_labels: [
                    {label: {name: '4', id: 271}},
                    {label: {name: '6', id: 272}},
                    {label: {name: '2', id: 180}},
                    {label: {name: '10', id: 279}}
                  ],
                  services: [
                    {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                    {name: 'bamboo_proxy', version: null, status: 'running'},
                    {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                    {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                    {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                    {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                    {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                    {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'running'},
                    {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                    {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                  ]
              }];
              var clusterType = '1_master';
              var status = clusterStatus.getClusterStatus(nodes, clusterType);
              expect(status).toEqual('running');
            });

            it('cluster status should be unknow', function() {
              var nodes = [ {
                  agent_version: 'v0.1.121800',
                  attributes: [{attribute: 'gateway'}],
                  created_at: '2015-12-08 11:51:33',
                  id: 'fbb15260d254423d9ccfda45ba66ddce',
                  ip: '10.3.10.40',
                  name: '10.3.10.40',
                  role: 'master',
                  status: 'terminated',
                  updated_at: '2015-12-21 15:11:41',
                  node_labels: [
                    {label: {name: '4', id: 271}},
                    {label: {name: '6', id: 272}},
                    {label: {name: '2', id: 180}},
                    {label: {name: '10', id: 279}}
                  ],
                  services: [
                    {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                    {name: 'bamboo_proxy', version: null, status: 'uninstalled'},
                    {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                    {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                    {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                    {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                    {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                    {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'failed'},
                    {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                    {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                  ]
              }];

              var clusterType = '1_master';
              var status = clusterStatus.getClusterStatus(nodes, clusterType);
              expect(status).toEqual('unknow');
            });

            it('cluster status should be abnormal', function() {
              var nodes = [{
                  agent_version: 'v0.1.121800',
                  attributes: [{attribute: 'gateway'}],
                  created_at: '2015-12-08 11:51:33',
                  id: 'fbb15260d254423d9ccfda45ba66ddce',
                  ip: '10.3.10.40',
                  name: '10.3.10.40',
                  role: 'master',
                  status: 'running',
                  updated_at: '2015-12-21 15:11:41',
                  node_labels: [
                    {label: {name: '4', id: 271}},
                    {label: {name: '6', id: 272}},
                    {label: {name: '2', id: 180}},
                    {label: {name: '10', id: 279}}
                  ],
                  services: [
                    {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                    {name: 'bamboo_proxy', version: null, status: 'running'},
                    {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                    {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                    {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                    {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                    {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                    {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'failed'},
                    {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                    {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                  ]
              }];

              var clusterType = '1_master';
              var status = clusterStatus.getClusterStatus(nodes, clusterType);
              expect(status).toEqual('abnormal');
            });
        });

        describe('updateClusterStatus', function() {
            it('should update cluster status into abnormal', function() {
                var data = {
                    nodeId: 'fbb15260d254423d9ccfda45ba66ddce',
                    clusterId: 89,
                    master: {
                        status: 'failed',
                        version: 'mesos-0.23.0-master:omega.v0.2'
                    },
                    slave: {
                        status: 'running',
                        version: 'mesos-0.23.0-slave:omega.v0.2'
                    }
                };
                  
                var clusters = [{
                    cluster_type: "1_master",
                    created_at: "2015-12-08 11:01:56",
                    id: 89,
                    name: "222",
                    status: "running",
                    updated_at: "2015-12-21 15:44:10",
                    nodes: [{
                        agent_version: 'v0.1.121800',
                        attributes: [{attribute: 'gateway'}],
                        created_at: '2015-12-08 11:51:33',
                        id: 'fbb15260d254423d9ccfda45ba66ddce',
                        ip: '10.3.10.40',
                        name: '10.3.10.40',
                        role: 'master',
                        status: 'running',
                        updated_at: '2015-12-21 15:11:41',
                        services: [
                          {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                          {name: 'bamboo_proxy', version: null, status: 'running'},
                          {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                          {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                          {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                          {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                          {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                          {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'running'},
                          {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                          {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                        ]
                    }]
                }];

                clusterStatus.updateClusterStatus(data, clusters);
                expect(clusters[0].clusterStatus).toEqual('abnormal');
            });

            it('should update cluster status into running', function() {
                var data = {
                    nodeId: 'fbb15260d254423d9ccfda45ba66ddce',
                    clusterId: 89,
                    master: {
                        status: 'running',
                        version: 'mesos-0.23.0-master:omega.v0.2'
                    },
                    slave: {
                        status: 'running',
                        version: 'mesos-0.23.0-slave:omega.v0.2'
                    }
                };
                  
                var clusters = [{
                    cluster_type: "1_master",
                    created_at: "2015-12-08 11:01:56",
                    id: 89,
                    name: "222",
                    status: "running",
                    updated_at: "2015-12-21 15:44:10",
                    nodes: [{
                        agent_version: 'v0.1.121800',
                        attributes: [{attribute: 'gateway'}],
                        created_at: '2015-12-08 11:51:33',
                        id: 'fbb15260d254423d9ccfda45ba66ddce',
                        ip: '10.3.10.40',
                        name: '10.3.10.40',
                        role: 'master',
                        status: 'running',
                        updated_at: '2015-12-21 15:11:41',
                        services: [
                          {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                          {name: 'bamboo_proxy', version: null, status: 'running'},
                          {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                          {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                          {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                          {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                          {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                          {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'failed'},
                          {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                          {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                        ]
                    }]
                }];

                clusterStatus.updateClusterStatus(data, clusters);
                expect(clusters[0].clusterStatus).toEqual('running');
            });

            it('should update cluster status into installing', function() {
                var data = {
                    nodeId: 'fbb15260d254423d9ccfda45ba66ddce',
                    clusterId: 89,
                    master: {
                        status: 'installing',
                        version: 'mesos-0.23.0-master:omega.v0.2'
                    },
                    slave: {
                        status: 'running',
                        version: 'mesos-0.23.0-slave:omega.v0.2'
                    }
                };
                  
                var clusters = [{
                    cluster_type: "1_master",
                    created_at: "2015-12-08 11:01:56",
                    id: 89,
                    name: "222",
                    status: "running",
                    updated_at: "2015-12-21 15:44:10",
                    nodes: [{
                        agent_version: 'v0.1.121800',
                        attributes: [{attribute: 'gateway'}],
                        created_at: '2015-12-08 11:51:33',
                        id: 'fbb15260d254423d9ccfda45ba66ddce',
                        ip: '10.3.10.40',
                        name: '10.3.10.40',
                        role: 'master',
                        status: 'running',
                        updated_at: '2015-12-21 15:11:41',
                        services: [
                          {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                          {name: 'bamboo_proxy', version: null, status: 'running'},
                          {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                          {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                          {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                          {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                          {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                          {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'failed'},
                          {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                          {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                        ]
                    }]
                }];

                clusterStatus.updateClusterStatus(data, clusters);
                expect(clusters[0].clusterStatus).toEqual('installing');
            });
            
            it('should update cluster status into unknow', function() {
                var data = {
                    agentVersion: "v0.1.121800", 
                    nodeId: "fbb15260d254423d9ccfda45ba66ddce", 
                    status: "terminated", 
                    clusterId: 89
                };
                  
                var clusters = [{
                    cluster_type: "1_master",
                    created_at: "2015-12-08 11:01:56",
                    id: 89,
                    name: "222",
                    status: "running",
                    updated_at: "2015-12-21 15:44:10",
                    nodes: [{
                        agent_version: 'v0.1.121800',
                        attributes: [{attribute: 'gateway'}],
                        created_at: '2015-12-08 11:51:33',
                        id: 'fbb15260d254423d9ccfda45ba66ddce',
                        ip: '10.3.10.40',
                        name: '10.3.10.40',
                        role: 'master',
                        status: 'running',
                        updated_at: '2015-12-21 15:11:41',
                        services: [
                          {name: 'bamboo_gateway', version: 'bamboo-0.2.14:omega.v0.4', status: 'running'},
                          {name: 'bamboo_proxy', version: null, status: 'running'},
                          {name: 'cadvisor', version: 'cadvisor:omega.v1.0', status: 'running'},
                          {name: 'chronos', version: 'mesos-0.23.0-chronos-2.5.0:omega.v0.2', status: 'running'},
                          {name: 'exhibitor', version: 'exhibitor-1.5.5:omega.v0.2.3', status: 'running'},
                          {name: 'logcollection', version: 'logspout:omega.v0.4', status: 'running'},
                          {name: 'marathon', version: 'mesos-0.23.0-marathon-0.9.1:omega.v0.2.11', status: 'running'},
                          {name: 'master', version: 'mesos-0.23.0-master:omega.v0.2', status: 'running'},
                          {name: 'slave', version: 'mesos-0.23.0-slave:omega.v0.2', status: 'running'},
                          {name: 'zookeeper', version: 'zookeeper-3.4.6:omega.v0.2', status: 'running'}
                        ]
                    }]
                }];

                clusterStatus.updateClusterStatus(data, clusters);
                expect(clusters[0].clusterStatus).toEqual('unknow');
            });


        });

    });
})();
