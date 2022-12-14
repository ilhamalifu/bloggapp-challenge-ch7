const {Post} = require("../database/models");
const { Op } = require("sequelize");

// get all post
const getAllPost = async (tempQuery) => {
    let order = "ASC";
    let limit = 0;
    let page = 0;
    let data = [{}];
    let isPaginate = false;
    if (tempQuery.order !== undefined) {
      order = tempQuery.order;
    }
  
    if (tempQuery.limit !== undefined) {
      limit = tempQuery.limit;
    }
  
    if (tempQuery.page !== undefined) {
      page = tempQuery.page;
    }
  
    if(tempQuery.limit !== undefined && tempQuery.page !== undefined){
      isPaginate = true;
    }
  
    if (tempQuery.writer !== undefined) {
      if (tempQuery.title !== undefined) {
        if (isPaginate) {
          data = await Post.findAll({
            where: {
              [Op.and]: [
                { user_id: tempQuery.writer },
                {
                  title: {
                    [Op.substring]: tempQuery.title,
                  },
                },
              ],
            },
            order: [["title", order]],
            limit: limit,
            offset: (page - 1) * limit,
          });
        } else {
          data = await Post.findAll({
            where: {
              [Op.and]: [
                { user_id: tempQuery.writer },
                {
                  title: {
                    [Op.substring]: tempQuery.title,
                  },
                },
              ],
            },
            order: [["title", order]],
          });
        }
      } else {
        if (isPaginate) {
          data = await Post.findAll({
            where: {
              user_id: tempQuery.writer,
            },
            order: [["title", order]],
            limit: limit,
            offset: (page - 1) * limit,
          });
        } else {
          data = await Post.findAll({
            where: {
              user_id: tempQuery.writer,
            },
            order: [["title", order]],
          });
        }
      }
    } else if (
      tempQuery.title !== undefined && isPaginate
    ) {
      data = await Post.findAll({
        where: {
          title: {
            [Op.substring]: tempQuery.title,
          },
        },
        order: [["title", order]],
        limit: limit,
        offset: (page - 1) * limit,
      });
    } else if (tempQuery.title !== undefined) {
      data = await Post.findAll({
        where: {
          title: {
            [Op.substring]: tempQuery.title,
          },
        },
        order: [["title", order]],
      });
    } else if (isPaginate) {
      data = await Post.findAll({
        order: [["title", order]],
        limit: limit,
        offset: (page - 1) * limit,
      });
    } else {
      data = await Post.findAll({ order: [["title", order]] });
    }
  
    return data;
  };

// create post
const createPost = async ({title,image,body,user_id}) => {
    return await Post.create({
        title: title,
        image: image,
        body: body,
        user_id: user_id,
    });
};

// edit post
const editPost = async ({ title, body, image, post_id }) => {
    return await Post.update(
      {
        title,
        body,
        image,
      },
      {
        where: {
          id: post_id,
        },
        returning: true,
      }
    );
  };

  // get one post
const getOnePost = async (post_id) => {
    return await Post.findOne({
        where : {
            id: post_id,
        },
    });
};


const postRepo = {
    getAllPost,
    createPost,
    getOnePost,
    editPost
};

module.exports=postRepo;