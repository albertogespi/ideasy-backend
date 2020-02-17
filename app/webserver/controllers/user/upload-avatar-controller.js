"use strict";

const cloudinary = require("cloudinary").v2;
const mysqlPool = require("../../../database/mysql-pool");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAvatar(req, res, next) {
  const { userId } = req.claims;
  const { file } = req;

  console.log(req);

  if (!file || !file.buffer) {
    console.log("no hay archivo");
    return res.status(400).send({
      message: "invalid image"
    });
  }

  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        public_id: userId,
        width: 200,
        height: 200,
        format: "jpg",
        crop: "limit"
      },
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send(err);
        }

        const secureUrl = result.secure_url;

        let connection;
        try {
          connection = await mysqlPool.getConnection();
          const now = new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);

          const sqlQuery = `UPDATE users 
          SET avatar_url = ?,
          updated_at = ?
          WHERE user_id = ?
          AND deleted_at IS NULL`;

          connection.execute(sqlQuery, [secureUrl, now, userId]);
          connection.release();

          res.header("Location", secureUrl);
          return res.status(201).send("Foto de perfil actualizada");
        } catch (e) {
          if (connection) {
            connection.release();
          }
          console.error(e);
          return res.status(500).send(e.message);
        }
      }
    )
    .end(file.buffer);
}

module.exports = uploadAvatar;
