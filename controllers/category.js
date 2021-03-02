const Catergory = require('../models/category')



exports.getCategoryById = (req, res, next, id) => {
    Catergory.findById(id)
    .exec((err, cate) => {
        if(err || !cate){
            return res.status(400).json({
                error: "Category not found in DB"
            });
        };

        req.category = cate
        next();
    });
};

exports.createCategory = (req, res) => {

    if(!req.body){
        return res.status(401).json({
            error: "Request Body is empty"
        });
    };

    const category = new Catergory(req.body);
    category.save((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Unable to save the Category in the DB"
            });
        };
        res.json({
            "message":`${cate.name} successfully created`
        });
    });
};

exports.getCategory = (req, res) => {

    return res.json(req.category);
}

exports.getAllCategories = (req, res) => {
    Catergory.find({})
    .exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Cant load categories from the DB !!"
            });
        };
        res.json(categories);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;

    category.name = req.body.name;

    category.save((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Cant update the Category in DB"
            });
        };

        res.json(cate);
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.remove((err, category) => {
        if(err){
            return res.status(401).json({
                error: "Unable to delete the category from DB"
            });
        };
        res.json({
            message: `category successfully deleted`
        });
    });
};
