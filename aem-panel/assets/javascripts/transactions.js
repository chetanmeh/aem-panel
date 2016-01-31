function TransactionsCtrl($scope) {

  $scope.transactionKeys = [];
  $scope.transactionMap = {};
  $scope.logMap = {};
  $scope.queryMap = {};

  $scope.transactions = function() {
    return $scope.transactionKeys.map(function(n) {
      return $scope.transactionMap[n];
    });
  }

  $scope.activeKey = null;

  $scope.clear = function() {
    $scope.transactionKeys = [];
    $scope.transactionMap = {};
    $scope.logMap = {};
    $scope.queryMap = {};
  };

  $scope.activeRequest = function() {
    return $scope.transactionMap[$scope.activeKey];
  };

  $scope.activeQueries = function() {
    return $scope.queryMap[$scope.activeKey];
  };

  $scope.activeLog = function() {
    return $scope.logMap[$scope.activeKey];
  };

  $scope.setActive = function(transactionId) {
    $scope.activeKey = transactionId;
  };

  $scope.notEmpty = function(col) {
    if (!col) {
      return false;
    } else {
      return col.length > 0;
    }
  };

  $scope.getClass = function(transactionId) {
    return (transactionId === $scope.activeKey) ? 'selected' : '';
  };


  $scope.processTransaction = function(transaction, data) {
    $scope.transactionKeys.push(transaction.key);
    $scope.transactionMap[transaction.key] = transaction;

    angular.forEach(data, function(value, dataType) {
      $scope.$apply(function() {
        $scope.processTransactionData(transaction, dataType, value);
      });
    });

    $scope.setActive(transaction.key);
  };

  $scope.processTransactionData = function(transaction, dataType, data) {
    switch(dataType) {
      case "logs":
        $scope.pushToMap($scope.logMap, transaction.key, data);
        break;

      case "queries":
        $scope.pushToMap($scope.queryMap, transaction.key, data);
        break;

      default:
        console.log('Data-type not supported: ' + name);
    }
  };

  $scope.pushToMap = function(map, key, data) {
    var value = map[key];
    if (typeof value === 'undefined') {
      if (angular.isArray(data)) {
        map[key] = data;
      } else {
        map[key] = [data];
      }
    } else {
      value.push(data)
    }
  };
}
