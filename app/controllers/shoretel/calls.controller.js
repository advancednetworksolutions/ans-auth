var mysqldb = require('../../../config/mysqldb');




exports.show = function(req, res) {
  var grouping = '';
  var query = null;
  var g = req.query.grouping;
  var f = req.query.filter;

  switch (g) {
    case 'day':
      grouping = 'DATE(shorewarecdr.queueCall.StartTime)';
      break;
    case 'week':
      grouping = 'WEEKOFYEAR(DATE(shorewarecdr.queueCall.StartTime))';
      break;
    case 'month':
      grouping = 'MONTH(DATE(shorewarecdr.queueCall.StartTime))';
      break;
    case 'quarter':
      grouping = 'QUARTER(DATE(shorewarecdr.queueCall.StartTime))';
      break;
    default:
      grouping = 'DATE(shorewarecdr.queueCall.StartTime)';
      break;
  }

  if (req.query.avg === 'true') {
    if (req.query.filter) {
      switch (f) {
        case 'today':
          query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (Extension = 405 OR Extension = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
          break;
        case 'yesterday':
          query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (Extension = 405 OR Extension = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() -1 group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
          break;
        case 'this week':
          query = 'SELECT hour,AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND WEEKOFYEAR(DATE(shorewarecdr.queueCall.StartTime))=WEEKOFYEAR(NOW()) group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ') temp GROUP BY hour';
          break;
        case 'this month':
          query = 'SELECT hour,AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,'+grouping+' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND MONTH(DATE(shorewarecdr.queueCall.StartTime))=MONTH(NOW()) group by HOUR(shorewarecdr.queueCall.StartTime),'+grouping+') temp GROUP BY hour';
          break;
        case 'this quarter':
          query = 'SELECT hour,AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,'+grouping+' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND QUARTER(DATE(shorewarecdr.queueCall.StartTime))=QUARTER(CURDATE()) group by HOUR(shorewarecdr.queueCall.StartTime),'+grouping+') temp GROUP BY hour';
          break;
        case 'last quarter':
          query = 'SELECT hour,AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,'+grouping+' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND QUARTER(DATE(shorewarecdr.queueCall.StartTime))=QUARTER(CURDATE()) -1 group by HOUR(shorewarecdr.queueCall.StartTime),'+grouping+') temp GROUP BY hour';
          break;
        case 'last month':
          query = 'SELECT hour, AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour, COUNT(*) as calls,'+grouping+' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND MONTH(DATE(shorewarecdr.queueCall.StartTime))=MONTH(NOW())-1 group by HOUR(shorewarecdr.queueCall.StartTime),'+grouping+') temp GROUP BY hour';
          break;
        case 'last week':
          query = 'SELECT hour,AVG(calls) as calls FROM(SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,'+grouping+' as grouping FROM shorewarecdr.queueCall WHERE TargetType = 1 AND (QueueDN = 405 OR QueueDN = 505) AND WEEKOFYEAR(DATE(shorewarecdr.queueCall.StartTime))=WEEKOFYEAR(NOW()) -1 group by HOUR(shorewarecdr.queueCall.StartTime),'+grouping+') temp GROUP BY hour';
          break;
        default:
          query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
          break;
      }
    }
  } else {
    switch (f) {
      case 'today':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE (QueueDN = 405 OR QueueDN = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'yesterday':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE (QueueDN = 405 OR QueueDN = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() -1 group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'this week':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND WEEKOFYEAR(DATE(shorewarecdr.queueCall.StartTime))=WEEKOFYEAR(NOW()) group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'this month':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND MONTH(DATE(shorewarecdr.queueCall.StartTime))=MONTH(curdate()) group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'this quarter':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND QUARTER(DATE(shorewarecdr.queueCall.StartTime))=QUARTER(curdate()) group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'last week':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND WEEKOFYEAR(DATE(shorewarecdr.queueCall.StartTime))=WEEKOFYEAR(NOW()) -1 group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'last month':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND MONTH(DATE(shorewarecdr.queueCall.StartTime))=MONTH(curdate())-1 group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      case 'last quarter':
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND QUARTER(DATE(shorewarecdr.queueCall.StartTime))=QUARTER(curdate())-1 group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
      default:
        query = 'SELECT HOUR(shorewarecdr.queueCall.StartTime) as hour,COUNT(*) as calls,' + grouping + ' as grouping FROM shorewarecdr.queueCall WHERE  (QueueDN = 405 OR QueueDN = 505)  AND DATE(shorewarecdr.queueCall.StartTime) = curdate() group by HOUR(shorewarecdr.queueCall.StartTime),' + grouping + ';';
        break;
    }
  }
  if (query) {
    mysqldb.query(query,
      function(err, rows, fields) {
        if (err) res.status(500).json({
          success: false,
          message: err
        });
        if (rows) res.status(200).json(rows);
      });
  } else {
    res.status(204).json({
      success: false,
      message: 'No filter or grouping set'
    });
  }

}
