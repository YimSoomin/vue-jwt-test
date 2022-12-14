const jwt = require('jsonwebtoken');
//...
module.exports = {
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            /**
             * 다음과 같은 형태로 특정 에러에 대해서 핸들링해줄 수 있다. 
             if (e.name === 'TokenExpiredError') {
                return null
             }
             *
             */
            return null 
        }, 
    }
}