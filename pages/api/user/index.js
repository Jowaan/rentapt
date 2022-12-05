import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.find();
        res.status(200).json({
          success: true,
          data: user,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const create = await User.create(req.body);
        return res.status(201).json({ success: true, data: create });
      } catch (error) {
        let newError = {};
        if (error.code === 11000) {
          newError = {
            ...newError,
            unitError:
              "is already exist you have to remove or just update the existing!",
          };
        }
        res.status(400).json({
          success: false,
          errors: newError,
          error,
        });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
