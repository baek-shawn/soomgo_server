module.exports = function(app){
    const gosu = require('../controllers/gosuController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.get('/gosu-list',gosu.gosuList);
    app.get('/gosu-profile/:idx',gosu.gosuInfo);
    
};