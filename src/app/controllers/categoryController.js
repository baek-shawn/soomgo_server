const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const categoryDao = require('../dao/categoryDao');
const { constants } = require('buffer');


//4. 카테고리 기준에 따라 분류하고 하위 카테고리 리스트 가져오기
exports.categoryList = async function (req, res) {
    const {upper,lower} = req.query;

    if(!upper) return res.json({isSuccess: false, code: 2014, message: "카테고리를 선택해주세요."});
    if(!lower) return res.json({isSuccess: false, code: 2015, message: "카테고리를 선택해주세요."});
   
    try {

        const categoryRows = await categoryDao.checkCategory(upper,lower);
        
            if (!categoryRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2016,
                    message: "없는 카테고리입니다."
                });
            }


        const [popularCategory] = await categoryDao.getPopCategoryList(upper,lower);
        if (lower == 1) {

            return res.json({
                result:popularCategory,
                isSuccess: true,
                code: 1003,
                message: "인기 카테고리 리스트 조회 성공"
            });
        }
        
        
        
        
        
            const [category] = await categoryDao.getCategoryList(upper,lower);
            

            return res.json({
                            result:category,
                            isSuccess: true,
                            code: 1004,
                            message: "카테고리 리스트 조회 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//5. 특정 카테고리 가져오기
exports.categoryInfo = async function (req, res) {
    const {idx} = req.params;

    if(!idx) return res.json({isSuccess: false, code: 2017, message: "카테고리를 선택해주세요."});
    
   
    try {

        const categoryRows = await categoryDao.checkCategoryInfo(idx);
        
            if (!categoryRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2018,
                    message: "없는 카테고리입니다."
                });
            }

        
        const [category] = await categoryDao.getCategoryInfo(idx);
            

            return res.json({
                            result:category,
                            isSuccess: true,
                            code: 1005,
                            message: "카테고리 정보조회 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//10. 홈 카테고리 가져오기
exports.homeCategory = async function (req, res) {
    
try {

       const [category] = await categoryDao.getHomeCategory();
            

            return res.json({
                            result:category,
                            isSuccess: true,
                            code: 1013,
                            message: "홈 카테고리 조회 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};


//12. 카테고리 요청서 질문,보기가져오기
exports.categoryQuestion = async function (req, res) {
    const {categoryIdx} = req.params;

    if(!categoryIdx) return res.json({isSuccess: false, code: 2017, message: "카테고리를 선택해주세요."});
    
   
    try {

        const categoryRows = await categoryDao.checkCategoryInfo(categoryIdx);
        
            if (!categoryRows[0].exist) {

                return res.json({
                    isSuccess: false,
                    code: 2030,
                    message: "없는 카테고리입니다."
                });
            }

        
        const [category] = await categoryDao.getCategoryQuestion(categoryIdx);
            

            return res.json({
                            result:category,
                            isSuccess: true,
                            code: 1019,
                            message: "요청서 질문 불러오기 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};