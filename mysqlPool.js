const mysql = require("mysql");
const sqlConfig = require("./mysqlConfig");
const pool = mysql.createPool(sqlConfig);

const execute = (sqlString, func) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Mysql 数据库建立连接失败！", err);
            return;
        }
        connection.query(sqlString, (error, result) => {
            connection.release(); // 释放连接，此代码非常关键，缺失会造成MySQL连接池直接卡死
            if (error) {
                console.log("操作数据库失败！", error)
                return;
            }
            func(result);
        });
    });
};


module.exports = execute;


