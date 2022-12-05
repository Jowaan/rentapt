import dbConnect from "../../../../utils/dbConnect";
import Rental from "../../../../models/Rental";
import moment from "moment";
dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      const { unit, from, to } = req.body;
      let newTo = moment(to).add(1, "days");
      try {
        const create = await Rental.find({
          unit: unit,
          created_at: { $gte: from, $lte: newTo },
          status: "approved",
        });
        return res.status(201).json({
          success: true,
          data: create,
        });
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
