import dbConnect from "../../../utils/dbConnect";
import Rental from "../../../models/Rental";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const rental = await Rental.find();
        res.status(200).json({
          success: true,
          data: rental,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const create = await Rental.create(req.body);
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
