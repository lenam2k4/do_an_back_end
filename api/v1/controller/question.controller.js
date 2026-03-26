const Question = require("../models/question.model");

// [GET] /api/v1/questions/:topicId
module.exports.index = async ( req, res ) => {
  const topicId = req.params.topicId;

  try {
    const questions = await Question.find({
      topicId: topicId,
      deleted: false
    });

    res.json({
      code: 200,
      data: questions
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}