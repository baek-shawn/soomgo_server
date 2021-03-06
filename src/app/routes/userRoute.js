module.exports = function(app){
    const user = require('../controllers/userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/sign-up',user.signUp);
    app.post('/sign-in',user.signIn);
    app.get('/my-page',jwtMiddleware,user.myPage);
    app.get('/user',jwtMiddleware,user.userInfo);
    app.patch('/user',jwtMiddleware,user.userInfoPatch)
    
    
};