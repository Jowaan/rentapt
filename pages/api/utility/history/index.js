import dbConnect from "../../../../utils/dbConnect";
import Utility from "../../../../models/Utility";

dbConnect();

export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      const { unit, typeofutility } = req.body;
      try {
        const create = await Utility.find({
          unit,
          typeofutility,
        });
        return res.status(201).json({ success: true, data: create });
      } catch (error) {
        res.status(400).json({
          success: false,
          errors: error?.message,
        });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
