import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id);
        return res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({
          success: false,
          errors: error,
        });
      }
    case "PUT":
      try {
        const update = await User.findByIdAndUpdate(id, req.body);
        return res.status(201).json({ success: true, data: update });
      } catch (error) {
        res.status(400).json({
          success: false,
          errors: error,
        });
        return;
      }
    case "DELETE":
      try {
        const update = await User.findByIdAndDelete(id);
        return res.status(201).json({ success: true, data: update });
      } catch (error) {
        res.status(400).json({
          success: false,
          errors: error,
        });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
};
