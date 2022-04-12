const models = require('../models/index');

exports.index = async (req, res, next) => {
    const blogs = await models.Blog.findAll({
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'name']
            }
        ], 
        order: [['id', 'desc']]
    });

    res.status(200).json({
        data: blogs,
    });
}
