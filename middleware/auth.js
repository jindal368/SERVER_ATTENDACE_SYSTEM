/** @format */

import jwt from "jsonwebtoken";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      res.status(400).json({ message: "Please add auth token" });
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }
    console.log("middle : ", req.userId);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export default auth;
