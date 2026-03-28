const User = require("../models/user.model");
const Topic = require("../models/topic.model");
const Question = require("../models/question.model");
const Answer = require("../models/answer.model"); // 🔥 Import model Answer

module.exports.statistic = async (req, res) => {
  try {
    const [countUser, countTopic, countQuestion] = await Promise.all([
      User.countDocuments({ deleted: false }),
      Topic.countDocuments({ deleted: false }),
      Question.countDocuments({ deleted: false })
    ]);

    // 1. Thống kê số câu hỏi theo Tên chủ đề
    const questionsByTopic = await Question.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$topicId",
          count: { $sum: 1 }
        }
      },
      {
        $addFields: { "topicObjectId": { $toObjectId: "$_id" } } // Convert String ID sang ObjectId
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicObjectId",
          foreignField: "_id",
          as: "topicInfo"
        }
      },
      { $unwind: "$topicInfo" },
      {
        $project: {
          _id: 0,
          topicName: "$topicInfo.name",
          count: 1
        }
      }
    ]);

    // 2. Thống kê số lượt làm bài theo Tên chủ đề (Dựa trên Answer)
    const answersByTopic = await Answer.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$topicId",
          totalDone: { $sum: 1 }
        }
      },
      {
        $addFields: { "topicObjectId": { $toObjectId: "$_id" } }
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicObjectId",
          foreignField: "_id",
          as: "topicInfo"
        }
      },
      { $unwind: "$topicInfo" },
      {
        $project: {
          _id: 0,
          topicName: "$topicInfo.name",
          totalDone: 1
        }
      }
    ]);

    res.json({
      code: 200,
      data: {
        total: {
          user: countUser,
          topic: countTopic,
          question: countQuestion
        },
        questionsByTopic, // Data cho biểu đồ cột
        answersByTopic    // Data cho biểu đồ tròn (mới)
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};