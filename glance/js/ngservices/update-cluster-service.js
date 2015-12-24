(function () {
    'use strict';
    angular.module('glance')
        .factory('clusterStatus', clusterStatus);

    clusterStatus.$inject = [];

    function clusterStatus() {
      return {
          getClusterStatus: getClusterStatus,
          updateClusterStatus: updateClusterStatus
      };

      ////////

      function getClusterStatus(nodes, clusterType) {
          if(!nodes.length) {
              return;
          }
          var clusterTypes = {
              '1_master': 1,
              '3_masters': 3,
              '5_masters': 5,
          };
          var clusterServices = listClusterServices(nodes);

          if(isClusterUnknow(nodes)) {
              return CLUSTER_STATUS.unknow;
          } else if (isClusterRunning(clusterServices, clusterType, clusterTypes)) {
              return CLUSTER_STATUS.running;
          } else if (isClusterInstalling(clusterServices, clusterType, clusterTypes)) {
              return CLUSTER_STATUS.installing;
          }

          return CLUSTER_STATUS.abnormal;
      }

      function updateClusterStatus(data, clusters) {
          var clusterId = data.clusterId;
          var clusterIndex = searchIndex('id', clusterId, clusters);
          if (clusterIndex !== -1) {
              var cluster = clusters[clusterIndex];
              var nodeId = data.nodeId;
              var nodeIndex = searchIndex('id', nodeId, cluster.nodes);
              if (nodeIndex !== -1) {
                  var nodes = clusters[clusterIndex].nodes;
                  updateNode(data, nodes[nodeIndex]);
                  var clusterType = cluster.cluster_type;
                  cluster.clusterStatus = getClusterStatus(nodes, clusterType);
              }
          }
      }

      function isClusterRunning(clusterServices, clusterType, clusterTypes) {
          var status = [NODE_STATUS.running];
          var runningMasterAmount = calServicesByStatus(clusterServices.master, status);
          if (runningMasterAmount === clusterTypes[clusterType]) {
              if (calServicesByStatus(clusterServices.slave, status) >= 1) {
                  return true;
              }
          }
          return false;
      }

      function isClusterUnknow(nodes) {
          var amounts = calNodesByStatus(nodes, 'terminated');
          if (amounts.master > 0) {
              return true;
          }
          return (amounts.slaves && amounts.slave === amounts.slaveAmount);
      }

      function isClusterInstalling(clusterServices, clusterType, clusterTypes) {
          var statuses = [SERVICES_STATUS.running, SERVICES_STATUS.failed];
          var masterAmount = calServicesByStatus(clusterServices.master, statuses);
          var slaveAmount = calServicesByStatus(clusterServices.slave, statuses);
          return Boolean((masterAmount < clusterTypes[clusterType]) || (slaveAmount === 0));
      }

      function listClusterServices(nodes) {
          var clusterServices = {
              master: [],
              slave: []
          };
          var nodeServices = {};

          angular.forEach(nodes, function(node, index) {
              nodeServices = classifyNodeServices(node);
              clusterServices.master.push(nodeServices.master);
              clusterServices.slave.push(nodeServices.slave);
          });
          return clusterServices;
      }

      function calNodesByStatus(nodes, status) {
          var amounts = {
              master: 0,
              slave: 0,
              slaveAmount: 0
          };

          angular.forEach(nodes, function(node, nodeIndex) {
              if (node.role !== 'master') {
                  amounts.slaveAmount += 1;
              }
              if (status === getNodeStatus(node)) {
                  (node.role === 'master')? amounts.master += 1 : amounts.slave += 1;
              }
          });
          return amounts;
      }

      function calServicesByStatus(services, statuses) {
          var amount = 0;
          angular.forEach(services, function(service, index) {
              amount += (statuses.indexOf(service.status) !== -1 ? 1 : 0);
          });
          return amount;
      }

      function classifyNodeServices(node) {
          var nodeServices = {
              master: {},
              slave: {}
          };
          var names = Object.keys(nodeServices);
          var services = node.services;
          var breakAmount = 0;
          var service;

          for (var i = 0; i < services.length; i++) {
              service = services[i];
              if (names.indexOf(service.name) !== -1) {
                  nodeServices[service.name] = service;
                  breakAmount += 1;
              }
              if (breakAmount === names.length) {
                  break;
              }
          }
          return nodeServices;
      }

      function getNodeStatus(node) {
          var status;
          var rawStatus = node.status;
          var installingStatuses = 
            [NODE_STATUS.installing, NODE_STATUS.initing, NODE_STATUS.uninstalling];

          if (installingStatuses.indexOf(rawStatus) > -1) {
              status = NODE_STATUS.installing;
          } else if (rawStatus === NODE_STATUS.running) {
              if (getServiceStatus(node)  === SERVICES_STATUS.failed) {
                  status = NODE_STATUS.failed;
              }
          }
          return status ? status : rawStatus;
      }

      function getServiceStatus(node) {
          var role = Boolean(node.role === 'master');
          var checkServices = role? ['zookeeper', 'master', 'marathon'] : ['slave'];
          var service;
          for (var i = 0; i < node.services.length; i++) {
              service = node.services[i];
              if (service.status === SERVICES_STATUS.installing) {
                  return SERVICES_STATUS.installing;
              } else if (
                  service.status == SERVICES_STATUS.failed || 
                  service.status == SERVICES_STATUS.uninstalled
              ) {
                  if (checkServices.indexOf(service.name) > -1) {
                      return SERVICES_STATUS.failed;
                  }
              }
          }
          return SERVICES_STATUS.running;
      }

      function searchIndex(key, keyValue, values) {
          for (var i = 0; i < values.length; i++) {
              if (values[i][key] === keyValue) {
                  return i;
              }
          }
          return -1;
      }

      function updateNode(data, node) {
          var key;
          var index;
          var serviceStatus;
          for (key in data) {
              if (key !== 'clusterId' && key !== 'nodeId') {
                  if (key === 'status') {
                      node.status = data.status;
                  } else if (key === 'agentVersion') {

                  } else {
                      index = searchIndex('name', key, node.services);
                      serviceStatus = data[key].status;
                      if(serviceStatus === SERVICES_STATUS.uninstalling) {
                          serviceStatus = SERVICES_STATUS.installing;
                      }
                      node.services[index].status = serviceStatus;
                      node.services[index].version = data[key].version;
                  }
              }
          }
          return node;
      }

    }
})();