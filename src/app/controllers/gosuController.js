const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const gosuDao = require('../dao/gosuDao');
const { constants } = require('buffer');

//7. 고수찾기(고수찾기 리스트)
exports.gosuList = async function (req, res) {
    const {region,topCategory,middleCategory,bottomCategory} = req.body;
    const gosuParams=[region,topCategory,middleCategory,bottomCategory]
    
    try {
        if(region){
        const [gosuRegionRows] = await gosuDao.checkgosuRegion(region);
        
            if (!gosuRegionRows[0].exist ) {

                return res.json({
                    isSuccess: false,
                    code: 2019,
                    message: "잘못된 지역 선택입니다."
                });
            }
        }

        if(topCategory&&middleCategory&&bottomCategory) {
        const [gosuCategoryRows] = await gosuDao.checkgosuCategory(topCategory,middleCategory,bottomCategory);
    
        if (!gosuCategoryRows[0].exist) {

            return res.json({
                isSuccess: false,
                code: 2020,
                message: "잘못된 카테고리 선택입니다."
            });
        }
    }
        
        const [gosuInfoCategoryFilter] = await gosuDao.getGosuInfoCategoryFilter(topCategory,middleCategory,bottomCategory);
         if(!region && topCategory){
            return res.json({
                result:gosuInfoCategoryFilter,
                isSuccess: true,
                code: 1007,
                message: "고수 리스트 카테고리 필터 조회성공"
            });

         }   
        
         const [gosuInfoRegionFilter] = await gosuDao.getGosuInfoRegionFilter(region);
         if(!topCategory && region){
            return res.json({
                result:gosuInfoRegionFilter,
                isSuccess: true,
                code: 1008,
                message: "고수 리스트 리전 필터 조회성공"
            });

         }   
        
         const [gosuInfoNonFilter] = await gosuDao.getGosuInfoNonFilter();
        
         if(!topCategory && !region && !middleCategory && !bottomCategory){
            return res.json({
                result:gosuInfoNonFilter,
                isSuccess: true,
                code: 1009,
                message: "고수 리스트 논 필터 조회성공"
            });

         }   
        
        const [gosuInfoAllFilter] = await gosuDao.getGosuInfoAllFilter(gosuParams);
            
            

            return res.json({
                            result:gosuInfoAllFilter,
                            isSuccess: true,
                            code: 1010,
                            message: "고수 리스트 조회성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

//8. 고수프로필 가져오기
exports.gosuInfo = async function (req, res) {
    const {idx} = req.params;
    console.log(idx);
    
    
    try {
        const [gosuInfoRows] = await gosuDao.checkgosuMoreInfo(idx);
    
        if (!gosuInfoRows[0].exist) {

            return res.json({
                isSuccess: false,
                code: 2021,
                message: "존재하지 않는 고수 프로필입니다."
            });
        }
        
        
        
        const [gosuMoreInfo] = await gosuDao.getGosuMoreInfo(idx);
            
            

            return res.json({
                            result:gosuMoreInfo[0],
                            isSuccess: true,
                            code: 1011,
                            message: "고수 정보 조회성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};
