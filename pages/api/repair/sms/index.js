export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { Vonage } = require("@vonage/server-sdk");
        const vonage = new Vonage(
          {
            apiKey: "cbbc38a3",
            apiSecret: "NXpG3zqWzJJ9rrkx",
            signatureSecret:
              "7e3iHQ9jlbOiqkE5hN9iOy8FAmv01kdjXwjJ4kTc51jdUxJo8P",
            signatureMethod: "MD5 HASH signature",
          },
          { debug: true }
        );
        const resp = await vonage.sms.send({
          to: "639959151063",
          from: "Vonage API's",
          text: req.body.message,
        });
        console.log(resp);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(200).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
};
