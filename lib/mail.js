import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpEmail(email, code, type) {
  const title = type === "REGISTER" ? "تأیید ثبت‌نام" : "بازیابی رمز عبور";

  await transporter.sendMail({
    from: `"کافه کوک" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${title} - کافه کوک`,
    html: `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>

      <body style="margin:0;padding:0;background:#f4f1ed;font-family:Tahoma,Arial,sans-serif;direction:rtl;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ed;padding:40px 15px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 35px rgba(70,45,30,0.10);">

                <!-- Header -->
                <tr>
                  <td style="background:#3b2418;padding:30px 30px;text-align:center;">
                    <div style="font-size:34px;margin-bottom:8px;">☕</div>

                    <div style="font-size:26px;font-weight:bold;color:#ffffff;">
                      کافه کوک
                    </div>

                    <div style="font-size:13px;color:#d8c4b5;margin-top:8px;">
                      تجربه‌ای خوشمزه، درست مثل یک فنجان قهوه
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 35px;text-align:center;">

                    <div style="display:inline-block;background:#f5eee8;color:#8b5e3c;border-radius:50px;padding:8px 18px;font-size:13px;font-weight:bold;margin-bottom:18px;">
                      ${title}
                    </div>

                    <h1 style="margin:0 0 12px;color:#2d1b12;font-size:23px;font-weight:bold;">
                      تأیید ایمیل شما
                    </h1>

                    <p style="margin:0 auto 28px;color:#77675e;font-size:14px;line-height:2;">
                      برای ادامه، کد تأیید زیر را در صفحه کافه کوک وارد کنید.
                    </p>

                    <!-- OTP -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <div style="background:#faf7f4;border:2px dashed #c9a88e;border-radius:18px;padding:22px 15px;">
                            <div style="font-size:12px;color:#9a887d;margin-bottom:10px;">
                              کد تأیید شما
                            </div>

                            <div dir="ltr" style="font-family:Arial,sans-serif;font-size:36px;font-weight:bold;letter-spacing:10px;color:#6f4329;">
                              ${code}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:25px 0 0;color:#8b7a70;font-size:13px;">
                      ⏱ این کد تا <strong style="color:#6f4329;">۱۰ دقیقه</strong> معتبر است.
                    </p>

                    <div style="height:1px;background:#eee5df;margin:30px 0;"></div>

                    <p style="margin:0;color:#9a8a80;font-size:12px;line-height:2;">
                      اگر شما این درخواست را ارسال نکرده‌اید، این ایمیل را نادیده بگیرید.
                      <br />
                      هیچ اقدامی لازم نیست.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#faf8f6;padding:22px 30px;text-align:center;border-top:1px solid #eee5df;">
                    <div style="font-size:13px;color:#765442;font-weight:bold;">
                      کافه کوک
                    </div>

                    <div style="font-size:11px;color:#a59790;margin-top:7px;">
                      این ایمیل به صورت خودکار ارسال شده است.
                    </div>
                  </td>
                </tr>

              </table>

              <div style="max-width:560px;text-align:center;padding:18px 10px;">
                <span style="font-size:11px;color:#a39791;">
                  © ${new Date().getFullYear()} کافه کوک — تمامی حقوق محفوظ است.
                </span>
              </div>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
  });
}
