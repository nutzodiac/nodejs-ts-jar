const bcryptjs = require('bcryptjs');
const models = require('../models/index');

exports.index = async (req, res, next) => {
    const users = await models.User.findAll({
        attributes: { exclude: ['password'] },
        include: [
            {
                model: models.Blog,
                as: 'blogs',
                attributes: ['id', 'title']
            }
        ], 
        order: [['id', 'desc'], ['blogs', 'id', 'desc']]
    });

    res.status(200).json({
        data: users,
    });
}

exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            const error = new Error('ไม่พบผู้ใช้นี้ในระบบ');
            // error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        return res.status(404).json({
            error: {
                message: error.message
            }
        });
    }
}

exports.insert = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //check duplicate email
        const existEmail = await models.User.findOne({ where: { email: email } });

        if (existEmail) {
            const error = new Error('มีผู้ใช้นี้ในระบบแล้ว กรุณาใช้อีเมล์ใหม่');
            // error.statusCode = 404;
            throw error;
        }

        //hash password
        const salt = await bcryptjs.genSalt(8);
        const passwordHash = await bcryptjs.hash(password, salt);

        //insert
        const user = await models.User.create({
            name: name,
            email: email,
            password: passwordHash
        });

        return res.status(201).json({
            message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
            data: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(404).json({
            error: {
                message: error.message
            }
        });
    }
}

exports.update = async (req, res, next) => {
    try {
        const { id, name, email, password } = req.body;

        if (req.params.id !== id) {
            const error = new Error('รหัสผู้ใช้ไม่ถูกต้อง');
            throw error;
        }

        //hash password
        const salt = await bcryptjs.genSalt(8);
        const passwordHash = await bcryptjs.hash(password, salt);

        //update
        const user = await models.User.update({
            name: name,
            email: email,
            password: passwordHash
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({
            message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
            data: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(404).json({
            error: {
                message: error.message
            }
        });
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(id);

        if (!user) {
            const error = new Error('ไม่พบผู้ใช้นี้ในระบบ');
            // error.statusCode = 404;
            throw error;
        }

        //delete user by id
        await models.User.destroy({
            where: {
                id : id
            }
        });

        return res.status(200).json({
            message: 'ลบข้อมูลเรียบร้อยแล้ว',
        });
    } catch (error) {
        return res.status(404).json({
            error: {
                message: error.message
            }
        });
    }
}