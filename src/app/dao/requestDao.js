const { pool } = require("../../../config/database");
//9. 요청서 보내기
async function insertOrder(params) {

    try {
      const connection = await pool.getConnection(async (conn) => conn);
      
        try {
            await connection.beginTransaction();
    
    const insertRequestInfoQuery = `
    INSERT INTO request (userIdx, categoryIdx,firstQuestionIdx,firstAnswerIdx,secondQuestionIdx,secondAnswerIdx,
        thirdQuestionIdx,thirdAnswerIdx,fourthQuestionIdx,userRegion)
    VALUES (?,?,?,?,?,?,?,?,?,?);
      `;
    const [insertRequestInfoRow] = await connection.query(
      insertRequestInfoQuery,
      params
    );
    connection.release();
    await connection.commit();
    
    return [insertRequestInfoRow];
  }  catch(err) {
    await connection.rollback(); // ROLLBACK
    connection.release();
    logger.error(`example transaction Query error\n: ${JSON.stringify(err)}`);
    return false;
  }

} catch(err) {
logger.error(`example transaction DB Connection error\n: ${JSON.stringify(err)}`);
return false;
}
}

async function checkCategory(categoryIdx) {

        const connection = await pool.getConnection(async (conn) => conn);
        
            const categoryQuery = `
            select Exists(select * from bottomCategory where bottomCategoryIdx = ?) as exist
                        `;
            const categoryParams = [categoryIdx];
            const [rows] = await connection.query(
                categoryQuery,
                categoryParams
            );
            connection.release();
          
            return [rows];
        } 


async function checkFirstQuestion(firstQuestion,firstAnswer) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const categoryQuery = `
      select Exists(select * from requestQuestion inner join requestChoice on 
        requestQuestion.questionIdx = requestChoice.questionIdx where requestQuestion.questionIdx = ? 
        and choiceIdx = ?) as exist;
                  `;
      const categoryParams = [firstQuestion,firstAnswer];
      const [rows] = await connection.query(
          categoryQuery,
          categoryParams
      );
      connection.release();
    
      return [rows];
  } 


async function checkSecondQuestion(secondQuestion,secondAnswer) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const categoryQuery = `
      select Exists(select * from requestQuestion inner join requestChoice on 
        requestQuestion.questionIdx = requestChoice.questionIdx where requestQuestion.questionIdx = ? 
        and choiceIdx = ?) as exist;
                  `;
      const categoryParams = [secondQuestion,secondAnswer];
      const [rows] = await connection.query(
          categoryQuery,
          categoryParams
      );
      connection.release();
    
      return [rows];
  } 

async function checkThirdQuestion(thirdQuestion,thirdAnswer) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const categoryQuery = `
      select Exists(select * from requestQuestion inner join requestChoice on 
        requestQuestion.questionIdx = requestChoice.questionIdx where requestQuestion.questionIdx = ? 
        and choiceIdx = ?) as exist;
                  `;
      const categoryParams = [thirdQuestion,thirdAnswer];
      const [rows] = await connection.query(
          categoryQuery,
          categoryParams
      );
      connection.release();
    
      return [rows];
  } 


//13.요청서 바탕으로 고수찾기
async function getRequest(token,requestIdx) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const gosuQuery = `
      select * from request where userIdx = ? and categoryIdx = ?;
  
                  `;
      
      const gosuParams = [token,requestIdx]
      const [rows] = await connection.query(
          gosuQuery,
          gosuParams
      );
      connection.release();
      
      return [rows];
  } 


async function searchGosu(userAddress,userNum,categoryNum) {

const connection = await pool.getConnection(async (conn) => conn);

const requestQuery = `

select requestIdx ,request.userIdx, request.categoryIdx, gosuProfile.gosuProfileIdx, profileImage from request 
inner join gosuSelectBottomCategory on request.categoryIdx = gosuSelectBottomCategory.bottomCategoryIdx inner join gosuProfile
on gosuProfile.gosuProfileIdx = gosuSelectBottomCategory.gosuProfileIdx inner join bottomCategory
on gosuSelectBottomCategory.bottomCategoryIdx = bottomCategory.bottomCategoryIdx inner join gosuActivityRegion
on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx inner join user on gosuProfile.userIdx = user.userIdx
where request.userIdx =? and request.categoryIdx = ? and activityRegion LIKE '%${userAddress}%' and request.status = 'N' ;
            `;
const requestParams = [userNum,categoryNum];
const [rows] = await connection.query(
  requestQuery,
  requestParams
);
connection.release();

return [rows];
} 


async function checkUserGosu(token,categoryIdx) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const requestQuery = `
      select Exists(select * from request where userIdx = ? and categoryIdx =?) as exist;
                  `;
      const requestParams = [token,categoryIdx];
      const [rows] = await connection.query(
        requestQuery,
        requestParams
      );
      connection.release();
    
      return [rows];
  }


async function insertEstimateInfo(requestNumber,userNumber,categoryNumber,gosuNumber) {

const connection = await pool.getConnection(async (conn) => conn);

    const requestQuery = `
    INSERT INTO estimate (requestIdx, userIdx, categoryIdx, gosuProfileIdx)
VALUES (?,?,?,?);
                `;
    const requestParams = [requestNumber,userNumber,categoryNumber,gosuNumber];
    const [rows] = await connection.query(
        requestQuery,
        requestParams
    );
    connection.release();
    
    return [rows];
}


//14.요청서 리스트 가져오기
async function getRecivedList(token) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select estimateIdx, estimate.requestIdx ,DATE_FORMAT(estimate.createAt,'%Y-%m-%d') as dateTime, 
bottomCategoryTitle, profileImage  
from estimate inner join bottomCategory on estimate.categoryIdx = bottomCategory.bottomCategoryIdx
left join gosuProfile on estimate.gosuProfileIdx = gosuProfile.gosuProfileIdx inner join user on
gosuProfile.userIdx = user.userIdx where estimate.userIdx = ? ;
    
                    `;
        
        const gosuParams = [token]
        const [rows] = await connection.query(
            gosuQuery,
            gosuParams
        );
        connection.release();
        
        return [rows];
    } 

   //15.받은 견적 상세정보
async function getRecivedListInfo(token,categoryIdx) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const gosuQuery = `
      select estimateIdx, estimate.requestIdx,estimate.categoryIdx , gosuProfile.gosuProfileIdx,
 DATE_FORMAT(estimate.createAt,'%Y-%m-%d') as dateTime, bottomCategoryTitle, profileImage, user.userName,
 grade, reviewCount, categoryImage, pay
from estimate inner join bottomCategory on estimate.categoryIdx = bottomCategory.bottomCategoryIdx
left join gosuProfile on estimate.gosuProfileIdx = gosuProfile.gosuProfileIdx inner join user on
gosuProfile.userIdx = user.userIdx left join (select gosuIdx,categoryIdx,count(reviewIdx) as reviewCount, 
round(avg(reviewGrade),1) as grade from review group by gosuIdx) as reviewInfo on gosuProfile.gosuProfileIdx
= reviewInfo.gosuIdx inner join categoryInfo on bottomCategory.bottomCategoryIdx = categoryInfo.categoryIdx
where estimate.userIdx = ? and estimate.categoryIdx = ?;
  
                  `;
      
      const gosuParams = [token,categoryIdx]
      const [rows] = await connection.query(
          gosuQuery,
          gosuParams
      );
      connection.release();
      
      return [rows];
  } 


  //16.받은 견적 취소하기
async function deleteRecivedListInfo(token,categoryIdx) {

  const connection = await pool.getConnection(async (conn) => conn);
  
      const gosuQuery = `
      UPDATE request SET status ='Y' where userIdx = ? and categoryIdx = ? ;
  
                  `;
      
      const gosuParams = [token,categoryIdx]
      const [rows] = await connection.query(
          gosuQuery,
          gosuParams
      );
      connection.release();
      
      return [rows];
  } 
 
 


 

  

  module.exports = {
    insertOrder,
    checkCategory,
    getRequest,
    searchGosu,
    checkUserGosu,
    checkFirstQuestion,
    checkSecondQuestion,
    checkThirdQuestion,
    insertEstimateInfo,
    getRecivedList,
    getRecivedListInfo,
    deleteRecivedListInfo
    
    
    
};