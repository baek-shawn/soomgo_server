const { pool } = require("../../../config/database");

//4. 카테고리 기준에 따라 분류하고 하위 카테고리 리스트 가져오기

async function getCategoryList(upper,lower) {
    
      const connection = await pool.getConnection(async (conn) => conn);
      
        const categoryQuery = `
        select bottomCategoryIdx,bottomCategoryTitle from topCategory inner join middleCategory on 
topCategory.topCategoryIdx = middleCategory.topCategoryIdx
inner join bottomCategory on middleCategory.middleCategoryIdx = bottomCategory.middleCategoryIdx
where topCategory.topCategoryIdx =? and middleCategory.middleCategoryIdx=? ;
                      `;
        const categoryParams = [upper,lower];
        const [rows] = await connection.query(
            categoryQuery,
            categoryParams
        );
        connection.release();
        await connection.commit();
        return [rows];
      } 

async function getPopCategoryList(upper,lower) {

const connection = await pool.getConnection(async (conn) => conn);

    const categoryQuery = `
    select bottomCategoryIdx,bottomCategoryTitle,popularImage from topCategory inner join middleCategory on 
topCategory.topCategoryIdx = middleCategory.topCategoryIdx
inner join categoryInfo on middleCategory.middleCategoryIdx = categoryInfo.popularIdx
inner join bottomCategory on categoryInfo.categoryIdx = bottomCategory.bottomCategoryIdx
where topCategory.topCategoryIdx =? and middleCategory.middleCategoryIdx=? ;
                `;
    const categoryParams = [upper,lower];
    const [rows] = await connection.query(
        categoryQuery,
        categoryParams
    );
    connection.release();
    await connection.commit();
    return [rows];
} 


async function checkCategory(upper,lower) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const categoryQuery = `
        select Exists(select * from topCategory inner join middleCategory 
            on topCategory.topCategoryIdx = middleCategory.topCategoryIdx
            where topCategory.topCategoryIdx = ? and middleCategory.middleCategoryIdx=?) as exist
                    `;
        const categoryParams = [upper,lower];
        const [rows] = await connection.query(
            categoryQuery,
            categoryParams
        );
        connection.release();
      
        return rows;
    }


//5. 특정 카테고리 가져오기
async function getCategoryInfo(idx) {

const connection = await pool.getConnection(async (conn) => conn);

const categoryQuery = `
select bottomCategory.bottomCategoryIdx,bottomCategoryTitle, grade, activityGosu, requestQuantity, reviewCount, categoryDescription 
, categoryImage from bottomCategory inner join categoryInfo 
on bottomCategory.bottomCategoryIdx = categoryInfo.categoryIdx
left join (select categoryIdx,count(reviewIdx) as reviewCount, round(avg(reviewGrade),1) as grade
from review group by categoryIdx) as reviewInfo on bottomCategory.bottomCategoryIdx = reviewInfo.categoryIdx
left join (select bottomCategoryIdx, count(bottomCategoryIdx) as activityGosu from gosuSelectBottomCategory
group by bottomCategoryIdx) as gosuInfo on bottomCategory.bottomCategoryIdx = gosuInfo.bottomCategoryIdx
left join (select categoryIdx, count(categoryIdx) as requestQuantity from request group by categoryIdx)
as requestInfo on bottomCategory.bottomCategoryIdx = requestInfo.categoryIdx
where bottomCategory.bottomCategoryIdx =?

                    `;
const categoryParams = [idx];
const [rows] = await connection.query(
    categoryQuery,
    categoryParams
);
connection.release();

return rows;
} 

async function checkCategoryInfo(idx) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const categoryQuery = `
        select Exists(select * from categoryInfo where categoryIdx =?) as exist
                    `;
        const categoryParams = [idx];
        const [rows] = await connection.query(
            categoryQuery,
            categoryParams
        );
        connection.release();
      
        return rows;
    } 


//10. 홈 카테고리 가져오기

async function getHomeCategory() {
    
    const connection = await pool.getConnection(async (conn) => conn);
    
      const categoryQuery = `
      select topCategoryIdx, topCategoryTitle from topCategory
                    `;
      
      const [rows] = await connection.query(
          categoryQuery,
          
      );
      connection.release();
      await connection.commit();
      return [rows];
    } 


//12. 카테고리 요청서 질문,보기가져오기

async function getCategoryQuestion(categoryIdx) {
    
    const connection = await pool.getConnection(async (conn) => conn);
    
      const categoryQuery = `
      select requestQuestion.questionIdx,question,choiceIdx,choice 
from requestQuestion left join requestChoice 
on requestQuestion.questionIdx = requestChoice.questionIdx where requestQuestion.categoryIdx = ? ;
                    `;
      
      const [rows] = await connection.query(
          categoryQuery,
          categoryIdx
          
      );
      connection.release();
      await connection.commit();
      return [rows];
    } 
  




module.exports = {
    
    getCategoryList,
    getPopCategoryList,
    checkCategory,
    getCategoryInfo,
    checkCategoryInfo,
    getHomeCategory,
    getCategoryQuestion
    
};