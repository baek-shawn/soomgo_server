module.exports = function(app){
    const order = require('../controllers/requestController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.post('/request',jwtMiddleware, order.requestInfo);
    app.get('/gosu-search/:categoryIdx', jwtMiddleware,order.gosuSearch);
    app.get('/recived-list',jwtMiddleware,order.recivedList);
    app.get('/recived-info/:categoryIdx',jwtMiddleware,order.recivedListInfo);
    app.delete('/recived-info/:categoryIdx',jwtMiddleware,order.deleteListInfo);
    
    
};