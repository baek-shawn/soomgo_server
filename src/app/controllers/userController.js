const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');

let reg_pwd = /^.*(?=.{8,100})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;


//1.회원가입 -이메일
exports.signUp = async function (req, res) {
    const {type} = req.query;
    const {
        name, email, password, repassword
    } = req.body;
    
    if (!name) return res.json({isSuccess: false, code: 2000, message: "이름을 입력해주세요."});
    if (!email) return res.json({isSuccess: false, code: 2001, message: "이메일을 입력해주세요."});
    

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 2002, message: "옳바른 이메일 형식을 입력해주세요"});

    if (!password) return res.json({isSuccess: false, code: 2003, message: "비밀번호 형식이 잘못되었습니다. 영문 + 숫자 조합 8자리 이상 입력해주세요."});
    if (!reg_pwd.test(password)) return res.json({
        isSuccess: false,
        code: 2004,
        message: "비밀번호 형식이 잘못되었습니다. 영문 + 숫자 조합 8자리 이상 입력해주세요."
    });
    if(password !== repassword)
    return res.json
    ({isSuccess: false, code:2005, message:"비밀번호가 일치하지 않습니다."});

    
        try {
            // 이메일 중복 확인
            const emailRows = await userDao.userEmailCheck(email);
            if (emailRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 2006,
                    message: "이미 가입하셨네요! 비밀번호를 입력해주세요."
                });
            }
            
            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            const insertUserInfoParams = [name, email, hashedPassword,type];
            
            const [insertUserRows] = await userDao.insertUserInfo(insertUserInfoParams);

            
            
         
            return res.json({
                isSuccess: true,
                code: 1000,
                message:  "회원가입 성공을 축하드립니다."
            });
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//2.로그인 -이메일
exports.signIn = async function (req, res) {
    const {type} = req.query
    const {
        email, password
    } = req.body;
    
    
    if (!email) return res.json({isSuccess: false, code: 2007, message: "이메일을 입력해주세요."});
    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 2008, message: "옳바른 이메일 형식을 입력해주세요."});

    if (!reg_pwd.test(password)) return res.json({
        isSuccess: false,
        code: 2009,
        message: "비밀번호 형식이 잘못되었습니다. 영문 + 숫자 조합 8자리 이상 입력해주세요."
    });
    
    try {

            const [loginInfo] = await userDao.loginUser(email,type);

            if (loginInfo.length<1) {
                
                return res.json({
                    isSuccess: false,
                    code: 2010,
                    message: "이메일 또는 비밀번호가 옳바르지 않습니다."
                });
            }

            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            const [loginPassword] = await userDao.checkPassword(email);
            if (loginPassword[0].password !== hashedPassword) {     //db에 hashedPassword암호 수를늘려야됨 
                
                return res.json({
                    isSuccess: false,
                    code: 2011,
                    message: "이메일 또는 비밀번호가 옳바르지 않습니다."
                });
            }

            let token = await jwt.sign({
                userIdx: loginInfo[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀 키
            {
                expiresIn: '365d',
            
            } // 유효 시간은 365일
        );

           
            return res.json({
                            result:loginInfo[0],
                            isSuccess: true,
                            jwt: token,
                            code: 1001,
                            message: loginInfo[0].userName + "님 안녕하세요"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//3. 마이 페이지
exports.myPage = async function (req, res) {
    const token = req.verifiedToken.userIdx;
   
    try {

            const [myPageInfo] = await userDao.getMyPage(token);
            

            return res.json({
                            result:myPageInfo[0],
                            isSuccess: true,
                            code: 1002,
                            message: "마이페이지 조회성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//6. 유저 정보 가져오기
exports.userInfo = async function (req, res) {
    const token = req.verifiedToken.userIdx;
   
    try {

            const [userInfo] = await userDao.getUserInfo(token);
            

            return res.json({
                            result:userInfo[0],
                            isSuccess: true,
                            code: 1006,
                            message: "유저정보 조회성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//11. 유저 정보 수정하기
exports.userInfoPatch = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    const {image,name,email,password,newPassword,newRePassword,phoneNumber} = req.body;
   
    try {
        if (image){
            
            const [imageInfo] = await userDao.updateImage(image,token);
            return res.json({
                isSuccess: true,
                code: 1014,
                message: "로딩중입니다."
            });
        }

        if (name){
            const [nameInfo] = await userDao.updateName(name,token);
            return res.json({
                isSuccess: true,
                code: 1015,
                message: "이름이 수정되었습니다."
            });
        }

        if (email){
            if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 2026, message: "올바른 이메일 형식을 입력해주세요"});
            const [emailInfo] = await userDao.updateEmail(email,token);
            return res.json({
                isSuccess: true,
                code: 1016,
                message: "이메일이 수정되었습니다."
            });
            
        }

        if (password && newPassword && newRePassword){
            
            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

            const [loginPassword] = await userDao.checkUserIndexPassword(token);

            if (loginPassword[0].password !== hashedPassword) {      //기존 비밀번호 확인
                
                return res.json({
                    isSuccess: false,
                    code: 2027,
                    message: "기존 비밀번호를 확인해주세요"
                });
            }

            if(newPassword !== newRePassword)
            return res.json
            ({isSuccess: false, code:2028, message:"비밀번호가 일치하지 않습니다."});
                

            if (!reg_pwd.test(newPassword)) return res.json({
                isSuccess: false,
                code: 2029,
                message: "비밀번호 형식이 잘못되었습니다. 영문 + 숫자 조합 8자리 이상 입력해주세요."
            });


            const newHashedPassword = await crypto.createHash('sha512').update(newPassword).digest('hex');
            const [passwordInfo] = await userDao.updatePassword(newHashedPassword,token);
            return res.json({
                isSuccess: true,
                code: 1017,
                message: "비밀번호가 수정되었습니다."
            });

            
    }

            if(phoneNumber){
                    
                const [phoneNumberInfo] = await userDao.updatePhone(phoneNumber,token);
                return res.json({
                    
                    isSuccess: true,
                    code: 1018,
                    message: "전화번호가 수정되었습니다."
            });
            }
    
       
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


