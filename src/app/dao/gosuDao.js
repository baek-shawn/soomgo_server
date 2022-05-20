const { pool } = require("../../../config/database");


//7. 고수찾기(고수리스트)
async function getGosuInfoAllFilter(gosuParams) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select gosuProfile.gosuProfileIdx, profileImage, userName, oneLineDescription
        from user inner join gosuProfile on user.userIdx = gosuProfile.userIdx inner join gosuActivityRegion 
        on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(topCategoryIdx 
        separator ' ') as topCategoryIdx from gosuSelectTopCategory group by gosuProfileIdx) as topCategory on gosuProfile.gosuProfileIdx
        = topCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(middleCategoryIdx 
        separator ' ') as middleCategoryIdx from gosuSelectMiddleCategory group by gosuProfileIdx) as middleCategory on gosuProfile.gosuProfileIdx
        = middleCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(bottomCategoryIdx 
        separator ' ') as bottomCategoryIdx from gosuSelectBottomCategory group by gosuProfileIdx) as bottomCategory on gosuProfile.gosuProfileIdx
        = bottomCategory.gosuProfileIdx where activityRegion = ? and topCategory.topCategoryIdx = ?
        and middleCategory.middleCategoryIdx = ? and bottomCategory.bottomCategoryIdx =?

                    `;
        
        const [rows] = await connection.query(
            gosuQuery,
            gosuParams
        );
        connection.release();
        
        return [rows];
    } 

async function getGosuInfoCategoryFilter(topCategory,middleCategory,bottomCategory) {

const connection = await pool.getConnection(async (conn) => conn);

    const gosuQuery = `
    select gosuProfile.gosuProfileIdx, profileImage, userName, oneLineDescription
from user inner join gosuProfile on user.userIdx = gosuProfile.userIdx inner join gosuActivityRegion 
on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(topCategoryIdx 
separator ' ') as topCategoryIdx from gosuSelectTopCategory group by gosuProfileIdx) as topCategory on gosuProfile.gosuProfileIdx
= topCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(middleCategoryIdx 
separator ' ') as middleCategoryIdx from gosuSelectMiddleCategory group by gosuProfileIdx) as middleCategory on gosuProfile.gosuProfileIdx
= middleCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(bottomCategoryIdx 
separator ' ') as bottomCategoryIdx from gosuSelectBottomCategory group by gosuProfileIdx) as bottomCategory on gosuProfile.gosuProfileIdx
= bottomCategory.gosuProfileIdx where  topCategory.topCategoryIdx = ? and middleCategory.middleCategoryIdx = ?
and bottomCategory.bottomCategoryIdx = ?
;

                `;
    const gosuParams = [topCategory,middleCategory,bottomCategory]
    const [rows] = await connection.query(
        gosuQuery,
        gosuParams
    );
    connection.release();
    
    return [rows];
} 

async function getGosuInfoRegionFilter(region) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select gosuProfile.gosuProfileIdx, profileImage, userName, oneLineDescription
    from user inner join gosuProfile on user.userIdx = gosuProfile.userIdx inner join gosuActivityRegion 
    on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(topCategoryIdx 
    separator ' ') as topCategoryIdx from gosuSelectTopCategory group by gosuProfileIdx) as topCategory on gosuProfile.gosuProfileIdx
    = topCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(middleCategoryIdx 
    separator ' ') as middleCategoryIdx from gosuSelectMiddleCategory group by gosuProfileIdx) as middleCategory on gosuProfile.gosuProfileIdx
    = middleCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(bottomCategoryIdx 
    separator ' ') as bottomCategoryIdx from gosuSelectBottomCategory group by gosuProfileIdx) as bottomCategory on gosuProfile.gosuProfileIdx
    = bottomCategory.gosuProfileIdx where activityRegion = ?
    ;
    
                    `;
        const gosuParams = [region]
        const [rows] = await connection.query(
            gosuQuery,
            gosuParams
        );
        connection.release();
        
        return [rows];
    } 

async function getGosuInfoNonFilter() {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select gosuProfile.gosuProfileIdx, profileImage, userName, oneLineDescription
    from user inner join gosuProfile on user.userIdx = gosuProfile.userIdx inner join gosuActivityRegion 
    on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(topCategoryIdx 
    separator ' ') as topCategoryIdx from gosuSelectTopCategory group by gosuProfileIdx) as topCategory on gosuProfile.gosuProfileIdx
    = topCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(middleCategoryIdx 
    separator ' ') as middleCategoryIdx from gosuSelectMiddleCategory group by gosuProfileIdx) as middleCategory on gosuProfile.gosuProfileIdx
    = middleCategory.gosuProfileIdx inner join (select gosuProfileIdx ,group_concat(bottomCategoryIdx 
    separator ' ') as bottomCategoryIdx from gosuSelectBottomCategory group by gosuProfileIdx) as bottomCategory on gosuProfile.gosuProfileIdx
    = bottomCategory.gosuProfileIdx 
    ;
    
                    `;
        
        const [rows] = await connection.query(
            gosuQuery
        );
        connection.release();
        
        return [rows];
    } 

async function checkgosuRegion(region) {

const connection = await pool.getConnection(async (conn) => conn);

    const gosuQuery = `
    select Exists(select * from gosuProfile inner join gosuActivityRegion
        on gosuProfile.gosuProfileIdx = gosuActivityRegion.gosuProfileIdx 
        where activityRegion =?) as exist
    
;

                `;
    
    const [rows] = await connection.query(
        gosuQuery,
        region
    );
    connection.release();
    
    return [rows];
} 

async function checkgosuCategory(topCategory,middleCategory,bottomCategory) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select Exists(select * from topCategory inner join middleCategory 
            on topCategory.topCategoryIdx = middleCategory.topCategoryIdx
            inner join bottomCategory on middleCategory.middleCategoryIdx = bottomCategory.middleCategoryIdx
            where topCategory.topCategoryIdx = ? and middleCategory.middleCategoryIdx=? 
            and bottomCategoryIdx = ?) as exist
        
    ;
    
                    `;
        
        const gosuParams = [topCategory,middleCategory,bottomCategory]
        const [rows] = await connection.query(
            gosuQuery,
            gosuParams
        );
        connection.release();
        
        return [rows];
    } 

//8. 고수프로필 가져오기
async function getGosuMoreInfo(idx) {

const connection = await pool.getConnection(async (conn) => conn);

    const gosuQuery = `
    select gosuProfile.gosuProfileIdx, profileImage, userName, mainCategory, reviewGrade,
reviewCount, oneLineDescription, authentication, activityRegion, activityRadius, contactTime,
carrer, numberOfEmployees, selectCategory, detailDescription
from user inner join gosuProfile on user.userIdx = gosuProfile.userIdx
inner join (select gosuProfileIdx, if(main='Y',bottomCategory.bottomCategoryTitle,' ') as mainCategory, 
group_concat(bottomCategoryTitle) as selectCategory from gosuSelectBottomCategory 
inner join bottomCategory on gosuSelectBottomCategory.bottomCategoryIdx = bottomCategory.bottomCategoryIdx
group by gosuProfileIdx) as selectedCategory on gosuProfile.gosuProfileIdx = selectedCategory.gosuProfileIdx
left join (select gosuIdx, round(avg(if(status='N',reviewGrade,null)),1) as reviewGrade, 
count(if(status='N',reviewIdx,null)) as reviewCount from review group by gosuIdx) as review
on gosuProfile.gosuProfileIdx = review.gosuIdx inner join gosuActivityRegion on gosuProfile.gosuProfileIdx = 
gosuActivityRegion.gosuProfileIdx where gosuProfile.gosuProfileIdx =?

    
;

                `;
    
    const gosuParams = [idx]
    const [rows] = await connection.query(
        gosuQuery,
        gosuParams
    );
    connection.release();
    
    return [rows];
} 


async function checkgosuMoreInfo(region) {

    const connection = await pool.getConnection(async (conn) => conn);
    
        const gosuQuery = `
        select Exists(select * from gosuProfile  
            where gosuProfileIdx =?) as exist
        
    ;
    
                    `;
        
        const [rows] = await connection.query(
            gosuQuery,
            region
        );
        connection.release();
        
        return [rows];
    } 
    

    
    module.exports = {
        getGosuInfoAllFilter,
        getGosuInfoCategoryFilter,
        getGosuInfoRegionFilter,
        getGosuInfoNonFilter,
        checkgosuRegion,
        checkgosuCategory,
        getGosuMoreInfo,
        checkgosuMoreInfo
        
    };