import dbConnect from "../../../../utils/dbConnect";
import Rental from "../../../../models/Rental";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const rental = await Rental.find({ status: "pending" });
        res.status(200).json({
          success: true,
          data: rental,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
