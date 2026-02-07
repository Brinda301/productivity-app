import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReminder(to: string, subject: string, body: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html: body,
  });
}

// Example: Daily digest email
export async function sendDailyDigest(to: string, data: {
  tasksToday: number;
  interviewsToday: number;
  caloriesLogged: number;
  calorieGoal: number;
}) {
  const html = `
    <h2>Your Daily Digest</h2>
    <ul>
      <li><strong>Tasks due today:</strong> ${data.tasksToday}</li>
      <li><strong>Interviews today:</strong> ${data.interviewsToday}</li>
      <li><strong>Calories:</strong> ${data.caloriesLogged} / ${data.calorieGoal}</li>
    </ul>
  `;
  await sendReminder(to, 'Daily Productivity Digest', html);
}
