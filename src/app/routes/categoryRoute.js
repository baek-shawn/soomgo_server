module.exports = function(app){
    const category = require('../controllers/categoryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.get('/categories',category.categoryList);
    app.get('/category/:idx',category.categoryInfo);
    app.get('/home-category',category.homeCategory);
    app.get('/question/:categoryIdx',category.categoryQuestion);
};