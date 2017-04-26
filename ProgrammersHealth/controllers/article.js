const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) =>{
        res.render('article/create');
    },
    createPost: (req, res) =>{
        let articleParts = req.body;

        let errorMsg = '';

        if(!req.isAuthenticated()){
            errorMsg = 'Sorry, you must be logged in!';
        }else if(!articleParts.title){
            errorMsg = 'Title is required!';
        }else if(!articleParts.content){
            errorMsg = 'Content is required!';
        }

        if(errorMsg){
            res.render('article/create', {
                error: errorMsg
            });
            return;
        }

        let userId = req.user.id;
        articleParts.author = userId;

        Article.create(articleParts).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if(err){
                    res.render('article/create', {
                        error: errorMsg
                    });
                }else {
                    res.redirect('/');
                }
            });
        });
    }
};