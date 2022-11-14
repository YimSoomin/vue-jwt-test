const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    username: String,
    password: String,
    admin: {
        type: Boolean,
        default: false
    }
})


// create 메소드는 새 유저를 생성합니다.원래는 이 메소드처럼 비밀번호를 
// 그대로 문자열 형태로 저장하면 보안적으로 매우 나쁩니다.일단 지금은 배우는 과정이니 간단하게 문자열로 저장을 하지만,
// 포스트의 후반부에서는 비밀번호를 해쉬하여 저장하도록 하겠습니다

// create new User document
User.statics.create = function (username, password) {

    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')


    const user = new this({
        username,
        password: encrypted
    })

    // return the Promise
    return user.save()
}


// findOneByUsername 메소드는 username 값을 사용하여 유저를 찾습니다

// find one user by using username
User.statics.findOneByUsername = function (username) {
    return this.findOne({
        username
    }).exec()
}


// verify 메소드는 비밀번호가 정확한지 확인을 합니다.지금은 그냥 === 를 사용해서 비교 후 결과를 반환하지만
//  포스트 후반부에서는 해쉬를 확인하여 결과를 반환하겠습니다


// verify the password of the User documment
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    return this.password === encrypted
}


// assignAdmin 메소드는 유저를 관리자 계정으로 설정해줍니다.저희 예제 프로젝트에서는,
// 가장 처음으로 가입한 사람과, 관리자가 나중에 API 를 사용하여 지정한사람이 관리자 권한을 부여 받습니다.
User.methods.assignAdmin = function () {
    this.admin = true
    return this.save()
}


module.exports = mongoose.model('User', User)

app.post('/auth/login', (req, res) => {
    // 로그인 인증
    User.user_id = req.body.id;
    User.user_pwd = req.body.pwd;
    let jwt_secret = 'DinnerKang';
    console.log(req.body.id);
    if (User.user_id) {
        connection.query(`SELECT user_pwd, user_role FROM user WHERE user_id = "${User.user_id}"`, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            console.log(results);

            const hash = crypto.createHmac('sha256', secret)
                .update(req.body.pwd)
                .digest('base64');
            User.user_role = results[0].user_role;
            if (hash == results[0].user_pwd) {
                const getToken = new Promise((resolve, reject) => {
                    jwt.sign({
                            id: User.user_id,
                            role: User.user_role
                        },
                        jwt_secret, {
                            expiresIn: '7d',
                            issuer: 'Dinner',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                });

                getToken.then(
                    token => {
                        res.status(200).json({
                            'status': 200,
                            'msg': 'login success',
                            token
                        });
                    }
                );
            } else {
                res.status(400).json({
                    'status': 400,
                    'msg': 'password 가 틀림'
                });
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'msg': 'id값이 없음'
        });
    }
});