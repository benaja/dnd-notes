import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";
import Mail from "nodemailer/lib/mailer";
import { join } from "path";

const transport = createTransport({
  host: process.env.MAIL_HOST || "",
  port: parseInt(process.env.MAIL_PORT || "25"),
  // secure: true,
  auth: {
    user: process.env.MAIL_USERNAME || "sdf",
    pass: process.env.MAIL_PASSWORD || "sdf",
  },
});

transport.use(
  "compile",
  nodemailerMjmlPlugin({ templateFolder: join(process.cwd(),  "src/server/mailTemplates") }),
);

export const sendMail = (options: Mail.Options) => {
  return transport.sendMail({
    from: "RPG Notes <rpg-notes@benaja.ch>",
    ...options,
  });
};

export default transport;
