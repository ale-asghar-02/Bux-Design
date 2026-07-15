const quoteEmailTemplate = ({ username, email, service, budget, projectDescription }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Quote Request</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e; padding:24px 32px;">
              <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
                New Quote Request
              </h1>
              <p style="margin:4px 0 0; color:#b8b9c3; font-size:13px;">
                Bux Designs &mdash; Project Inquiry
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; width:140px; color:#8a8a8a; font-size:13px; vertical-align:top;">
                    Name
                  </td>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#1a1a2e; font-size:14px; font-weight:600;">
                    ${username}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#8a8a8a; font-size:13px; vertical-align:top;">
                    Email
                  </td>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#1a1a2e; font-size:14px;">
                    <a href="mailto:${email}" style="color:#4f46e5; text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#8a8a8a; font-size:13px; vertical-align:top;">
                    Service
                  </td>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#1a1a2e; font-size:14px;">
                    ${service}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee; color:#8a8a8a; font-size:13px; vertical-align:top;">
                    Budget
                  </td>
                  <td style="padding:12px 0; border-bottom:1px solid #eeeeee;">
                    <span style="display:inline-block; background-color:#eef2ff; color:#4f46e5; font-size:13px; font-weight:500; padding:4px 12px; border-radius:20px;">
                      ${budget}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Project Description -->
              <div style="margin-top:24px;">
                <p style="margin:0 0 8px; color:#8a8a8a; font-size:13px;">Project Description</p>
                <div style="background-color:#f9f9fb; border:1px solid #eeeeee; border-radius:6px; padding:16px; color:#333333; font-size:14px; line-height:1.6; white-space:pre-wrap;">${projectDescription}</div>
              </div>

              <!-- CTA -->
              <div style="margin-top:28px; text-align:center;">
                <a href="mailto:${email}" style="display:inline-block; background-color:#4f46e5; color:#ffffff; text-decoration:none; font-size:14px; font-weight:500; padding:12px 28px; border-radius:6px;">
                  Reply to ${username}
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#f9f9fb; text-align:center;">
              <p style="margin:0; color:#aaaaaa; font-size:12px;">
                This is an automated notification from Bux Designs website.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = quoteEmailTemplate;