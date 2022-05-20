const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const requestDao = require('../dao/requestDao');
const { constants } = require('buffer');

//9.요청서 보내기
exports.requestInfo = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    const {
        categoryIdx,firstQuestion,firstAnswer,secondQuestion,secondAnswer,
        thirdQuestion,thirdAnswer,fourthQuestion,userRegion
    } = req.body;
    
    const params = [token,categoryIdx,firstQuestion,firstAnswer,secondQuestion,secondAnswer,thirdQuestion,thirdAnswer,fourthQuestion,userRegion];
      
        if (!categoryIdx) return res.json({isSuccess: false, code: 2023, message: "카테고리를 선택해주세요."}); 
        if (!userRegion) return res.json({isSuccess: false, code: 2024, message: "요청서를 완료해주세요."}); 
         
        
         
           
    
        try {
            
            const [categoryRows] = await requestDao.checkCategory(categoryIdx);
            
            if (!categoryRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2025,
                    message: "없는 카테고리입니다."
                });
            }

            const [firstQuestionRows] = await requestDao.checkFirstQuestion(firstQuestion,firstAnswer);
            
            if (!firstQuestionRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2032,
                    message: "질문에 대한 잘못된 값입니다."
                });
            }

            const [secondQuestionRows] = await requestDao.checkSecondQuestion(secondQuestion,secondAnswer);
            
            if (!secondQuestionRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2033,
                    message: "질문에 대한 잘못된 값입니다."
                });
            }

            const [thirdQuestionRows] = await requestDao.checkThirdQuestion(thirdQuestion,thirdAnswer);
            
            if (!thirdQuestionRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2034,
                    message: "질문에 대한 잘못된 값입니다."
                });
            }



            
        const [insertUserRows] = await requestDao.insertOrder(params);

            
            return res.json({
                isSuccess: true,
                code: 1012,
                message:  "작성하신 요청에 맞는 고수님을 찾고 있습니다."
            });
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};



//13.요청서 바탕으로 고수찾기
exports.gosuSearch = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    const {categoryIdx} = req.params;
    
    try {
        


           
            const [userGosuRows] = await requestDao.checkUserGosu(token,categoryIdx);
            
            
            if (!userGosuRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2031,
                    message: "유저가 보낸 요청서가 아닙니다."
                });
            }
            
            
            
            const [requestRows] = await requestDao.getRequest(token,categoryIdx);
            
            let requestNum = requestRows[0].requestIdx;
            
            let categoryNum = requestRows[0].categoryIdx;
            let userNum = requestRows[0].userIdx;
            let userRegion = requestRows[0].userRegion;
            let userArray = userRegion.split(" ");
            let userAddress = userArray[1]

           
            
           

            const [gosuRows] = await requestDao.searchGosu(userAddress,userNum,categoryNum);
            
            if (!gosuRows[0]){
                const [estimateNonRows] = await requestDao.insertEstimateInfo(requestNum,userNum,categoryNum,);
            }

            for (i = 0; i < gosuRows.length; i++) {
                let requestNumber = gosuRows[i].requestIdx;
                let userNumber = gosuRows[i].userIdx;
                let categoryNumber = gosuRows[i].categoryIdx;
                let gosuNumber = gosuRows[i].gosuProfileIdx
                
                
                
                const [estimateRows] = await requestDao.insertEstimateInfo(requestNumber,userNumber,categoryNumber,gosuNumber);
                    
              }


            if (!gosuRows[0]){
                return res.json({
                    
                    isSuccess: true,
                    code: 1020,
                    message:  "작성하신 요청에 맞는 고수님을 찾고 있습니다."
                });
            }

            return res.json({
                result: gosuRows,
                isSuccess: true,
                code: 1021,
                message:  gosuRows.length+"명의 고수님을 찾았습니다."
            });
            
            
        
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//14.요청서 리스트 가져오기
exports.recivedList = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    
    
    try {

        
    
            
        const [estimateRows] = await requestDao.getRecivedList(token);
                    
            

            return res.json({
                result: estimateRows,
                isSuccess: true,
                code: 1022,
                message: "견적서 리스트 불러오기 성공"
            });
            
            
        
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//15.받은 견적 상세정보
exports.recivedListInfo = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    const {categoryIdx} = req.params;
    
    
    try {
    
        const [userGosuRows] = await requestDao.checkUserGosu(token,categoryIdx);
            
            
            if (!userGosuRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2032,
                    message: "유저가 보낸 요청서가 아닙니다."
                });
            }
            
        const [estimateRows] = await requestDao.getRecivedListInfo(token,categoryIdx);
                    
            

            return res.json({
                result: estimateRows,
                isSuccess: true,
                code: 1023,
                message: "견적서 상세정보 불러오기 성공"
            });
            
            
        
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//16.받은 견적 취소하기
exports.deleteListInfo = async function (req, res) {
    const token = req.verifiedToken.userIdx;
    const {categoryIdx} = req.params;
    
    
    try {
    
        const [userGosuRows] = await requestDao.checkUserGosu(token,categoryIdx);
            
            
            if (!userGosuRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2033,
                    message: "유저가 보낸 요청서가 아닙니다."
                });
            }
            
        const [estimateRows] = await requestDao.deleteRecivedListInfo(token,categoryIdx);
                    
            

            return res.json({
                
                isSuccess: true,
                code: 1024,
                message: "요청을 취소했습니다."
            });
            
            
        
        } catch (err) {
           
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};



