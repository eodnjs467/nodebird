// const {DataTypes} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {     // MySQL 에는 users 테이블 생성됨.
        email: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',     // 한글 저장
    });
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'});
    };
    return User;
}
