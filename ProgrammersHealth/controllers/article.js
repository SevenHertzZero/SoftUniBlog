const Article = require('mongoose').model('Article');

function validateArtilce(articleParts, req) {
    let errorMsg = '';

    if(!req.isAuthenticated()){
        errorMsg = 'You should be logged in to opperate with articles';
    }else if(!articleParts.title){
        errorMsg = 'Title is required!';
    }else if(!articleParts.content){
        errorMsg = 'Content is required!';
    }
        return errorMsg;
}

module.exports = {
    createGet: (req, res) =>{
        res.render('article/create');
    },
    createPost: (req, res) =>{
        let articleParts = req.body;

        let errorMsg = validateArtilce(articleParts,req);

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
                    res.redirect('article/create', {
                        error: errorMsg
                    });
                }else {
                    res.redirect('/');
                }
            });
        });
    },
    detailsGet:(req,res) => {

        let id = req.params.id;

        Article.findById(id).populate('author').then(article =>{
            res.render('article/details', article)
        });
    },
    editGet:(req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/edit',article);
        });
    },
    editPost:(req, res) => {
        let id = req.params.id;
        let articleParts = req.body;

        let errorMsg = validateArtilce(articleParts, req);

        if (errorMsg) {
            res.render('article/edit', {
                error: errorMsg
            });
            return;
        } else {
            Article.update({_id: id}, {$set: {title: articleParts.title, content: articleParts.content}})
                .then(updateStatus => {
                    res.redirect('/article/details/' + id);
                });
        }

    }
};