const { pool } = require("../../../config/database");


//1.회원가입 - 이메일
async function userEmailCheck(email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    
      try {
          await connection.beginTransaction();
      
      const selectEmailQuery = `
      select userIdx, email from user where email =?;
                    `;
      const selectEmailParams = [email];
      const [emailRows] = await connection.query(
        selectEmailQuery,
        selectEmailParams
      );
      connection.release();
      await connection.commit();
      return emailRows;
    } catch(err) {
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

  async function insertUserInfo(insertUserInfoParams) {

    try {
      const connection = await pool.getConnection(async (conn) => conn);
      
        try {
            await connection.beginTransaction();
    
    const insertUserInfoQuery = `
    INSERT INTO user (userName, email, password, socialUser)
    VALUES (?,?,?,?);
      `;
    const [insertUserInfoRow] = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
    );
    connection.release();
    await connection.commit();
    
    return [insertUserInfoRow];
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

//2.로그인 - 이메일

async function loginUser(email,type) {
  try {
  const connection = await pool.getConnection(async (conn) => conn);
  
        try {
          
          await connection.beginTransaction();
          const loginQuery = `SELECT userIdx ,userName, email,profileImage
          FROM user where email = ? and socialUser= ? `;
          let loginParam = [email,type]
          const [rows] = await connection.query(
            loginQuery,
            loginParam)
          await connection.commit();
          connection.release();
          return [rows];
        } catch(err) {
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


async function checkPassword(email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        await connection.beginTransaction();
        const loginQuery = `SELECT password 
        FROM user where email = ? `;
  
        let loginParam = [email]
        const [rows] = await connection.query(
          loginQuery,
          loginParam)
        connection.release();
        await connection.commit();

        return [rows];
        }catch(err) {
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



//3.마이페이지 조회

async function getMyPage(token) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        await connection.beginTransaction();
        const myPageQuery = `SELECT profileImage, userName, email 
        FROM user where userIdx = ? `;
  
        let myPageParam = [token]
        const [rows] = await connection.query(
          myPageQuery,
          myPageParam)
        connection.release();
        await connection.commit();

        return [rows];
        }catch(err) {
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

//6. 유저정보 가져오기
async function getUserInfo(token) {

const connection = await pool.getConnection(async (conn) => conn);

    const userQuery = `
    select userIdx, profileImage, userName, email, phoneNumber from user where userIdx =?;
                `;
    const userParams = [token];
    const [rows] = await connection.query(
        userQuery,
        userParams
    );
    connection.release();
    await connection.commit();
    return [rows];
} 


//11. 유저 정보 수정하기

async function updateImage(image,token) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      
      try {
          await connection.beginTransaction();
    
            const userQuery = `
            update user set profileImage = ? WHERE userIdx = ?;
            `;
            let userParams =[image,token]
            const orderInfoRow = await connection.query(
            userQuery,
            userParams
            );
            connection.release();
            await connection.commit();
            return orderInfoRow;
        } catch(err) {
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

async function updateName(name,token) {
try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        await connection.beginTransaction();

        const userQuery = `
        update user set userName = ? WHERE userIdx = ?;
        `;
        let userParams =[name,token]
        const orderInfoRow = await connection.query(
        userQuery,
        userParams
        );
        connection.release();
        await connection.commit();
        return orderInfoRow;
    } catch(err) {
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

async function updateEmail(email,token) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        try {
            await connection.beginTransaction();
    
            const userQuery = `
            update user set email = ? WHERE userIdx = ?;
            `;
            let userParams =[email,token]
            const orderInfoRow = await connection.query(
            userQuery,
            userParams
            );
            connection.release();
            await connection.commit();
            return orderInfoRow;
        } catch(err) {
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

async function checkUserIndexPassword(token) {
try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        await connection.beginTransaction();

        const userQuery = `
        SELECT password 
          FROM user where userIdx = ?;
        `;
        let userParams =[token]
        const orderInfoRow = await connection.query(
        userQuery,
        userParams
        );
        connection.release();
        await connection.commit();
        return orderInfoRow;
    } catch(err) {
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

async function updatePassword(newHashedPassword,token) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        try {
            await connection.beginTransaction();
    
            const userQuery = `
            update user set password = ? WHERE userIdx = ?;
            `;
            let userParams =[newHashedPassword,token]
            const orderInfoRow = await connection.query(
            userQuery,
            userParams
            );
            connection.release();
            await connection.commit();
            return orderInfoRow;
        } catch(err) {
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

async function updatePhone(phoneNumber,token) {
try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        await connection.beginTransaction();

        const userQuery = `
        update user set phoneNumber = ? WHERE userIdx = ?;
        `;
        let userParams =[phoneNumber,token]
        const orderInfoRow = await connection.query(
        userQuery,
        userParams
        );
        connection.release();
        await connection.commit();
        return orderInfoRow;
    } catch(err) {
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




module.exports = {
    userEmailCheck,
    insertUserInfo,
    loginUser,
    checkPassword,
    getMyPage,
    getUserInfo,
    updateImage,
    updateName,
    updateEmail,
    checkUserIndexPassword,
    updatePassword,
    updatePhone
    
    
    
};